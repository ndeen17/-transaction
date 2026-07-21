import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { WizardPanel } from "../components/ui/WizardPanel";
import { Logo } from "../components/Logo";
import { ApiRequestError, login } from "../lib/api";

export function LoginPage() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await login(loginId.trim(), password);
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("authUser", JSON.stringify(result.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[480px]">
      <div className="mb-4 flex items-center justify-between px-1">
        <Link to="/">
          <Logo />
        </Link>
        <Link to="/" className="text-sm text-muted hover:text-ink">
          Cancel
        </Link>
      </div>

      <WizardPanel>
        <div className="flex justify-center">
          <Badge>Welcome back</Badge>
        </div>
        <h1 className="mt-4 text-center text-2xl font-medium tracking-tight text-ink sm:text-[28px]">
          Log in to your account
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-center text-sm leading-relaxed text-muted">
          Enter your login ID and password to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Login ID</span>
            <input
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              autoComplete="username"
              required
              className="w-full rounded-2xl border border-[#EEF1F5] bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-blue-500"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-2xl border border-[#EEF1F5] bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-blue-500"
            />
          </label>

          {error && <p className="rounded-xl bg-[#FDEEEE] px-4 py-3 text-sm text-[#F2555A]">{error}</p>}

          <Button type="submit" loading={submitting} className="w-full justify-center" withArrow>
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </WizardPanel>
    </div>
  );
}
