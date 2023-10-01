import React, {useState, useEffect} from "react";
import { Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

const Editor = () => {
  const [darkMode, setDarkMode] = useState()

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw />
    </div>
  );
};

export default Editor;
