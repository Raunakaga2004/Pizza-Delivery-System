import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [mail, setMail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!mail) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/customer/auth/forgot-password`,
        { mail }
      );
      setSuccess(res.data?.message || "If the email exists, a reset link was sent.");
    } catch (err : any) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">Forgot Password</h2>

        {error && <div className="mb-3 p-2 bg-red-900 text-red-300 rounded">{error}</div>}
        {success && <div className="mb-3 p-2 bg-green-900 text-green-300 rounded">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-100">Email</label>
            <input
              type="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-700 text-gray-100 rounded hover:bg-blue-600 disabled:opacity-60 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-300">
          Remembered your password?{" "}
          <button onClick={() => navigate("/login")} className="text-blue-400 underline hover:text-blue-300">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
