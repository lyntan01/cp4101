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
            content: index,
            isBinary: false,
          },
          "src/App.js": {
            content: app,
            isBinary: false,
          },
          "src/styles.css": {
            content: css,
            isBinary: false,
          },
          "public/index.html": {
            content: html,
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

const app = `import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`;

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

const css = `.App {
  font-family: sans-serif;
  text-align: center;
}`;

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
