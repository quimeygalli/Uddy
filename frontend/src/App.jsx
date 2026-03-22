import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import SignUpForm from "./components/signUp.jsx";
import SignInForm from "./components/signIn.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/signin" element={<SignInForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
