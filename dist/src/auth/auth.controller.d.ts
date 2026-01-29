import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/register.dto';
import { LoginRequest } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    create(dto: RegisterRequest): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login(dto: LoginRequest): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
