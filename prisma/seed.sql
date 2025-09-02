-- Seed data for IELTS Level Check

-- Test Questions for LISTENING
INSERT INTO "TestQuestion" (id, "testType", "questionText", options, "correctAnswer", "audioUrl", "passageText", difficulty) VALUES
('listening-1', 'LISTENING', 'What is the man''s occupation?', '["Teacher", "Doctor", "Engineer", "Lawyer"]', 'Doctor', '/audio/listening-1.mp3', NULL, 'BEGINNER'),
('listening-2', 'LISTENING', 'Where did the conversation take place?', '["Hospital", "School", "Office", "Home"]', 'Hospital', '/audio/listening-2.mp3', NULL, 'INTERMEDIATE'),
('listening-3', 'LISTENING', 'What time does the meeting start?', '["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"]', '10:00 AM', '/audio/listening-3.mp3', NULL, 'ADVANCED'),
('listening-4', 'LISTENING', 'How many people attended the conference?', '["50", "100", "150", "200"]', '150', '/audio/listening-4.mp3', NULL, 'INTERMEDIATE');

-- Test Questions for READING
INSERT INTO "TestQuestion" (id, "testType", "questionText", options, "correctAnswer", "audioUrl", "passageText", difficulty) VALUES
('reading-1', 'READING', 'What is the main idea of the passage?', '["Climate change effects", "Economic growth", "Educational reform", "Healthcare improvement"]', 'Climate change effects', NULL, 'Climate change is one of the most pressing issues of our time. Rising temperatures and changing weather patterns affect ecosystems worldwide...', 'BEGINNER'),
('reading-2', 'READING', 'According to the text, what percentage of species are endangered?', '["15%", "25%", "35%", "45%"]', '25%', NULL, 'Recent studies show that approximately 25% of plant and animal species are facing extinction due to human activities and climate change...', 'INTERMEDIATE'),
('reading-3', 'READING', 'What does the author suggest as a solution?', '["Government intervention", "International cooperation", "Individual action", "Technological advancement"]', 'International cooperation', NULL, 'The complexity of environmental challenges requires coordinated efforts from nations worldwide. Only through international cooperation...', 'ADVANCED'),
('reading-4', 'READING', 'Which year was the research conducted?', '["2020", "2021", "2022", "2023"]', '2022', NULL, 'The comprehensive study was conducted in 2022 by leading environmental scientists from multiple universities...', 'INTERMEDIATE');

-- Writing Prompts
INSERT INTO "WritingPrompt" (id, "taskType", title, prompt, "wordLimit", "timeLimit") VALUES
('writing-task1-1', 'TASK_1', 'Chart Description', 'The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarize the information by selecting and reporting the main features and make comparisons where relevant.', 150, 20),
('writing-task1-2', 'TASK_1', 'Process Diagram', 'The diagram below shows the process of recycling plastic bottles. Summarize the information by selecting and reporting the main features.', 150, 20),
('writing-task2-1', 'TASK_2', 'Education Technology', 'Some people think that computers and the Internet are more important for a child''s education than going to school. However, others believe that schools and teachers are essential for children to learn effectively. Discuss both views and give your opinion.', 250, 40),
('writing-task2-2', 'TASK_2', 'Work-Life Balance', 'In many countries, people are working longer hours. What are the reasons for this? What effects does this trend have on individuals and society?', 250, 40);

-- Speaking Topics
INSERT INTO "SpeakingTopic" (id, part, topic, questions, "timeLimit") VALUES
('speaking-part1-1', 'PART_1', 'Hometown', '["Where are you from?", "Do you like your hometown?", "What is famous about your hometown?", "Would you like to live somewhere else?"]', 5),
('speaking-part1-2', 'PART_1', 'Hobbies', '["What are your hobbies?", "How did you become interested in your hobbies?", "What hobbies are popular in your country?", "Do you think hobbies should be shared with other people?"]', 5),
('speaking-part2-1', 'PART_2', 'Memorable Trip', 'Describe a memorable trip you have taken. You should say: where you went, who you went with, what you did there, and explain why it was memorable.', 3),
('speaking-part2-2', 'PART_2', 'Favorite Book', 'Describe a book you enjoyed reading. You should say: what the book was about, when you read it, why you chose to read it, and explain why you enjoyed it.', 3),
('speaking-part3-1', 'PART_3', 'Travel and Tourism', '["How has tourism changed in your country?", "What are the advantages and disadvantages of tourism?", "How do you think tourism will change in the future?"]', 5),
('speaking-part3-2', 'PART_3', 'Reading Habits', '["Do people in your country like to read?", "What kinds of books are popular?", "How has technology changed reading habits?"]', 5);
