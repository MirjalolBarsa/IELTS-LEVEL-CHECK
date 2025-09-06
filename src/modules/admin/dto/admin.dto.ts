import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber, Min, Max, IsEmail } from 'class-validator';
import { TestType } from '../../tests/dto/submit-test.dto';

export class CreateAdminDto {
    @ApiProperty({
        description: 'Email',
        example: 'admin@ielts.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Parol',
        example: 'SecurePassword123',
    })
    @IsString()
    password: string;

    @ApiProperty({
        description: 'Ism',
        example: 'John',
    })
    @IsString()
    firstName: string;

    @ApiProperty({
        description: 'Familiya',
        example: 'Doe',
    })
    @IsString()
    lastName: string;

    @ApiProperty({
        description: 'Username',
        example: 'johndoe_admin',
    })
    @IsString()
    username: string;

    @ApiProperty({
        description: 'Role',
        enum: ['ADMIN', 'SUPER_ADMIN'],
        example: 'ADMIN',
    })
    @IsEnum(['ADMIN', 'SUPER_ADMIN'])
    role: 'ADMIN' | 'SUPER_ADMIN';
}

export class UpdateUserRoleDto {
    @ApiProperty({
        description: 'Yangi role',
        enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
        example: 'ADMIN',
    })
    @IsEnum(['USER', 'ADMIN', 'SUPER_ADMIN'])
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
}

export class CreateTestQuestionDto {
    @ApiProperty({
        description: 'Test turi',
        enum: TestType,
        example: TestType.LISTENING,
    })
    @IsEnum(TestType)
    testType: TestType;

    @ApiProperty({
        description: 'Savol matni',
        example: 'What is the main topic of the conversation?',
    })
    @IsString()
    questionText: string;

    @ApiProperty({
        description: 'Javob variantlari (JSON format)',
        example: ['Option A', 'Option B', 'Option C', 'Option D'],
        required: false,
    })
    @IsOptional()
    options?: string[];

    @ApiProperty({
        description: 'To\'g\'ri javob',
        example: 'Option A',
        required: false,
    })
    @IsOptional()
    @IsString()
    correctAnswer?: string;

    @ApiProperty({
        description: 'Audio fayl URL (Listening uchun)',
        example: '/audio/listening-1.mp3',
        required: false,
    })
    @IsOptional()
    @IsString()
    audioUrl?: string;

    @ApiProperty({
        description: 'Matn (Reading uchun)',
        example: 'The passage text goes here...',
        required: false,
    })
    @IsOptional()
    @IsString()
    passageText?: string;

    @ApiProperty({
        description: 'Qiyinchilik darajasi',
        enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
        example: 'INTERMEDIATE',
    })
    @IsEnum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

export class CreateWritingPromptDto {
    @ApiProperty({
        description: 'Writing task turi',
        enum: ['TASK_1', 'TASK_2'],
        example: 'TASK_1',
    })
    @IsEnum(['TASK_1', 'TASK_2'])
    taskType: 'TASK_1' | 'TASK_2';

    @ApiProperty({
        description: 'Prompt matni',
        example: 'The chart below shows...',
    })
    @IsString()
    prompt: string;

    @ApiProperty({
        description: 'Ko\'rsatmalar',
        example: 'Summarize the information by selecting and reporting the main features...',
    })
    @IsString()
    instructions: string;

    @ApiProperty({
        description: 'Vaqt chegarasi (daqiqalarda)',
        example: 20,
    })
    @IsNumber()
    @Min(1)
    @Max(60)
    timeLimit: number;

    @ApiProperty({
        description: 'So\'z chegarasi',
        example: 150,
    })
    @IsNumber()
    @Min(50)
    @Max(500)
    wordLimit: number;

    @ApiProperty({
        description: 'Qiyinchilik darajasi',
        enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
        example: 'INTERMEDIATE',
    })
    @IsEnum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

export class CreateSpeakingTopicDto {
    @ApiProperty({
        description: 'Speaking qismi',
        enum: ['PART_1', 'PART_2', 'PART_3'],
        example: 'PART_1',
    })
    @IsEnum(['PART_1', 'PART_2', 'PART_3'])
    part: 'PART_1' | 'PART_2' | 'PART_3';

    @ApiProperty({
        description: 'Mavzu',
        example: 'Tell me about your hometown',
    })
    @IsString()
    topic: string;

    @ApiProperty({
        description: 'Qo\'shimcha savollar',
        example: 'Where is it located? What do you like about it?',
        required: false,
    })
    @IsOptional()
    @IsString()
    questions?: string;

    @ApiProperty({
        description: 'Vaqt chegarasi (daqiqalarda)',
        example: 2,
    })
    @IsNumber()
    @Min(1)
    @Max(10)
    timeLimit: number;

    @ApiProperty({
        description: 'Qiyinchilik darajasi',
        enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
        example: 'INTERMEDIATE',
    })
    @IsEnum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}
