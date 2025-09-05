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

        // Create uploads directory
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
                .setDescription('IELTS darajasini tekshirish uchun backend API')
                .setVersion('1.0')
                .addBearerAuth()
                .addTag('Auth', 'Authentication')
                .addTag('Users', 'User management')
                .addTag('Tests', 'IELTS tests')
                .addTag('Results', 'Test results')
                .build();

            const document = SwaggerModule.createDocument(app, config);
            SwaggerModule.setup('api/docs', app, document);
        }

        console.log('🗄️  Database connected successfully');
        
        // Start the server
        await app.listen(port);

        console.log(`🚀 IELTS API running on: http://localhost:${port}`);
        console.log(`📱 API endpoints: http://localhost:${port}/api`);
        
        if (process.env.NODE_ENV !== 'production') {
            console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
        }

    } catch (error) {
        console.error('❌ Failed to start IELTS application:', error);
        process.exit(1);
    }
}

bootstrap();