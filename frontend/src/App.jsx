import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import SignUpForm from "./pages/signUp.jsx";
import SignInForm from "./pages/signIn.jsx";
import Homepage from "./pages/HomePage.jsx";
import AddSubject from "./pages/AddSubject.jsx";
import MainLayout from "./layout/MainLayout.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Does not have a sidebar */}
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/signin" element={<SignInForm />} />

        {/* Has a sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/add-subject" element={<AddSubject />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
