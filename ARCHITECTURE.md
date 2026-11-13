# QuantumChat architecture

```mermaid
flowchart TD
  UI[React UI Components] --> Hooks[Typed Redux Hooks]
  Hooks --> Store[Redux Toolkit Store]
  Store --> Slice[Chat Feature Slice]
  Slice --> State[Conversations and Messages State]
  UI --> Mock[Mock Chat Service]
  Mock --> UI
  Data[Typed Mock Data] --> Slice
  Types[Shared TypeScript Models] --> UI
  Types --> Slice
```

The React components render the current state and dispatch user actions. The chat feature slice owns conversation/message updates. Mock services simulate loading and incoming activity. Shared TypeScript interfaces define the message, member, and conversation contracts.
