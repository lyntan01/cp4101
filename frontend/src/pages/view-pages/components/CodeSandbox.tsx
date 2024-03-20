import React from 'react'

interface CodeSandboxProps {
  sandboxId: string
  view: string
}

const CodeSandbox: React.FC<CodeSandboxProps> = ({
  sandboxId,
  view
}: CodeSandboxProps) => {
  return (
    <div className='my-10'>
      {sandboxId.length > 0 ? (
        <iframe
          src={`https://codesandbox.io/embed/${sandboxId}?view=${view}`}
          style={{
            width: '100%',
            height: '500px',
            border: '0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}
          title='code-sandbox'
          allow='camera; encrypted-media; geolocation; microphone; payment;'
          sandbox='allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts'
        ></iframe>
      ) : (
        <></>
      )}
    </div>
  )
}

export default CodeSandbox
