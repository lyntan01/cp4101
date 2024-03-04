import { LexOutput } from "../../rich-text-editor";
import { ExercisePage } from "../../types/models";
import CodeSandboxButton from "./CreateCodeSandbox";

interface ExercisePageContentProps {
  exercisePage: ExercisePage;
}

const ExercisePageContent: React.FC<ExercisePageContentProps> = ({
  exercisePage,
}: ExercisePageContentProps) => {
  return (
    <div>
      <LexOutput
        key={exercisePage.id}
        editorStateStr={exercisePage.instructions}
      />
      <CodeSandboxButton />
    </div>
  );
};

export default ExercisePageContent;
