import { useState } from "react";

export default function AuthForm({ mode, onSuccess }) {
  // mode = "login" или "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Выбор URL: /api/auth/register или /api/auth/login
    const url = mode === "register"
      ? "/api/auth/register"
      : "/api/auth/login";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || "Something went wrong");
      }
      // Вызываем onSuccess из родительского компонента, передаем токен + user
      onSuccess(data.access_token, data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl mb-4 text-center">
        {mode === "login" ? "Login" : "Register"}
      </h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border px-3 py-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        {mode === "login" ? (
          <>
            Don’t have an account?{" "}
            <button onClick={() => onSuccess("switch", null)} className="text-blue-600">
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button onClick={() => onSuccess("switch", null)} className="text-blue-600">
              Login
            </button>
          </>
        )}
      </p>
    </div>
  );
}