import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('YouTube Sponsorship Workflow API')
    .setDescription(`
      ## Overview
      This API provides endpoints for managing YouTube sponsorship deals through a comprehensive workflow system.
      
      ## Features
      - **Authentication**: Gmail OAuth integration for secure access
      - **Deal Management**: Create, update, and track sponsorship deals
      - **Workflow Stages**: 9-stage kanban board workflow
      - **Email Integration**: Automated email tracking and management
      
      ## Authentication
      All protected endpoints require a valid JWT token obtained through the authentication flow.
      Use the Bearer token in the Authorization header:
      \`Authorization: Bearer <your-token>\`
      
      ## Workflow Stages
      1. **Prospecting**: Initial research and identification
      2. **Initial Contact**: First outreach to potential sponsors
      3. **Negotiation**: Terms and conditions discussion
      4. **Contract Sent**: Legal documentation sent
      5. **Contract Signed**: Agreement finalized
      6. **Content Creation**: Video/content production
      7. **Content Review**: Sponsor approval process
      8. **Published**: Content goes live
      9. **Completed**: Deal closed and payment received
    `)
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
            tokenUrl: 'https://oauth2.googleapis.com/token',
            scopes: {
              'https://www.googleapis.com/auth/gmail.readonly': 'Read Gmail messages',
              'https://www.googleapis.com/auth/gmail.send': 'Send Gmail messages',
              'https://www.googleapis.com/auth/gmail.modify': 'Modify Gmail messages',
            },
          },
        },
      },
      'gmail-oauth',
    )
    .addTag('Authentication', 'Endpoints for user authentication and Gmail OAuth')
    .addTag('Deals', 'Endpoints for managing sponsorship deals')
    .addTag('Workflow', 'Endpoints for workflow stage management')
    .addTag('Emails', 'Endpoints for email integration and tracking')
    .addTag('Analytics', 'Endpoints for analytics and reporting')
    .addServer('http://localhost:3001', 'Development server')
    .addServer('https://api.yourdomain.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'YouTube Sponsorship API Docs',
    customfavIcon: 'https://avatars.githubusercontent.com/u/6936373?s=48&v=4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });
}