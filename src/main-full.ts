import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app-full.module';

async function bootstrap() {
    try {
        console.log('🔄 Starting FULL IELTS API...');

        const app = await NestFactory.create<NestExpressApplication>(AppModule, {
            logger: ['error', 'warn', 'log'],
        });
        console.log('✅ IELTS Application created successfully');

        // Static files serving for uploaded audio
        app.useStaticAssets(join(__dirname, '..', 'uploads'), {
            prefix: '/uploads/',
        });

        // Global validation pipe
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        // CORS
        app.enableCors();
        app.setGlobalPrefix('api');

        // Swagger
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

        const port = 3000;
        await app.listen(port);

        console.log(`🚀 IELTS API running on: http://localhost:${port}`);
        console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
        console.log(`🔗 API endpoints: http://localhost:${port}/api`);

    } catch (error) {
        console.error('❌ Failed to start IELTS application:', error);
        process.exit(1);
    }
}

bootstrap();
