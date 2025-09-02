import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { OpenaiModule } from '../openai/openai.module';

@Module({
    imports: [OpenaiModule],
    providers: [TestsService],
    controllers: [TestsController],
    exports: [TestsService],
})
export class TestsModule { }
