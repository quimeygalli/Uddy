import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function SignInForm() {
  const [error, setError] = useState("");
  const goToHomepage = useNavigate();

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

    const response = await fetch("http://localhost:8000/api/signin", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    if (response.ok) {
      // If the user exists, go to homepage

      goToHomepage("/");
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
          <label className="">Username</label>
          <input
            required
            onChange={handleData}
            className="form_fields"
            type="text"
            name="username"
            placeholder="..."
          />
          <label className="">Password</label>
          <input
            required
            onChange={handleData}
            className="form_fields"
            type="password"
            name="password"
            placeholder="..."
          />
          <button className="border text-cyan-950 border-zinc-400 rounded-md p-2 w-full bg-cyan-200 mt-4 font-semibold hover:bg-cyan-100 transition-colors cursor-pointer">
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignInForm;
