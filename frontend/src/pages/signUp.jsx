import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function SignUpForm() {
  const [error, setError] = useState("");
  const [step, setStep] = useState("register"); // "register" | "verify" | "done"
  const [registeredUsername, setRegisteredUsername] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [code, setCode] = useState("");
  const goToPage = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeat_password: "",
  });

  const handleData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.repeat_password) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    const response = await fetch("http://localhost:8000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setRegisteredUsername(data.username);
      setRegisteredEmail(formData.email);
      setStep("verify");
    } else {
      if (data.email) {
        setError(data.email[0]);
      } else if (data.username) {
        setError(data.username[0]);
      } else if (data.non_field_errors) {
        setError(data.non_field_errors[0]);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    const response = await fetch("http://localhost:8000/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: registeredUsername, code: code.trim() }),
    });

    const data = await response.json();

    if (response.ok) {
      setStep("done");
    } else {
      setError(data.error || "Verification failed. Please check your code.");
    }
  };

  // --- Step: registration form ---
  if (step === "register") {
    return (
      <div className="min-h-screen p-6 sm:p-12 md:p-20 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-amber-50 text-center">Sign up</h1>
        <form
          onSubmit={handleRegister}
          className="pt-10 sm:pt-20 flex items-center justify-center w-full"
        >
          <div className="flex flex-col gap-2 w-full max-w-sm px-4 pb-4 text-amber-50">
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <label>Username</label>
            <input
              required
              onChange={handleData}
              className="form_fields"
              type="text"
              name="username"
              id="signup-username"
              placeholder="John"
            />
            <label>Email</label>
            <input
              required
              onChange={handleData}
              className="form_fields"
              type="email"
              name="email"
              id="signup-email"
              placeholder="john@example.com"
            />
            <label>Password</label>
            <input
              required
              onChange={handleData}
              className="form_fields"
              type="password"
              name="password"
              id="signup-password"
              placeholder="Min 8 characters"
            />
            <label>Repeat Password</label>
            <input
              required
              onChange={handleData}
              className="form_fields"
              type="password"
              name="repeat_password"
              id="signup-repeat-password"
              placeholder="Repeat your password"
            />
            <button
              id="signup-submit"
              className="border text-cyan-950 border-zinc-400 rounded-md p-2 w-full bg-cyan-200 mt-4 font-semibold hover:bg-cyan-100 transition-colors cursor-pointer"
            >
              Sign up
            </button>

            <div className="flex items-center gap-3 my-1">
              <hr className="flex-1 border-zinc-600" />
              <span className="text-zinc-400 text-sm">or</span>
              <hr className="flex-1 border-zinc-600" />
            </div>

            <button
              id="goto-signin"
              type="button"
              onClick={() => goToPage("/signin")}
              className="border border-zinc-500 rounded-md p-2 w-full text-amber-50 font-semibold hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- Step: enter verification code ---
  if (step === "verify") {
    return (
      <div className="min-h-screen p-6 sm:p-12 md:p-20 flex flex-col items-center justify-center">
        <div className="flex flex-col w-full max-w-sm px-4 text-amber-50">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">Check your inbox</h1>
          <p className="text-zinc-400 text-sm text-center mb-6">
            We sent a 6-digit code to <span className="text-cyan-300">{registeredEmail}</span>.
            Enter it below to activate your account.
          </p>

          <form onSubmit={handleVerify} className="flex flex-col gap-3">
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <label>Verification code</label>
            <input
              required
              id="verify-code-input"
              className="form_fields tracking-widest text-center text-xl font-mono"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
            <button
              id="verify-submit"
              className="border text-cyan-950 border-zinc-400 rounded-md p-2 w-full bg-cyan-200 mt-2 font-semibold hover:bg-cyan-100 transition-colors cursor-pointer"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Step: success ---
  return (
    <div className="min-h-screen p-6 sm:p-12 md:p-20 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4 w-full max-w-sm px-4 text-amber-50 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Account verified</h1>
        <p className="text-zinc-300 text-sm">Your email is confirmed. You can now sign in.</p>
        <button
          id="goto-signin-after-verify"
          onClick={() => goToPage("/signin")}
          className="border text-cyan-950 border-zinc-400 rounded-md p-2 w-full bg-cyan-200 mt-4 font-semibold hover:bg-cyan-100 transition-colors cursor-pointer"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}

export default SignUpForm;
