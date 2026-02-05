# Specification

## Summary
**Goal:** Build a simple WhatsApp-like 1:1 messaging app (“Shaheen Messenger”) with Internet Identity authentication, persistent chats/messages, a two-pane messenger UI, polling-based updates, and a distinctive non-blue/purple theme.

**Planned changes:**
- Add Internet Identity sign-in/out with session handling; clearly show signed-in vs signed-out UI and display the user’s identity (principal or derived label).
- Implement a single Motoko-actor backend with persistent models/storage for users, 2-person conversations, and messages (author, timestamp, text, conversation id).
- Add conversation management: start a new 1:1 chat by entering another user identifier; show an inbox list with last message preview and last activity time; open a thread on selection.
- Add 1:1 messaging: send text messages, load message history, provide periodic polling refresh and a manual refresh control (no sockets).
- Build a messenger layout: left sidebar (conversation list + new chat) and right pane (header, message list, composer) using React Query with English loading/empty/error states.
- Apply a consistent, distinctive visual theme across auth, inbox, and thread views (primary palette not blue/purple).
- Generate and include static image assets under `frontend/public/assets/generated` and render them in the app (logo + at least one empty-state/login illustration).

**User-visible outcome:** Users can sign in with Internet Identity, start 1:1 chats by entering another user’s identifier, view their conversation inbox, open a chat thread, send and read messages with polling-based updates, and see a themed UI with a Shaheen Messenger logo and an illustration on an empty/login state.
