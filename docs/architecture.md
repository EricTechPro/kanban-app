# **Brownfield Enhancement Architecture**

## **YouTube Sponsorship Workflow \- Gmail Integration**

### **Document Information**

* **Version**: 1.0  
* **Date**: July 2025  
* **Architect**: Winston  
* **Status**: Approved for Development

### **Section 1: Introduction**

This document outlines the architectural approach for enhancing the YouTube Sponsorship Workflow application with a comprehensive Gmail integration. Its primary goal is to serve as the guiding architectural blueprint for AI-driven development of these new features while ensuring seamless and safe integration with the existing system.

#### Existing Project Analysis

* **Current Project State**:  
  * **Primary Purpose**: A Kanban board for managing YouTube sponsorship deals.  
  * **Current Tech Stack**: The frontend is built with Next.js 15, TypeScript, and shadcn/ui. State is managed via React Context and data persists in client-side localStorage.  
  * **Architecture Style**: A client-side, single-page application (SPA) with a basic authentication system.  
* **Identified Constraints**: The architecture must be budget-conscious regarding API calls, scalable to handle large email volumes, and highly secure due to the handling of sensitive email data.

### **Section 2: Enhancement Scope and Integration Strategy**

#### Enhancement Overview

* **Enhancement Type**: Major Feature Addition & System Integration.  
* **Scope**: Integrate Gmail as a primary data source, introduce a new AI summarization service, and build a bidirectional data synchronization mechanism.  
* **Integration Impact**: High. This requires a new backend service, a database, and significant changes to the data management and user onboarding flows.

#### Integration Approach

* **Code Integration Strategy**: We will build a **new, separate microservice** responsible for all Gmail API interactions, background synchronization, and AI summarization processing. This decouples heavy background tasks from the frontend, allows independent scaling, and enhances security.  
* **Database Integration**: A new PostgreSQL database will be introduced to store user account information, encrypted Gmail tokens, email metadata, AI summaries, and sync state.  
* **UI Integration**: The Next.js frontend will communicate with the new backend microservice via a secure **tRPC API**.

#### Compatibility Requirements

* **Hybrid Mode**: The architecture will support both manual deals (migrated from localStorage to the database) and Gmail-integrated deals.  
* **Backward Compatibility**: For users who do not opt into the Gmail integration, the existing functionality will be preserved. A one-time migration path will be provided for existing data.

### **Section 3: Tech Stack Alignment**

#### Existing Technology Stack (Frontend)

| Category | Current Technology | Version | Usage in Enhancement |
| :---- | :---- | :---- | :---- |
| **Framework** | Next.js | 15.x | Render all new UI components and manage routing. |
| **Language** | TypeScript | 5.x | Ensure type safety for all new frontend code. |
| **UI Components** | shadcn/ui | latest | Build all new UI elements for visual consistency. |
| **State Mngmt** | React Context | 18.x | Manage UI-specific state on the client side. |

#### New Technology Additions (Backend Microservice)

| Technology | Version | Purpose | Rationale |
| :---- | :---- | :---- | :---- |
| **NestJS** | 10.x | Backend framework for the microservice. | A robust, scalable, and TypeScript-first framework ideal for this use case. |
| **tRPC** | 11.x | API communication layer. | Provides end-to-end type safety between the client and server. |
| **PostgreSQL** | 16.x | Primary database. | Reliable, ACID-compliant database perfect for structured user and deal data. |
| **Prisma** | latest | ORM for database interaction. | Excellent TypeScript integration and robust schema migration tools. |
| **Redis** | 7.x | Caching layer and queue backend. | High-performance store for caching AI summaries and managing background jobs. |
| **BullMQ** | latest | Queue system for background jobs. | A robust, Redis-based queue system for managing asynchronous tasks like Gmail sync. |
| **OpenAI API** | latest | AI service for email summarization. | Leverages powerful GPT models for high-quality text summarization. |
| **Docker** | latest | Containerization for the microservice. | Ensures consistent environments from local development to production. |

### **Section 4: Data Models and Schema Changes**

The following Prisma schema defines the core tables for the PostgreSQL database, enabling the hybrid MANUAL vs. GMAIL deal tracking system.

// schema.prisma

datasource db {  
  provider \= "postgresql"  
  url      \= env("DATABASE\_URL")  
}

generator client {  
  provider \= "prisma-client-js"  
}

model User {  
  id                    String    @id @default(cuid())  
  email                 String    @unique  
  name                  String?  
  encryptedAccessToken  String?  
  encryptedRefreshToken String?  
  tokenEncryptionKey    String?  
  tokenExpiry           DateTime?  
  defaultAIPrompt       String?  
  syncFrequency         Int?      @default(300)  
  deals                 Deal\[\]  
  syncState             SyncState?  
  createdAt             DateTime  @default(now())  
  updatedAt             DateTime  @updatedAt  
}

model SyncState {  
  id                    String    @id @default(cuid())  
  lastSyncTimestamp     DateTime  @default(now())  
  isSyncing             Boolean   @default(false)  
  lastSyncError         String?  
  consecutiveFailures   Int       @default(0)  
  user                  User      @relation(fields: \[userId\], references: \[id\])  
  userId                String    @unique  
  createdAt             DateTime  @default(now())  
  updatedAt             DateTime  @updatedAt  
}

model Deal {  
  id                    String       @id @default(cuid())  
  title                 String  
  source                DealSource   @default(MANUAL)  
  value                 Float?  
  priority              String?  
  stage                 String       @default("1-Prospecting")  
  dueDate               DateTime?  
  startDate             DateTime?  
  progress              Int?         @default(0)  
  tags                  String\[\]     @default(\[\])  
  deliverables          String\[\]     @default(\[\])  
  gmailMessageId        String?      @unique  
  gmailThreadId         String?  
  emailSubject          String?  
  emailSender           String?  
  emailReceivedAt       DateTime?  
  lastSyncedAt          DateTime?  
  syncStatus            SyncStatus   @default(SYNCED)  
  user                  User         @relation(fields: \[userId\], references: \[id\])  
  userId                String  
  brand                 Brand?       @relation(fields: \[brandId\], references: \[id\])  
  brandId               String?  
  summary               AISummary?  
  history               DealHistory\[\]  
  createdAt             DateTime     @default(now())  
  updatedAt             DateTime     @updatedAt  
  @@index(\[userId, stage\])  
  @@index(\[gmailMessageId\])  
  @@index(\[source, userId\])  
  @@index(\[updatedAt\])  
  @@index(\[syncStatus\])  
}

model Brand {  
  id                    String @id @default(cuid())  
  name                  String  
  email                 String @unique  
  domain                String?  
  deals                 Deal\[\]  
  createdAt             DateTime @default(now())  
  updatedAt             DateTime @updatedAt  
  @@index(\[email\])  
  @@index(\[domain\])  
}

model AISummary {  
  id                    String   @id @default(cuid())  
  content               String  
  promptUsed            String  
  promptVersion         String?  
  modelUsed             String  
  tokensUsed            Int?  
  processingTimeMs      Int?  
  costUsd               Float?  
  userRating            Int?  
  userFeedback          String?  
  deal                  Deal     @relation(fields: \[dealId\], references: \[id\])  
  dealId                String   @unique  
  createdAt             DateTime @default(now())  
  updatedAt             DateTime @updatedAt  
  @@index(\[createdAt\])  
  @@index(\[modelUsed, promptUsed\])  
  @@index(\[costUsd\])  
}

model DealHistory {  
  id                    String   @id @default(cuid())  
  dealId                String  
  action                String  
  oldValue              Json?  
  newValue              Json?  
  source                String  
  metadata              Json?  
  deal                  Deal     @relation(fields: \[dealId\], references: \[id\])  
  createdAt             DateTime @default(now())  
  @@index(\[dealId, createdAt\])  
  @@index(\[action\])  
  @@index(\[source\])  
}

enum DealSource {  
  MANUAL  
  GMAIL  
}

enum SyncStatus {  
  SYNCED  
  PENDING  
  FAILED  
  CONFLICT  
}

### **Section 5: Component Architecture**

The NestJS microservice will be built using a modular architecture with a clear separation of concerns.

#### Core NestJS Modules

* **AuthModule**: Manages Gmail OAuth2 flow, JWT validation, and secure token encryption.  
* **TRPCModule**: Exposes the tRPC router as the primary API layer for the frontend.  
* **SyncModule**: Manages all asynchronous Gmail sync jobs using BullMQ and Redis.  
* **GmailModule**: A dedicated client for all Gmail API interactions, including quota management.  
* **AIModule**: Manages all OpenAI API interactions, including summarization, caching, and cost tracking.  
* **PrismaModule**: Provides a shared, injectable Prisma Client for database access.  
* **ConfigModule**: Centralizes management of environment variables and secrets.  
* **ErrorModule**: Provides centralized error handling, logging, and monitoring.  
* **HealthModule**: Exposes health check endpoints for the service and its dependencies.

#### Component Interaction Diagram

sequenceDiagram  
    participant FE as Next.js Frontend  
    participant API as tRPC API Gateway  
    participant Auth as AuthGuard  
    participant Deal as DealService  
    participant Sync as SyncService (Queue)  
    participant DB as PrismaService (Postgres)

    FE-\>\>+API: Call \`deal.updateStage({ dealId, newStage })\`  
    API-\>\>+Auth: Validate JWT  
    Auth--\>\>-API: User Context (userId)  
    API-\>\>+Deal: updateStage(userId, dealId, newStage)  
    Deal-\>\>+DB: findUnique(dealId, userId)  
    DB--\>\>-Deal: Return Deal  
    Deal-\>\>Deal: Perform Business Logic  
    Deal-\>\>+Sync: addJob('update-gmail-label', { deal })  
    Sync--\>\>-Deal: Job Queued  
    Deal-\>\>+DB: update(deal)  
    DB--\>\>-Deal: Updated Deal  
    Deal--\>\>-API: Return Updated Deal  
    API--\>\>-FE: Success Response

### **Section 6: API Design and Integration**

The API contract is defined using tRPC with Zod for validation, ensuring end-to-end type safety.

#### tRPC Router Procedures (Examples)

* **dealRouter**:  
  * list(input: { stage?: string }): Fetches deals for the user.  
  * createManual(input: { title: string, ... }): Creates a new manual deal.  
  * updateStage(input: { dealId: string, newStage: string }): Updates a deal's stage and queues a Gmail sync job.  
* **syncRouter**:  
  * triggerFullSync(): Triggers a high-priority full account sync.  
  * getStatus(): Fetches the user's current sync status.  
* **aiRouter**:  
  * getSummary(input: { dealId: string }): Gets a cached summary or generates a new one.  
* **userRouter**:  
  * getPreferences(): Fetches the user's profile and settings.  
  * updatePreferences(input: { ... }): Updates user settings.

#### Frontend Integration Patterns

* **tRPC Client**: A single, type-safe client will be used in the Next.js app.  
* **Data Fetching**: We will use React Query (@tanstack/react-query) for client-side data fetching and caching.  
* **Real-time Updates**: The initial implementation will use **short polling** on the sync.getStatus endpoint to provide UI feedback during sync operations.