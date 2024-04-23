import { lazy } from "react";
import { ModeToggle } from "./components/mode-toggle";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";

const HomePage = lazy(() => import("./pages/home"));
const PollPage = lazy(() => import("./pages/poll"));

function App() {
  return (
    <>
      <Toaster />

      <header className="flex w-full justify-end p-2">
        <ModeToggle />
      </header>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/poll/:id" element={<PollPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
