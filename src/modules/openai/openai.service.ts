import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface WritingEvaluation {
    taskResponse: number;
    coherenceCohesion: number;
    lexicalResource: number;
    grammaticalRange: number;
    overallBand: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
}

export interface SpeakingEvaluation {
    fluencyCoherence: number;
    lexicalResource: number;
    grammaticalRange: number;
    pronunciation: number;
    overallBand: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
}

@Injectable()
export class OpenaiService {
    private readonly logger = new Logger(OpenaiService.name);
    private openai: OpenAI;
    private mockMode: boolean = false;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');

        if (!apiKey || !apiKey.startsWith('sk-')) {
            this.logger.warn('OpenAI API key not found or invalid. Using mock evaluation mode.');
            this.mockMode = true;
            return;
        }

        try {
            this.openai = new OpenAI({
                apiKey,
            });
            this.logger.log('OpenAI service initialized successfully');
        } catch (error) {
            this.logger.error('Failed to initialize OpenAI service, using mock mode', error);
            this.mockMode = true;
        }
    }

    async evaluateWriting(
        taskType: 'TASK_1' | 'TASK_2',
        prompt: string,
        response: string,
        wordLimit: number,
    ): Promise<WritingEvaluation> {
        if (this.mockMode) {
            return this.mockWritingEvaluation(taskType, response, wordLimit);
        }
        if (!this.openai) {
            throw new Error('OpenAI service not initialized');
        }

        const systemPrompt = this.getWritingSystemPrompt(taskType);
        const userPrompt = this.getWritingUserPrompt(prompt, response, wordLimit);

        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.3,
                max_tokens: 1000,
            });

            const content = completion.choices[0]?.message?.content;
            if (!content) {
                throw new Error('No response from OpenAI');
            }

            return this.parseWritingEvaluation(content);
        } catch (error) {
            this.logger.error('Error evaluating writing:', error);
            throw new Error('Writing evaluation failed');
        }
    }

    async evaluateSpeaking(
        transcript: string,
        topic: string,
        part: 'PART_1' | 'PART_2' | 'PART_3',
    ): Promise<SpeakingEvaluation> {
        if (this.mockMode) {
            return this.mockSpeakingEvaluation();
        }

        if (!this.openai) {
            throw new Error('OpenAI service not initialized');
        }

        const systemPrompt = this.getSpeakingSystemPrompt(part);
        const userPrompt = this.getSpeakingUserPrompt(topic, transcript);

        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.3,
                max_tokens: 1000,
            });

            const content = completion.choices[0]?.message?.content;
            if (!content) {
                throw new Error('No response from OpenAI');
            }

            return this.parseSpeakingEvaluation(content);
        } catch (error) {
            this.logger.error('Error evaluating speaking:', error);
            throw new Error('Speaking evaluation failed');
        }
    }

    private getWritingSystemPrompt(taskType: 'TASK_1' | 'TASK_2'): string {
        const basePrompt = `You are an expert IELTS Writing examiner. Evaluate the response according to IELTS Writing ${taskType} criteria:

1. Task Response (TR) - Band 1-9
2. Coherence and Cohesion (CC) - Band 1-9  
3. Lexical Resource (LR) - Band 1-9
4. Grammatical Range and Accuracy (GRA) - Band 1-9

Provide scores for each criterion and calculate the overall band score (average of 4 criteria, rounded to nearest 0.5).

Response format (JSON):
{
  "taskResponse": 7.0,
  "coherenceCohesion": 6.5,
  "lexicalResource": 7.0,
  "grammaticalRange": 6.0,
  "overallBand": 6.5,
  "feedback": "Overall feedback in Uzbek",
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement 1", "Improvement 2"]
}`;

        return taskType === 'TASK_1'
            ? basePrompt + '\n\nFor Task 1: Focus on data description, overview, key features, and accuracy.'
            : basePrompt + '\n\nFor Task 2: Focus on position, argument development, examples, and conclusion.';
    }

    private getSpeakingSystemPrompt(part: 'PART_1' | 'PART_2' | 'PART_3'): string {
        return `You are an expert IELTS Speaking examiner. Evaluate the response according to IELTS Speaking criteria:

1. Fluency and Coherence (FC) - Band 1-9
2. Lexical Resource (LR) - Band 1-9
3. Grammatical Range and Accuracy (GRA) - Band 1-9
4. Pronunciation (P) - Band 1-9

Provide scores for each criterion and calculate the overall band score (average of 4 criteria, rounded to nearest 0.5).

Part ${part} specific considerations:
${part === 'PART_1' ? 'Part 1: Personal questions, familiar topics, basic responses expected.' :
                part === 'PART_2' ? 'Part 2: Individual long turn, 2-minute speech on given topic.' :
                    'Part 3: Discussion, abstract ideas, detailed responses expected.'}

Response format (JSON):
{
  "fluencyCoherence": 7.0,
  "lexicalResource": 6.5,
  "grammaticalRange": 7.0,
  "pronunciation": 6.0,
  "overallBand": 6.5,
  "feedback": "Overall feedback in Uzbek",
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement 1", "Improvement 2"]
}`;
    }

    private getWritingUserPrompt(prompt: string, response: string, wordLimit: number): string {
        return `Task: ${prompt}

Word limit: ${wordLimit} words
Student response: ${response}

Please evaluate this IELTS Writing response and provide detailed feedback in the specified JSON format. Write feedback and comments in Uzbek language.`;
    }

    private getSpeakingUserPrompt(topic: string, transcript: string): string {
        return `Topic/Question: ${topic}

Student response transcript: ${transcript}

Please evaluate this IELTS Speaking response and provide detailed feedback in the specified JSON format. Write feedback and comments in Uzbek language.`;
    }

    private parseWritingEvaluation(content: string): WritingEvaluation {
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const parsed = JSON.parse(jsonMatch[0]);

            return {
                taskResponse: parseFloat(parsed.taskResponse) || 0,
                coherenceCohesion: parseFloat(parsed.coherenceCohesion) || 0,
                lexicalResource: parseFloat(parsed.lexicalResource) || 0,
                grammaticalRange: parseFloat(parsed.grammaticalRange) || 0,
                overallBand: parseFloat(parsed.overallBand) || 0,
                feedback: parsed.feedback || 'Baholash yakunlanmadi',
                strengths: parsed.strengths || [],
                improvements: parsed.improvements || [],
            };
        } catch (error) {
            this.logger.error('Error parsing writing evaluation:', error);
            throw new Error('Failed to parse evaluation response');
        }
    }

    private parseSpeakingEvaluation(content: string): SpeakingEvaluation {
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const parsed = JSON.parse(jsonMatch[0]);

            return {
                fluencyCoherence: parseFloat(parsed.fluencyCoherence) || 0,
                lexicalResource: parseFloat(parsed.lexicalResource) || 0,
                grammaticalRange: parseFloat(parsed.grammaticalRange) || 0,
                pronunciation: parseFloat(parsed.pronunciation) || 0,
                overallBand: parseFloat(parsed.overallBand) || 0,
                feedback: parsed.feedback || 'Baholash yakunlanmadi',
                strengths: parsed.strengths || [],
                improvements: parsed.improvements || [],
            };
        } catch (error) {
            this.logger.error('Error parsing speaking evaluation:', error);
            throw new Error('Failed to parse evaluation response');
        }
    }

    // Mock evaluation methods
    private mockWritingEvaluation(taskType: 'TASK_1' | 'TASK_2', response: string, wordLimit: number): WritingEvaluation {
        const wordCount = response.trim().split(/\s+/).length;
        const lengthScore = Math.min(wordCount / wordLimit, 1) * 2 + 5; // 5-7 range
        
        const baseScore = Math.random() * 2 + 5; // 5-7 range
        
        return {
            taskResponse: Math.round((baseScore + (lengthScore * 0.3)) * 10) / 10,
            coherenceCohesion: Math.round((baseScore + Math.random() * 0.5) * 10) / 10,
            lexicalResource: Math.round((baseScore + Math.random() * 0.5) * 10) / 10,
            grammaticalRange: Math.round((baseScore + Math.random() * 0.5) * 10) / 10,
            overallBand: Math.round(baseScore * 10) / 10,
            feedback: `Mock baholash: ${taskType} uchun ${wordCount} so'zlik javob. Bu demo rejimi, real OpenAI API kaliti qo'shing.`,
            strengths: [
                'Yozma ish topshirildi',
                'Matn tuzilishi mavjud',
                'Savol tushunildi'
            ],
            improvements: [
                'Real OpenAI API kalitini qo\'shing',
                'Grammatik xatolarni kamayting',
                'Lug\'at boyligini oshiring'
            ]
        };
    }

    private mockSpeakingEvaluation(): SpeakingEvaluation {
        const baseScore = Math.random() * 2 + 5; // 5-7 range
        
        return {
            fluencyCoherence: Math.round((baseScore + Math.random() * 0.5) * 10) / 10,
            lexicalResource: Math.round((baseScore + Math.random() * 0.5) * 10) / 10,
            grammaticalRange: Math.round((baseScore + Math.random() * 0.5) * 10) / 10,
            pronunciation: Math.round((baseScore + Math.random() * 0.5) * 10) / 10,
            overallBand: Math.round(baseScore * 10) / 10,
            feedback: 'Mock baholash: Audio fayl qabul qilindi. Bu demo rejimi, real OpenAI API kaliti qo\'shing.',
            strengths: [
                'Audio fayl yuklandi',
                'Gapirish jarayoni tugallandi',
                'Vaqtni samarali ishlatdi'
            ],
            improvements: [
                'Real OpenAI API kalitini qo\'shing',
                'Talaffuzni yaxshilang',
                'Nutq tezligini sozlang'
            ]
        };
    }
}
