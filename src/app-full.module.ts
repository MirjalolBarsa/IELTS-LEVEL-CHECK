import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './config/prisma.module';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TestsModule } from './modules/tests/tests.module';
import { ResultsModule } from './modules/results/results.module';
import { OpenaiModule } from './modules/openai/openai.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        PrismaModule,
        AuthModule,
        UsersModule,
        TestsModule,
        ResultsModule,
        OpenaiModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule { }
