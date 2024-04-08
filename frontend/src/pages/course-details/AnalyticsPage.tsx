import { Tab } from '@headlessui/react'
import { classNames } from '../../utils/classNames'
import { Course } from '../../types/models'
import { ChapterAnalytics, getChapterAnalytics } from '../../api/course'
import { useEffect, useState } from 'react'
import { useToast } from '../../wrappers/ToastProvider'

interface AnalyticsPageProps {
  key: number
  course: Course
}

export const AnalyticsPage = ({ key, course }: AnalyticsPageProps) => {
  const [chapterAnalytics, setChapterAnalytics] = useState<ChapterAnalytics[]>(
    []
  )
  const { displayToast, ToastType } = useToast()

  const fetchChapterAnalytics = async () => {
    try {
      const response = await getChapterAnalytics(
        course.id,
        course.students.length
      )
      console.log(response.data)
      setChapterAnalytics(response.data)
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR)
      } else {
        displayToast(
          'Analytics could not be fetched: Unknown error.',
          ToastType.ERROR
        )
      }
      console.log(error)
    }
  }

  useEffect(() => {
    fetchChapterAnalytics()
  }, [])

  return (
    <Tab.Panel
      key={key}
      className={classNames(
        'rounded-xl bg-white p-3',
        'ring-white/60 ring-offset-2 ring-offset-blue-400'
      )}
    >
      <h1 className='text-xl font-semibold leading-6 text-gray-900'>
        Analytics
      </h1>
      <div className='mt-8 flow-root'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-center text-sm font-medium text-gray-900 sm:pl-6'
                    >
                      Chapter
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-center text-sm font-medium text-gray-900'
                    >
                      No. of Students who Attempted 1st Exercise
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-center text-sm font-medium text-gray-900'
                    >
                      % of Students who Attempted 1st Exercise
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-center text-sm font-medium text-gray-900'
                    >
                      No. of Students who Attempted Generated Exercises
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-center text-sm font-medium text-gray-900'
                    >
                      Average Number of Exercise Submissions per Student
                    </th>

                    <th
                      scope='col'
                      className='relative py-3.5 pl-3 pr-4 sm:pr-6'
                    >
                      <span className='sr-only'></span>
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {course.chapters.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className='whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6 text-center'
                      >
                        No chapters created in this course yet.
                      </td>
                    </tr>
                  ) : (
                    chapterAnalytics.map(item => (
                      <tr key={item.chapterId}>
                        <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6'>
                          {item.chapterName}
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center'>
                          {item.studentsWithExercisePageSubmissions}
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center'>
                          {item.percentStudentsWithExercisePageSubmissions}%
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center'>
                          {item.studentsWithGeneratedExerciseSubmissions}
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center'>
                          {item.avgSubmissionsPerStudent
                            ? item.avgSubmissionsPerStudent.toFixed(1)
                            : '-'}
                        </td>
                        <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                          <button
                            type='button'
                            className='text-indigo-600 hover:text-indigo-900'
                            onClick={() => {
                              // navigate
                            }}
                          >
                            View More
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Tab.Panel>
  )
}
