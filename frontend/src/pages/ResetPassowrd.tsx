import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/customer/auth/reset-password/${token}`,
        { password }
      );
      setSuccess(res.data?.message || "Password reset successful.");
      
      setTimeout(() => navigate("/login"), 1500);
    } catch (err : any) {
      setError(err.response?.data?.message || "Reset failed. Token may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded shadow border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">Reset Password</h2>

        {error && <div className="mb-3 p-2 bg-red-900 text-red-300 rounded">{error}</div>}
        {success && <div className="mb-3 p-2 bg-green-900 text-green-300 rounded">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-100">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-100">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-700 text-gray-100 rounded hover:bg-blue-600 disabled:opacity-60 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-300">
          Back to{" "}
          <button onClick={() => navigate("/login")} className="text-blue-400 underline hover:text-blue-300">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
