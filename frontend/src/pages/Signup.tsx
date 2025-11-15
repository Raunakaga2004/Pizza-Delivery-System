import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const nameRef = useRef<any>(null);

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [cooldown, setCooldown] = useState(0);

  const handleSubmit = async (e : any) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/customer/auth/signup`,
        { name, mail, password }
      );

      setStep("verify");
      setSuccess("Account created! Please verify your email.");
      startCooldown();

    } catch (err : any) {
      setError(err.response?.data?.message || "Something went wrong.");
    }

    setLoading(false);
  };

  const startCooldown = () => {
    setCooldown(30);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/customer/auth/resend-verification`,
        { mail }
      );

      setSuccess("Verification email resent successfully!");
      startCooldown();

    } catch (err) {
      setError("Unable to resend. Try again.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">

        {step === "form" && (
          <>
            <h1 className="text-2xl font-semibold text-center mb-6 text-gray-100">
              Create Your Account
            </h1>

            {error && <div className="p-2 mb-4 bg-red-900 text-red-300 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block font-medium mb-1 text-gray-300">Full Name</label>
                <input
                  type="text"
                  ref={nameRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-600 rounded-xl outline-none focus:ring focus:ring-blue-500 bg-gray-700 text-gray-100"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-300">Email</label>
                <input
                  type="email"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-600 rounded-xl outline-none focus:ring focus:ring-blue-500 bg-gray-700 text-gray-100"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-300">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full p-2 border border-gray-600 rounded-xl outline-none focus:ring focus:ring-blue-500 pr-10 bg-gray-700 text-gray-100"
                  />

                  <span
                    onClick={() => setShowPass((prev) => !prev)}
                    className="absolute right-3 top-2 text-sm cursor-pointer text-gray-400"
                  >
                    {showPass ? "Hide" : "Show"}
                  </span>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full py-2 bg-blue-700 text-gray-100 rounded-xl font-medium hover:bg-blue-600 transition disabled:opacity-40"
              >
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </form>

            <p className="mt-4 text-center text-gray-300">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          </>
        )}

        {step === "verify" && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Verify Your Email</h2>

            <p className="text-gray-300 mb-3">
              We've sent a verification link to:
            </p>

            <p className="font-semibold mb-3 text-gray-100">{mail}</p>

            <p className="text-sm text-gray-400 mb-6">
              Please open your inbox and click on the link to activate your account.
              You cannot log in until your email is verified.
            </p>

            {success && (
              <div className="p-2 mb-4 bg-green-900 text-green-300 rounded">
                {success}
              </div>
            )}

            {error && (
              <div className="p-2 mb-4 bg-red-900 text-red-300 rounded">
                {error}
              </div>
            )}

            <button
              disabled={cooldown > 0}
              onClick={handleResend}
              className={`w-full py-2 rounded-xl text-gray-100 font-medium transition
                ${cooldown > 0 ? "bg-gray-600" : "bg-blue-700 hover:bg-blue-600"}`}
            >
              {cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Resend Verification Email"}
            </button>

            <p className="mt-6 text-center text-sm text-gray-300">
              Already verified?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Login now
              </span>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
