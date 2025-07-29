### **Section 5: Component Architecture**

The NestJS microservice will be built using a modular architecture with a clear separation of concerns.

#### Core NestJS Modules

- **AuthModule**: Manages Gmail OAuth2 flow, JWT validation, and secure token encryption.
- **TRPCModule**: Exposes the tRPC router as the primary API layer for the frontend.
- **SyncModule**: Manages all asynchronous Gmail sync jobs using BullMQ and Redis.
- **GmailModule**: A dedicated client for all Gmail API interactions, including quota management.
- **AIModule**: Manages all OpenAI API interactions, including summarization, caching, and cost tracking.
- **PrismaModule**: Provides a shared, injectable Prisma Client for database access.
- **ConfigModule**: Centralizes management of environment variables and secrets.
- **ErrorModule**: Provides centralized error handling, logging, and monitoring.
- **HealthModule**: Exposes health check endpoints for the service and its dependencies.

#### Component Interaction Diagram

```mermaid
sequenceDiagram
    participant FE as Next.js Frontend
    participant API as tRPC API Gateway
    participant Auth as AuthGuard
    participant Deal as DealService
    participant Sync as SyncService (Queue)
    participant DB as PrismaService (Postgres)

    FE->>+API: Call `deal.updateStage({ dealId, newStage })`
    API->>+Auth: Validate JWT
    Auth-->>-API: User Context (userId)
    API->>+Deal: updateStage(userId, dealId, newStage)
    Deal->>+DB: findUnique(dealId, userId)
    DB-->>-Deal: Return Deal
    Deal->>Deal: Perform Business Logic
    Deal->>+Sync: addJob('update-gmail-label', { deal })
    Sync-->>-Deal: Job Queued
    Deal->>+DB: update(deal)
    DB-->>-Deal: Updated Deal
    Deal-->>-API: Return Updated Deal
    API-->>-FE: Success Response
```
