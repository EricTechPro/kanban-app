# **Brownfield Product Requirements Document (PRD) \- v2**

## **YouTube Sponsorship Workflow \- Gmail Integration Enhancement**

### **Document Information**

* **Version**: 2.0  
* **Date**: July 2025  
* **Enhancement**: Gmail-Integrated Workflow Management  
* **Status**: Approved for Architecture

### **Section 1: Intro Project Analysis and Context**

**Existing Project Overview:**

* **Current State**: The project is a functional YouTube Sponsorship Workflow Kanban board built on Next.js 15 and shadcn/ui. It includes authentication, deal management across a 9-stage workflow, and a responsive dashboard. The primary data is managed client-side in local storage.  
* **Available Documentation**: Original PRD.md, README.md, and a VISUAL\_IMPROVEMENTS.md which provides excellent context on the current UI/UX state.

**Enhancement Scope:**

* **Enhancement Type**: This is a major enhancement involving:  
  * Integration with a New System (Gmail API)  
  * Major Feature Addition (Label-based Kanban, AI Summarization)  
  * UI/UX Overhaul (New onboarding, settings, and potentially a new board view)  
* **Enhancement Description**: To transform the application into a Gmail-integrated workflow management system where emails are organized into Kanban columns via labels, enhanced with AI-powered summarization and bidirectional synchronization.  
* **Impact Assessment**: This will have a **Significant Impact** on the existing codebase, requiring architectural changes to accommodate a new data source, external API integration, and background synchronization processes.

**Goals and Background Context:**

* **Goals**:  
  * Integrate Gmail as a primary workflow source, allowing users to manage workflows directly from their inbox.  
  * Automate the creation of Kanban cards from emails.  
  * Leverage AI to provide actionable summaries of email threads, reducing manual reading time.  
  * Ensure seamless, bidirectional synchronization between the app and Gmail.  
* **Background Context**: The current application is effective for manually tracked sponsorship deals. However, many creators manage initial opportunities and communications within their email. This enhancement bridges that gap, turning the user's inbox into the source of truth for their workflow and dramatically reducing the manual effort of data entry and tracking.

### **Section 2: Requirements (Revised)**

**Functional Requirements (FR):**

1. **Gmail Integration & Authentication**: The system must integrate with the Gmail API via OAuth, requesting appropriate permissions for reading and managing labels and email metadata.  
2. **Label-Based Kanban System**: The application must dynamically generate Kanban columns based on a user-defined Gmail label structure (e.g., "kanban/1-Prospecting"). It must support creating and modifying this label structure from within the app.  
3. **Email-to-Card Transformation**: Emails will be transformed into Kanban cards, with a clear strategy for mapping email content (subject, sender, body, attachments) to structured card fields (title, brand, value, etc.).  
4. **Bidirectional Synchronization**: Changes to labels in Gmail must be reflected on the Kanban board, and moving a card between columns must update the corresponding email's label in Gmail. The system must include logic for conflict resolution.  
5. **AI-Powered Email Summarization**: The system will integrate with an AI service to generate concise, actionable summaries of email threads, with support for user-configurable prompts.  
6. **Hybrid Mode Operation**: Users must be able to manage both Gmail-integrated items and the original, manually-created sponsorship deals within the same interface.

**Technical Requirements (TR):**

* **Data Architecture**:  
  * Must support a hybrid storage model: utilizing the Gmail API as the source of truth, supplemented by a local cache and a separate database for user preferences and AI summaries.  
  * A background synchronization service with robust conflict resolution algorithms is required.  
  * The system must feature an offline mode with a sync queue and retry mechanisms for actions taken while disconnected.  
* **Performance Requirements**:  
  * Initial import and sync of 1,000 emails must complete in under 30 seconds.  
  * Real-time sync for individual label changes should be reflected in the UI in under 2 seconds.  
  * AI summarization should complete in under 10 seconds per email thread.  
* **Integration Requirements**:  
  * The system must include robust error handling and management for Gmail API quota limits.  
  * Must incorporate failover logic for the AI service and manage processing costs.

**Compatibility Requirements (CR):**

1. The existing deal-based Kanban board must continue to function independently for users who choose not to connect a Gmail account.  
2. Existing APIs and data structures for manual deals must remain backward compatible.  
3. The UI for new features must remain consistent with the existing shadcn/ui design system.  
4. There must be a clear data migration path for users who wish to transition existing manual deals into the Gmail-integrated system.

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

### **Section 4: Risk Assessment**

**High-Risk Items**

* **Gmail API Quota Limits**: Could severely impact user experience during peak usage.  
* **AI Processing Costs**: May scale unpredictably with user adoption.  
* **Complex Bidirectional Sync**: Carries a risk of data inconsistencies and user confusion.  
* **User Onboarding Complexity**: A high drop-off risk exists during the setup process due to its multi-step nature.

**Medium-Risk Items**

* **Performance with Large Email Volumes**: Potential for degradation with power users who have large mailboxes.  
* **Dependency on External Services**: The application's availability is tied to the uptime of Gmail and the selected AI provider.  
* **Data Privacy Concerns**: Users may hesitate when granting email access permissions.  
* **Mobile Experience**: The complexity of the Gmail integration may be challenging to translate effectively to mobile devices.

**Low-Risk Items**

* **UI Component Compatibility**: The existing shadcn/ui component library is expected to adapt well to new requirements.  
* **Authentication Integration**: The new Gmail OAuth flow can be built upon the existing authentication system.

**Mitigation Strategies**

* **Quota Monitoring**: Implement real-time quota tracking and user notifications to manage API limits gracefully.  
* **AI Cost Controls**: Provide users with usage limits and transparent cost information to manage AI processing expenses.  
* **Robust Offline Mode**: Build a comprehensive sync queue with sophisticated conflict resolution to ensure data integrity.  
* **Simplified Onboarding**: Create a guided setup process with clear value propositions at each step to reduce user drop-off.  
* **Performance Optimization**: Implement lazy loading, pagination for large datasets, and efficient caching strategies from the outset.

### **Section 5: Enhanced Success Metrics**

**Technical Metrics**

* **Gmail Sync Success Rate**: \>99.5% successful synchronizations.  
* **AI Summarization Accuracy**: \>85% user satisfaction with the generated summaries.  
* **App Performance**: Maintain \<3 second page load times and \<2 second sync operations.  
* **API Quota Efficiency**: Average user consumption should be \<50% of the daily Gmail API quota.  
* **Error Recovery Rate**: \>95% of synchronization errors should be resolved automatically by the system.

**User Adoption Metrics**

* **Onboarding Completion**: \>80% of new users should successfully complete the full Gmail integration and setup process.  
* **Daily Active Usage**: \>60% of users who connect their Gmail account should interact with the application daily.  
* **Feature Utilization**: \>70% of active users should regularly use the AI summarization feature.  
* **Retention After Integration**: \>85% of users should remain active 30 days after integrating their Gmail account.  
* **User Satisfaction**: Achieve a \>4.5/5 rating for the Gmail integration features specifically.

**Business Impact Metrics**

* **Time-to-Value**: A new user should be able to go from signup to seeing their first synced email as a Kanban card in under 5 minutes.  
* **Workflow Efficiency**: Achieve a \>40% reduction in time spent by users manually organizing their emails.  
* **User Growth**: The new features should contribute to a \>20% increase in user acquisition, demonstrating its value as a differentiator.

### **Section 6: Epic and Story Structure**

#### Epic 1: Gmail Workflow Integration & AI Summarization

**Epic Goal**: To transform the application into a "Gmail-first" workflow tool by integrating directly with the Gmail API, enabling automatic card creation from labeled emails, and providing AI-powered summaries to streamline user workflows.

#### Phase 1: Foundation (MVP)

*(Duration: 8-10 weeks)*

**Scope**: Gmail OAuth integration, read-only label-based column creation, basic email-to-card conversion, and a manual sync trigger.

**Stories**:

* **1.1: Connect Gmail Account**: As a user, I want to connect my Gmail account via a secure OAuth flow so that the application can access my emails and labels.  
* **1.2: View Gmail Labels as Columns**: As a user, I want the application to read my "kanban-flow" labels from Gmail and display them as columns on the board, so that I can visualize my workflow.  
* **1.3: View Emails as Basic Cards**: As a user, I want emails with a workflow label in Gmail to appear as cards in the corresponding column, with the email subject as the card title, so that I can see my work items.  
* **1.4: Manually Trigger Sync**: As a new user, I want a "Sync with Gmail" button so that I can fetch the latest email and label data on demand.

#### Phase 2: Core Synchronization

*(Duration: 6-8 weeks)*

**Scope**: Implement full bidirectional sync, enhance email parsing for key fields, and support bulk operations.

**Stories**:

* **2.1: Update Gmail Label by Moving Card**: As a user, I want to move a card from one column to another and have the corresponding email's label updated automatically in Gmail, so that my two systems stay in sync.  
* **2.2: Implement Real-Time Sync**: As a user, I want changes made in Gmail (e.g., adding a label to an email) to be reflected in the app automatically, so that the board is always up-to-date.  
* **2.3: Implement Conflict Resolution**: As a system, I need a mechanism to gracefully handle sync conflicts (e.g., a card is moved in the app at the same time its label is changed in Gmail).  
* **2.4: Parse Key Data from Emails**: As a user, I want the system to automatically parse and populate fields like dates and priority from the email content, so that my cards are more informative with less manual entry.

#### Phase 3: AI Integration

*(Duration: 4-6 weeks)*

**Scope**: Integrate an AI service for email summarization, allow for custom prompts, and implement caching and cost controls.

**Stories**:

* **3.1: View AI-Powered Summaries**: As a user, I want to click on a card and see a concise, AI-generated summary of the email thread, so that I can quickly understand its content and key action items.  
* **3.2: Configure AI Prompts**: As a power user, I want to create and save custom system prompts for the AI summarizer, so that I can tailor the summaries to my specific workflow needs.  
* **3.3: Cache AI Summaries**: As a system, I need to cache AI summaries to reduce processing time and API costs for previously summarized emails.

#### Phase 4: Advanced Features

*(Duration: 6-8 weeks)*

**Scope**: Add support for multiple Gmail accounts, advanced filtering, and mobile optimization.

**Stories**:

* **4.1: Connect Multiple Gmail Accounts**: As a user with multiple roles (e.g., personal brand and agency), I want to connect more than one Gmail account and switch between them.  
* **4.2: Implement Advanced Filtering**: As a user, I want to filter my Kanban board by email sender, date range, and other metadata, so I can easily find specific items.  
* **4.3: Optimize for Mobile**: As a mobile user, I want the Gmail-integrated board to be fully responsive and easy to use on my smartphone.

### **Section 7: Next Steps**

Architect Handoff Prompt:  
"This Product Requirements Document details a major enhancement to integrate a Gmail-based workflow into our existing Kanban application. The next step is to create a comprehensive Brownfield Enhancement Architecture.  
Please analyze this PRD and the existing project's architecture to design a solution that addresses the new data model, background synchronization services, AI integration, and API quota management, while ensuring the stability and integrity of the existing application."