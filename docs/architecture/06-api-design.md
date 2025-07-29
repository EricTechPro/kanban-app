### **Section 6: API Design and Integration**

The API contract is defined using tRPC with Zod for validation, ensuring end-to-end type safety.

#### tRPC Router Procedures (Examples)

- **dealRouter**:
  - list(input: { stage?: string }): Fetches deals for the user.
  - createManual(input: { title: string, ... }): Creates a new manual deal.
  - updateStage(input: { dealId: string, newStage: string }): Updates a deal's stage and queues a Gmail sync job.
- **syncRouter**:
  - triggerFullSync(): Triggers a high-priority full account sync.
  - getStatus(): Fetches the user's current sync status.
- **aiRouter**:
  - getSummary(input: { dealId: string }): Gets a cached summary or generates a new one.
- **userRouter**:
  - getPreferences(): Fetches the user's profile and settings.
  - updatePreferences(input: { ... }): Updates user settings.

#### Frontend Integration Patterns

- **tRPC Client**: A single, type-safe client will be used in the Next.js app.
- **Data Fetching**: We will use React Query (@tanstack/react-query) for client-side data fetching and caching.
- **Real-time Updates**: The initial implementation will use **short polling** on the sync.getStatus endpoint to provide UI feedback during sync operations.
