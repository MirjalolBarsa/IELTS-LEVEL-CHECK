import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
    @Get()
    @ApiOperation({ summary: 'API health check' })
    @ApiResponse({ status: 200, description: 'API is working' })
    getHello() {
        return {
            message: 'IELTS Level Check API is working!',
            version: '1.0.0',
            timestamp: new Date().toISOString()
        };
    }

    @Get('health')
    @ApiOperation({ summary: 'Health check endpoint' })
    @ApiResponse({ status: 200, description: 'Health status' })
    getHealth() {
        return {
            status: 'OK',
            service: 'IELTS Level Check API',
            database: 'Connected',
            timestamp: new Date().toISOString()
        };
    }
}
