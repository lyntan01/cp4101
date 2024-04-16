import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Chapter, Exercise, PageTypeEnum, Submission } from '../../types/models'
import { useToast } from '../../wrappers/ToastProvider'
import { getChapterById } from '../../api/chapter'
import { LexEditor, LexOutput } from '../../rich-text-editor'
import {
  Accordion,
  AccordionHeader,
  AccordionBody
} from '@material-tailwind/react'
import CodeSandbox from '../view-pages/components/CodeSandbox'
import { MonacoEditor } from '../../components/monaco-editor'
import {
  editTeacherFeedback,
  getLatestSubmissionByChapterIdAndStudentId
} from '../../api/submission'
import { convertMarkdownToLexicalJson } from '../../utils/convertMarkdownToLexicalJson'

const CreateTeacherFeedback: React.FC = () => {
  const { chapterId } = useParams()
  const [chapter, setChapter] = useState<Chapter>()
  const [exercise, setExercise] = useState<Exercise>()
  const [isExerciseShown, setIsExerciseShown] = useState(false)

  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [submissionData, setSubmissionData] = useState<{
    id: string
    studentAnswer: string
    generatedFeedback: string
    teacherFeedback: string
    submittedAt: Date
    studentId: string
    exerciseId: string
  }>({
    id: '',
    studentAnswer: '',
    generatedFeedback: '',
    teacherFeedback: '',
    submittedAt: new Date(),
    studentId: '',
    exerciseId: ''
  })
  const [generatedFeedbackLexicalJson, setGeneratedFeedbackLexicalJson] =
    useState<string>('')

  const { displayToast, ToastType } = useToast()
  const navigate = useNavigate()

  const fetchChapter = async () => {
    try {
      const response = await getChapterById(chapterId ?? '')
      // console.log(response.data)

      const chapter = response.data
      const page = chapter.pages.find(
        page => page.type === PageTypeEnum.EXERCISE
      )
      if (!page) {
        // If no exercise page exists, throw an error or display a toast directly
        throw new Error('No exercise page found in the chapter.')
      } else {
        setSubmissionData({
          ...submissionData,
          exerciseId: page.exercisePage!.exercise.id
        })
        setExercise({
          id: page.exercisePage!.exercise.id,
          instructions: page.exercisePage!.exercise.instructions,
          sandboxId: page.exercisePage!.exercise.sandboxId,
          correctAnswer: page.exercisePage!.exercise.correctAnswer,
          submissions: []
        })
      }

      // Handle the case where there are no students
      if (chapter.course.students.length === 0) {
        // Optionally handle the case where there are no students
        throw new Error('No students found in the course.')
      }

      setChapter(chapter)
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR)
      } else {
        displayToast(
          'Chapter could not be fetched: Unknown error.',
          ToastType.ERROR
        )
      }
      console.log(error)
    }
  }

  const handleSubmit = async () => {
    try {
      if (submissionData.teacherFeedback.trim().length === 0) {
        displayToast('Feedback cannot be empty!', ToastType.ERROR)
        return
      }
      const response = await editTeacherFeedback(
        submissionData.id,
        submissionData.teacherFeedback
      )
      displayToast('Feedback edited successfully.', ToastType.INFO)
      navigate(`/courses/${chapter?.course.id}/3`)
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR)
      } else {
        displayToast(
          'Feedback could not be edited: Unknown error.',
          ToastType.ERROR
        )
      }
      console.log(error)
    }
  }

  const fetchSubmission = async () => {
    try {
      if (selectedStudentId.length > 0) {
        const response = await getLatestSubmissionByChapterIdAndStudentId(
          chapterId ?? '',
          selectedStudentId
        )
        console.log(response)
        if (!response || !response.data) {
          throw new Error(
            'Student has not submitted any attempts for this exercise.'
          )
        }

        const submission: Submission = response.data
        setSubmissionData({
          ...submissionData,
          id: submission.id,
          studentAnswer: submission.studentAnswer,
          generatedFeedback: submission.generatedFeedback,
          teacherFeedback: submission.teacherFeedback,
          submittedAt: submission.submittedAt,
          studentId: selectedStudentId
        })
        setGeneratedFeedbackLexicalJson(
          await convertMarkdownToLexicalJson(submission.generatedFeedback)
        )
      }
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR)
      } else {
        displayToast(
          'Chapter could not be fetched: Unknown error.',
          ToastType.ERROR
        )
      }
      console.log(error)
    }
  }

  useEffect(() => {
    fetchChapter()
  }, [])

  useEffect(() => {
    fetchSubmission()
  }, [selectedStudentId])

  return (
    chapter && (
      <div>
        <h2 className='text-2xl font-bold tracking-wide text-gray-800'>
          Give Feedback for Student Exercise Attempt
        </h2>
        <p className='mt-1 text-sm leading-6 font-light tracking-wide text-gray-600'>
          in {chapter.name} of {chapter.course.name}
        </p>

        <div className='mt-10 grid gap-x-6 gap-y-8'>
          <div>
            <label
              htmlFor='student'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Select Student:
            </label>
            <select
              id='student'
              name='student'
              className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
              defaultValue=''
              onChange={event => setSelectedStudentId(event.target.value)}
            >
              <option disabled value='' className='text-gray-500'>
                Please select a student
              </option>
              {chapter.course.students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div className=''>
            <label
              htmlFor='content'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Feedback for Student's Exercise Attempt
            </label>
            <div className='mt-2'>
              <LexEditor
                onChange={value =>
                  setSubmissionData({
                    ...submissionData,
                    teacherFeedback: value
                  })
                }
                editorStateStr={submissionData.teacherFeedback}
              />
            </div>
          </div>

          <div className='w-full items-center text-center'>
            <button
              type='button'
              onClick={() => handleSubmit()}
              className='block mx-auto w-48 bg-sky-600 hover:bg-slate-700 px-5 py-3 text-base items-center gap-x-1.5 rounded-lg font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 justify-center'
            >
              Edit Feedback
            </button>
          </div>

          {exercise && (
            <Accordion
              key={exercise.id}
              open={isExerciseShown}
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                  stroke='currentColor'
                  className={`${
                    isExerciseShown ? 'rotate-180' : ''
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
              className='rounded-lg border border-blue-gray-100'
            >
              <AccordionHeader
                onClick={() => setIsExerciseShown(!isExerciseShown)}
                placeholder=''
                className='bg-slate-100 px-6 text-base font-medium text-slate-800'
              >
                View Exercise
              </AccordionHeader>
              <AccordionBody className='p-4 text-base'>
                <LexOutput
                  key={exercise.id}
                  editorStateStr={exercise.instructions}
                />
                <CodeSandbox sandboxId={exercise.sandboxId} />

                <h3 className='underline mb-2'>Correct Answer:</h3>
                {/* TODO: Replace language with the language of the exercise */}
                <MonacoEditor
                  value={exercise.correctAnswer}
                  language='javascript'
                  readOnly={true}
                  className='h-96 my-4'
                />

                {selectedStudentId && (
                  <>
                    <h3 className='underline mb-2'>Student Answer:</h3>
                    {/* TODO: Replace language with the language of the exercise */}
                    <MonacoEditor
                      value={submissionData.studentAnswer}
                      language='javascript'
                      readOnly={true}
                      className='h-96 my-4'
                    />

                    <h3 className='underline mb-2'>AI-Generated Feedback:</h3>
                    <LexOutput editorStateStr={generatedFeedbackLexicalJson} />
                  </>
                )}
              </AccordionBody>
            </Accordion>
          )}
        </div>
      </div>
    )
  )
}

export default CreateTeacherFeedback
