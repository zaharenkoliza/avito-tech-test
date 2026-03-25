import {
	Alert,
	Button,
	Grid,
	Group,
	Stack,
	Title,
	useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAdAi } from "./model/useAdAi";
import { useAdDraft } from "./model/useAdDraft";

import { sanitizeItemForCategory, type ItemWithRevision } from "@/entities/ad";
import { getErrorMessage, isNotFoundError } from "@/shared/api/apiClient";
import { adsService } from "@/shared/api/services";
import { AppLoader } from "@/shared/ui/AppLoader";
import { AdAiChatCard, AdEditForm } from "@/widgets/ad-edit";

export const AdEditPage = () => {
	const { id: idRaw } = useParams();
	const navigate = useNavigate();
	const { colorScheme } = useMantineColorScheme();
	const isDark = colorScheme === "dark";
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [item, setItem] = useState<ItemWithRevision | null>(null);
	const id = Number(idRaw);

	const form = useForm<ItemWithRevision>({
		initialValues: {
			id: 0,
			category: "electronics",
			title: "",
			description: "",
			price: 0,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			params: {},
			needsRevision: false,
		},
		validate: {
			title: (value) => (value.trim().length === 0 ? "Введите название" : null),
			price: (value) =>
				value === null || value < 0 ? "Цена должна быть >= 0" : null,
		},
		validateInputOnChange: true,
		validateInputOnBlur: true,
	});
	const setFormValuesRef = useRef(form.setValues);
	const { clearDraft, getDraft, saveDraft } = useAdDraft();

	const {
		chat,
		chatRequestError,
		clearChatError,
		clearDescriptionResult,
		clearPriceResult,
		descriptionRequestError,
		descriptionSuggestion,
		generateDescription,
		hasRequestedDescription,
		hasRequestedPrice,
		isChatSending,
		isGeneratingDescription,
		isSuggestingPrice,
		priceRequestError,
		priceSuggestion,
		sendChatMessage,
		suggestPrice,
	} = useAdAi({ adId: id });

	useEffect(() => {
		document.body.style.backgroundColor = isDark
			? "var(--mantine-color-dark-8)"
			: "#ffffff";

		return () => {
			document.body.style.backgroundColor = "";
		};
	}, [isDark]);

	useEffect(() => {
		setFormValuesRef.current = form.setValues;
	}, [form.setValues]);

	useEffect(() => {
		if (!Number.isFinite(id)) {
			void navigate("/ads");
			return;
		}

		const controller = new AbortController();
		setLoading(true);
		setError(null);

		void adsService
			.getAd(id, controller.signal)
			.then((response) => {
				setItem(response);
				const draft = getDraft(id);
				const mergedValues = draft
					? ({ ...response, ...draft } as ItemWithRevision)
					: response;

				setFormValuesRef.current(sanitizeItemForCategory(mergedValues));
			})
			.catch((requestError) => {
				if (controller.signal.aborted) return;

				if (isNotFoundError(requestError)) {
					void navigate("/ads", { replace: true });
					return;
				}

				setError(getErrorMessage(requestError));
			})
			.finally(() => {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			});

		return () => controller.abort();
	}, [getDraft, id, navigate]);

	useEffect(() => {
		if (!item) return;

		const timeoutId = window.setTimeout(() => {
			saveDraft(id, form.values);
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [form.values, id, item, saveDraft]);

	const save = form.onSubmit(async (values) => {
		if (saving) return;

		setSaving(true);
		setError(null);

		try {
			const sanitizedValues = sanitizeItemForCategory(values);

			await adsService.updateAd(id, {
				category: sanitizedValues.category,
				title: sanitizedValues.title,
				description: sanitizedValues.description,
				price: sanitizedValues.price ?? 0,
				params: sanitizedValues.params as Record<string, unknown>,
			});

			clearDraft(id);
			notifications.show({
				title: "Изменения сохранены",
				message: "Переходим к просмотру объявления",
				color: "green",
			});
			void navigate(`/ads/${id}`);
		} catch (saveError) {
			const message = getErrorMessage(saveError);
			setError(message);
			notifications.show({
				title: "Ошибка сохранения",
				message,
				color: "red",
			});
		} finally {
			setSaving(false);
		}
	});

	const isTitleValid = form.values.title.trim().length > 0;
	const isPriceValid = form.values.price !== null && form.values.price >= 0;
	const isSaveDisabled = !isTitleValid || !isPriceValid || saving;
	const handleCancel = () => {
		clearDraft(id);
		void navigate(`/ads/${id}`);
	};

	if (loading) {
		return <AppLoader />;
	}

	if (error || !item) {
		return (
			<Stack p="lg">
				<Alert color="red" icon={<IconAlertCircle size={16} />}>
					{error ?? "Объявление не найдено"}
				</Alert>
				<Button component={Link} to="/ads" variant="default">
					Назад к списку
				</Button>
			</Stack>
		);
	}

	return (
		<Stack p="lg" gap="lg" mih="100vh">
			<Title order={2} fz={30}>
				Редактирование объявления
			</Title>

			{error ? (
				<Alert color="red" icon={<IconAlertCircle size={16} />}>
					{error}
				</Alert>
			) : null}

			<Grid>
				<Grid.Col span={{ base: 12, lg: 8 }}>
					<form onSubmit={save}>
						<AdEditForm
							form={form}
							onSuggestPrice={() => void suggestPrice(form.values)}
							isSuggestingPrice={isSuggestingPrice}
							hasRequestedPrice={hasRequestedPrice}
							priceSuggestion={priceSuggestion}
							priceRequestError={priceRequestError}
							onApplyPrice={() => {
								if (priceSuggestion) {
									form.setFieldValue("price", priceSuggestion.value);
									clearPriceResult();
								}
							}}
							onClosePriceResult={clearPriceResult}
							onRequestDescription={(mode) =>
								void generateDescription(form.values, mode)
							}
							isGeneratingDescription={isGeneratingDescription}
							hasRequestedDescription={hasRequestedDescription}
							descriptionSuggestion={descriptionSuggestion}
							descriptionRequestError={descriptionRequestError}
							onApplyDescription={() => {
								if (descriptionSuggestion) {
									form.setFieldValue("description", descriptionSuggestion);
									clearDescriptionResult();
								}
							}}
							onCloseDescriptionResult={clearDescriptionResult}
						/>
					</form>
				</Grid.Col>
				<Grid.Col span={{ base: 12, lg: 4 }}>
					<Stack>
						<AdAiChatCard
							chat={chat}
							isSending={isChatSending}
							error={chatRequestError}
							onCloseError={clearChatError}
							onSend={(message) => void sendChatMessage(form.values, message)}
						/>
					</Stack>
				</Grid.Col>
			</Grid>

			<Group justify="flex-start">
				<Button
					onClick={() => void save()}
					loading={saving}
					disabled={isSaveDisabled}
					w={108}
					h={38}
					radius={8}
					px={12}
					py={8}
					fw={400}
					fz="md"
					style={{
						fontStyle: "normal",
						lineHeight: "140%",
						letterSpacing: "0",
					}}
				>
					Сохранить
				</Button>
				<Button
					variant="default"
					onClick={handleCancel}
					w={108}
					h={38}
					radius={8}
					px={12}
					py={8}
					fw={400}
					fz="md"
					style={{
						fontStyle: "normal",
						lineHeight: "140%",
						letterSpacing: "0",
					}}
				>
					Отменить
				</Button>
			</Group>
		</Stack>
	);
};
