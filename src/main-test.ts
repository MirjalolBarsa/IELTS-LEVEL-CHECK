import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app-test.module';

async function bootstrap() {
    try {
        console.log('🔄 Starting minimal NestJS application...');

        const app = await NestFactory.create(AppModule);
        console.log('✅ NestJS application created successfully');

        app.setGlobalPrefix('api');
        app.enableCors();

        // Swagger setup
        const config = new DocumentBuilder()
            .setTitle('IELTS Level Check API')
            .setDescription('IELTS darajasini tekshirish uchun backend API')
            .setVersion('1.0')
            .addTag('API')
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api/docs', app, document);

        const port = 3000;
        await app.listen(port);

        console.log(`🚀 Minimal app running on: http://localhost:${port}`);
        console.log(`📚 API available at: http://localhost:${port}/api`);
        console.log(`📚 Swagger docs at: http://localhost:${port}/api/docs`);

    } catch (error) {
        console.error('❌ Failed to start application:', error);
        process.exit(1);
    }
}

bootstrap();
