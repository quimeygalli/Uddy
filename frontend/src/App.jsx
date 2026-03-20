// TODO; send data from form to backend

import "./index.css";

function App() {
  async function testRequest() {
    const res = await fetch("http://127.0.0.1:8000/api/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "test123",
        email: "test@test.com",
        password: "12345678",
        repeat_password: "12345678",
      }),
    });

    const data = await res.json();
    console.log(data);
  }

  return (
    <div>
      <h1 className="text-3xl  font-bold  text-amber-50">Sign up</h1>
      <form className="pt-20 flex items-center justify-center ">
        <div className="flex flex-col  gap-2 w-50 pb-4 text-amber-50">
          <label className="">Username</label>
          <input
            className="border border-zinc-400 rounded-md bg-amber-50"
            type="text"
            name="username"
          />
          <label>Email</label>
          <input
            className="border border-zinc-400 rounded-md bg-amber-50"
            type="text"
            name="username"
          />
          <label>Password</label>
          <input
            className="border border-zinc-400 rounded-md bg-amber-50"
            type="text"
            name="username"
          />
          <label>Repeat Password</label>
          <input
            className="border border-zinc-400 rounded-md bg-amber-50"
            type="text"
            name="username"
          />
          <button
            className="border text-cyan-950 border-zinc-400 rounded-md p-1 w-25 bg-cyan-200"
            onClick={testRequest}
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
