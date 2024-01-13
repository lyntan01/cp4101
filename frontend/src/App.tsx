import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [backendMessage, setBackendMessage] = useState("");

  useEffect(() => {
    axios
      .get("/api/hello")
      .then((response) => {
        setBackendMessage(response.data.message);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>
          <p>Message from the backend: {backendMessage}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
