export const TextWithMonospace = ({ text }: { text: string }) => {
  // Split the text by backticks and process each segment
  const parts = text.split(/(`.*?`)/g)

  return (
    <div className='whitespace-pre-wrap'>
      {parts.map((part, index) => {
        // Check if the part is code (enclosed in backticks)
        if (part.startsWith('`') && part.endsWith('`')) {
          // Remove the backticks and wrap in a <span> with monospace styling
          return (
            <span
              key={index}
              className='font-mono bg-gray-200 px-1 rounded-md font-normal'
            >
              {part.substring(1, part.length - 1)}
            </span>
          )
        } else {
          // Render the text as is
          return part
        }
      })}
    </div>
  )
}
