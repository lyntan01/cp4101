import { LexOutput } from '../../rich-text-editor'
import {
  Chapter,
  Exercise,
  ExercisePage,
  Submission,
  UserRoleEnum
} from '../../types/models'
import CodeSandbox from './components/CodeSandbox'
import {
  Accordion,
  AccordionHeader,
  AccordionBody
} from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { MonacoEditor } from '../../components/monaco-editor/MonacoEditor'
import { GenericButton } from '../../components/buttons'
import { useToast } from '../../wrappers/ToastProvider'
import {
  GetExerciseStudentAnswerFeedbackData,
  getExerciseStudentAnswerFeedback
} from '../../api/exercisePage'
import {
  CreateGeneratedExerciseData,
  generateNewExercise
} from '../../api/generatedExercise'
import {
  convertMarkdownToLexicalJson,
  emptyLexicalJson
} from '../../utils/convertMarkdownToLexicalJson'
import { getLatestSubmissionByChapterIdAndStudentId } from '../../api/submission'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { TeacherFeedbackModal } from './components/TeacherFeedbackModal'

interface ExercisePageContentProps {
  exercisePage: ExercisePage
  chapter: Chapter
  userId: string
  role: UserRoleEnum
}

const ExercisePageContent: React.FC<ExercisePageContentProps> = ({
  exercisePage,
  chapter,
  userId,
  role
}: ExercisePageContentProps) => {
  const [currentExercise, setCurrentExercise] = useState<Exercise>(
    exercisePage.exercise
  )

  // Teacher View
  const [isCorrectAnswerShown, setIsCorrectAnswerShown] = useState(false)

  // Student View
  const [isFirstExercise, setIsFirstExercise] = useState(true)
  const [isSubmitAnswerShown, setIsSubmitAnswerShown] = useState(false)
  const [studentAnswer, setStudentAnswer] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')
  const [latestSubmission, setLatestSubmission] = useState<Submission | null>(
    null
  )
  const [isTeacherFeedbackModalShown, setIsTeacherFeedbackModalShown] =
    useState(false)

  const { displayToast, ToastType } = useToast()

  const getNextExercise = async () => {
    try {
      const createGeneratedExerciseData: CreateGeneratedExerciseData = {
        chapterId: chapter.id,
        chapterName: chapter.name,
        chapterLearningOutcomes: chapter.learningOutcomes,
        studentPreviousExerciseInstructions: currentExercise.instructions
      }
      if (studentAnswer.trim().length > 0) {
        createGeneratedExerciseData.studentPreviousExerciseAttempt =
          studentAnswer
      }
      if (feedback.trim().length > 0) {
        createGeneratedExerciseData.studentPreviousExerciseFeedback = feedback
      }

      displayToast('Generating new exercise...', ToastType.INFO)

      // Call OpenAI service API to get new exercise
      const response = await generateNewExercise(createGeneratedExerciseData)
      const newExercise = response.data.exercise
      console.log('newExercise', newExercise)

      // Convert exercise instructions to Lexical JSON
      const exerciseInstructionsJson = await convertMarkdownToLexicalJson(
        newExercise.instructions
      )
      newExercise.instructions = exerciseInstructionsJson
      console.log('newExercise after converting to Lexical JSON', newExercise)

      // Display generated exercise
      setCurrentExercise({ ...newExercise, submissions: [] })
      setIsSubmitAnswerShown(false)
      setStudentAnswer('')
      setFeedback('')
      setIsFirstExercise(false)
      displayToast('New exercise generated successfully.', ToastType.INFO)
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR)
      } else {
        displayToast(
          'New exercise could not be generated: Unknown error.',
          ToastType.ERROR
        )
      }
      console.log(error)
    }
  }

  const handleSubmitAnswer = async () => {
    try {
      if (studentAnswer.trim().length === 0) {
        displayToast('Answer cannot be empty!', ToastType.ERROR)
        return
      }

      // Call OpenAI service API to get feedback
      const feedbackData: GetExerciseStudentAnswerFeedbackData = {
        studentId: userId,
        exerciseId: currentExercise.id,
        exerciseInstructions: currentExercise.instructions,
        correctAnswer: currentExercise.correctAnswer,
        studentAnswer: studentAnswer
      }
      const response = await getExerciseStudentAnswerFeedback(feedbackData)
      const lexicalJson = await convertMarkdownToLexicalJson(response.data)
      setFeedback(lexicalJson)
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

  const fetchTeacherFeedback = async () => {
    try {
      const response = await getLatestSubmissionByChapterIdAndStudentId(
        chapter.id,
        userId
      )

      if (response && response.data && response.data.length > 0) {
        setLatestSubmission(response.data[0])
      }

      // If student has not submitted any attempts for this exercise before, latestSubmission will be null.
      console.log('latestSubmission', latestSubmission)
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

  useEffect(() => {
    fetchTeacherFeedback()
  }, [])

  return (
    <div>
      {role === UserRoleEnum.STUDENT &&
        latestSubmission &&
        latestSubmission.teacherFeedback &&
        latestSubmission.teacherFeedback !== emptyLexicalJson && (
          <div className='w-full items-center text-center'>
            <GenericButton
              text='View Teacher Feedback for Latest Submission'
              type='button'
              icon={<DocumentTextIcon className='h-4 w-4' />}
              onClick={() => {
                setIsTeacherFeedbackModalShown(true)
              }}
              className='mb-4 bg-gray-500 hover:bg-gray-700 mx-auto'
            />
          </div>
        )}
      {!isFirstExercise && (
        <p className='italic text-slate-400 text-sm font-light mb-4'>
          Note: This exercise is generated by AI and has not been vetted for
          accuracy by the instructor. If you have any queries, please contact
          your instructor.
        </p>
      )}
      <LexOutput
        key={exercisePage.id}
        editorStateStr={currentExercise.instructions}
      />
      <CodeSandbox sandboxId={currentExercise.sandboxId} />

      {role === UserRoleEnum.TEACHER && (
        <Accordion
          key={exercisePage.id}
          open={isCorrectAnswerShown}
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2}
              stroke='currentColor'
              className={`${
                isCorrectAnswerShown ? 'rotate-180' : ''
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
          className='my-8 rounded-lg border border-blue-gray-100'
        >
          <AccordionHeader
            onClick={() => setIsCorrectAnswerShown(!isCorrectAnswerShown)}
            placeholder=''
            className='bg-slate-100 px-6 text-base font-medium text-slate-800'
          >
            Correct Answer
          </AccordionHeader>
          <AccordionBody className='p-4 text-base'>
            {/* TODO: Replace language with the language of the exercise */}
            <MonacoEditor
              value={currentExercise.correctAnswer}
              language='javascript'
              readOnly={true}
              className='h-96'
            />
          </AccordionBody>
        </Accordion>
      )}

      {role === UserRoleEnum.STUDENT && (
        <>
          <div className='w-full items-center text-center'>
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
                {/* TODO: Replace language with the language of the exercise */}
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
                    onClick={() => handleSubmitAnswer()}
                    className='my-4 bg-sky-500 hover:bg-sky-700'
                  />
                  {feedback.trim().length > 0 && (
                    <div className='overflow-hidden rounded-lg bg-gray-100 text-left text-wrap whitespace-pre-wrap'>
                      <div className='px-4 py-5 sm:p-6'>
                        <h1 className='font-bold underline'>Feedback</h1>
                        <h4 className='italic mb-4'>
                          Note: AI-generated feedback may not be 100% accurate.
                          Please ignore irrelevant feedback.
                        </h4>
                        <LexOutput editorStateStr={feedback} />
                      </div>
                    </div>
                  )}
                </div>
              </AccordionBody>
            </Accordion>

            <button
              type='button'
              onClick={() => getNextExercise()}
              className='block mx-auto bg-sky-600 hover:bg-sky-700 px-5 py-3 text-base font-medium items-center gap-x-1.5 rounded-lg font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 justify-center'
            >
              Generate New Exercise
            </button>
          </div>
          {isTeacherFeedbackModalShown && latestSubmission && (
            <TeacherFeedbackModal
              setIsModalOpen={setIsTeacherFeedbackModalShown}
              submission={latestSubmission}
            />
          )}
        </>
      )}
    </div>
  )
}

export default ExercisePageContent
