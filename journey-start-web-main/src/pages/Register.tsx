import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) setError(error.message);
    else setSuccess(true);
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
        <form onSubmit={handleRegister}>
          <h2 className="text-2xl font-bold mb-6">Registrace</h2>
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
            placeholder="Heslo"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-600 mb-4">Zkontroluj svůj email pro potvrzení registrace.</div>}
          <button
            className="w-full bg-primary text-white py-2 rounded"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registruji..." : "Registrovat"}
          </button>
        </form>
      </div>
      <div className="mt-4 text-center text-sm">
        Máš už účet?{' '}
        <a href="/login" className="text-primary underline hover:text-primary/80">Přihlásit se</a>
      </div>
    </div>
  );
};

export default Register; 