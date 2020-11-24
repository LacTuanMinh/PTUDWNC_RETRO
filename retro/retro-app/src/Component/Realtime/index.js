import React, { useEffect, useState } from 'react';
import socketIOClient from "socket.io-client";
// import {socket } from '../BoardContent/index'
const ENDPOINT = "http://localhost:8000";
function TimeCounter() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      setResponse(data);
    });
  }, []);

  return (
    <p>
      It's <time dateTime={response}>{response}</time>
    </p>
  );
}

export default TimeCounter;