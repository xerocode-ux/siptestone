"use client";
import { FormEvent, useState } from "react";

export default function ExecutiveLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/executive/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Invalid Executive ID or password");
      return;
    }
    window.location.href = "/executive";
  }

  return (
    <main className="shell" style={{ maxWidth: 520 }}>
      <section className="card pad" style={{ marginTop: 70 }}>
        <div className="brand">KYC Verify · Executive</div>
        <h1 style={{ marginBottom: 6 }}>Executive Login</h1>
        <p className="muted">Authorized staff only.</p>
        <form onSubmit={submit} style={{ marginTop: 24 }}>
          <label>Executive ID</label>
          <input value={id} onChange={(e) => setId(e.target.value)} autoComplete="username" required />
          <label style={{ display: "block", marginTop: 16 }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          {error && <div className="notice" style={{ marginTop: 16 }}>{error}</div>}
          <button className="btn" style={{ width: "100%", marginTop: 20 }} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
