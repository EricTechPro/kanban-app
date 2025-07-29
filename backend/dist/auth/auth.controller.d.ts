import { Request, Response } from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    googleAuth(req: Request): Promise<void>;
    googleAuthRedirect(req: Request, res: Response): Promise<void>;
    getGoogleAuthUrl(): {
        url: string;
    };
}
