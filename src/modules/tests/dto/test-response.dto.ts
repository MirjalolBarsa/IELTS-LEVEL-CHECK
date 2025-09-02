import { ApiProperty } from '@nestjs/swagger';

export class TestResultResponseDto {
    @ApiProperty({
        description: 'Test natijasi ID',
        example: 'clxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    })
    id: string;

    @ApiProperty({
        description: 'Test turi',
        example: 'LISTENING',
    })
    testType: string;

    @ApiProperty({
        description: 'Umumiy ball',
        example: 7.5,
    })
    score: number;

    @ApiProperty({
        description: 'IELTS band ball',
        example: 7.5,
    })
    bandScore: number;

    @ApiProperty({
        description: 'Maksimal ball',
        example: 9.0,
    })
    maxScore: number;

    @ApiProperty({
        description: 'Fikr-mulohaza',
        example: 'Yaxshi natija...',
    })
    feedback?: string;

    @ApiProperty({
        description: 'AI tahlili (Writing/Speaking uchun)',
        required: false,
    })
    aiAnalysis?: any;

    @ApiProperty({
        description: 'Test yaratilgan vaqt',
        example: '2024-01-01T00:00:00.000Z',
    })
    createdAt: Date;
}

export class TestSessionResponseDto {
    @ApiProperty({
        description: 'Test sessiyasi ID',
        example: 'clxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    })
    id: string;

    @ApiProperty({
        description: 'Test turi',
        example: 'LISTENING',
    })
    testType: string;

    @ApiProperty({
        description: 'Test holati',
        example: 'IN_PROGRESS',
    })
    status: string;

    @ApiProperty({
        description: 'Boshlangan vaqt',
        example: '2024-01-01T00:00:00.000Z',
    })
    startedAt: Date;

    @ApiProperty({
        description: 'Tugagan vaqt',
        example: '2024-01-01T00:30:00.000Z',
        required: false,
    })
    completedAt?: Date;
}
