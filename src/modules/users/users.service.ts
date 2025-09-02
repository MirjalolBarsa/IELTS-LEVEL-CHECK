import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto) {
        // Check if user already exists
        const existingUser = await this.findByUsernameOrEmail(
            createUserDto.username,
            createUserDto.email,
        );

        if (existingUser) {
            throw new ConflictException('Foydalanuvchi nomi yoki email allaqachon mavjud');
        }

        const user = await this.prisma.user.create({
            data: createUserDto,
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user;
    }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException('Foydalanuvchi topilmadi');
        }

        return user;
    }

    async findByUsernameOrEmail(username: string, email?: string) {
        return this.prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email: email || username },
                ],
            },
        });
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.findOne(id);

        // If password is being updated, hash it
        if (updateUserDto.password) {
            const saltRounds = 12;
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
        }

        // Check for username/email conflicts if they're being updated
        if (updateUserDto.username || updateUserDto.email) {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    AND: [
                        { id: { not: id } },
                        {
                            OR: [
                                { username: updateUserDto.username },
                                { email: updateUserDto.email },
                            ].filter(Boolean),
                        },
                    ],
                },
            });

            if (existingUser) {
                throw new ConflictException('Foydalanuvchi nomi yoki email allaqachon mavjud');
            }
        }

        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id); // Check if user exists

        await this.prisma.user.delete({
            where: { id },
        });

        return { message: 'Foydalanuvchi muvaffaqiyatli o\'chirildi' };
    }

    async getUserStats(id: string) {
        const user = await this.findOne(id);

        const stats = await this.prisma.testResult.groupBy({
            by: ['testType'],
            where: { userId: id },
            _count: {
                id: true,
            },
            _avg: {
                bandScore: true,
            },
            _max: {
                bandScore: true,
            },
        });

        return {
            user,
            statistics: stats.map(stat => ({
                testType: stat.testType,
                totalTests: stat._count.id,
                averageBand: stat._avg.bandScore,
                highestBand: stat._max.bandScore,
            })),
        };
    }
}
