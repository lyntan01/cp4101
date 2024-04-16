import { Submission } from '../../../types/models'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { LexOutput } from '../../../rich-text-editor'
import { MonacoEditor } from '../../../components/monaco-editor'
import { useEffect, useState } from 'react'
import { useToast } from '../../../wrappers/ToastProvider'
import { convertMarkdownToLexicalJson } from '../../../utils/convertMarkdownToLexicalJson'

interface TeacherFeedbackModalProps {
  setIsModalOpen: (isModalOpen: boolean) => void
  submission: Submission
}

export const TeacherFeedbackModal: React.FC<TeacherFeedbackModalProps> = ({
  setIsModalOpen,
  submission
}) => {
  const [generatedFeedbackLexicalJson, setGeneratedFeedbackLexicalJson] =
    useState<string>('')
  const { displayToast, ToastType } = useToast()

  const formatGeneratedFeedback = async () => {
    try {
      setGeneratedFeedbackLexicalJson(
        await convertMarkdownToLexicalJson(submission.generatedFeedback)
      )
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR)
      } else {
        displayToast(
          'AI-generated feedback cannot be retrieved: Unknown error.',
          ToastType.ERROR
        )
      }
      console.log(error)
    }
  }

  useEffect(() => {
    formatGeneratedFeedback()
  }, [])

  return (
    <div className='fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none'>
      <div className='fixed inset-0 bg-gray-500 opacity-75'></div>
      <div className='relative bg-white p-5 rounded-lg shadow-md max-h-[90vh] w-8/12 overflow-y-auto'>
        <div className='flex flex-col items-start justify-between gap-3'>
          <div className='flex flex-row justify-between w-full'>
            <h3 className='text-lg font-semibold leading-6 text-gray-900'>
              Teacher Feedback on Latest Submission
            </h3>
            <button
              type='button'
              className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              onClick={() => setIsModalOpen(false)}
            >
              <span className='sr-only'>Close</span>
              <XMarkIcon className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <p>
            Submitted on{' '}
            {new Date(submission.submittedAt)
              .toLocaleString('en-GB', {
                timeZone: 'Asia/Singapore',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })
              .replace('am', 'AM')
              .replace('pm', 'PM')}
          </p>

          <div className='space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:pb-0'>
            <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6'>
              <h3 className='block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5'>
                Teacher Feedback
              </h3>
              <div className='mt-2 sm:col-span-2'>
                <LexOutput editorStateStr={submission.teacherFeedback} />
              </div>
            </div>

            <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6'>
              <h3 className='block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5'>
                AI-Generated Feedback
              </h3>
              <div className='mt-2 sm:col-span-2 sm:mt-0'>
                <LexOutput editorStateStr={generatedFeedbackLexicalJson} />
              </div>
            </div>

            <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6'>
              <h3 className='block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5'>
                Your Submission
              </h3>
              <div className='mt-2 sm:col-span-2 sm:mt-0'>
                {/* TODO: Replace language with the language of the exercise */}
                <MonacoEditor
                  value={submission.studentAnswer}
                  language='javascript'
                  readOnly={true}
                  className='h-96 my-4'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
