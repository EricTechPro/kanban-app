# Brownfield Enhancement Architecture - Gmail Integration

This directory contains the sharded architecture document for the YouTube Sponsorship Workflow Gmail Integration enhancement.

## Document Structure

1. **[01-introduction.md](./01-introduction.md)** - Architecture overview and existing project analysis
2. **[02-integration-strategy.md](./02-integration-strategy.md)** - Enhancement scope and integration approach
3. **[03-tech-stack.md](./03-tech-stack.md)** - Technology stack alignment and new additions
4. **[04-data-models.md](./04-data-models.md)** - Database schema and data model definitions
5. **[05-component-architecture.md](./05-component-architecture.md)** - NestJS modules and component interactions
6. **[06-api-design.md](./06-api-design.md)** - tRPC API design and frontend integration patterns

## Document Information

- **Version**: 1.0
- **Date**: July 2025
- **Architect**: Winston
- **Status**: Approved for Development

## Architecture Overview

This architecture implements a **microservice approach** with:

- **Frontend**: Next.js 15 + TypeScript + shadcn/ui (existing)
- **Backend**: New NestJS microservice with tRPC API
- **Database**: PostgreSQL with Prisma ORM
- **Caching/Queues**: Redis + BullMQ
- **External APIs**: Gmail API + OpenAI API

## Quick Navigation

- **Start Here**: [01-introduction.md](./01-introduction.md)
- **Integration Strategy**: [02-integration-strategy.md](./02-integration-strategy.md)
- **Database Design**: [04-data-models.md](./04-data-models.md)
- **API Specifications**: [06-api-design.md](./06-api-design.md)
