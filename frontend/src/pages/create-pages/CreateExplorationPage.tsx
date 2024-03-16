import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getChapterById } from '../../api/chapter'
import { LexEditor } from '../../rich-text-editor'
import { Chapter } from '../../types/models'
import { useToast } from '../../wrappers/ToastProvider'
import { GenericButton } from '../../components/buttons'
import {
  CreateExplorationPageData,
  createExplorationPage
} from '../../api/explorationPage'
import { MonacoEditor } from '../../components/monaco-editor'

const CreateExplorationPage: React.FC = () => {
  const { chapterId } = useParams()
  const [chapter, setChapter] = useState<Chapter>()
  const [explorationPageData, setExplorationPageData] =
    useState<CreateExplorationPageData>({
      title: '',
      chapterId: chapterId ?? '',
      instructions: '',
      sandboxId: ''
    })

  const { displayToast, ToastType } = useToast()
  const navigate = useNavigate()

  const fetchChapter = async () => {
    try {
      const response = await getChapterById(chapterId ?? '')
      setChapter(response.data)
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
      if (explorationPageData.title.trim().length === 0) {
        displayToast('Page title cannot be empty!', ToastType.ERROR)
        return
      }
      const newPageResponse = await createExplorationPage(explorationPageData)
      displayToast('Exploration page created successfully.', ToastType.INFO)
      navigate(`/pages/${newPageResponse.data.pageId}`)
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR)
      } else {
        displayToast(
          'Exploration page could not be created: Unknown error.',
          ToastType.ERROR
        )
      }
      console.log(error)
    }
  }

  useEffect(() => {
    fetchChapter()
  })

  return (
    <div className='pb-12'>
      <h2 className='text-2xl font-bold tracking-wide text-gray-800'>
        Create new exploration page
      </h2>
      <p className='mt-1 text-sm leading-6 font-light tracking-wide text-gray-600'>
        in {chapter?.name}
      </p>
      <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6'>
        <div className='sm:col-span-4'>
          <label
            htmlFor='title'
            className='block text-sm font-medium leading-6 text-gray-900'
          >
            Page Title
          </label>
          <div className='mt-2'>
            <input
              id='title'
              name='title'
              type='text'
              value={explorationPageData.title}
              onChange={e =>
                setExplorationPageData({
                  ...explorationPageData,
                  title: e.target.value
                })
              }
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>

        <div className='sm:col-span-6'>
          <label
            htmlFor='instructions'
            className='block text-sm font-medium leading-6 text-gray-900'
          >
            Exploration Instructions
          </label>
          <div className='mt-2'>
            <LexEditor
              onChange={value =>
                setExplorationPageData({
                  ...explorationPageData,
                  instructions: value
                })
              }
              editorStateStr={explorationPageData.instructions}
            />
          </div>
        </div>

        <div className='sm:col-span-4'>
          <label
            htmlFor='sandboxId'
            className='block text-sm font-medium leading-6 text-gray-900'
          >
            Code Sandbox ID
          </label>
          <div className='mt-2'>
            <input
              id='sandboxId'
              name='sandboxId'
              type='text'
              placeholder='e.g. 5jgmjp'
              value={explorationPageData.sandboxId}
              onChange={e =>
                setExplorationPageData({
                  ...explorationPageData,
                  sandboxId: e.target.value
                })
              }
              className='block w-2/12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>
      </div>
      <div className='px-4 py-8 rounded space-y-4 flex flex-col'>
        <GenericButton
          type='submit'
          text='Create Page'
          onClick={handleSubmit}
          className='self-center bg-sky-600 hover:bg-sky-700'
        />
      </div>
    </div>
  )
}

export default CreateExplorationPage
