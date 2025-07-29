# **Brownfield Product Requirements Document (PRD) - v2**

## **YouTube Sponsorship Workflow - Gmail Integration Enhancement**

### **Document Information**

- **Version**: 2.0
- **Date**: July 2025
- **Enhancement**: Gmail-Integrated Workflow Management
- **Status**: Approved for Architecture

### **Section 1: Intro Project Analysis and Context**

**Existing Project Overview:**

- **Current State**: The project is a functional YouTube Sponsorship Workflow Kanban board built on Next.js 15 and shadcn/ui. It includes authentication, deal management across a 9-stage workflow, and a responsive dashboard. The primary data is managed client-side in local storage.
- **Available Documentation**: Original PRD.md, README.md, and a VISUAL_IMPROVEMENTS.md which provides excellent context on the current UI/UX state.

**Enhancement Scope:**

- **Enhancement Type**: This is a major enhancement involving:
  - Integration with a New System (Gmail API)
  - Major Feature Addition (Label-based Kanban, AI Summarization)
  - UI/UX Overhaul (New onboarding, settings, and potentially a new board view)
- **Enhancement Description**: To transform the application into a Gmail-integrated workflow management system where emails are organized into Kanban columns via labels, enhanced with AI-powered summarization and bidirectional synchronization.
- **Impact Assessment**: This will have a **Significant Impact** on the existing codebase, requiring architectural changes to accommodate a new data source, external API integration, and background synchronization processes.

**Goals and Background Context:**

- **Goals**:
  - Integrate Gmail as a primary workflow source, allowing users to manage workflows directly from their inbox.
  - Automate the creation of Kanban cards from emails.
  - Leverage AI to provide actionable summaries of email threads, reducing manual reading time.
  - Ensure seamless, bidirectional synchronization between the app and Gmail.
- **Background Context**: The current application is effective for manually tracked sponsorship deals. However, many creators manage initial opportunities and communications within their email. This enhancement bridges that gap, turning the user's inbox into the source of truth for their workflow and dramatically reducing the manual effort of data entry and tracking.
