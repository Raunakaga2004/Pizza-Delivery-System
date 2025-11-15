import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/auth/signin`, {
        mail,
        password,
      });

      localStorage.setItem("admin_token", res.data.token);

      navigate("/admin/dashboard");

    } catch (err : any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">

        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-100">
          Admin Login
        </h1>

        {error && (
          <div className="mb-4 p-2 bg-red-900 text-red-300 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block mb-1 font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-lg outline-none focus:ring focus:ring-blue-500 bg-gray-700 text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-lg outline-none focus:ring focus:ring-blue-500 bg-gray-700 text-gray-100"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-700 text-gray-100 py-2 rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
