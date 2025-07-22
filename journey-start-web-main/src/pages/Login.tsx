import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="bg-card p-8 rounded shadow-md w-full max-w-sm">
        <button
          type="button"
          className="w-full bg-red-500 text-white py-2 rounded mb-6"
          onClick={handleGoogleLogin}
        >
          Pokračovat s Google
        </button>
        <form onSubmit={handleLogin}>
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          <input
            className="w-full mb-4 p-2 border rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full mb-4 p-2 border rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <button
            className="w-full bg-primary text-white py-2 rounded"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <div className="mt-4 text-center text-sm">
        Ještě nemáš účet?{' '}
        <a href="/register" className="text-primary underline hover:text-primary/80">Registrovat</a>
      </div>
    </div>
  );
};

export default Login;
