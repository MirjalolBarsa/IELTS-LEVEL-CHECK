-- CreateEnum
CREATE TYPE "public"."TestType" AS ENUM ('LISTENING', 'READING', 'WRITING', 'SPEAKING');

-- CreateEnum
CREATE TYPE "public"."TestStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "public"."Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "public"."WritingTaskType" AS ENUM ('TASK_1', 'TASK_2');

-- CreateEnum
CREATE TYPE "public"."SpeakingPart" AS ENUM ('PART_1', 'PART_2', 'PART_3');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."test_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testType" "public"."TestType" NOT NULL,
    "status" "public"."TestStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "test_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."test_results" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "testType" "public"."TestType" NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "bandScore" DOUBLE PRECISION NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL,
    "responses" JSONB NOT NULL,
    "correctAnswers" JSONB NOT NULL,
    "feedback" TEXT,
    "aiAnalysis" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."test_questions" (
    "id" TEXT NOT NULL,
    "testType" "public"."TestType" NOT NULL,
    "questionText" TEXT NOT NULL,
    "options" JSONB,
    "correctAnswer" TEXT,
    "audioUrl" TEXT,
    "passageText" TEXT,
    "difficulty" "public"."Difficulty" NOT NULL DEFAULT 'INTERMEDIATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."writing_prompts" (
    "id" TEXT NOT NULL,
    "taskType" "public"."WritingTaskType" NOT NULL,
    "prompt" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "timeLimit" INTEGER NOT NULL,
    "wordLimit" INTEGER NOT NULL,
    "difficulty" "public"."Difficulty" NOT NULL DEFAULT 'INTERMEDIATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "writing_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."speaking_topics" (
    "id" TEXT NOT NULL,
    "part" "public"."SpeakingPart" NOT NULL,
    "topic" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "timeLimit" INTEGER NOT NULL,
    "difficulty" "public"."Difficulty" NOT NULL DEFAULT 'INTERMEDIATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "speaking_topics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."test_sessions" ADD CONSTRAINT "test_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."test_results" ADD CONSTRAINT "test_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."test_results" ADD CONSTRAINT "test_results_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."test_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
