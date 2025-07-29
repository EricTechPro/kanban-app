### **Section 3: User Journeys**

**First-Time User Journey**

1. **Login** → A user logs into the application and initiates the Gmail connection process via an OAuth screen, which includes a clear permission explanation.
2. **Label Discovery** → The application detects existing Kanban-formatted labels or guides the user through the process of creating a new label structure within Gmail.
3. **Initial Import** → The system begins processing emails from the selected labels, displaying a progress indicator to manage user expectations during the wait.
4. **Tutorial** → The user is presented with a brief walkthrough, such as "Your first email is now a card," to demonstrate the core functionality.
5. **AI Setup** → Users are prompted to set their preferences for AI summarization, including the ability to select or create custom prompts.
6. **First Interaction** → The user is encouraged to move a card, triggering the bidirectional sync and confirming the connection to Gmail is active.

**Daily Usage Journey**

1. **App Launch** → Upon opening the app, the user sees a clear indicator of the background sync status.
2. **New Content** → As new emails are labeled in Gmail, they automatically appear as new cards on the board.
3. **Workflow Management** → The user moves cards between columns, and the corresponding Gmail labels are updated seamlessly in near real-time.
4. **Detail View** → Clicking on a card opens a detailed view where the AI-generated summary loads with the email context.

**Error Recovery Journey**

1. **Sync Failure** → The UI displays a clear, non-intrusive error message and provides an option to retry the sync.
2. **Quota Exceeded** → The application enters a gracefully degraded state, notifies the user of the Gmail API quota issue, and informs them when functionality will be restored.
3. **Permission Revoked** → If Gmail access is revoked, the user is guided through a re-authentication flow to restore the connection.
4. **Offline Mode** → If the user is offline, actions are queued locally. Upon reconnection, the queue is processed to sync with Gmail.
