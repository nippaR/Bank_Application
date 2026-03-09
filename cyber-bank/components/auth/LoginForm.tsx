"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError("");
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setServerError(result.error);
            return;
        }

        window.location.href = "/redirect-by-role";
    };

    return (
        <form
            onSubmit={handleLogin}
            className="max-w-md space-y-4 rounded-lg border p-6"
        >
            <h1 className="text-2xl font-bold">Login</h1>

            <div>
                <label className="mb-1 block">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                    required
                />
            </div>

            <div>
                <label className="mb-1 block">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded bg-black px-4 py-2 text-white"
            >
                {loading ? "Logging in..." : "Login"}
            </button>

            {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        </form>
    );
}