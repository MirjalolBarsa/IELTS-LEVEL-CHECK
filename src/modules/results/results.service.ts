import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class ResultsService {
    constructor(private prisma: PrismaService) { }

    // Foydalanuvchining barcha natijalarini olish
    async getMyResults(userId: string) {
        return this.prisma.testResult.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                testType: true,
                score: true,
                bandScore: true,
                maxScore: true,
                feedback: true,
                createdAt: true,
                aiAnalysis: true,
            },
        });
    }

    // Test turi bo'yicha natijalarni olish
    async getResultsByTestType(userId: string, testType: string) {
        return this.prisma.testResult.findMany({
            where: {
                userId,
                testType: testType as any,
            },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                testType: true,
                score: true,
                bandScore: true,
                maxScore: true,
                feedback: true,
                responses: true,
                correctAnswers: true,
                aiAnalysis: true,
                createdAt: true,
            },
        });
    }

    // Bitta natijani olish
    async getResultById(userId: string, resultId: string) {
        const result = await this.prisma.testResult.findFirst({
            where: {
                id: resultId,
                userId,
            },
            include: {
                session: true,
            },
        });

        if (!result) {
            throw new NotFoundException('Test natijasi topilmadi');
        }

        return result;
    }

    // Foydalanuvchi statistikasi
    async getUserStatistics(userId: string) {
        // Barcha testlar soni
        const totalTests = await this.prisma.testResult.count({
            where: { userId },
        });

        // Test turlari bo'yicha statistika
        const testTypeStats = await this.prisma.testResult.groupBy({
            by: ['testType'],
            where: { userId },
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

        // Eng yaxshi natijalar
        const bestResults = await this.prisma.testResult.findMany({
            where: { userId },
            orderBy: { bandScore: 'desc' },
            take: 5,
            select: {
                id: true,
                testType: true,
                bandScore: true,
                createdAt: true,
            },
        });

        // Oxirgi testlar
        const recentResults = await this.prisma.testResult.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
                id: true,
                testType: true,
                bandScore: true,
                createdAt: true,
            },
        });

        // Umumiy o'rtacha ball
        const averageResult = await this.prisma.testResult.aggregate({
            where: { userId },
            _avg: {
                bandScore: true,
            },
        });

        return {
            totalTests,
            averageBandScore: averageResult._avg.bandScore || 0,
            testTypeStatistics: testTypeStats.map(stat => ({
                testType: stat.testType,
                totalTests: stat._count.id,
                averageBand: stat._avg.bandScore || 0,
                highestBand: stat._max.bandScore || 0,
            })),
            bestResults,
            recentResults,
        };
    }

    // Global statistika (Admin uchun)
    async getGlobalStatistics() {
        // Barcha foydalanuvchilar soni
        const totalUsers = await this.prisma.user.count();

        // Barcha testlar soni
        const totalTests = await this.prisma.testResult.count();

        // Test turlari bo'yicha statistika
        const testTypeStats = await this.prisma.testResult.groupBy({
            by: ['testType'],
            _count: {
                id: true,
            },
            _avg: {
                bandScore: true,
            },
        });

        // Eng faol foydalanuvchilar
        const mostActiveUsers = await this.prisma.testResult.groupBy({
            by: ['userId'],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
            take: 10,
        });

        // Kunlik statistika (oxirgi 30 kun)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyStats = await this.prisma.testResult.groupBy({
            by: ['createdAt'],
            where: {
                createdAt: {
                    gte: thirtyDaysAgo,
                },
            },
            _count: {
                id: true,
            },
        });

        return {
            totalUsers,
            totalTests,
            averageBandScore: testTypeStats.reduce((sum, stat) =>
                sum + (stat._avg.bandScore || 0), 0) / testTypeStats.length || 0,
            testTypeStatistics: testTypeStats.map(stat => ({
                testType: stat.testType,
                totalTests: stat._count.id,
                averageBand: stat._avg.bandScore || 0,
            })),
            mostActiveUsers: await Promise.all(
                mostActiveUsers.map(async (user) => {
                    const userInfo = await this.prisma.user.findUnique({
                        where: { id: user.userId },
                        select: { username: true, email: true },
                    });
                    return {
                        userId: user.userId,
                        username: userInfo?.username,
                        email: userInfo?.email,
                        totalTests: user._count.id,
                    };
                })
            ),
            dailyActivity: dailyStats,
        };
    }

    // Natijani o'chirish
    async deleteResult(userId: string, resultId: string) {
        const result = await this.prisma.testResult.findFirst({
            where: {
                id: resultId,
                userId,
            },
        });

        if (!result) {
            throw new NotFoundException('Test natijasi topilmadi');
        }

        await this.prisma.testResult.delete({
            where: { id: resultId },
        });

        return { message: 'Test natijasi muvaffaqiyatli o\'chirildi' };
    }
}
