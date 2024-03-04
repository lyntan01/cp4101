import {
  Chapter,
  ExercisePage,
  Prisma,
  TraditionalTextBasedLessonPage,
} from "@prisma/client";
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

  public async generateLessonPage({
    chapterId,
    chapterName,
    chapterLearningOutcomes,
  }: {
    chapterId: string;
    chapterName: string;
    chapterLearningOutcomes: string[];
  }): Promise<TraditionalTextBasedLessonPage> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant designed to output JSON.
        Provide your answer in JSON structure like this {"title": "Lesson: <Title of lesson page>", "content": "<Typescript string containing content of lesson page in Markdown>"}
        Example title of lesson page: "Lesson: Introduction to Flutter"
        Don't include the chapter number in the title of lesson page.`,
        },
        {
          role: "user",
          name: "Instructor",
          content: `${getLessonPagePrompt(
            chapterName,
            chapterLearningOutcomes
          )}`,
        },
      ],
    });

    console.log("completion", completion); // TO DELETE

    const jsonString = completion.choices[0].message.content; // JSON formatted string
    const parsedJson = JSON.parse(jsonString); // Convert to JavaScript object
    console.log("parsedJson", parsedJson); // TO DELETE

    // Save lesson page content as markdown
    // Markdown will be converted to Lexical JSON when first retrieved on the frontend
    const newLessonPage =
      await this.traditionalTextBasedLessonPageService.createTraditionalTextBasedLessonPage(
        {
          title: parsedJson.title,
          chapterId: chapterId,
          content: parsedJson.content,
        }
      );

    return newLessonPage;
  }

  public async generateExercisePage({
    chapterId,
    chapterName,
    chapterLearningOutcomes,
  }: {
    chapterId: string;
    chapterName: string;
    chapterLearningOutcomes: string[];
  }): Promise<void> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant designed to output JSON.
        Provide your answer in JSON structure like this {"title": "<Title of exercise page>", "instructions": "<Typescript string containing exercise instructions in Markdown>", "exercise": "<File contents in JSON format>", "correctAnswer": "<String containing correct answer>"}
        Example title of exercise page: "Exercise: Fix Sculpture Slideshow"
        Don't include the chapter number in the title of exercise page.`,
        },
        {
          role: "user",
          name: "Instructor",
          content: `I am teaching an undergraduate course chapter titled React Hooks. Generate an exercise that achieves these lesson learning outcomes:
          Explain the purpose of React Hooks
          Use built-in hooks like useEffect, and custom hooks
          Understand how to refactor class components to functional components with hooks

          The exercise should consist of three parts. 

          Part 1: the instructions for the exercise as a Typescript string in markdown format. 

          Part 2: the exercise itself, which already contains code that the user just needs to modify. 

          Part 3: the correct answer for the exercise.

          The instructions MUST be a Typescript string in markdown format. The instructions MUST NOT tell the user what they should do, as this will be revealing the correct answer.
          The exercise MUST be code in files. There can be separate files.
          The correct answer MUST be a string containing the correct answer.
          `,
        },
        {
          role: "assistant",
          name: "Assistant",
          content: `{
          "title": "Exercise: Fix Sculpture Slideshow",
          "instructions": "Here's a component that renders a sculpture image. Clicking the “Next” button should show the next sculpture by changing the index to 1, then 2, and so on. However, this won't work (you can try it!):\n\nThe handleClick event handler is updating a local variable, index. But two things prevent that change from being visible:\n\n1. Local variables don't persist between renders. When React renders this component a second time, it renders it from scratch—it doesn't consider any changes to the local variables.\n2. Changes to local variables won't trigger renders. React doesn't realize it needs to render the component again with the new data.\n\nYour task is to fix to "Next" button to show the next sculpture by changing and retaining the index between renders.\n\nHint: To add a state variable, import useState from React at the top of the file.",
          "exercise": {
"files": {
"package.json": {
"content": "{"dependencies":{"react":"latest","react-dom":"latest"}}",
"isBinary": false
},
"src/index.js": {
"content": "import { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\n\nimport App from "./App";\n\nconst rootElement = document.getElementById("root");\nconst root = createRoot(rootElement);\n\nroot.render(\n <StrictMode>\n <App />\n </StrictMode>\n);\n",
"isBinary": false
},
"src/App.js": {
"content": "import { sculptureList } from './data.js';\n\nexport default function App() {\n const [index, setIndex] = React.useState(0);\n\n function handleClick() {\n setIndex((prevIndex) => prevIndex + 1);\n }\n\n const sculpture = sculptureList[index];\n\n return (\n <>\n <button onClick={handleClick}>Next</button>\n <h2>\n <i>{sculpture.name} </i> \n by {sculpture.artist}\n </h2>\n <h3>({index + 1} of {sculptureList.length})</h3>\n <img src={sculpture.url} alt={sculpture.alt} />\n <p>{sculpture.description}</p>\n </>\n );\n}",
"isBinary": false
},
"src/data.js": {
"content": "export const sculptureList = [{\n name: 'Homenaje a la Neurocirugía',\n artist: 'Marta Colvin Andrade',\n description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',\n url: 'https://i.imgur.com/Mx7dA2Y.jpg',\n alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.' \n}, {\n name: 'Floralis Genérica',\n artist: 'Eduardo Catalano',\n description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',\n url: 'https://i.imgur.com/ZF6s192m.jpg',\n alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'\n}, {\n name: 'Eternal Presence',\n artist: 'John Woodrow Wilson',\n description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',\n url: 'https://i.imgur.com/aTtVpES.jpg',\n alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'\n}];",
"isBinary": false
},
"public/index.html": {
"content": "<!DOCTYPE html>\n<html lang="en">\n\n<head>\n <meta charset="utf-8">\n <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\n <meta name="theme-color" content="#000000">\n \n <link rel="manifest" href="%PUBLIC_URL%/manifest.json">\n <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">\n \n <title>React App</title>\n</head>\n\n<body>\n <noscript>\n You need to enable JavaScript to run this app.\n </noscript>\n <div id="root"></div>\n</body>\n\n</html>\n",
"isBinary": false
}
}
},
          "correctAnswer": "// App.js
          import { useState } from 'react';
          import { sculptureList } from './data.js';

          export default function Gallery() {
            const [index, setIndex] = useState(0);

            function handleClick() {
              setIndex(index + 1);
            }

            let sculpture = sculptureList[index];
            return (
              <>
                <button onClick={handleClick}>
                  Next
                </button>
                <h2>
                  <i>{sculpture.name} </i> 
                  by {sculpture.artist}
                </h2>
                <h3>  
                  ({index + 1} of {sculptureList.length})
                </h3>
                <img 
                  src={sculpture.url} 
                  alt={sculpture.alt}
                />
                <p>
                  {sculpture.description}
                </p>
              </>
            );
          }"
          }`,
        },
        {
          role: "user",
          name: "Instructor",
          content: `${getExercisePagePrompt(
            chapterName,
            chapterLearningOutcomes
          )}`,
        },
      ],
    });

    console.log("completion", completion); // TO DELETE

    const jsonString = completion.choices[0].message.content; // JSON formatted string
    const parsedJson = JSON.parse(jsonString); // Convert to JavaScript object
    console.log("parsedJson", parsedJson); // TO DELETE

    // Save lesson page content as markdown
    // Markdown will be converted to Lexical JSON when first retrieved on the frontend
    // const newLessonPage =
    //   await this.traditionalTextBasedLessonPageService.createTraditionalTextBasedLessonPage(
    //     {
    //       title: parsedJson.title,
    //       chapterId: chapterId,
    //       content: parsedJson.content,
    //     }
    //   );

    // return newLessonPage;
  }
}

// HELPER FUNCTIONS

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

function getLessonPagePrompt(
  chapterName: string,
  learningOutcomes: string[]
): string {
  let lessonPage = `I am teaching an undergraduate course chapter titled ${chapterName}.\n`;

  lessonPage +=
    "Generate a lesson page as a Typescript string in markdown format that achieves the following learning outcomes:\n";
  learningOutcomes.forEach((outcome, index) => {
    lessonPage += `${index + 1}. ${outcome}\n`;
  });

  lessonPage +=
    "The lesson page must be targeted towards readers who have no prior knowledge, and must include code blocks if necessary. You will be rewarded $200 for a clear, step-by-step lesson.";

  return lessonPage;
}

function getExercisePagePrompt(
  chapterName: string,
  learningOutcomes: string[]
): string {
  let prompt = `I am teaching an undergraduate course chapter titled ${chapterName}.\n`;

  prompt +=
    "Generate an exercise that achieves the following learning outcomes:\n";
  learningOutcomes.forEach((outcome, index) => {
    prompt += `${index + 1}. ${outcome}\n`;
  });

  prompt +=
    `The exercise should consist of three parts. 

    Part 1: the instructions for the exercise as a Typescript string in markdown format. 

    Part 2: the exercise itself, which already contains code that the user just needs to modify. 

    Part 3: the correct answer for the exercise.

    The instructions MUST be a Typescript string in markdown format. The instructions MUST NOT tell the user what they should do, as this will be revealing the correct answer.
    The exercise MUST be code in files. There can be separate files.
    The correct answer MUST be a string containing the correct answer.
    
    You will be rewarded $200 for a clear exercise in the required format.`;

  return prompt;
}