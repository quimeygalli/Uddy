import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function SignInForm() {
  const [error, setError] = useState("");
  const goToPage = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleData = (data) => {
    setFormData({
      ...formData,
      [data.target.name]: data.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const response = await fetch("http://localhost:8000/api/signin", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      goToPage("/");
    } else if (response.status === 403) {
      setError(data.error || "Please verify your email before signing in.");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="min-h-screen p-6 sm:p-12 md:p-20 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-amber-50 text-center">Sign in</h1>
      <form
        onSubmit={handleSubmit}
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
            id="signin-username"
            placeholder="..."
          />
          <label>Password</label>
          <input
            required
            onChange={handleData}
            className="form_fields"
            type="password"
            name="password"
            id="signin-password"
            placeholder="..."
          />
          <button
            id="signin-submit"
            className="border text-cyan-950 border-zinc-400 rounded-md p-2 w-full bg-cyan-200 mt-4 font-semibold hover:bg-cyan-100 transition-colors cursor-pointer"
          >
            Sign in
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <hr className="flex-1 border-zinc-600" />
            <span className="text-zinc-400 text-sm">or</span>
            <hr className="flex-1 border-zinc-600" />
          </div>

          <button
            id="goto-signup"
            type="button"
            onClick={() => goToPage("/signup")}
            className="border border-zinc-500 rounded-md p-2 w-full text-amber-50 font-semibold hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Create an account
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignInForm;
