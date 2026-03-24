# Avito Tech Test

Тестовый fullstack-проект для работы с объявлениями:

- список объявлений с поиском, фильтрами, сортировкой и пагинацией;
- просмотр карточки объявления;
- редактирование объявления;
- AI-функции для подсказки цены, генерации/улучшения описания и чата;
- интеграция с Ollama для локального LLM.

Проект состоит из двух частей:

- `client/` - React + Vite + Mantine;
- `server/` - Fastify + TypeScript.

## Возможности

### Клиент

- страница списка ` /ads `;
- страница просмотра ` /ads/:id `;
- страница редактирования ` /ads/:id/edit `;
- синхронизация фильтров списка с URL;
- автосохранение черновика редактирования в `localStorage`;
- переключатель темы;
- тесты на Vitest + Testing Library.

### Сервер

- выдача списка объявлений и карточки объявления;
- обновление объявления;
- валидация входных данных через `zod`;
- AI-эндпоинты:
  - `POST /ai/price`
  - `POST /ai/description`
  - `POST /ai/chat`
- проксирование запросов к Ollama;
- искусственная задержка ответов для тестирования состояний загрузки.

## Стек

### Frontend

- React 19
- TypeScript
- Vite
- Mantine
- Redux Toolkit
- React Router
- Axios
- Vitest

### Backend

- Fastify
- TypeScript
- Zod
- dotenv
- Ollama

## Структура репозитория

```text
.
|-- client/                 # frontend
|-- server/                 # backend
|-- docker-compose.yml      # общий запуск client + server + ollama
`-- README.md
```

Дополнительно:

- [client/README.md](/d:/ITMO/interships/avito-tech-test/client/README.md) - детали по клиенту;
- [client/ARCHITECTURE.md](/d:/ITMO/interships/avito-tech-test/client/ARCHITECTURE.md) - структура клиентского приложения.

## Как запустить

## 1. Docker Compose

Самый простой способ поднять весь проект:

```bash
docker compose up --build
```

После запуска будут доступны:

- клиент: `http://localhost:5173`
- API: `http://localhost:8080`
- Ollama: `http://localhost:11434`

Сервисы в `docker-compose.yml`:

- `client` - dev-сервер Vite;
- `server` - Fastify backend;
- `api` - прокси `8080 -> 8081`, чтобы у клиента был стабильный адрес API;
- `ollama` - LLM runtime;
- `ollama-init` - подтягивает модель при старте.

По умолчанию используется модель:

```bash
llama3:latest
```

## 2. Локально без Docker

### Требования

- Node.js 20+
- npm 10+
- установленный и запущенный Ollama

### Backend

```bash
cd server
npm install
npm start
```

Сервер по умолчанию стартует на `http://localhost:8080`.

Переменные окружения:

```bash
PORT=8080
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3:latest
OLLAMA_TIMEOUT_MS=300000
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Клиент будет доступен на `http://localhost:5173`.

При необходимости можно указать адрес API:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Скрипты

### Client

```bash
cd client
npm run dev
npm run build
npm run lint
npm run lint:fix
npm run test
```

### Server

```bash
cd server
npm run start
```

## API

### Объявления

- `GET /items` - список объявлений
- `GET /items/:id` - карточка объявления
- `PUT /items/:id` - обновление объявления

Поддерживаемые query-параметры списка:

- `q`
- `limit`
- `skip`
- `categories`
- `needsRevision`
- `sortColumn`
- `sortDirection`

### AI

- `POST /ai/price` - подсказка цены
- `POST /ai/description` - генерация или улучшение описания
- `POST /ai/chat` - чат по объявлению

## Пользовательские сценарии

### Список объявлений

- поиск по названию;
- фильтрация по категориям;
- фильтр по объявлениям, требующим доработки;
- сортировка;
- переключение между `grid` и `list`.

### Просмотр объявления

- заголовок, цена, характеристики и описание;
- переход к редактированию;
- визуальная плашка для незаполненных полей.

### Редактирование

- изменение полей объявления;
- автосохранение черновика;
- AI-подсказка цены;
- AI-улучшение описания;
- чат с AI;
- сохранение изменений.

## Тестирование

Сейчас тесты есть в клиентской части.

Запуск:

```bash
cd client
npm run test
```

Покрыты в первую очередь:

- утилиты;
- работа с `localStorage`;
- часть redux-логики;
- базовые сценарии страниц.

## Что важно знать

- backend хранит данные в памяти из `server/data/items.json`, это не production-хранилище;
- обновления не переживают перезапуск сервера;
- для AI нужен доступный Ollama и загруженная модель;
- сервер специально добавляет задержку ответов, чтобы можно было тестировать loading-state;
- CORS на backend уже настроен;
- серый фон используется на странице списка, а детали и редактирование отображаются на белом фоне.

## Маршруты

- `/ads`
- `/ads/:id`
- `/ads/:id/edit`

Все остальные маршруты редиректятся на `/ads`.
