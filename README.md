# QuantumChat

A responsive, frontend-only team messaging application built as a take-home assignment. The interface is inspired by modern team chat products and uses mock data rather than a backend.

## Tech stack

- React 18 + Vite
- TypeScript
- Tailwind CSS v4 (Vite plugin) and custom responsive CSS
- Redux Toolkit + React Redux
- React Hook Form dependency included for future form workflows
- Lucide React icons
- Vitest for reducer tests

## Getting started

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

## Tests

```bash
npm run test:run
```

## Features

- Conversation list with profile avatars, online indicators, last-message preview, timestamps and unread badges
- Conversation search and All / Unread / Groups filters
- Direct and group conversations
- Message composer; Enter sends and Shift+Enter inserts a new line
- Simulated incoming messages and typing indicator
- Delivery/read status indicators
- Reply, edit, delete, copy and emoji reactions
- Group member details with mock add/remove member actions
- Message search within the active conversation
- Light and dark themes (theme preference stored in localStorage)
- Responsive desktop, tablet and mobile layouts
- Loading and error UI states

## Architecture

```text
src/
├── app/                  # Redux store and typed hooks
├── components/           # Sidebar, chat window, message and group UI
├── data/                 # Typed mock members, conversations and messages
├── features/chat/        # Chat slice and reducer tests
├── hooks/                # Reusable UI behaviour
├── services/             # Mock API and incoming message simulation
├── test/                 # Vitest setup
├── types/                # Shared TypeScript models
├── App.tsx
├── index.css
└── main.tsx
```

### State management

Redux Toolkit stores conversations, messages, active conversation, typing state, theme and group details. Reducers handle message creation, editing, deletion, reactions, unread counts and mock member management. Typed React Redux hooks keep component access to the store consistent.

### Mock behaviour

There is no backend. Initial conversations and messages are defined in `src/data/mockData.ts`. A mock service simulates initial loading, and the chat view periodically simulates incoming messages and typing. This keeps the assignment focused on frontend architecture and interactions.

### Engineering decisions and trade-offs

- The app uses a feature-based Redux slice and shared TypeScript models to keep state and data contracts clear.
- Conversation/message data is local mock data; there is no real authentication, network delivery or multi-user synchronization.
- Message history is held in Redux memory for the current session. Theme preference persists in localStorage.
- The message list uses normal DOM rendering. Virtualization and infinite scroll were not added because they are optional enhancements and the supplied dataset is small.
- Attachment action is a UI placeholder; no file upload service is connected.
- Group member changes are local mock actions.
- The design uses custom CSS for detailed responsive styling alongside Tailwind CSS v4 integration.

## Keyboard shortcuts

- `Enter`: send a message
- `Shift + Enter`: new line
- `Ctrl/Cmd + K`: focus conversation search
- `Esc`: close the mobile conversation drawer

## Assignment notes

This project prioritizes the required core experience over optional advanced challenges. Before submitting, run the production build and tests, inspect the app at desktop/tablet/mobile widths, and update this README with your repository URL if needed.
