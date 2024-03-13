import { useState } from 'react'
import { PageTypeEnum } from '../../../types/models'
import { RadioGroup } from '@headlessui/react'

interface AddNewPageModalProps {
  setIsModalOpen: (isModalOpen: boolean) => void
  navigateToCreatePage: (pageType: PageTypeEnum) => void
}

export const AddNewPageModal: React.FC<AddNewPageModalProps> = ({
  setIsModalOpen,
  navigateToCreatePage
}) => {
  const [pageType, setPageType] = useState<PageTypeEnum>(
    PageTypeEnum.TRADITIONAL_TEXT_BASED_LESSON
  )

  const options = [
    {
      name: 'Text Page',
      description: 'Contains rich text to explain concepts and examples',
      pageTypeEnum: PageTypeEnum.TRADITIONAL_TEXT_BASED_LESSON
    },
    {
      name: 'Exercise Page',
      description:
        'Contains an exercise with a code sandbox for students to apply their knowledge',
      pageTypeEnum: PageTypeEnum.EXERCISE
    },
    {
      name: 'Exploration Page',
      description:
        'Contains a code sandbox for students to explore with no set instructions',
      pageTypeEnum: PageTypeEnum.EXPLORATION
    }
  ]

  return (
    <div className='fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none'>
      <div className='fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none'>
        <div className='fixed inset-0 bg-gray-500 opacity-75'></div>
        <div className='relative bg-white p-5 rounded-lg shadow-md h-42 w-6/12'>
          <div className='flex flex-col items-start justify-between gap-3'>
            <h3 className='text-lg font-semibold leading-6 text-gray-900'>
              Select Type of New Page
            </h3>

            <div className='w-full mt-3 mb-3'>
              <RadioGroup value={pageType} onChange={setPageType}>
                <RadioGroup.Label className='sr-only'>
                  Privacy option
                </RadioGroup.Label>
                <div className='-space-y-px rounded-md bg-white'>
                  {options.map((option, optionIndex) => (
                    <RadioGroup.Option
                      key={option.name}
                      value={option.pageTypeEnum}
                      className={({ checked }) =>
                        classNames(
                          optionIndex === 0
                            ? 'rounded-tl-md rounded-tr-md'
                            : '',
                          optionIndex === options.length - 1
                            ? 'rounded-bl-md rounded-br-md'
                            : '',
                          checked
                            ? 'z-10 border-indigo-200 bg-indigo-50'
                            : 'border-gray-200',
                          'relative flex cursor-pointer border p-4 focus:outline-none'
                        )
                      }
                    >
                      {({ active, checked }) => (
                        <>
                          <span
                            className={classNames(
                              checked
                                ? 'bg-indigo-600 border-transparent'
                                : 'bg-white border-gray-300',
                              active
                                ? 'ring-2 ring-offset-2 ring-indigo-600'
                                : '',
                              'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center'
                            )}
                            aria-hidden='true'
                          >
                            <span className='rounded-full bg-white w-1.5 h-1.5' />
                          </span>
                          <span className='ml-3 flex flex-col'>
                            <RadioGroup.Label
                              as='span'
                              className={classNames(
                                checked ? 'text-indigo-900' : 'text-gray-900',
                                'block text-sm font-medium'
                              )}
                            >
                              {option.name}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                              as='span'
                              className={classNames(
                                checked ? 'text-indigo-700' : 'text-gray-500',
                                'block text-sm'
                              )}
                            >
                              {option.description}
                            </RadioGroup.Description>
                          </span>
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
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
              disabled={pageType === null}
              className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none
                ${
                  pageType === null
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500'
                }`}
              onClick={() => navigateToCreatePage(pageType)}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function classNames (...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
