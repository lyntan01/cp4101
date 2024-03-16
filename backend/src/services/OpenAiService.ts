import {
  Chapter,
  ExercisePage,
  ExplorationPage,
  Prisma,
  TraditionalTextBasedLessonPage,
} from "@prisma/client";
import OpenAI from "openai";
import { ChapterService } from "./ChapterService";
import { TraditionalTextBasedLessonPageService } from "./TraditionalTextBasedLessonPageService";
import { ExercisePageService } from "./ExercisePageService";
import { CodeSandboxService } from "./CodeSandboxService";
import { ExplorationPageService } from "./ExplorationPageService";

export class OpenAiService {
  constructor(
    private openai: OpenAI = new OpenAI(),
    private chapterService: ChapterService = new ChapterService(),
    private traditionalTextBasedLessonPageService: TraditionalTextBasedLessonPageService = new TraditionalTextBasedLessonPageService(),
    private exercisePageService: ExercisePageService = new ExercisePageService(),
    private explorationPageService: ExplorationPageService = new ExplorationPageService(),
    private codeSandboxService: CodeSandboxService = new CodeSandboxService(),
  ) { }

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
  }): Promise<ExercisePage> {
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
          The exercise MUST be code in files. There can be separate files. The exercise MUST contain ALL the code necessary to deploy the full app.
          The exercise MUST contain the package.json file with all necessary dependencies listed.
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

    const jsonString = completion.choices[0].message.content; // JSON formatted string
    const parsedJson = JSON.parse(jsonString); // Convert to JavaScript object
    console.log("parsedJson", parsedJson); // TO DELETE

    // Use CodeSandboxService to create the sandbox
    const sandboxId = await this.codeSandboxService.createSandbox(parsedJson.exercise.files);

    // Save exercise page instructions as markdown
    // Markdown will be converted to Lexical JSON when first retrieved on the frontend
    const newExercisePage =
      await this.exercisePageService.createExercisePage(
        {
          title: parsedJson.title,
          chapterId: chapterId,
          instructions: parsedJson.instructions,
          sandboxId: sandboxId,
          correctAnswer: parsedJson.correctAnswer,
        }
      );

    return newExercisePage;
  }

  public async getExerciseStudentAnswerFeedback({
    exerciseInstructions,
    correctAnswer,
    studentAnswer
  }: {
    exerciseInstructions: string;
    correctAnswer: string;
    studentAnswer: string;
    // include exercise files??
  }): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant.`
        },
        {
          role: "user",
          name: "Instructor",
          content: `I am teaching an online course, with an exercise for students to practice applying what they have learnt.
          The exercise instructions are: ${exerciseInstructions}.
          The correct answer is: ${correctAnswer}.
          The student's answer is: ${studentAnswer}.
          Provide clear, useful feedback for the student.
          You must NOT reveal the correct answer to the student. You MUST give concrete, clear, and actionable feedback.
          If the student has already achieved the correct answer in essence, you can praise the student and tell them that they have done it correctly.
          Use backticks for code or any text that should be in monospace`,
        },
      ],
    });

    console.log("completion", completion); // TO DELETE

    const feedback = completion.choices[0].message.content;

    return feedback;
  }

  public async generateExplorationPage({
    chapterId,
    chapterName,
    chapterLearningOutcomes,
  }: {
    chapterId: string;
    chapterName: string;
    chapterLearningOutcomes: string[];
  }): Promise<ExplorationPage> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant designed to output JSON.
        Provide your answer in JSON structure like this {"title": "<Title of exploration page>", "instructions": "<Typescript string containing exploration instructions in Markdown>", "app": "<File contents in JSON format>"}
        Example title of exercise page: "Exploration: Playing Around With Props"
        Don't include the chapter number in the title of exploration page.`,
        },
        {
          role: "user",
          name: "Instructor",
          content: `I am teaching an undergraduate course chapter titled Passing Props to a Component. Generate an app with code and challenges for the student to try out that achieves these lesson learning outcomes:
          Prop Passing Fundamentals: Students understand how props flow from parent to child components in React.
          Prop Type Implementation: Students enforce type checking and default values for props, enhancing code reliability.
          Dynamic Component Rendering: Students utilize props for dynamic rendering, enabling flexible and reusable components.

          The exploration should consist of two parts. 

          Part 1: the instructions for the exploration as a Typescript string in markdown format. 

          Part 2: the app itself, which already contains code that the user just needs to modify. 

          The instructions MUST be a Typescript string in markdown format. The instructions MUST NOT tell the user what they should do, as this will be revealing the correct answer.
          The instructions MUST contain 3 challenges as suggestions for the student to complete. The challenges MUST be clear, concise, and actionable.
          The exercise MUST be code in files. There can be separate files. The exercise MUST contain ALL the code necessary to deploy the full app.
          The exercise MUST contain the package.json file with all necessary dependencies listed.
          The code in the exercise MUST NOT have already completed the challenges. The student should be able to complete the challenges by modifying the code.
          `,
        },
        {
          role: "assistant",
          name: "Assistant",
          content: `{
          "title": "Exploration: Playing Around With Props",
          "instructions": "Here are some challenges for you to try out and explore!\n\
1: Extract a component\n\
This Gallery component contains some very similar markup for two profiles. Extract a Profile component out of it to reduce the duplication. You’ll need to choose what props to pass to it.\n\n\
2: Adjust the image size based on a prop\n\
Right now, the profile image is of a fixed width and height. Pass the width and height as a prop so each profile image can be of a different width and height.\n\n\
3: Passing JSX in a children prop\n\
The Gallery component contains two profiles in cards. Extract a Card component from the Gallery component, and use the children prop to pass different JSX to it.\n\n\
Feel free to use the sandbox below to recap what you've learnt, and play around exploring what you can do! Don't be limited by the suggestions above - let your creativity run wild!\n\n\
Click on the Get Feedback button when you're done to get instant feedback on your code."
,
          "app": {
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
"content": "import { getImageUrl } from './utils.js';\n\nexport default function Gallery() {\n return (\n <div>\n <h1>Notable Scientists</h1>\n <section className=\"profile\">\n <h2>Maria Skłodowska-Curie</h2>\n <img\n className=\"avatar\"\n src={getImageUrl('szV5sdG')}\n alt=\"Maria Skłodowska-Curie\"\n width={70}\n height={70}\n />\n <ul>\n <li>\n <b>Profession: </b> \n physicist and chemist\n </li>\n <li>\n <b>Awards: 4 </b> \n (Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)\n </li>\n <li>\n <b>Discovered: </b>\n polonium (chemical element)\n </li>\n </ul>\n </section>\n <section className=\"profile\">\n <h2>Katsuko Saruhashi</h2>\n <img\n className=\"avatar\"\n src={getImageUrl('YfeOqp2')}\n alt=\"Katsuko Saruhashi\"\n width={70}\n height={70}\n />\n <ul>\n <li>\n <b>Profession: </b> \n geochemist\n </li>\n <li>\n <b>Awards: 2 </b> \n (Miyake Prize for geochemistry, Tanaka Prize)\n </li>\n <li>\n <b>Discovered: </b>\n a method for measuring carbon dioxide in seawater\n </li>\n </ul>\n </section>\n </div>\n );\n}"
"isBinary": false
},
"src/utils.js": {
"content": "export function getImageUrl(imageId, size = 's') {\n  return (\n    'https://i.imgur.com/' +\n    imageId +\n    size +\n    '.jpg'\n  );\n}"
"isBinary": false
},
"public/index.html": {
"content": "<!DOCTYPE html>\n<html lang="en">\n\n<head>\n <meta charset="utf-8">\n <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\n <meta name="theme-color" content="#000000">\n \n <link rel="manifest" href="%PUBLIC_URL%/manifest.json">\n <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">\n \n <title>React App</title>\n</head>\n\n<body>\n <noscript>\n You need to enable JavaScript to run this app.\n </noscript>\n <div id="root"></div>\n</body>\n\n</html>\n",
"isBinary": false
}
}
},
          }`,
        },
        {
          role: "user",
          name: "Instructor",
          content: `${getExplorationPagePrompt(
            chapterName,
            chapterLearningOutcomes
          )}`,
        },
      ],
    });

    const jsonString = completion.choices[0].message.content; // JSON formatted string
    const parsedJson = JSON.parse(jsonString); // Convert to JavaScript object
    console.log("parsedJson", parsedJson); // TO DELETE

    // Use CodeSandboxService to create the sandbox
    const sandboxId = await this.codeSandboxService.createSandbox(parsedJson.app.files);

    // Save exercise page instructions as markdown
    // Markdown will be converted to Lexical JSON when first retrieved on the frontend
    const newExplorationPage =
      await this.explorationPageService.createExplorationPage(
        {
          title: parsedJson.title,
          chapterId: chapterId,
          instructions: parsedJson.instructions,
          sandboxId: sandboxId,
        }
      );

    return newExplorationPage;
  }

  public async getExplorationStudentAttemptFeedback({
    explorationInstructions,
    studentDescription,
    studentAnswer
  }: {
    explorationInstructions: string;
    studentDescription: string;
    studentAnswer: string;
    // include exercise files??
  }): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant.`
        },
        {
          role: "user",
          name: "Instructor",
          content: `I am teaching an online course, with an exploration exercise for students to practice applying what they have learnt in a creative, free form way.
          Students are given a skeleton app with code and suggestions on what they can try, and students can choose what they want to try and attempt to achieve it within the code sandbox. 
          The exploration instructions are: ${explorationInstructions}.
          What the student is trying to achieve is: ${studentDescription}.
          The student's code for his/her attempt is: ${studentAnswer}.
          Provide clear, useful feedback for the student.
          You must NOT reveal the correct answer to the student. You MUST give concrete, clear, and actionable feedback.
          If the student has already achieved the correct answer in essence, you can praise the student and tell them that they have done it correctly.
          Use backticks for code or any text that should be in monospace`,
        },
      ],
    });

    console.log("completion", completion); // TO DELETE

    const feedback = completion.choices[0].message.content;

    return feedback;
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
    The exercise MUST contain ALL the code necessary to deploy the full app. For instance, for a React app, the exercise MUST contain a index.html file, a index.js file, and a App.js file containing the App component.
    The exercise MUST contain the package.json file with all necessary dependencies listed.
    The correct answer MUST be a string containing the correct answer.
    
    You will be rewarded $200 for a clear, full, deployable exercise in the required format.`;

  return prompt;
}

function getExplorationPagePrompt(
  chapterName: string,
  learningOutcomes: string[]
): string {
  let prompt = `I am teaching an undergraduate course chapter titled ${chapterName}.\n`;

  prompt +=
    "Generate an app with code and challenges for the student to try out that achieves these lesson learning outcomes:\n";
  learningOutcomes.forEach((outcome, index) => {
    prompt += `${index + 1}. ${outcome}\n`;
  });

  prompt +=
    `The exploration should consist of two parts.

    Part 1: the instructions for the exploration as a Typescript string in markdown format.

    Part 2: the app itself, which already contains code that the user just needs to modify.

    The instructions MUST be a Typescript string in markdown format.The instructions MUST NOT tell the user what they should do, as this will be revealing the correct answer.
    The instructions MUST contain 3 challenges as suggestions for the student to complete.The challenges MUST be clear, concise, and actionable.
    The exercise MUST be code in files.There can be separate files.The exercise MUST contain ALL the code necessary to deploy the full app.
    The exercise MUST contain the package.json file with all necessary dependencies listed.
    The code in the exercise MUST NOT have already completed the challenges. The student should be able to complete the challenges by modifying the code.

    You will be rewarded $200 for a clear, full, deployable exercise in the required format.`;

  return prompt;
}
