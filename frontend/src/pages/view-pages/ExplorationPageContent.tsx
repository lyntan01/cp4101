import { LexOutput } from '../../rich-text-editor'
import { ExplorationPage, UserRoleEnum } from '../../types/models'
import CodeSandbox from './components/CodeSandbox'
import {
  Accordion,
  AccordionHeader,
  AccordionBody
} from '@material-tailwind/react'
import { useState } from 'react'
import { MonacoEditor } from '../../components/monaco-editor/MonacoEditor'
import { GenericButton } from '../../components/buttons'
import { useToast } from '../../wrappers/ToastProvider'
import {
  GetExplorationStudentAnswerFeedbackData,
  getExplorationStudentAnswerFeedback
} from '../../api/explorationPage'
import { convertMarkdownToLexicalJson } from '../../utils/convertMarkdownToLexicalJson'

interface ExplorationPageContentProps {
  explorationPage: ExplorationPage
  role: UserRoleEnum
}

const ExplorationPageContent: React.FC<ExplorationPageContentProps> = ({
  explorationPage,
  role
}: ExplorationPageContentProps) => {
  const [isSubmitAnswerShown, setIsSubmitAnswerShown] = useState(false)
  const [studentAnswer, setStudentAnswer] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')

  const { displayToast, ToastType } = useToast()

  const handleSubmitAnswer = async (answer: string) => {
    try {
      if (studentAnswer.trim().length === 0) {
        displayToast('Answer cannot be empty!', ToastType.ERROR)
        return
      }

      // Call OpenAI service API to get feedback
      // const feedbackData: GetExplorationStudentAnswerFeedbackData = {
      //   explorationInstructions: explorationPage.instructions,
      //   studentAnswer: answer
      // }
      // const response = await getExplorationStudentAnswerFeedback(feedbackData)
      // const lexicalJson = await convertMarkdownToLexicalJson(response.data)
      // setFeedback(lexicalJson)
      displayToast('Student answer submitted successfully.', ToastType.INFO)
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR)
      } else {
        displayToast(
          'Feedback could not be generated: Unknown error.',
          ToastType.ERROR
        )
      }
      console.log(error)
    }
  }

  return (
    <div>
      <LexOutput
        key={explorationPage.id}
        editorStateStr={explorationPage.instructions}
      />
      <CodeSandbox sandboxId={explorationPage.sandboxId} />

      {role === UserRoleEnum.STUDENT && (
        <Accordion
          key='studentAnswer'
          open={isSubmitAnswerShown}
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2}
              stroke='currentColor'
              className={`${
                isSubmitAnswerShown ? 'rotate-180' : ''
              } h-5 w-5 transition-transform`}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19.5 8.25l-7.5 7.5-7.5-7.5'
              />
            </svg>
          }
          placeholder=''
          className='my-8'
        >
          <AccordionHeader
            onClick={() => setIsSubmitAnswerShown(!isSubmitAnswerShown)}
            placeholder=''
            className='w-52 mx-auto bg-slate-100 px-6 text-base font-medium text-slate-800 border border-blue-gray-100 rounded-lg'
          >
            Submit Answer
          </AccordionHeader>
          <AccordionBody className='p-6 text-base text-center border border-blue-gray-100 rounded-lg'>
            {/* TODO: Replace language with the language of the exploration */}
            <div>
              Copy and paste your answer into the editor below:
              <MonacoEditor
                value={studentAnswer}
                language='javascript'
                readOnly={false}
                handleEditorChange={(value: string | undefined) =>
                  setStudentAnswer(value ?? '')
                }
                className='block w-full h-96 my-4 rounded-md border-2 border-gray-300 shadow-sm'
              />
              <GenericButton
                text='Get Feedback'
                type='button'
                onClick={() => handleSubmitAnswer(studentAnswer)}
                className='my-4 bg-sky-500 hover:bg-sky-700'
              />
              {feedback.trim().length > 0 && (
                <div className='overflow-hidden rounded-lg bg-gray-100 text-left text-wrap whitespace-pre-wrap'>
                  <div className='px-4 py-5 sm:p-6'>
                    <h2 className='font-bold mb-2'>Feedback:</h2>
                    <LexOutput editorStateStr={feedback} />
                  </div>
                </div>
              )}
            </div>
          </AccordionBody>
        </Accordion>
      )}
    </div>
  )
}

export default ExplorationPageContent
