import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Test Questions for LISTENING
    await prisma.testQuestion.createMany({
        data: [
            {
                id: 'listening-1',
                testType: 'LISTENING',
                questionText: 'What is the man\'s occupation?',
                options: ['Teacher', 'Doctor', 'Engineer', 'Lawyer'],
                correctAnswer: 'Doctor',
                audioUrl: '/audio/listening-1.mp3',
                difficulty: 'BEGINNER',
            },
            {
                id: 'listening-2',
                testType: 'LISTENING',
                questionText: 'Where did the conversation take place?',
                options: ['Hospital', 'School', 'Office', 'Home'],
                correctAnswer: 'Hospital',
                audioUrl: '/audio/listening-2.mp3',
                difficulty: 'INTERMEDIATE',
            },
            {
                id: 'listening-3',
                testType: 'LISTENING',
                questionText: 'What time does the meeting start?',
                options: ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
                correctAnswer: '10:00 AM',
                audioUrl: '/audio/listening-3.mp3',
                difficulty: 'ADVANCED',
            },
            {
                id: 'listening-4',
                testType: 'LISTENING',
                questionText: 'How many people attended the conference?',
                options: ['50', '100', '150', '200'],
                correctAnswer: '150',
                audioUrl: '/audio/listening-4.mp3',
                difficulty: 'INTERMEDIATE',
            },
        ],
        skipDuplicates: true,
    });

    // Test Questions for READING
    await prisma.testQuestion.createMany({
        data: [
            {
                id: 'reading-1',
                testType: 'READING',
                questionText: 'What is the main idea of the passage?',
                options: ['Climate change effects', 'Economic growth', 'Educational reform', 'Healthcare improvement'],
                correctAnswer: 'Climate change effects',
                passageText: 'Climate change is one of the most pressing issues of our time. Rising temperatures and changing weather patterns affect ecosystems worldwide...',
                difficulty: 'BEGINNER',
            },
            {
                id: 'reading-2',
                testType: 'READING',
                questionText: 'According to the text, what percentage of species are endangered?',
                options: ['15%', '25%', '35%', '45%'],
                correctAnswer: '25%',
                passageText: 'Recent studies show that approximately 25% of plant and animal species are facing extinction due to human activities and climate change...',
                difficulty: 'INTERMEDIATE',
            },
            {
                id: 'reading-3',
                testType: 'READING',
                questionText: 'What does the author suggest as a solution?',
                options: ['Government intervention', 'International cooperation', 'Individual action', 'Technological advancement'],
                correctAnswer: 'International cooperation',
                passageText: 'The complexity of environmental challenges requires coordinated efforts from nations worldwide. Only through international cooperation...',
                difficulty: 'ADVANCED',
            },
            {
                id: 'reading-4',
                testType: 'READING',
                questionText: 'Which year was the research conducted?',
                options: ['2020', '2021', '2022', '2023'],
                correctAnswer: '2022',
                passageText: 'The comprehensive study was conducted in 2022 by leading environmental scientists from multiple universities...',
                difficulty: 'INTERMEDIATE',
            },
        ],
        skipDuplicates: true,
    });

    // Writing Prompts
    await prisma.writingPrompt.createMany({
        data: [
            {
                id: 'writing-task1-1',
                taskType: 'TASK_1',
                instructions: 'Chart Description',
                prompt: 'The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarize the information by selecting and reporting the main features and make comparisons where relevant.',
                wordLimit: 150,
                timeLimit: 20,
            },
            {
                id: 'writing-task1-2',
                taskType: 'TASK_1',
                instructions: 'Process Diagram',
                prompt: 'The diagram below shows the process of recycling plastic bottles. Summarize the information by selecting and reporting the main features.',
                wordLimit: 150,
                timeLimit: 20,
            },
            {
                id: 'writing-task2-1',
                taskType: 'TASK_2',
                instructions: 'Education Technology',
                prompt: 'Some people think that computers and the Internet are more important for a child\'s education than going to school. However, others believe that schools and teachers are essential for children to learn effectively. Discuss both views and give your opinion.',
                wordLimit: 250,
                timeLimit: 40,
            },
            {
                id: 'writing-task2-2',
                taskType: 'TASK_2',
                instructions: 'Work-Life Balance',
                prompt: 'In many countries, people are working longer hours. What are the reasons for this? What effects does this trend have on individuals and society?',
                wordLimit: 250,
                timeLimit: 40,
            },
        ],
        skipDuplicates: true,
    });

    // Speaking Topics
    await prisma.speakingTopic.createMany({
        data: [
            {
                id: 'speaking-part1-1',
                part: 'PART_1',
                topic: 'Hometown',
                questions: ['Where are you from?', 'Do you like your hometown?', 'What is famous about your hometown?', 'Would you like to live somewhere else?'],
                timeLimit: 5,
            },
            {
                id: 'speaking-part1-2',
                part: 'PART_1',
                topic: 'Hobbies',
                questions: ['What are your hobbies?', 'How did you become interested in your hobbies?', 'What hobbies are popular in your country?', 'Do you think hobbies should be shared with other people?'],
                timeLimit: 5,
            },
            {
                id: 'speaking-part2-1',
                part: 'PART_2',
                topic: 'Memorable Trip',
                questions: ['Describe a memorable trip you have taken. You should say: where you went, who you went with, what you did there, and explain why it was memorable.'],
                timeLimit: 3,
            },
            {
                id: 'speaking-part2-2',
                part: 'PART_2',
                topic: 'Favorite Book',
                questions: ['Describe a book you enjoyed reading. You should say: what the book was about, when you read it, why you chose to read it, and explain why you enjoyed it.'],
                timeLimit: 3,
            },
            {
                id: 'speaking-part3-1',
                part: 'PART_3',
                topic: 'Travel and Tourism',
                questions: ['How has tourism changed in your country?', 'What are the advantages and disadvantages of tourism?', 'How do you think tourism will change in the future?'],
                timeLimit: 5,
            },
            {
                id: 'speaking-part3-2',
                part: 'PART_3',
                topic: 'Reading Habits',
                questions: ['Do people in your country like to read?', 'What kinds of books are popular?', 'How has technology changed reading habits?'],
                timeLimit: 5,
            },
        ],
        skipDuplicates: true,
    });

    console.log('✅ Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
