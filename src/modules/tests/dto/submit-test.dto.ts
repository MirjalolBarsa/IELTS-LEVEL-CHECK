import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsArray, IsOptional, IsNumber, Min, Max } from 'class-validator';

export enum TestType {
    LISTENING = 'LISTENING',
    READING = 'READING',
    WRITING = 'WRITING',
    SPEAKING = 'SPEAKING',
}

export class SubmitTestDto {
    @ApiProperty({
        description: 'Test turi',
        enum: TestType,
        example: TestType.LISTENING,
    })
    @IsEnum(TestType)
    testType: TestType;

    @ApiProperty({
        description: 'Test javoblari',
        example: { q1: 'answer1', q2: 'answer2' },
    })
    responses: Record<string, any>;

    @ApiProperty({
        description: 'Test sessiyasi ID (ixtiyoriy)',
        required: false,
    })
    @IsOptional()
    @IsString()
    sessionId?: string;
}

export class StartTestSessionDto {
    @ApiProperty({
        description: 'Test turi',
        enum: TestType,
        example: TestType.LISTENING,
    })
    @IsEnum(TestType)
    testType: TestType;
}

export class WritingSubmissionDto {
    @ApiProperty({
        description: 'Writing task turi',
        enum: ['TASK_1', 'TASK_2'],
        example: 'TASK_1',
    })
    @IsEnum(['TASK_1', 'TASK_2'])
    taskType: 'TASK_1' | 'TASK_2';

    @ApiProperty({
        description: 'Yozilgan matn',
        example: 'The chart shows...',
    })
    @IsString()
    text: string;

    @ApiProperty({
        description: 'Prompt ID',
        example: 'prompt-uuid',
    })
    @IsString()
    promptId: string;
}

export class SpeakingSubmissionDto {
    @ApiProperty({
        description: 'Speaking part',
        enum: ['PART_1', 'PART_2', 'PART_3'],
        example: 'PART_1',
    })
    @IsEnum(['PART_1', 'PART_2', 'PART_3'])
    part: 'PART_1' | 'PART_2' | 'PART_3';

    @ApiProperty({
        description: 'Audio transkripsiya',
        example: 'Hello, my name is...',
    })
    @IsString()
    transcript: string;

    @ApiProperty({
        description: 'Topic ID',
        example: 'topic-uuid',
    })
    @IsString()
    topicId: string;
}
