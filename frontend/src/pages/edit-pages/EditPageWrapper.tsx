import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Page, User } from '../../types/models'
import { useToast } from '../../wrappers/ToastProvider'
import { getPageById } from '../../api/page'
import { convertPageContentToLexicalJson } from '../../utils/convertMarkdownToLexicalJson'
import { useAuth } from '../../wrappers/AuthContext'
import EditTraditionalTextPage from './EditTraditionalTextPage'

const EditPageWrapper: React.FC = () => {
  const { pageId } = useParams()
  const [page, setPage] = useState<Page>()

  const { user } = useAuth<User>()

  const { displayToast, ToastType } = useToast()

  const getPage = async () => {
    try {
      const response = await getPageById(pageId ?? '')
      const page = response.data

      // Check if the page content is in Markdown, and convert to Lexical JSON if true
      const updatedPage = await convertPageContentToLexicalJson(page)

      setPage(updatedPage)
    } catch (error) {
      displayToast(
        'Page could not be retrieved from the server.',
        ToastType.ERROR
      )
      console.log(error)
    }
  }

  useEffect(() => {
    getPage()
  }, [pageId])

  if (user?.role === 'STUDENT') {
    return (
      <h2 className='text-xl font-bold tracking-wide text-red-600'>
        You are not allowed to edit this page.
      </h2>
    )
  }

  if (page && page.chapter) {
    if (page.type === 'TRADITIONAL_TEXT_BASED_LESSON') {
      return <EditTraditionalTextPage page={page} />
    } else if (page.type === 'EXERCISE') {
      // return <EditExercisePage />;
    } else if (page.type === 'EXPLORATION') {
      // return <EditExplorationPage />;
    }

    return <></>
  }

  return <></>
}

export default EditPageWrapper
