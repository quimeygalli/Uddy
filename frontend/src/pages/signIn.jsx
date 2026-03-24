import { useState } from "react";
import "../index.css";

function SignInForm() {
  const [error, setError] = useState("");

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    console.log(data);
  };

  return (
    <div>
      <h1 className="text-3xl  font-bold  text-amber-50">Sign in</h1>
      <form
        onSubmit={handleSubmit}
        className="pt-20 flex items-center justify-center "
      >
        <div className="flex flex-col  gap-2 w-50 pb-4 text-amber-50">
          <label className="">Username</label>
          <input
            required
            onChange={handleData}
            className="form_fields"
            type="text"
            name="username"
            placeholder="John"
          />
          <label className="">Username</label>
          <input
            required
            onChange={handleData}
            className="form_fields"
            type="password"
            name="password"
            placeholder="John"
          />
          <button className="border text-cyan-950 border-zinc-400 rounded-md p-1 w-25 bg-cyan-200">
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignInForm;
