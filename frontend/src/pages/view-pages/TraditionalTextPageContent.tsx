import { LexOutput } from "../../rich-text-editor";
import { TraditionalTextBasedLessonPage } from "../../types/models";

interface TraditionalTextPageContentProps {
  traditionalTextBasedLessonPage: TraditionalTextBasedLessonPage;
}

const TraditionalTextPageContent: React.FC<TraditionalTextPageContentProps> = ({
  traditionalTextBasedLessonPage,
}: TraditionalTextPageContentProps) => {
  return (
    <LexOutput
      key={traditionalTextBasedLessonPage.id}
      editorStateStr={traditionalTextBasedLessonPage.content}
    />
  );
};

export default TraditionalTextPageContent;
