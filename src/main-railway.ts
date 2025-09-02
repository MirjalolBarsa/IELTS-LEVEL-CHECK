import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
    try {
        console.log('🔄 Starting IELTS API...');

        const app = await NestFactory.create<NestExpressApplication>(AppModule, {
            logger: ['error', 'warn', 'log'],
        });
        console.log('✅ IELTS Application created successfully');

        // Global exception filter
        app.useGlobalFilters(new GlobalExceptionFilter());

        // Global logging interceptor
        app.useGlobalInterceptors(new LoggingInterceptor());

        // Create uploads directory for Railway
        const uploadDir = '/tmp/uploads';
        try {
            if (!existsSync(uploadDir)) {
                mkdirSync(uploadDir, { recursive: true });
                console.log('✅ Created upload directory:', uploadDir);
            }
        } catch (err) {
            console.log('⚠️ Could not create upload directory, using memory storage');
        }

        // Static files serving for uploaded audio
        app.useStaticAssets(uploadDir, {
            prefix: '/uploads/',
        });

        // Global validation pipe
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
                disableErrorMessages: process.env.NODE_ENV === 'production',
            }),
        );

        // CORS
        app.enableCors({
            origin: process.env.CORS_ORIGINS?.split(',') || ['*'],
            credentials: true,
        });
        app.setGlobalPrefix('api');

        const port = process.env.PORT || 3000;

        // Swagger documentation (only in development)
        if (process.env.NODE_ENV !== 'production') {
            const config = new DocumentBuilder()
                .setTitle('IELTS Level Check API')
                .setDescription('IELTS darajasini aniqlash uchun API')
                .setVersion('1.0')
                .addTag('Auth', 'Authentication endpoints')
                .addTag('Tests', 'IELTS test endpoints')
                .addTag('Users', 'User management endpoints')
                .addTag('Results', 'Test results endpoints')
                .addBearerAuth()
                .build();

            const document = SwaggerModule.createDocument(app, config);
            SwaggerModule.setup('api/docs', app, document, {
                customSiteTitle: 'IELTS API Documentation',
                customfavIcon: 'https://cdn-icons-png.flaticon.com/512/3002/3002543.png',
                customCss: '.swagger-ui .topbar { display: none }',
            });

            console.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);
        }

        await app.listen(port, '0.0.0.0');
        console.log(`🚀 IELTS API is running on: http://localhost:${port}`);
        console.log(`📱 Health check: http://localhost:${port}/api/health`);
        if (process.env.NODE_ENV !== 'production') {
            console.log(`📖 API Documentation: http://localhost:${port}/api/docs`);
        }
    } catch (error) {
        console.error('❌ Error starting IELTS API:', error);
        process.exit(1);
    }
}

bootstrap();
