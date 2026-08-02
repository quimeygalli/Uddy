import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import SignUpForm from "./pages/signUp.jsx";
import SignInForm from "./pages/signIn.jsx";
import AddSubject from "./pages/AddSubject.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import RecapPage from "./pages/RecapPage.jsx";
import SubjectPage from "./pages/SubjectPage.jsx";
import ChallengePage from "./pages/ChallengePage.jsx";
import ChallengeStudyPage from "./pages/ChallengeStudyPage.jsx";
import ChallengeHistoryPage from "./pages/ChallengeHistoryPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Does not have a sidebar */}
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/signin" element={<SignInForm />} />

        {/* Has a sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<RecapPage />} />
          <Route path="/add-subject" element={<AddSubject />} />
          <Route path="/subject/:id" element={<SubjectPage />} />
          <Route path="/challenge/:friendId" element={<ChallengePage />} />
          <Route path="/challenge-study/:challengeId" element={<ChallengeStudyPage />} />
          <Route path="/challenge-history/:friendId" element={<ChallengeHistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
