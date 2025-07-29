### **Section 2: Requirements (Revised)**

**Functional Requirements (FR):**

1. **Gmail Integration & Authentication**: The system must integrate with the Gmail API via OAuth, requesting appropriate permissions for reading and managing labels and email metadata.
2. **Label-Based Kanban System**: The application must dynamically generate Kanban columns based on a user-defined Gmail label structure (e.g., "kanban/1-Prospecting"). It must support creating and modifying this label structure from within the app.
3. **Email-to-Card Transformation**: Emails will be transformed into Kanban cards, with a clear strategy for mapping email content (subject, sender, body, attachments) to structured card fields (title, brand, value, etc.).
4. **Bidirectional Synchronization**: Changes to labels in Gmail must be reflected on the Kanban board, and moving a card between columns must update the corresponding email's label in Gmail. The system must include logic for conflict resolution.
5. **AI-Powered Email Summarization**: The system will integrate with an AI service to generate concise, actionable summaries of email threads, with support for user-configurable prompts.
6. **Hybrid Mode Operation**: Users must be able to manage both Gmail-integrated items and the original, manually-created sponsorship deals within the same interface.

**Technical Requirements (TR):**

- **Data Architecture**:
  - Must support a hybrid storage model: utilizing the Gmail API as the source of truth, supplemented by a local cache and a separate database for user preferences and AI summaries.
  - A background synchronization service with robust conflict resolution algorithms is required.
  - The system must feature an offline mode with a sync queue and retry mechanisms for actions taken while disconnected.
- **Performance Requirements**:
  - Initial import and sync of 1,000 emails must complete in under 30 seconds.
  - Real-time sync for individual label changes should be reflected in the UI in under 2 seconds.
  - AI summarization should complete in under 10 seconds per email thread.
- **Integration Requirements**:
  - The system must include robust error handling and management for Gmail API quota limits.
  - Must incorporate failover logic for the AI service and manage processing costs.

**Compatibility Requirements (CR):**

1. The existing deal-based Kanban board must continue to function independently for users who choose not to connect a Gmail account.
2. Existing APIs and data structures for manual deals must remain backward compatible.
3. The UI for new features must remain consistent with the existing shadcn/ui design system.
4. There must be a clear data migration path for users who wish to transition existing manual deals into the Gmail-integrated system.
