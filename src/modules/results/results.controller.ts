import {
    Controller,
    Get,
    Delete,
    Param,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { ResultsService } from './results.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TestResultResponseDto } from '../tests/dto/test-response.dto';

@ApiTags('Results')
@Controller('results')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ResultsController {
    constructor(private readonly resultsService: ResultsService) { }

    @Get('my')
    @ApiOperation({ summary: 'Mening barcha test natijalarim' })
    @ApiResponse({
        status: 200,
        description: 'Foydalanuvchining barcha test natijalari',
        type: [TestResultResponseDto],
    })
    getMyResults(@Request() req) {
        return this.resultsService.getMyResults(req.user.id);
    }

    @Get('my/stats')
    @ApiOperation({ summary: 'Mening test statistikam' })
    @ApiResponse({
        status: 200,
        description: 'Foydalanuvchi test statistikasi',
    })
    getMyStatistics(@Request() req) {
        return this.resultsService.getUserStatistics(req.user.id);
    }

    @Get('my/:testType')
    @ApiOperation({ summary: 'Test turi bo\'yicha natijalarim' })
    @ApiParam({
        name: 'testType',
        description: 'Test turi',
        enum: ['LISTENING', 'READING', 'WRITING', 'SPEAKING'],
    })
    @ApiResponse({
        status: 200,
        description: 'Test turi bo\'yicha natijalar',
        type: [TestResultResponseDto],
    })
    getResultsByTestType(
        @Request() req,
        @Param('testType') testType: string,
    ) {
        return this.resultsService.getResultsByTestType(req.user.id, testType);
    }

    @Get('global/stats')
    @ApiOperation({ summary: 'Global statistika (Admin uchun)' })
    @ApiResponse({
        status: 200,
        description: 'Barcha foydalanuvchilar statistikasi',
    })
    getGlobalStatistics() {
        return this.resultsService.getGlobalStatistics();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Test natijasini ID bo\'yicha olish' })
    @ApiParam({ name: 'id', description: 'Test natijasi ID' })
    @ApiResponse({
        status: 200,
        description: 'Test natijasi tafsilotlari',
        type: TestResultResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Test natijasi topilmadi' })
    getResultById(@Request() req, @Param('id') id: string) {
        return this.resultsService.getResultById(req.user.id, id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Test natijasini o\'chirish' })
    @ApiParam({ name: 'id', description: 'Test natijasi ID' })
    @ApiResponse({
        status: 200,
        description: 'Test natijasi muvaffaqiyatli o\'chirildi',
    })
    @ApiResponse({ status: 404, description: 'Test natijasi topilmadi' })
    deleteResult(@Request() req, @Param('id') id: string) {
        return this.resultsService.deleteResult(req.user.id, id);
    }
}
