import { LexOutput } from "../../rich-text-editor";
import { ExercisePage } from "../../types/models";
import CodeSandbox from "./CodeSandbox";

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
      <CodeSandbox sandboxId={exercisePage.sandboxId} />
    </div>
  );
};

export default ExercisePageContent;
