import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        // Check if user already exists
        const existingUser = await this.usersService.findByUsernameOrEmail(
            registerDto.username,
            registerDto.email,
        );

        if (existingUser) {
            throw new ConflictException('Foydalanuvchi nomi yoki email allaqachon mavjud');
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

        // Create user
        const user = await this.usersService.create({
            ...registerDto,
            password: hashedPassword,
        });

        // Generate token
        const payload = { username: user.username, sub: user.id, email: user.email };
        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            token_type: 'Bearer',
            expires_in: this.getTokenExpirationTime(),
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        };
    }

    async login(user: any): Promise<AuthResponseDto> {
        const payload = { username: user.username, sub: user.id, email: user.email };
        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            token_type: 'Bearer',
            expires_in: this.getTokenExpirationTime(),
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        };
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByUsernameOrEmail(username);

        if (user && await bcrypt.compare(password, user.password)) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }

    private getTokenExpirationTime(): number {
        const expiresIn = this.configService.get('JWT_EXPIRES_IN') || '24h';
        // Convert to seconds (simple implementation)
        if (expiresIn.includes('h')) {
            return parseInt(expiresIn) * 3600;
        }
        if (expiresIn.includes('d')) {
            return parseInt(expiresIn) * 86400;
        }
        return 86400; // default 24 hours
    }
}
