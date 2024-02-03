import { Chapter, Prisma } from "@prisma/client";
import OpenAI from "openai";
import { ChapterService } from "./ChapterService";
import { TraditionalTextBasedLessonPageService } from "./TraditionalTextBasedLessonPageService";

export class OpenAiService {
  constructor(
    private openai: OpenAI = new OpenAI(),
    private chapterService: ChapterService = new ChapterService(),
    private traditionalTextBasedLessonPageService: TraditionalTextBasedLessonPageService = new TraditionalTextBasedLessonPageService()
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
      const createdChapter = await this.chapterService.createChapter(
        chapterData
      );

      // Create learning outcome page
      const createdPage =
        await this.traditionalTextBasedLessonPageService.createTraditionalTextBasedLessonPage(
          {
            title: "Learning Outcomes",
            chapterId: createdChapter.id,
            content: generateLearningOutcomesLexicalJSON(
              chapter.learningOutcomes
            ),
          }
        );

      createdChapters.push(createdChapter);
    }

    return createdChapters;
  }
}

function generateLearningOutcomesLexicalJSON(
  learningOutcomes: string[]
): string {
  const outcomeItems = learningOutcomes.map((outcome, index) => ({
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: outcome,
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "listitem",
        version: 1,
        value: index + 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "list",
    version: 1,
    listType: "bullet",
    start: 1,
    tag: "ul",
  }));

  const jsonOutput = {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: "In this chapter, you will learn how to:",
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
        ...outcomeItems,
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };

  return JSON.stringify(jsonOutput, null, 2);
}
