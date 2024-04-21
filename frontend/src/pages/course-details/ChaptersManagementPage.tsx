import { Tab } from '@headlessui/react'
import { useEffect, useState } from 'react'
import {
  createChapter as createChapterApi,
  deleteChapter as deleteChapterApi,
  generateChapters as generateChaptersApi,
  getAllChaptersByCourseId
} from '../../api/chapter'
import { deletePage as deletePageApi } from '../../api/page'
import {
  createTextPage,
  generateLessonPage as generateLessonPageApi
} from '../../api/textPage'
import { generateExercisePage as generateExercisePageApi } from '../../api/exercisePage'
import { generateExplorationPage as generateExplorationPageApi } from '../../api/explorationPage'
import { Chapter, Course, PageTypeEnum, UserRoleEnum } from '../../types/models'
import { classNames } from '../../utils/classNames'
import { useToast } from '../../wrappers/ToastProvider'
import { ChapterAccordion } from './components/ChapterAccordion'
import { CreateChapterModal } from './components/CreateChapterModal'
import { GenerateChaptersModal } from './components/GenerateChaptersModal'
import { generateLearningOutcomesLexicalJSON } from '../../utils/convertMarkdownToLexicalJson'

interface ChaptersManagementPageProps {
  key: number
  course: Course
  role: UserRoleEnum
}

export const ChaptersManagementPage = ({
  key,
  course,
  role
}: ChaptersManagementPageProps) => {
  const [isGenerateChaptersModalOpen, setIsGenerateChaptersModalOpen] =
    useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const { displayToast, ToastType } = useToast()

  const fetchChapters = async () => {
    try {
      const response = await getAllChaptersByCourseId(course.id)
      setChapters(response.data)
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR)
      } else {
        displayToast(
          'Chapters could not be fetched: Unknown error.',
          ToastType.ERROR
        )
      }
      console.log(error)
    }
  }

  const generateChapters = async (
    numChapters: number,
    courseLearningOutcomes: string
  ) => {
    try {
      displayToast('Generating, hang on tight!', ToastType.INFO)

      const response = await generateChaptersApi({
        courseId: course.id,
        courseName: course.name,
        courseLearningOutcomes: courseLearningOutcomes,
        numChapters: numChapters
      })
      console.log(response.data) // TO DELETE
      displayToast('Chapters generated successfully.', ToastType.INFO)
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR)
      } else {
        displayToast(
          'Chapters could not be generated: Unknown error.',
          ToastType.ERROR
        )
      }
      console.log(error)
    } finally {
      setIsGenerateChaptersModalOpen(false)
    }
  }

  const generateAllPages = async () => {
    try {
      await generateLessonPages()
      await generateExercisePages()
      await generateExplorationPages()
    } catch (error) {
      console.log(error)
      displayToast(
        'An unexpected error occurred during pages generation.',
        ToastType.ERROR
      )
    }
  }

  const generateLessonPages = async () => {
    try {
      displayToast('Generating, hang on tight!', ToastType.INFO)

      // Map each chapter to a promise created by calling generateLessonPageApi
      const promises = chapters.map(chapter =>
        generateLessonPageApi({
          chapterId: chapter.id,
          chapterName: chapter.name,
          chapterLearningOutcomes: chapter.learningOutcomes
        })
          .then(response => ({
            status: 'fulfilled',
            value: response.data
          }))
          .catch(error => ({
            status: 'rejected',
            reason: error
          }))
      )

      // Wait for all promises to settle, regardless of fulfillment or rejection
      const results = await Promise.allSettled(promises)

      // Handle results
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(result.value) // TO DELETE
        } else if (result.status === 'rejected') {
          const error = result.reason
          if (error.response) {
            displayToast(`${error.response.data.error}`, ToastType.ERROR)
          } else {
            displayToast(
              `Lesson page for chapter ${chapters[index].name} could not be generated: Unknown error.`,
              ToastType.ERROR
            )
          }
        }
      })

      displayToast('Lesson pages generated successfully.', ToastType.INFO)
    } catch (error) {
      console.log(error)
      displayToast(
        'An unexpected error occurred during lesson pages generation.',
        ToastType.ERROR
      )
    }
  }

  const generateExercisePages = async () => {
    try {
      displayToast('Generating, hang on tight!', ToastType.INFO)

      // Map each chapter to a promise created by calling generateExercisePageApi
      const promises = chapters.map(chapter =>
        generateExercisePageApi({
          chapterId: chapter.id,
          chapterName: chapter.name,
          chapterLearningOutcomes: chapter.learningOutcomes
        })
          .then(response => ({
            status: 'fulfilled',
            value: response.data
          }))
          .catch(error => ({
            status: 'rejected',
            reason: error
          }))
      )

      // Wait for all promises to settle, regardless of fulfillment or rejection
      const results = await Promise.allSettled(promises)

      // Handle results
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(result.value) // TO DELETE
        } else if (result.status === 'rejected') {
          const error = result.reason
          if (error.response) {
            displayToast(`${error.response.data.error}`, ToastType.ERROR)
          } else {
            displayToast(
              `Exercise page for chapter ${chapters[index].name} could not be generated: Unknown error.`,
              ToastType.ERROR
            )
          }
        }
      })

      displayToast('Exercise pages generated successfully.', ToastType.INFO)
    } catch (error) {
      console.log(error)
      displayToast(
        'An unexpected error occurred during exercise pages generation.',
        ToastType.ERROR
      )
    }
  }

  const generateExplorationPages = async () => {
    try {
      displayToast('Generating, hang on tight!', ToastType.INFO)

      // Map each chapter to a promise created by calling generateExplorationPageApi
      const promises = chapters.map(chapter =>
        generateExplorationPageApi({
          chapterId: chapter.id,
          chapterName: chapter.name,
          chapterLearningOutcomes: chapter.learningOutcomes
        })
          .then(response => ({
            status: 'fulfilled',
            value: response.data
          }))
          .catch(error => ({
            status: 'rejected',
            reason: error
          }))
      )

      // Wait for all promises to settle, regardless of fulfillment or rejection
      const results = await Promise.allSettled(promises)

      // Handle results
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(result.value) // TO DELETE
        } else if (result.status === 'rejected') {
          const error = result.reason
          if (error.response) {
            displayToast(`${error.response.data.error}`, ToastType.ERROR)
          } else {
            displayToast(
              `Exploration page for chapter ${chapters[index].name} could not be generated: Unknown error.`,
              ToastType.ERROR
            )
          }
        }
      })

      displayToast('Exploration pages generated successfully.', ToastType.INFO)
    } catch (error) {
      console.log(error)
      displayToast(
        'An unexpected error occurred during exploration pages generation.',
        ToastType.ERROR
      )
    }
  }

  const createChapter = async (
    chapterName: string,
    chapterLearningOutcomes: string
  ) => {
    try {
      const response = await createChapterApi({
        name: chapterName.trim(),
        learningOutcomes: [chapterLearningOutcomes.trim()],
        courseId: course.id
      })

      // Create learning outcomes page
      await createTextPage({
        title: 'Learning Outcomes',
        chapterId: response.data.id,
        content: generateLearningOutcomesLexicalJSON([
          chapterLearningOutcomes.trim()
        ])
      })

      displayToast('Chapter created successfully.', ToastType.INFO)
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR)
      } else {
        displayToast(
          'Chapter could not be created: Unknown error.',
          ToastType.ERROR
        )
      }
      console.log(error)
    } finally {
      setIsCreateModalOpen(false)
    }
  }

  const deleteChapter = async (chapterId: string) => {
    // TODO: Add a delete modal instead of deleting directly
    try {
      await deleteChapterApi(chapterId)
      displayToast('Chapter deleted successfully.', ToastType.INFO)
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR)
      } else {
        displayToast(
          'Chapter could not be deleted: Unknown error.',
          ToastType.ERROR
        )
      }
      console.log(error)
    }
  }

  const deletePage = async (pageId: string) => {
    // TODO: Add a delete modal instead of deleting directly
    try {
      await deletePageApi(pageId)
      displayToast('Page deleted successfully.', ToastType.INFO)
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR)
      } else {
        displayToast(
          'Page could not be deleted: Unknown error.',
          ToastType.ERROR
        )
      }
      console.log(error)
    }
  }

  // Helper functions, to delete
  const isLessonPagesGenerated = (): boolean => {
    return chapters.every(
      chapter =>
        chapter.pages.length > 1 &&
        chapter.pages.some(
          page => page.type === PageTypeEnum.TRADITIONAL_TEXT_BASED_LESSON
        )
    )
  }

  const isExercisePagesGenerated = (): boolean => {
    return chapters.every(
      chapter =>
        chapter.pages.length > 2 &&
        chapter.pages.some(page => page.type === PageTypeEnum.EXERCISE)
    )
  }

  const isExplorationPagesGenerated = (): boolean => {
    return chapters.every(
      chapter =>
        chapter.pages.length > 2 &&
        chapter.pages.some(page => page.type === PageTypeEnum.EXPLORATION)
    )
  }

  useEffect(() => {
    fetchChapters()
  }, [
    isCreateModalOpen,
    isGenerateChaptersModalOpen,
    deleteChapter,
    deletePage,
    generateLessonPages
  ])

  return (
    <>
      <Tab.Panel
        key={key}
        className={classNames(
          'rounded-xl bg-white p-3',
          'ring-white/60 ring-offset-2 ring-offset-blue-400'
        )}
      >
        <div>
          <div className='sm:flex sm:items-center'>
            <div className='sm:flex-auto'>
              <h1 className='text-xl font-semibold leading-6 text-gray-900'>
                Chapters
              </h1>
            </div>
            {role === UserRoleEnum.TEACHER && (
              <div className='mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex space-x-2'>
                {chapters.length === 0 ? (
                  <button
                    type='button'
                    disabled={chapters.length > 0}
                    className='block rounded-md bg-indigo-400 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    onClick={() => setIsGenerateChaptersModalOpen(true)}
                  >
                    Generate Chapters
                  </button>
                ) : !isLessonPagesGenerated() ? (
                  // Note: If all 3 page types have not been generated, the button will generate all 3 types (lesson, exercise, exploration)
                  <button
                    type='button'
                    disabled={chapters.length === 0}
                    className='block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    onClick={() => generateAllPages()}
                  >
                    Generate Pages for All Chapters
                  </button>
                ) : !isExercisePagesGenerated() ? (
                  <button
                    type='button'
                    disabled={chapters.length === 0}
                    className='block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    onClick={() => generateExercisePages()}
                  >
                    Generate Exercise Pages for All Chapters
                  </button>
                ) : !isExplorationPagesGenerated() ? (
                  <button
                    type='button'
                    disabled={chapters.length === 0}
                    className='block rounded-md bg-indigo-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    onClick={() => generateExplorationPages()}
                  >
                    Generate Exploration Pages for All Chapters
                  </button>
                ) : (
                  <></>
                )}
                <button
                  type='button'
                  className='block rounded-md bg-gray-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Add chapter
                </button>
              </div>
            )}
          </div>
        </div>
        <ChapterAccordion
          chapters={chapters}
          role={role}
          deleteChapter={deleteChapter}
          deletePage={deletePage}
        />
      </Tab.Panel>
      {isGenerateChaptersModalOpen && (
        <GenerateChaptersModal
          setIsModalOpen={setIsGenerateChaptersModalOpen}
          generateChapters={generateChapters}
          courseName={course.name}
        />
      )}
      {isCreateModalOpen && (
        <CreateChapterModal
          setIsModalOpen={setIsCreateModalOpen}
          createChapter={createChapter}
        />
      )}
    </>
  )
}
