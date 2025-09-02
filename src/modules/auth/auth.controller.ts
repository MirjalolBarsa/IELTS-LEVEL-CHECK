import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Get,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Yangi foydalanuvchi ro\'yxatdan o\'tkazish' })
    @ApiResponse({
        status: 201,
        description: 'Muvaffaqiyatli ro\'yxatdan o\'tdi',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 409, description: 'Foydalanuvchi allaqachon mavjud' })
    @ApiResponse({ status: 400, description: 'Noto\'g\'ri ma\'lumotlar' })
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('local'))
    @ApiOperation({ summary: 'Foydalanuvchi kirishi' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: 'Muvaffaqiyatli kirdi',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Noto\'g\'ri ma\'lumotlar' })
    async login(@Request() req): Promise<AuthResponseDto> {
        return this.authService.login(req.user);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Foydalanuvchi profilini olish' })
    @ApiResponse({ status: 200, description: 'Profil ma\'lumotlari' })
    @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi' })
    getProfile(@Request() req) {
        return req.user;
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Foydalanuvchi chiqishi' })
    @ApiResponse({ status: 200, description: 'Muvaffaqiyatli chiqdi' })
    @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi' })
    logout() {
        // JWT tokenlar stateless, shuning uchun server tomonida logout qilish shart emas
        // Frontend tomonida tokenni o'chirish kifoya
        return { message: 'Muvaffaqiyatli chiqdi' };
    }
}
