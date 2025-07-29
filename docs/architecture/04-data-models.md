### **Section 4: Data Models and Schema Changes**

The following Prisma schema defines the core tables for the PostgreSQL database, enabling the hybrid MANUAL vs. GMAIL deal tracking system.

```prisma
// schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
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
  deals                 Deal[]
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
  user                  User      @relation(fields: [userId], references: [id])
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
  tags                  String[]     @default([])
  deliverables          String[]     @default([])
  gmailMessageId        String?      @unique
  gmailThreadId         String?
  emailSubject          String?
  emailSender           String?
  emailReceivedAt       DateTime?
  lastSyncedAt          DateTime?
  syncStatus            SyncStatus   @default(SYNCED)
  user                  User         @relation(fields: [userId], references: [id])
  userId                String
  brand                 Brand?       @relation(fields: [brandId], references: [id])
  brandId               String?
  summary               AISummary?
  history               DealHistory[]
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt
  @@index([userId, stage])
  @@index([gmailMessageId])
  @@index([source, userId])
  @@index([updatedAt])
  @@index([syncStatus])
}

model Brand {
  id                    String @id @default(cuid())
  name                  String
  email                 String @unique
  domain                String?
  deals                 Deal[]
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  @@index([email])
  @@index([domain])
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
  deal                  Deal     @relation(fields: [dealId], references: [id])
  dealId                String   @unique
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  @@index([createdAt])
  @@index([modelUsed, promptUsed])
  @@index([costUsd])
}

model DealHistory {
  id                    String   @id @default(cuid())
  dealId                String
  action                String
  oldValue              Json?
  newValue              Json?
  source                String
  metadata              Json?
  deal                  Deal     @relation(fields: [dealId], references: [id])
  createdAt             DateTime @default(now())
  @@index([dealId, createdAt])
  @@index([action])
  @@index([source])
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
```
