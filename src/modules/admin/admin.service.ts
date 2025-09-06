import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import * as bcrypt from 'bcryptjs';
import {
    CreateTestQuestionDto,
    CreateWritingPromptDto,
    CreateSpeakingTopicDto,
    CreateAdminDto,
    UpdateUserRoleDto
} from './dto/admin.dto';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    // =============== TEST QUESTIONS MANAGEMENT ===============

    async getAllTestQuestions(testType?: string) {
        const where = testType ? { testType: testType as any } : {};
        
        return this.prisma.testQuestion.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async createTestQuestion(createDto: CreateTestQuestionDto) {
        return this.prisma.testQuestion.create({
            data: createDto as any,
        });
    }

    async updateTestQuestion(id: string, updateDto: Partial<CreateTestQuestionDto>) {
        const question = await this.prisma.testQuestion.findUnique({
            where: { id },
        });

        if (!question) {
            throw new NotFoundException('Test savoli topilmadi');
        }

        return this.prisma.testQuestion.update({
            where: { id },
            data: updateDto as any,
        });
    }

    async deleteTestQuestion(id: string) {
        const question = await this.prisma.testQuestion.findUnique({
            where: { id },
        });

        if (!question) {
            throw new NotFoundException('Test savoli topilmadi');
        }

        return this.prisma.testQuestion.delete({
            where: { id },
        });
    }

    // =============== WRITING PROMPTS MANAGEMENT ===============

    async getAllWritingPrompts(taskType?: string) {
        const where = taskType ? { taskType: taskType as any } : {};
        
        return this.prisma.writingPrompt.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async createWritingPrompt(createDto: CreateWritingPromptDto) {
        return this.prisma.writingPrompt.create({
            data: createDto as any,
        });
    }

    async updateWritingPrompt(id: string, updateDto: Partial<CreateWritingPromptDto>) {
        const prompt = await this.prisma.writingPrompt.findUnique({
            where: { id },
        });

        if (!prompt) {
            throw new NotFoundException('Writing prompt topilmadi');
        }

        return this.prisma.writingPrompt.update({
            where: { id },
            data: updateDto as any,
        });
    }

    async deleteWritingPrompt(id: string) {
        const prompt = await this.prisma.writingPrompt.findUnique({
            where: { id },
        });

        if (!prompt) {
            throw new NotFoundException('Writing prompt topilmadi');
        }

        return this.prisma.writingPrompt.delete({
            where: { id },
        });
    }

    // =============== SPEAKING TOPICS MANAGEMENT ===============

    async getAllSpeakingTopics(part?: string) {
        const where = part ? { part: part as any } : {};
        
        return this.prisma.speakingTopic.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async createSpeakingTopic(createDto: CreateSpeakingTopicDto) {
        return this.prisma.speakingTopic.create({
            data: createDto as any,
        });
    }

    async updateSpeakingTopic(id: string, updateDto: Partial<CreateSpeakingTopicDto>) {
        const topic = await this.prisma.speakingTopic.findUnique({
            where: { id },
        });

        if (!topic) {
            throw new NotFoundException('Speaking topic topilmadi');
        }

        return this.prisma.speakingTopic.update({
            where: { id },
            data: updateDto as any,
        });
    }

    async deleteSpeakingTopic(id: string) {
        const topic = await this.prisma.speakingTopic.findUnique({
            where: { id },
        });

        if (!topic) {
            throw new NotFoundException('Speaking topic topilmadi');
        }

        return this.prisma.speakingTopic.delete({
            where: { id },
        });
    }

    // =============== USERS MANAGEMENT ===============

    async getAllUsers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    createdAt: true,
                    _count: {
                        select: {
                            testResults: true,
                        },
                    },
                },
            }),
            this.prisma.user.count(),
        ]);

        return {
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async deleteUser(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('Foydalanuvchi topilmadi');
        }

        return this.prisma.user.delete({
            where: { id },
        });
    }

    // =============== STATISTICS & ANALYTICS ===============

    async getSystemStatistics() {
        const [
            totalUsers,
            totalTestResults,
            totalQuestions,
            totalPrompts,
            totalTopics,
            recentActivity
        ] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.testResult.count(),
            this.prisma.testQuestion.count(),
            this.prisma.writingPrompt.count(),
            this.prisma.speakingTopic.count(),
            this.prisma.testResult.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            }),
        ]);

        const testsByType = await this.prisma.testResult.groupBy({
            by: ['testType'],
            _count: { testType: true },
        });

        const averageScores = await this.prisma.testResult.groupBy({
            by: ['testType'],
            _avg: { bandScore: true },
        });

        return {
            overview: {
                totalUsers,
                totalTestResults,
                totalQuestions,
                totalPrompts,
                totalTopics,
            },
            testsByType: testsByType.map(item => ({
                testType: item.testType,
                count: item._count.testType,
            })),
            averageScores: averageScores.map(item => ({
                testType: item.testType,
                averageScore: item._avg.bandScore,
            })),
            recentActivity,
        };
    }

    async getUserDetails(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                testResults: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                },
                _count: {
                    select: {
                        testResults: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('Foydalanuvchi topilmadi');
        }

        return user;
    }

    // =============== TEST RESULTS MANAGEMENT ===============

    async getAllTestResults(page = 1, limit = 20, testType?: string) {
        const skip = (page - 1) * limit;
        const where = testType ? { testType: testType as any } : {};
        
        const [results, total] = await Promise.all([
            this.prisma.testResult.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            }),
            this.prisma.testResult.count({ where }),
        ]);

        return {
            results,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async deleteTestResult(id: string) {
        const result = await this.prisma.testResult.findUnique({
            where: { id },
        });

        if (!result) {
            throw new NotFoundException('Test natijasi topilmadi');
        }

        return this.prisma.testResult.delete({
            where: { id },
        });
    }

    // =============== ADMIN MANAGEMENT (Super Admin only) ===============

    async createAdmin(createDto: CreateAdminDto) {
        // Email va username tekshirish
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: createDto.email },
                    { username: createDto.username }
                ]
            }
        });

        if (existingUser) {
            throw new ConflictException('Email yoki username allaqachon mavjud');
        }

        // Parolni hash qilish
        const hashedPassword = await bcrypt.hash(createDto.password, 10);

        const admin = await this.prisma.user.create({
            data: {
                email: createDto.email,
                username: createDto.username,
                password: hashedPassword,
                firstName: createDto.firstName,
                lastName: createDto.lastName,
                role: createDto.role as any,
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });

        return admin;
    }

    async getAllAdmins() {
        return this.prisma.user.findMany({
            where: {
                role: {
                    in: ['ADMIN', 'SUPER_ADMIN']
                }
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        testResults: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateUserRole(userId: string, updateDto: UpdateUserRoleDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('Foydalanuvchi topilmadi');
        }

        return this.prisma.user.update({
            where: { id: userId },
            data: { role: updateDto.role as any },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                updatedAt: true,
            },
        });
    }

    async deleteAdmin(adminId: string) {
        const admin = await this.prisma.user.findUnique({
            where: { id: adminId },
        });

        if (!admin) {
            throw new NotFoundException('Admin topilmadi');
        }

        if (!['ADMIN', 'SUPER_ADMIN'].includes(admin.role as any)) {
            throw new BadRequestException('Bu foydalanuvchi admin emas');
        }

        return this.prisma.user.delete({
            where: { id: adminId },
        });
    }
}
