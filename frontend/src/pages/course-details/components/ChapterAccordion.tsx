import { useState } from 'react'
import { Chapter, UserRoleEnum } from '../../../types/models'
import {
  Accordion,
  AccordionHeader,
  AccordionBody
} from '@material-tailwind/react'
import { Icon } from './AccordionIcon'
import {
  DocumentTextIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { AddNewPageListItem } from './AddNewPageListItem'
import { useNavigate } from 'react-router-dom'
import {
  EditChapterData,
  editChapter as editChapterApi
} from '../../../api/chapter'
import { useToast } from '../../../wrappers/ToastProvider'
import { updateTextPage } from '../../../api/textPage'
import { generateLearningOutcomesLexicalJSON } from '../../../utils/convertMarkdownToLexicalJson'
import { EditChapterModal } from './EditChapterModal'

interface ChapterAccordionProps {
  chapters: Chapter[]
  role: UserRoleEnum
  deleteChapter: (chapterId: string) => void
  deletePage: (pageId: string) => void
}

export function ChapterAccordion ({
  chapters,
  role,
  deleteChapter,
  deletePage
}: ChapterAccordionProps) {
  const [open, setOpen] = useState<string[]>([])
  const [editChapterId, setEditChapterId] = useState<string>('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const navigate = useNavigate()

  const { displayToast, ToastType } = useToast()

  console.log('chapters', chapters)

  const handleOpen = (id: string) => {
    if (open.includes(id)) {
      setOpen(open.filter((item: string) => item !== id)) // Remove id from open array
    } else {
      setOpen([...open, id]) // Add id to open array
    }
  }

  const editChapter = async (data: EditChapterData) => {
    try {
      const response = await editChapterApi(editChapterId, data)
      console.log('edit response', response.data)
      displayToast('Chapter edited successfully.', ToastType.INFO)

      // Edit learning outcomes page
      if (data.learningOutcomes) {
        const textPageId = response.data.pages.find(
          page => page.title === 'Learning Outcomes'
        )?.traditionalTextBasedLessonPage?.id
        if (textPageId) {
          await updateTextPage({
            textPageId: textPageId,
            title: 'Learning Outcomes',
            content: generateLearningOutcomesLexicalJSON(data.learningOutcomes)
          })

          displayToast(
            'Learning Outcomes page updated successfully.',
            ToastType.INFO
          )
        }
      }
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
    } finally {
      setIsEditModalOpen(false)
      setEditChapterId('')
    }
  }

  return (
    <div className='mt-8'>
      {chapters.length === 0 ? (
        <p className='mt-8 text-gray-500'>No chapters added yet.</p>
      ) : (
        chapters.map(chapter => (
          <Accordion
            key={chapter.id}
            open={open.includes(chapter.id)}
            icon={
              <Icon
                id={chapter.id}
                open={open}
                editChapter={() => {
                  setEditChapterId(chapter.id)
                  setIsEditModalOpen(true)
                }}
                deleteChapter={deleteChapter}
                role={role}
              />
            }
            placeholder=''
            className='mb-8 rounded-lg border border-blue-gray-100'
          >
            <AccordionHeader
              onClick={() => handleOpen(chapter.id)}
              placeholder=''
              className='bg-slate-100 px-6 text-base font-medium text-slate-800'
            >
              {chapter.name}
            </AccordionHeader>
            <AccordionBody className='py-0'>
              {chapter.pages.length === 0 ? (
                role === UserRoleEnum.TEACHER ? (
                  <AddNewPageListItem chapterId={chapter.id} />
                ) : (
                  <p className='mx-6 my-4 font-semibold text-center'>
                    No pages yet
                  </p>
                )
              ) : (
                <ul className='divide-y divide-gray-200'>
                  {chapter.pages
                    .sort(function (p1, p2) {
                      return (
                        new Date(p1.createdAt).getTime() -
                        new Date(p2.createdAt).getTime()
                      )
                    })
                    .map(page => (
                      <li
                        key={page.id}
                        className='relative flex justify-between gap-x-6 py-4 px-4 hover:bg-sky-50'
                      >
                        <div className='flex min-w-0 gap-x-4'>
                          <DocumentTextIcon
                            className='h-5 w-5 flex-none text-gray-600 hover:text-gray-900'
                            aria-hidden='true'
                          />
                          <div className='min-w-0 flex-auto'>
                            <button
                              className='text-sm font-normal leading-6 text-gray-900 hover:underline'
                              onClick={() => navigate(`/pages/${page.id}`)}
                            >
                              {page.title}
                            </button>
                          </div>
                        </div>
                        <div className='flex shrink-0 items-center gap-x-2'>
                          {role === UserRoleEnum.TEACHER && (
                            <PencilSquareIcon
                              className='h-5 w-5 flex-none text-gray-400'
                              onClick={() => {
                                navigate(`/pages/edit/${page.id}`)
                              }}
                            />
                          )}
                          {role === UserRoleEnum.TEACHER && (
                            <TrashIcon
                              className='h-5 w-5 flex-none text-red-400'
                              onClick={() => {
                                deletePage(page.id)
                              }}
                            />
                          )}
                        </div>
                      </li>
                    ))}
                  {role === UserRoleEnum.TEACHER ? (
                    <AddNewPageListItem chapterId={chapter.id} />
                  ) : (
                    <></>
                  )}
                </ul>
              )}
            </AccordionBody>
          </Accordion>
        ))
      )}
      {isEditModalOpen && (
        <EditChapterModal
          chapter={chapters.find(chapter => chapter.id === editChapterId)!}
          editChapter={editChapter}
          setIsModalOpen={setIsEditModalOpen}
        />
      )}
    </div>
  )
}
