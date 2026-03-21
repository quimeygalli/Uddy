import { useState } from "react";
import "../index.css";

// Apparently React functions must start with an uppercase
function SignUpForm() {
  // Used to display an error (used email, used username, passwords do not match)
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeat_password: "",
  });

  const handleData = (data) => {
    setFormData({
      ...formData,
      // [] make JS evaluate the expression before inserting the result.
      [data.target.name]: data.target.value, // Very interesting React behavior.
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check password confirmation
    if (formData.password != formData.repeat_password) {
      setError("Passwords do not match");
    }
    // Add more error checks based in backend responses in the future (username, email)
    else {
      setError("");
      fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: {
          // Apparently really important. Should try axious out later
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(formData);
    }
  };

  return (
    <div>
      <h1 className="text-3xl  font-bold  text-amber-50">Sign up</h1>
      <form
        onSubmit={handleSubmit}
        className="pt-20 flex items-center justify-center "
      >
        {error && <p className="text-red-500">{error}</p>}
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
          <label>Email</label>
          <input
            required
            onChange={handleData}
            className="form_fields"
            type="email"
            name="email"
            placeholder="john@example.com"
          />
          <label>Password</label>
          <input
            required
            onChange={handleData}
            className="form_fields"
            type="password"
            name="password"
            placeholder="Min 8 char"
          />
          <label>Repeat Password</label>
          <input
            required
            onChange={handleData}
            className="form_fields"
            type="password"
            name="repeat_password"
            placeholder="Just repeat the pw"
          />
          <button className="border text-cyan-950 border-zinc-400 rounded-md p-1 w-25 bg-cyan-200">
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
export default SignUpForm;
