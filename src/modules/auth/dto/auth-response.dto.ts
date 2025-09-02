import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
    @ApiProperty({
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    access_token: string;

    @ApiProperty({
        description: 'Token turi',
        example: 'Bearer',
    })
    token_type: string;

    @ApiProperty({
        description: 'Token muddati (sekundlarda)',
        example: 86400,
    })
    expires_in: number;

    @ApiProperty({
        description: 'Foydalanuvchi ma\'lumotlari',
    })
    user: {
        id: string;
        username: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
}
