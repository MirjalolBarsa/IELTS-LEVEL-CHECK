import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: 'Foydalanuvchi nomi',
        example: 'john_doe',
        minLength: 3,
        maxLength: 30,
    })
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    username: string;

    @ApiProperty({
        description: 'Email manzil',
        example: 'john@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Parol',
        example: 'strongPassword123',
        minLength: 6,
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: 'Ism',
        example: 'John',
        required: false,
    })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({
        description: 'Familiya',
        example: 'Doe',
        required: false,
    })
    @IsOptional()
    @IsString()
    lastName?: string;
}
