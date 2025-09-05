import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Request,
    Param,
    Query,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
    ApiConsumes,
} from '@nestjs/swagger';
import { TestsService } from './tests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
    SubmitTestDto,
    StartTestSessionDto,
    WritingSubmissionDto,
    SpeakingSubmissionDto,
    TestType,
} from './dto/submit-test.dto';
import {
    TestResultResponseDto,
    TestSessionResponseDto,
} from './dto/test-response.dto';

@ApiTags('Tests')
@Controller('tests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TestsController {
    constructor(private readonly testsService: TestsService) { }

    @Post('sessions/start')
    @ApiOperation({ summary: 'Test sessiyasini boshlash' })
    @ApiResponse({
        status: 201,
        description: 'Test sessiyasi muvaffaqiyatli boshlandi',
        type: TestSessionResponseDto,
    })
    startSession(@Request() req, @Body() startTestDto: StartTestSessionDto) {
        return this.testsService.startTestSession(req.user.id, startTestDto);
    }

    @Get('questions/:testType')
    @ApiOperation({ summary: 'Test savollarini olish' })
    @ApiParam({ name: 'testType', enum: TestType })
    @ApiResponse({
        status: 200,
        description: 'Test savollari',
    })
    getQuestions(@Param('testType') testType: TestType) {
        return this.testsService.getTestQuestions(testType);
    }

    @Get('writing/prompts')
    @ApiOperation({ summary: 'Writing promptlarini olish' })
    @ApiQuery({
        name: 'taskType',
        enum: ['TASK_1', 'TASK_2'],
        required: false,
        description: 'Writing task turi',
    })
    @ApiResponse({
        status: 200,
        description: 'Writing promptlari',
    })
    getWritingPrompts(@Query('taskType') taskType?: 'TASK_1' | 'TASK_2') {
        return this.testsService.getWritingPrompts(taskType);
    }

    @Get('speaking/topics')
    @ApiOperation({ summary: 'Speaking topiclarini olish' })
    @ApiQuery({
        name: 'part',
        enum: ['PART_1', 'PART_2', 'PART_3'],
        required: false,
        description: 'Speaking qismi',
    })
    @ApiResponse({
        status: 200,
        description: 'Speaking topiclari',
    })
    getSpeakingTopics(@Query('part') part?: 'PART_1' | 'PART_2' | 'PART_3') {
        return this.testsService.getSpeakingTopics(part);
    }

    @Post('submit/listening-reading')
    @ApiOperation({ summary: 'Listening/Reading testini topshirish' })
    @ApiResponse({
        status: 201,
        description: 'Test muvaffaqiyatli baholandi',
        type: TestResultResponseDto,
    })
    submitListeningReading(@Request() req, @Body() submitTestDto: SubmitTestDto) {
        if (!['LISTENING', 'READING'].includes(submitTestDto.testType)) {
            throw new Error('Bu endpoint faqat Listening va Reading testlari uchun');
        }
        return this.testsService.submitListeningReading(req.user.id, submitTestDto);
    }

    @Post('submit/writing')
    @ApiOperation({ summary: 'Writing testini topshirish' })
    @ApiResponse({
        status: 201,
        description: 'Writing test muvaffaqiyatli baholandi',
        type: TestResultResponseDto,
    })
    submitWriting(@Request() req, @Body() writingDto: WritingSubmissionDto) {
        return this.testsService.submitWriting(req.user.id, writingDto);
    }

    @Post('submit/speaking')
    @ApiOperation({ summary: 'Speaking testini topshirish' })
    @ApiResponse({
        status: 201,
        description: 'Speaking test muvaffaqiyatli baholandi',
        type: TestResultResponseDto,
    })
    submitSpeaking(@Request() req, @Body() speakingDto: SpeakingSubmissionDto) {
        return this.testsService.submitSpeaking(req.user.id, speakingDto);
    }

    @Post('upload/audio')
    @UseInterceptors(FileInterceptor('audio', {
        storage: memoryStorage(), // Memory storage for audio files
        fileFilter: (req, file, cb) => {
            if (file.mimetype.match(/\/(mp3|wav|m4a|ogg|aac|flac)$/)) {
                cb(null, true);
            } else {
                cb(new Error('Faqat audio fayllar yuklash mumkin!'), false);
            }
        },
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB limit
        },
    }))
    @ApiOperation({ summary: 'Listening/Speaking uchun audio fayl yuklash' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 201,
        description: 'Audio fayl muvaffaqiyatli yuklandi',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                filename: { type: 'string' },
                url: { type: 'string' },
                size: { type: 'number' },
                mimetype: { type: 'string' },
            },
        },
    })
    uploadAudio(@Request() req, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new Error('Audio fayl yuklanmadi!');
        }

        // Audio file upload response
        return {
            message: 'Audio fayl muvaffaqiyatli yuklandi',
            filename: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            uploadedBy: req.user.id,
            uploadedAt: new Date().toISOString(),
            note: 'Fayl memory da saqlanadi',
        };
    }
}
