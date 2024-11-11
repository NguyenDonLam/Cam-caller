import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { v4 } from "uuid";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/documents/${v4()}`} />} />
        <Route path="/documents/:id" element={<div />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
