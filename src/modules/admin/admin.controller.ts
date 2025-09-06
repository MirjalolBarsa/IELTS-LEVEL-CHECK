import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import {
    CreateTestQuestionDto,
    CreateWritingPromptDto,
    CreateSpeakingTopicDto
} from './dto/admin.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    // =============== SYSTEM OVERVIEW ===============

    @Get('dashboard')
    @ApiOperation({ summary: 'Admin dashboard ma\'lumotlari' })
    @ApiResponse({
        status: 200,
        description: 'Tizim statistikalari',
    })
    getSystemStatistics() {
        return this.adminService.getSystemStatistics();
    }

    // =============== TEST QUESTIONS MANAGEMENT ===============

    @Get('test-questions')
    @ApiOperation({ summary: 'Barcha test savollarini olish' })
    @ApiQuery({
        name: 'testType',
        required: false,
        enum: ['LISTENING', 'READING', 'WRITING', 'SPEAKING'],
    })
    @ApiResponse({
        status: 200,
        description: 'Test savollari ro\'yxati',
    })
    getAllTestQuestions(@Query('testType') testType?: string) {
        return this.adminService.getAllTestQuestions(testType);
    }

    @Post('test-questions')
    @ApiOperation({ summary: 'Yangi test savoli yaratish' })
    @ApiResponse({
        status: 201,
        description: 'Test savoli muvaffaqiyatli yaratildi',
    })
    createTestQuestion(@Body() createDto: CreateTestQuestionDto) {
        return this.adminService.createTestQuestion(createDto);
    }

    @Put('test-questions/:id')
    @ApiOperation({ summary: 'Test savolini yangilash' })
    @ApiParam({ name: 'id', description: 'Test savoli ID' })
    @ApiResponse({
        status: 200,
        description: 'Test savoli muvaffaqiyatli yangilandi',
    })
    updateTestQuestion(
        @Param('id') id: string,
        @Body() updateDto: Partial<CreateTestQuestionDto>
    ) {
        return this.adminService.updateTestQuestion(id, updateDto);
    }

    @Delete('test-questions/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Test savolini o\'chirish' })
    @ApiParam({ name: 'id', description: 'Test savoli ID' })
    @ApiResponse({
        status: 204,
        description: 'Test savoli muvaffaqiyatli o\'chirildi',
    })
    deleteTestQuestion(@Param('id') id: string) {
        return this.adminService.deleteTestQuestion(id);
    }

    // =============== WRITING PROMPTS MANAGEMENT ===============

    @Get('writing-prompts')
    @ApiOperation({ summary: 'Barcha writing promptlarini olish' })
    @ApiQuery({
        name: 'taskType',
        required: false,
        enum: ['TASK_1', 'TASK_2'],
    })
    @ApiResponse({
        status: 200,
        description: 'Writing promptlar ro\'yxati',
    })
    getAllWritingPrompts(@Query('taskType') taskType?: string) {
        return this.adminService.getAllWritingPrompts(taskType);
    }

    @Post('writing-prompts')
    @ApiOperation({ summary: 'Yangi writing prompt yaratish' })
    @ApiResponse({
        status: 201,
        description: 'Writing prompt muvaffaqiyatli yaratildi',
    })
    createWritingPrompt(@Body() createDto: CreateWritingPromptDto) {
        return this.adminService.createWritingPrompt(createDto);
    }

    @Put('writing-prompts/:id')
    @ApiOperation({ summary: 'Writing promptni yangilash' })
    @ApiParam({ name: 'id', description: 'Writing prompt ID' })
    @ApiResponse({
        status: 200,
        description: 'Writing prompt muvaffaqiyatli yangilandi',
    })
    updateWritingPrompt(
        @Param('id') id: string,
        @Body() updateDto: Partial<CreateWritingPromptDto>
    ) {
        return this.adminService.updateWritingPrompt(id, updateDto);
    }

    @Delete('writing-prompts/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Writing promptni o\'chirish' })
    @ApiParam({ name: 'id', description: 'Writing prompt ID' })
    @ApiResponse({
        status: 204,
        description: 'Writing prompt muvaffaqiyatli o\'chirildi',
    })
    deleteWritingPrompt(@Param('id') id: string) {
        return this.adminService.deleteWritingPrompt(id);
    }

    // =============== SPEAKING TOPICS MANAGEMENT ===============

    @Get('speaking-topics')
    @ApiOperation({ summary: 'Barcha speaking topiclarini olish' })
    @ApiQuery({
        name: 'part',
        required: false,
        enum: ['PART_1', 'PART_2', 'PART_3'],
    })
    @ApiResponse({
        status: 200,
        description: 'Speaking topiclar ro\'yxati',
    })
    getAllSpeakingTopics(@Query('part') part?: string) {
        return this.adminService.getAllSpeakingTopics(part);
    }

    @Post('speaking-topics')
    @ApiOperation({ summary: 'Yangi speaking topic yaratish' })
    @ApiResponse({
        status: 201,
        description: 'Speaking topic muvaffaqiyatli yaratildi',
    })
    createSpeakingTopic(@Body() createDto: CreateSpeakingTopicDto) {
        return this.adminService.createSpeakingTopic(createDto);
    }

    @Put('speaking-topics/:id')
    @ApiOperation({ summary: 'Speaking topicni yangilash' })
    @ApiParam({ name: 'id', description: 'Speaking topic ID' })
    @ApiResponse({
        status: 200,
        description: 'Speaking topic muvaffaqiyatli yangilandi',
    })
    updateSpeakingTopic(
        @Param('id') id: string,
        @Body() updateDto: Partial<CreateSpeakingTopicDto>
    ) {
        return this.adminService.updateSpeakingTopic(id, updateDto);
    }

    @Delete('speaking-topics/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Speaking topicni o\'chirish' })
    @ApiParam({ name: 'id', description: 'Speaking topic ID' })
    @ApiResponse({
        status: 204,
        description: 'Speaking topic muvaffaqiyatli o\'chirildi',
    })
    deleteSpeakingTopic(@Param('id') id: string) {
        return this.adminService.deleteSpeakingTopic(id);
    }

    // =============== USERS MANAGEMENT ===============

    @Get('users')
    @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
    @ApiResponse({
        status: 200,
        description: 'Foydalanuvchilar ro\'yxati',
    })
    getAllUsers(
        @Query('page') page?: number,
        @Query('limit') limit?: number
    ) {
        return this.adminService.getAllUsers(page, limit);
    }

    @Get('users/:id')
    @ApiOperation({ summary: 'Foydalanuvchi tafsilotlari' })
    @ApiParam({ name: 'id', description: 'Foydalanuvchi ID' })
    @ApiResponse({
        status: 200,
        description: 'Foydalanuvchi ma\'lumotlari',
    })
    getUserDetails(@Param('id') id: string) {
        return this.adminService.getUserDetails(id);
    }

    @Delete('users/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Foydalanuvchini o\'chirish' })
    @ApiParam({ name: 'id', description: 'Foydalanuvchi ID' })
    @ApiResponse({
        status: 204,
        description: 'Foydalanuvchi muvaffaqiyatli o\'chirildi',
    })
    deleteUser(@Param('id') id: string) {
        return this.adminService.deleteUser(id);
    }

    // =============== TEST RESULTS MANAGEMENT ===============

    @Get('test-results')
    @ApiOperation({ summary: 'Barcha test natijalarini olish' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
    @ApiQuery({
        name: 'testType',
        required: false,
        enum: ['LISTENING', 'READING', 'WRITING', 'SPEAKING'],
    })
    @ApiResponse({
        status: 200,
        description: 'Test natijalari ro\'yxati',
    })
    getAllTestResults(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('testType') testType?: string
    ) {
        return this.adminService.getAllTestResults(page, limit, testType);
    }

    @Delete('test-results/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Test natijasini o\'chirish' })
    @ApiParam({ name: 'id', description: 'Test natijasi ID' })
    @ApiResponse({
        status: 204,
        description: 'Test natijasi muvaffaqiyatli o\'chirildi',
    })
    deleteTestResult(@Param('id') id: string) {
        return this.adminService.deleteTestResult(id);
    }
}
