import { useState } from 'react'
import { EditChapterData } from '../../../api/chapter'
import { Chapter } from '../../../types/models'

interface EditChapterModalProps {
  chapter: Chapter
  setIsModalOpen: (isModalOpen: boolean) => void
  editChapter: (data: EditChapterData) => void
}

export const EditChapterModal: React.FC<EditChapterModalProps> = ({
  chapter,
  setIsModalOpen,
  editChapter
}) => {
  const [chapterName, setChapterName] = useState(chapter.name)
  const [chapterLearningOutcomes, setChapterLearningOutcomes] = useState(
    chapter.learningOutcomes.join('\n')
  )

  return (
    <div className='fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none'>
      <div className='fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none'>
        <div className='fixed inset-0 bg-gray-500 opacity-75'></div>
        <div className='relative bg-white p-5 rounded-lg shadow-md h-42 w-1/2'>
          <div className='flex flex-col items-start justify-between gap-3'>
            <h3 className='text-lg font-semibold leading-6 text-gray-900'>
              Edit Chapter
            </h3>

            <div className='w-full mt-3 mb-3'>
              <label
                htmlFor='title'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Chapter Name
              </label>
              <div className='relative rounded-md shadow-sm'>
                <input
                  type='text'
                  name='title'
                  id='title'
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                    chapterName.trim().length === 0
                      ? 'ring-red-300 text-red-900 focus:ring-red-500'
                      : 'ring-gray-300 text-gray-900 focus:ring-green-500'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                  placeholder='e.g. React Basics'
                  value={chapterName}
                  onChange={e => {
                    setChapterName(e.target.value)
                  }}
                  aria-invalid={true}
                  aria-describedby='title-error'
                />
              </div>
            </div>

            <div className='w-full mb-3'>
              <label
                htmlFor='outcomes'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Chapter Learning Outcomes
              </label>
              <div className='relative rounded-md shadow-sm'>
                <textarea
                  name='outcomes'
                  id='outcomes'
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                    chapterLearningOutcomes.trim().length === 0
                      ? 'ring-red-300 text-red-900 focus:ring-red-500'
                      : 'ring-gray-300 text-gray-900 focus:ring-green-500'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                  // placeholder='e.g. React Basics'
                  value={chapterLearningOutcomes}
                  onChange={e => {
                    setChapterLearningOutcomes(e.target.value)
                  }}
                  aria-invalid={true}
                  aria-describedby='title-error'
                />
              </div>
            </div>
          </div>
          <div className='mt-5 flex justify-end'>
            <button
              className='mr-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500'
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              disabled={
                chapterName.trim().length === 0 ||
                chapterLearningOutcomes.trim().length === 0
              }
              className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none
                ${
                  chapterName.trim().length === 0 ||
                  chapterLearningOutcomes.trim().length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500'
                }`}
              onClick={() =>
                editChapter({
                  name: chapterName,
                  learningOutcomes: chapterLearningOutcomes.split('\n')
                })
              }
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
