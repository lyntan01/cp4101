import React, { useState } from "react";
import { GenericButton } from "../../components/buttons";

const CodeSandboxButton: React.FC = () => {
  const [sandboxId, setSandboxId] = useState("");

  const createSandbox = () => {
    fetch("https://codesandbox.io/api/v1/sandboxes/define?json=1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        files: {
          "package.json": {
            content: JSON.stringify({
              dependencies: {
                react: "latest",
                "react-dom": "latest",
              },
            }),
            isBinary: false,
          },
          "src/index.js": {
            content: `import { StrictMode } from "react";
            import { createRoot } from "react-dom/client";

            import App from "./App";

            const rootElement = document.getElementById("root");
            const root = createRoot(rootElement);

            root.render(
              <StrictMode>
                <App />
              </StrictMode>
            );
            `,
            isBinary: false,
          },
          "src/App.js": {
            content: `import { sculptureList } from './data.js';

          export default function App() {
            let index = 0;

            function handleClick() {
              index = index + 1;
            }

            let sculpture = sculptureList[index];
            return (
              <>
                <button onClick={handleClick}>
                  Next
                </button>
                <h2>
                  <i>{sculpture.name} </i> 
                  by {sculpture.artist}
                </h2>
                <h3>  
                  ({index + 1} of {sculptureList.length})
                </h3>
                <img 
                  src={sculpture.url} 
                  alt={sculpture.alt}
                />
                <p>
                  {sculpture.description}
                </p>
              </>
            );
          }`,
            isBinary: false,
          },
          "src/data.js": {
            content: `export const sculptureList = [{
            name: 'Homenaje a la Neurocirugía',
            artist: 'Marta Colvin Andrade',
            description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
            url: 'https://i.imgur.com/Mx7dA2Y.jpg',
            alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
          }, {
            name: 'Floralis Genérica',
            artist: 'Eduardo Catalano',
            description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
            url: 'https://i.imgur.com/ZF6s192m.jpg',
            alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
          }, {
            name: 'Eternal Presence',
            artist: 'John Woodrow Wilson',
            description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
            url: 'https://i.imgur.com/aTtVpES.jpg',
            alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
          }];`,
            isBinary: false,
          },
          "public/index.html": {
            content: `<!DOCTYPE html>
            <html lang="en">

            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
              <meta name="theme-color" content="#000000">
              
              <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
              <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
              
              <title>React App</title>
            </head>

            <body>
              <noscript>
                You need to enable JavaScript to run this app.
              </noscript>
              <div id="root"></div>
            </body>

            </html>
            `,
            isBinary: false,
          },
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSandboxId(data.sandbox_id);
        console.log(data); // For demonstration, log the response data

        // Example response data:
        // {sandbox_id: '5jgmjp'}
      })
      .catch((error) => console.error("Error creating sandbox:", error));
  };

  return (
    <div className="mt-10">
      <GenericButton
        onClick={createSandbox}
        text="Create Sandbox"
        type="button"
      />
      {sandboxId.length > 0 ? (
        <iframe
          src={`https://codesandbox.io/embed/${sandboxId}?view=Editor+%2B+Preview`}
          style={{
            width: "100%",
            height: "500px",
            border: "0",
            borderRadius: "4px",
            overflow: "hidden",
          }}
          title="code-sandbox"
          allow="camera; encrypted-media; geolocation; microphone; payment;"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        ></iframe>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CodeSandboxButton;

const index = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

const html = `<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="theme-color" content="#000000">
	
	<link rel="manifest" href="%PUBLIC_URL%/manifest.json">
	<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
	
	<title>React App</title>
</head>

<body>
	<noscript>
		You need to enable JavaScript to run this app.
	</noscript>
	<div id="root"></div>
</body>

</html>
`;

const appStateExercise = `import { sculptureList } from './data.js';

export default function App() {
  let index = 0;

  function handleClick() {
    index = index + 1;
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        by {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}`;

const dataStateExercise = `export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}];`;
