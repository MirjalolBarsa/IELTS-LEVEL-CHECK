import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({
        description: 'Foydalanuvchi ID',
        example: 'clxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    })
    id: string;

    @ApiProperty({
        description: 'Foydalanuvchi nomi',
        example: 'john_doe',
    })
    username: string;

    @ApiProperty({
        description: 'Email manzil',
        example: 'john@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'Ism',
        example: 'John',
        required: false,
    })
    firstName?: string;

    @ApiProperty({
        description: 'Familiya',
        example: 'Doe',
        required: false,
    })
    lastName?: string;

    @ApiProperty({
        description: 'Yaratilgan vaqt',
        example: '2024-01-01T00:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Yangilangan vaqt',
        example: '2024-01-01T00:00:00.000Z',
    })
    updatedAt: Date;
}
