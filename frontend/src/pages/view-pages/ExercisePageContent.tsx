import { LexOutput } from "../../rich-text-editor";
import { ExercisePage, UserRoleEnum } from "../../types/models";
import CodeSandbox from "./components/CodeSandbox";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  ChevronRightIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

interface ExercisePageContentProps {
  exercisePage: ExercisePage;
  role: UserRoleEnum;
}

const ExercisePageContent: React.FC<ExercisePageContentProps> = ({
  exercisePage,
  role,
}: ExercisePageContentProps) => {
  const [isCorrectAnswerShown, setIsCorrectAnswerShown] = useState(false);

  return (
    <div>
      <LexOutput
        key={exercisePage.id}
        editorStateStr={exercisePage.instructions}
      />
      <CodeSandbox sandboxId={exercisePage.sandboxId} />

      {role === UserRoleEnum.TEACHER && (
        (
          <Accordion
            key={exercisePage.id}
            open={isCorrectAnswerShown}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`${
                  isCorrectAnswerShown ? "rotate-180" : ""
                } h-5 w-5 transition-transform`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            }
            placeholder=""
            className="my-8 rounded-lg border border-blue-gray-100"
          >
            <AccordionHeader
              onClick={() => setIsCorrectAnswerShown(!isCorrectAnswerShown)}
              placeholder=""
              className="bg-slate-100 px-6 text-base font-medium text-slate-800"
            >
              Correct Answer
            </AccordionHeader>
            <AccordionBody className="p-4 text-base">
              {/* TODO: Change to Monaco Editor instead of plain text */}
              <div>
                <pre>
                  <code>
                    {exercisePage.correctAnswer}
                  </code>
                </pre>
              </div>
            </AccordionBody>
          </Accordion>
        )
      )}
    </div>
  );
};

export default ExercisePageContent;
