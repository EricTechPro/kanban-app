import { Controller, Get, Post, Delete, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import {
  GmailAuthUrlDto,
  GmailAuthStatusDto,
  MessageResponseDto,
  AuthResponseDto,
  LoginDto,
  RegisterDto
} from '../dto/auth.dto';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Create a new user account with email and password'
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data'
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email already exists'
  })
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Implementation would go here
    // This is a placeholder that matches the DTO structure
    return {
      accessToken: 'jwt-token-here',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: 'user-123',
        email: registerDto.email,
        name: registerDto.name,
      }
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticate user with email and password'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated',
    type: AuthResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials'
  })
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Implementation would go here
    return {
      accessToken: 'jwt-token-here',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: 'user-123',
        email: loginDto.email,
        name: 'John Doe',
      }
    };
  }

  @Get('gmail/auth-url')
  @ApiOperation({
    summary: 'Get Gmail OAuth URL',
    description: 'Generate Gmail OAuth authorization URL to initiate the authentication flow'
  })
  @ApiResponse({
    status: 200,
    description: 'OAuth URL generated successfully',
    type: GmailAuthUrlDto
  })
  async getGmailAuthUrl(): Promise<GmailAuthUrlDto> {
    const authUrl = this.authService.generateAuthUrl();
    return {
      authUrl,
      message: 'Redirect user to this URL to start OAuth flow',
    };
  }

  @Get('gmail/status')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get Gmail connection status',
    description: 'Check if Gmail is connected and get connection details'
  })
  @ApiResponse({
    status: 200,
    description: 'Gmail connection status retrieved',
    type: GmailAuthStatusDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token'
  })
  async getGmailStatus(@Request() req): Promise<GmailAuthStatusDto> {
    const userId = req.user?.id || 'user-123'; // Would come from JWT
    const status = await this.authService.getAuthStatus(userId);
    return status;
  }

  @Delete('gmail/disconnect')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Disconnect Gmail account',
    description: 'Remove Gmail OAuth connection for the authenticated user'
  })
  @ApiResponse({
    status: 200,
    description: 'Gmail account disconnected successfully',
    type: MessageResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
  async disconnectGmail(@Request() req): Promise<MessageResponseDto> {
    const userId = req.user?.id || 'user-123'; // Would come from JWT
    await this.authService.disconnectGmail(userId);
    return {
      success: true,
      message: 'Gmail account disconnected successfully',
    };
  }

  @Post('gmail/refresh-token')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh Gmail access token',
    description: 'Refresh the Gmail OAuth access token if it has expired'
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: MessageResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - Failed to refresh token'
  })
  async refreshGmailToken(@Request() req): Promise<MessageResponseDto> {
    const userId = req.user?.id || 'user-123'; // Would come from JWT
    const accessToken = await this.authService.refreshTokenIfNeeded(userId);
    return {
      success: !!accessToken,
      message: accessToken ? 'Token refreshed successfully' : 'Token refresh failed',
    };
  }

  @Get('gmail/callback')
  @ApiOperation({
    summary: 'Gmail OAuth callback',
    description: 'Handle Gmail OAuth callback with authorization code'
  })
  @ApiResponse({
    status: 302,
    description: 'Redirect to success or error page'
  })
  async gmailCallback(@Request() req): Promise<void> {
    // OAuth callback implementation
    // Would handle the authorization code and redirect
  }
}