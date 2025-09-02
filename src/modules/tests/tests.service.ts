import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { OpenaiService } from '../openai/openai.service';
import {
    SubmitTestDto,
    StartTestSessionDto,
    WritingSubmissionDto,
    SpeakingSubmissionDto,
    TestType
} from './dto/submit-test.dto';

@Injectable()
export class TestsService {
    constructor(
        private prisma: PrismaService,
        private openaiService: OpenaiService,
    ) { }

    // Test session yaratish
    async startTestSession(userId: string, startTestDto: StartTestSessionDto) {
        const session = await this.prisma.testSession.create({
            data: {
                userId,
                testType: startTestDto.testType,
                status: 'IN_PROGRESS',
            },
        });

        return session;
    }

    // Test savollarini olish
    async getTestQuestions(testType: TestType) {
        const questions = await this.prisma.testQuestion.findMany({
            where: { testType },
            select: {
                id: true,
                questionText: true,
                options: true,
                audioUrl: true,
                passageText: true,
                difficulty: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        return questions;
    }

    // Writing promptlarini olish
    async getWritingPrompts(taskType?: 'TASK_1' | 'TASK_2') {
        const where = taskType ? { taskType } : {};

        return this.prisma.writingPrompt.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    // Speaking topiclarini olish
    async getSpeakingTopics(part?: 'PART_1' | 'PART_2' | 'PART_3') {
        const where = part ? { part } : {};

        return this.prisma.speakingTopic.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    // Listening/Reading testini baholash
    async submitListeningReading(userId: string, submitTestDto: SubmitTestDto) {
        const questions = await this.getTestQuestions(submitTestDto.testType);

        if (questions.length === 0) {
            throw new NotFoundException('Test savollari topilmadi');
        }

        let correctAnswers = 0;
        const totalQuestions = questions.length;
        const correctAnswersList: Record<string, string> = {};

        // Hardcoded correct answers (real projectda databasedan olish kerak)
        const correctAnswersMap = this.getCorrectAnswers(submitTestDto.testType);

        // Javoblarni tekshirish
        Object.entries(submitTestDto.responses).forEach(([questionId, userAnswer]) => {
            const correctAnswer = correctAnswersMap[questionId];
            correctAnswersList[questionId] = correctAnswer;

            if (this.compareAnswers(userAnswer, correctAnswer)) {
                correctAnswers++;
            }
        });

        const scorePercentage = (correctAnswers / totalQuestions) * 100;
        const bandScore = this.calculateBandScore(scorePercentage);

        // Test natijasini saqlash
        const testResult = await this.prisma.testResult.create({
            data: {
                userId,
                sessionId: submitTestDto.sessionId,
                testType: submitTestDto.testType as any,
                score: correctAnswers,
                bandScore,
                maxScore: totalQuestions,
                responses: submitTestDto.responses,
                correctAnswers: correctAnswersList,
                feedback: this.generateFeedback(bandScore, submitTestDto.testType),
            } as any,
        });

        // Test sessiyasini tugatish
        if (submitTestDto.sessionId) {
            await this.prisma.testSession.update({
                where: { id: submitTestDto.sessionId },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date(),
                },
            });
        }

        return testResult;
    }

    // Writing testini baholash
    async submitWriting(userId: string, writingDto: WritingSubmissionDto) {
        try {
            // Prompt ma'lumotlarini olish
            const prompt = await this.prisma.writingPrompt.findUnique({
                where: { id: writingDto.promptId },
            });

            if (!prompt) {
                throw new NotFoundException('Writing prompt topilmadi');
            }

            // AI orqali baholash
            const evaluation = await this.openaiService.evaluateWriting(
                writingDto.taskType,
                prompt.prompt,
                writingDto.text,
                prompt.wordLimit,
            );

            // Natijani saqlash
            const testResult = await this.prisma.testResult.create({
                data: {
                    userId,
                    testType: 'WRITING' as any,
                    score: evaluation.overallBand,
                    bandScore: evaluation.overallBand,
                    maxScore: 9,
                    responses: { text: writingDto.text },
                    correctAnswers: { prompt: prompt.prompt },
                    feedback: evaluation.feedback,
                    aiAnalysis: {
                        taskResponse: evaluation.taskResponse,
                        coherenceCohesion: evaluation.coherenceCohesion,
                        lexicalResource: evaluation.lexicalResource,
                        grammaticalRange: evaluation.grammaticalRange,
                        strengths: evaluation.strengths,
                        improvements: evaluation.improvements,
                    },
                } as any,
            });

            return testResult;
        } catch (error) {
            throw new BadRequestException(`Writing baholashda xatolik: ${error.message}`);
        }
    }

    // Speaking testini baholash
    async submitSpeaking(userId: string, speakingDto: SpeakingSubmissionDto) {
        try {
            // Topic ma'lumotlarini olish
            const topic = await this.prisma.speakingTopic.findUnique({
                where: { id: speakingDto.topicId },
            });

            if (!topic) {
                throw new NotFoundException('Speaking topic topilmadi');
            }

            // AI orqali baholash
            const evaluation = await this.openaiService.evaluateSpeaking(
                speakingDto.transcript,
                topic.topic,
                speakingDto.part,
            );

            // Natijani saqlash
            const testResult = await this.prisma.testResult.create({
                data: {
                    userId,
                    testType: 'SPEAKING' as any,
                    score: evaluation.overallBand,
                    bandScore: evaluation.overallBand,
                    maxScore: 9,
                    responses: { transcript: speakingDto.transcript },
                    correctAnswers: { topic: topic.topic },
                    feedback: evaluation.feedback,
                    aiAnalysis: {
                        fluencyCoherence: evaluation.fluencyCoherence,
                        lexicalResource: evaluation.lexicalResource,
                        grammaticalRange: evaluation.grammaticalRange,
                        pronunciation: evaluation.pronunciation,
                        strengths: evaluation.strengths,
                        improvements: evaluation.improvements,
                    },
                } as any,
            });

            return testResult;
        } catch (error) {
            throw new BadRequestException(`Speaking baholashda xatolik: ${error.message}`);
        }
    }

    // Band ball hisoblash
    private calculateBandScore(percentage: number): number {
        if (percentage >= 90) return 9.0;
        if (percentage >= 80) return 8.0;
        if (percentage >= 70) return 7.0;
        if (percentage >= 60) return 6.0;
        if (percentage >= 50) return 5.0;
        if (percentage >= 40) return 4.0;
        if (percentage >= 30) return 3.0;
        if (percentage >= 20) return 2.0;
        return 1.0;
    }

    // To'g'ri javoblar (hardcoded, real projectda databasedan olish kerak)
    private getCorrectAnswers(testType: TestType): Record<string, string> {
        if (testType === 'LISTENING') {
            return {
                'q1': 'Booking a hotel',
                'q2': 'three',
                'q3': 'Single room with private bathroom',
                'q4': '85',
                'q5': '10 AM',
                'q6': 'ground',
                'q7': 'Three',
                'q8': '10',
            };
        }

        if (testType === 'READING') {
            return {
                'r1': 'It connects people across distances instantly',
                'r2': 'False',
                'r3': 'information fatigue',
            };
        }

        return {};
    }

    // Javoblarni taqqoslash
    private compareAnswers(userAnswer: any, correctAnswer: string): boolean {
        if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
            return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
        }
        return userAnswer === correctAnswer;
    }

    // Fikr-mulohaza yaratish
    private generateFeedback(bandScore: number, testType: TestType): string {
        const testTypeName = testType === 'LISTENING' ? 'Tinglab tushunish' : 'O\'qib tushunish';

        if (bandScore >= 8.0) {
            return `Ajoyib! ${testTypeName} bo'yicha juda yuqori natija ko'rsatdingiz.`;
        }
        if (bandScore >= 6.5) {
            return `Yaxshi! ${testTypeName} bo'yicha yaxshi natija ko'rsatdingiz.`;
        }
        if (bandScore >= 5.0) {
            return `O'rtacha natija. ${testTypeName} bo'yicha ko'proq mashq qilishingiz tavsiya etiladi.`;
        }
        return `${testTypeName} bo'yicha ko'proq tayyorgarlik ko'rish kerak.`;
    }
}
