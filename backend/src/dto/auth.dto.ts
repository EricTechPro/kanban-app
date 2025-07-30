import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class RegisterDto extends LoginDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
  })
  tokenType: string;

  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: 3600,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      id: { type: 'string', example: 'user-123' },
      email: { type: 'string', example: 'user@example.com' },
      name: { type: 'string', example: 'John Doe' },
    },
  })
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export class GmailAuthUrlDto {
  @ApiProperty({
    description: 'Gmail OAuth authorization URL',
    example: 'https://accounts.google.com/o/oauth2/v2/auth?...',
  })
  authUrl: string;

  @ApiProperty({
    description: 'Instructions for the user',
    example: 'Redirect user to this URL to start OAuth flow',
  })
  message: string;
}

export class GmailAuthStatusDto {
  @ApiProperty({
    description: 'Whether Gmail is connected',
    example: true,
  })
  isConnected: boolean;

  @ApiProperty({
    description: 'Connected Gmail address',
    example: 'user@gmail.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Token expiration timestamp',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  expiresAt?: string;

  @ApiProperty({
    description: 'Whether token needs refresh',
    example: false,
  })
  needsRefresh: boolean;
}

export class MessageResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message: string;
}