import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './config/prisma.module';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TestsModule } from './modules/tests/tests.module';
import { ResultsModule } from './modules/results/results.module';
import { OpenaiModule } from './modules/openai/openai.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        ThrottlerModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                throttlers: [{
                    ttl: parseInt(configService.get('RATE_LIMIT_TTL') || '60') * 1000, // Convert to milliseconds
                    limit: parseInt(configService.get('RATE_LIMIT_LIMIT') || '100'),
                }],
            }),
            inject: [ConfigService],
        }),
        PrismaModule,
        AuthModule,
        UsersModule,
        TestsModule,
        ResultsModule,
        OpenaiModule,
        AdminModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule { }
