"use client";

import { useState } from "react";

export default function CreateFinanceUserForm() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
    });

    const [serverMessage, setServerMessage] = useState("");
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerMessage("");
        setServerError("");
        setLoading(true);

        try {
            const response = await fetch("/api/admin/finance-users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const result = await response.json();

            if (!response.ok) {
                setServerError(result.message || "Failed to create finance user");
                setLoading(false);
                return;
            }

            setServerMessage(result.message || "Finance user created");
            setForm({
                fullName: "",
                email: "",
                phone: "",
                password: "",
            });
        } catch {
            setServerError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md space-y-4 rounded-lg border p-6"
        >
            <h1 className="text-2xl font-bold">Create Finance User</h1>

            <div>
                <label className="mb-1 block">Full Name</label>
                <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full rounded border px-3 py-2"
                    required
                />
            </div>

            <div>
                <label className="mb-1 block">Email</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded border px-3 py-2"
                    required
                />
            </div>

            <div>
                <label className="mb-1 block">Phone</label>
                <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded border px-3 py-2"
                    required
                />
            </div>

            <div>
                <label className="mb-1 block">Password</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded border px-3 py-2"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded bg-blue-600 px-4 py-2 text-white"
            >
                {loading ? "Creating..." : "Create Finance User"}
            </button>

            {serverMessage && (
                <p className="text-sm text-green-600">{serverMessage}</p>
            )}

            {serverError && (
                <p className="text-sm text-red-600">{serverError}</p>
            )}
        </form>
    );
}