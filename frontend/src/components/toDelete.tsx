import axios from "axios";
import { useEffect, useState } from "react";

function SampleComponent() {
  const [backendMessage, setBackendMessage] = useState("");

  // useEffect(() => {
  //   axios
  //     .get("/api/hello")
  //     .then((response) => {
  //       setBackendMessage(response.data.message);
  //     })
  //     .catch((error) => {
  //       console.error("There was an error!", error);
  //     });
  // }, []);

  return (
    <div className="text-center">
      <p>Message from the backend: {backendMessage}</p>
    </div>
  );
}

export default SampleComponent;
