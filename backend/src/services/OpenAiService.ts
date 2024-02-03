import { ChapterDao } from "../dao/ChapterDao";
import { Chapter, Prisma } from "@prisma/client";
import OpenAI from "openai";

export class OpenAiService {
  constructor(
    private openai: OpenAI = new OpenAI(),
    private chapterDao: ChapterDao = new ChapterDao()
  ) {}

  public async generateChapters({
    courseId,
    courseName,
    courseLearningOutcomes,
    numChapters,
  }: {
    courseId: string;
    courseName: string;
    courseLearningOutcomes: string;
    numChapters: number;
  }): Promise<Chapter[]> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant designed to output JSON.
        Provide your answer in JSON structure like this {"courseOutline": [{"name": "<The name of the chapter>", "learningOutcomes": ["<Learning outcome 1>", "<Learning outcome 2>", "<Learning outcome 3>"]}, ...<additional chapters>]}`,
        },
        {
          role: "user",
          name: "Instructor",
          content: `I am teaching an undergraduate course titled ${courseName}.
          The overall learning outcomes for this course is: ${courseLearningOutcomes}.
          Your task is to generate a course outline consisting of ${numChapters} chapters.
          For each chapter, generate the chapter name and 3 chapter learning outcomes, in JSON format.`,
        },
      ],
    });

    console.log("completion", completion); // TO DELETE

    const jsonString = completion.choices[0].message.content; // JSON formatted string
    const parsedJson = JSON.parse(jsonString); // Convert to JavaScript object
    console.log("parsedJson", parsedJson); // TO DELETE

    const chapters = parsedJson.courseOutline; // Assuming the JSON has this structure
    const createdChapters: Chapter[] = [];

    for (const chapter of chapters) {
      const chapterData: Prisma.ChapterCreateInput = {
        name: chapter.name,
        learningOutcomes: chapter.learningOutcomes,
        course: {
          connect: { id: courseId },
        },
      };
      const createdChapter = await this.chapterDao.createChapter(chapterData);
      createdChapters.push(createdChapter);
    }

    return createdChapters;
  }
}

// const courseName = "React Basics";
// const courseLearningOutcomes =
//   "Students should be able to understand the basic concepts of React, and create their own React app by the end of the course.";
// const numChapters = 3;
