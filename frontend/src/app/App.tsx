import { useEffect, useState } from "react";
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
        <div>
          <p>Message from the backend: {backendMessage}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
