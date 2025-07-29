### **Section 3: Tech Stack Alignment**

#### Existing Technology Stack (Frontend)

| Category          | Current Technology | Version | Usage in Enhancement                              |
| :---------------- | :----------------- | :------ | :------------------------------------------------ |
| **Framework**     | Next.js            | 15.x    | Render all new UI components and manage routing.  |
| **Language**      | TypeScript         | 5.x     | Ensure type safety for all new frontend code.     |
| **UI Components** | shadcn/ui          | latest  | Build all new UI elements for visual consistency. |
| **State Mngmt**   | React Context      | 18.x    | Manage UI-specific state on the client side.      |

#### New Technology Additions (Backend Microservice)

| Technology     | Version | Purpose                                 | Rationale                                                                           |
| :------------- | :------ | :-------------------------------------- | :---------------------------------------------------------------------------------- |
| **NestJS**     | 10.x    | Backend framework for the microservice. | A robust, scalable, and TypeScript-first framework ideal for this use case.         |
| **tRPC**       | 11.x    | API communication layer.                | Provides end-to-end type safety between the client and server.                      |
| **PostgreSQL** | 16.x    | Primary database.                       | Reliable, ACID-compliant database perfect for structured user and deal data.        |
| **Prisma**     | latest  | ORM for database interaction.           | Excellent TypeScript integration and robust schema migration tools.                 |
| **Redis**      | 7.x     | Caching layer and queue backend.        | High-performance store for caching AI summaries and managing background jobs.       |
| **BullMQ**     | latest  | Queue system for background jobs.       | A robust, Redis-based queue system for managing asynchronous tasks like Gmail sync. |
| **OpenAI API** | latest  | AI service for email summarization.     | Leverages powerful GPT models for high-quality text summarization.                  |
| **Docker**     | latest  | Containerization for the microservice.  | Ensures consistent environments from local development to production.               |
