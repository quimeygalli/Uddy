import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import SignUpForm from "./pages/signUp.jsx";
import SignInForm from "./pages/signIn.jsx";
import Homepage from "./pages/homepage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
