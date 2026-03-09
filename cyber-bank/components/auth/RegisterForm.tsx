"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/validations/register";

export default function RegisterForm() {
    const [serverMessage, setServerMessage] = useState("");
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: RegisterInput) => {
        setServerMessage("");
        setServerError("");

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const result = await response.json();

            if (!response.ok) {
                setServerError(result.message || "Registration failed");
                return;
            }

            setServerMessage(result.message || "Registration successful");
            reset();
        } catch {
            setServerError("Something went wrong");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md space-y-4 rounded-lg border p-6"
        >
            <h1 className="text-2xl font-bold">Register</h1>

            <div>
                <label className="mb-1 block">Full Name</label>
                <input
                    {...register("fullName")}
                    className="w-full rounded border px-3 py-2"
                />
                {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block">Email</label>
                <input
                    type="email"
                    {...register("email")}
                    className="w-full rounded border px-3 py-2"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block">Phone Number</label>
                <input
                    {...register("phone")}
                    className="w-full rounded border px-3 py-2"
                />
                {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block">Password</label>
                <input
                    type="password"
                    {...register("password")}
                    className="w-full rounded border px-3 py-2"
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block">Confirm Password</label>
                <input
                    type="password"
                    {...register("confirmPassword")}
                    className="w-full rounded border px-3 py-2"
                />
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded bg-black px-4 py-2 text-white"
            >
                {isSubmitting ? "Submitting..." : "Register"}
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