import { useCallback, useRef, useState } from 'react'

import type { ItemWithRevision } from '@/entities/ad'

import { storage } from '@/shared/storage/localStorage'

const DRAFT_KEY = 'avito_item_drafts'

type DraftMap = Record<number, Partial<ItemWithRevision>>

export const useAdDraft = () => {
	const [drafts, setDrafts] = useState<DraftMap>(() => storage.get<DraftMap>(DRAFT_KEY, {}))
	const draftsRef = useRef(drafts)

	const setDraftsState = useCallback((updater: (prev: DraftMap) => DraftMap) => {
		setDrafts((prev) => {
			const next = updater(prev)
			draftsRef.current = next
			return next
		})
	}, [])

	const getDraft = useCallback((adId: number) => draftsRef.current[adId], [])

	const saveDraft = useCallback((adId: number, data: Partial<ItemWithRevision>) => {
		setDraftsState((prev) => {
			const prevDraft = prev[adId]

			if (JSON.stringify(prevDraft) === JSON.stringify(data)) {
				return prev
			}

			const next = { ...prev, [adId]: data }
			storage.set(DRAFT_KEY, next)
			return next
		})
	}, [setDraftsState])

	const clearDraft = useCallback((adId: number) => {
		setDraftsState((prev) => {
			const next = { ...prev }
			delete next[adId]
			storage.set(DRAFT_KEY, next)
			return next
		})
	}, [setDraftsState])

	return {
		clearDraft,
		getDraft,
		saveDraft,
	}
}
