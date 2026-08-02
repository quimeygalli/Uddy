import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../index.css";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const goToPage = useNavigate();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the link.");
      return;
    }

    fetch(`http://localhost:8000/api/verify-email?token=${token}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully.");
        } else {
          setStatus("error");
          setMessage(data.error || "The link is invalid or has already been used.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen p-6 sm:p-12 md:p-20 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4 w-full max-w-sm px-4 text-amber-50 text-center">
        {status === "loading" && (
          <>
            <div className="text-5xl animate-spin">⟳</div>
            <h1 className="text-2xl font-bold">Verifying your email…</h1>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-5xl">✅</div>
            <h1 className="text-2xl font-bold">You're verified!</h1>
            <p className="text-zinc-300 text-sm">{message}</p>
            <button
              id="verified-goto-signin"
              onClick={() => goToPage("/signin")}
              className="border text-cyan-950 border-zinc-400 rounded-md p-2 w-full bg-cyan-200 mt-4 font-semibold hover:bg-cyan-100 transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-5xl">❌</div>
            <h1 className="text-2xl font-bold">Verification failed</h1>
            <p className="text-zinc-300 text-sm">{message}</p>
            <button
              id="verify-error-goto-signin"
              onClick={() => goToPage("/signin")}
              className="border border-zinc-500 rounded-md p-2 w-full text-amber-50 font-semibold hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Back to Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;
