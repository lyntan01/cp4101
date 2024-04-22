import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { UserRoleEnum } from '../../../types/models'
import { EditChapterData } from '../../../api/chapter'

export function Icon ({
  id,
  open,
  editChapter,
  deleteChapter,
  role
}: {
  id: string
  open: string[]
  editChapter: (chapterId: string, data: EditChapterData) => void
  deleteChapter: (chapterId: string) => void
  role: UserRoleEnum
}) {
  return (
    <div className='flex'>
      {/* Arrow Icon */}
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={2}
        stroke='currentColor'
        className={`${
          open.includes(id) ? 'rotate-180' : ''
        } h-5 w-5 transition-transform`}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M19.5 8.25l-7.5 7.5-7.5-7.5'
        />
      </svg>

      {/* Delete Icon */}
      {role === UserRoleEnum.TEACHER && (
        <div className='flex flex-row'>
          <PencilSquareIcon
            className='h-5 w-5 text-gray-500 ml-2'
            onClick={() =>
              editChapter(id, {
                name: 'Edited Chapter',
                learningOutcomes: ['TEST']
              })
            }
          />
          <TrashIcon
            className='h-5 w-5 text-red-500 ml-2'
            onClick={() => deleteChapter(id)}
          />
        </div>
      )}
    </div>
  )
}
