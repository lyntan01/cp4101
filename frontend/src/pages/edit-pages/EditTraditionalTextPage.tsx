import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UpdateTextPageData, updateTextPage } from '../../api/textPage'
import { GenericButton } from '../../components/buttons'
import { LexEditor } from '../../rich-text-editor'
import { useToast } from '../../wrappers/ToastProvider'
import { Page } from '../../types/models'

interface EditTraditionalTextPageProps {
  page: Page
}

const EditTraditionalTextPage: React.FC<EditTraditionalTextPageProps> = ({
  page
}: EditTraditionalTextPageProps) => {
  const [updateTextPageData, setUpdateTextPageData] =
    useState<UpdateTextPageData>({
      textPageId: page.traditionalTextBasedLessonPage!.id,
      title: page.title,
      content: page.traditionalTextBasedLessonPage!.content
    })

  const { displayToast, ToastType } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      if (updateTextPageData.title.trim().length === 0) {
        displayToast('Page title cannot be empty!', ToastType.ERROR)
        return
      }

      const updatedPageResponse = await updateTextPage(updateTextPageData)
      displayToast('Text lesson page updated successfully.', ToastType.INFO)
      navigate(`/pages/${updatedPageResponse.data.pageId}`)
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR)
      } else {
        displayToast(
          'Text lesson page could not be updated: Unknown error.',
          ToastType.ERROR
        )
      }
      console.log(error)
    }
  }

  return (
    <div className='pb-12'>
      <h2 className='text-2xl font-bold tracking-wide text-gray-800'>
        Edit page
      </h2>
      <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
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
              value={updateTextPageData.title}
              onChange={e =>
                setUpdateTextPageData({
                  ...updateTextPageData,
                  title: e.target.value
                })
              }
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>

        <div className='sm:col-span-6'>
          <label
            htmlFor='content'
            className='block text-sm font-medium leading-6 text-gray-900'
          >
            Content
          </label>
          <div className='mt-2'>
            {updateTextPageData.content !== '' && (
              <LexEditor
                onChange={value =>
                  setUpdateTextPageData({
                    ...updateTextPageData,
                    content: value
                  })
                }
                editorStateStr={updateTextPageData.content}
              />
            )}
          </div>
        </div>
      </div>
      <div className='px-4 py-8 rounded space-y-4 flex flex-col'>
        <GenericButton
          type='submit'
          text='Edit Page'
          onClick={handleSubmit}
          className='self-center bg-sky-600 hover:bg-sky-700'
        />
      </div>
    </div>
  )
}

export default EditTraditionalTextPage
