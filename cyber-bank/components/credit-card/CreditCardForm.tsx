"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    creditCardSchema,
    type CreditCardInput,
} from "@/validations/credit-card";

export default function CreditCardForm() {
    const [serverMessage, setServerMessage] = useState("");
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreditCardInput>({
        resolver: zodResolver(creditCardSchema),
        defaultValues: {
            fullName: "",
            dateOfBirth: "",
            nicPassportNumber: "",
            residentialAddress: "",
            mobilePhone: "",
            email: "",
            employmentStatus: "EMPLOYED",
            employerName: "",
            monthlyIncome: "",
            city: "",
            postalCode: "",
        },
    });

    const onSubmit: SubmitHandler<CreditCardInput> = async (values) => {
        setServerMessage("");
        setServerError("");

        try {
            const response = await fetch("/api/credit-card/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const result = await response.json();

            if (!response.ok) {
                setServerError(result.message || "Submission failed");
                return;
            }

            setServerMessage(result.message || "Application submitted");
            reset();
        } catch {
            setServerError("Something went wrong");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-2xl space-y-4 rounded-lg border p-6"
        >
            <h1 className="text-2xl font-bold">Credit Card Application</h1>

            <div>
                <label className="mb-1 block">Full Name</label>
                <input
                    {...register("fullName")}
                    className="w-full rounded border px-3 py-2"
                />
                {errors.fullName && (
                    <p className="text-sm text-red-600">{errors.fullName.message}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block">Date of Birth</label>
                <input
                    type="date"
                    {...register("dateOfBirth")}
                    className="w-full rounded border px-3 py-2"
                />
                {errors.dateOfBirth && (
                    <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block">NIC / Passport Number</label>
                <input
                    {...register("nicPassportNumber")}
                    className="w-full rounded border px-3 py-2"
                />
                {errors.nicPassportNumber && (
                    <p className="text-sm text-red-600">
                        {errors.nicPassportNumber.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block">Residential Address</label>
                <textarea
                    {...register("residentialAddress")}
                    className="w-full rounded border px-3 py-2"
                />
                {errors.residentialAddress && (
                    <p className="text-sm text-red-600">
                        {errors.residentialAddress.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block">Mobile Phone</label>
                <input
                    {...register("mobilePhone")}
                    className="w-full rounded border px-3 py-2"
                />
                {errors.mobilePhone && (
                    <p className="text-sm text-red-600">{errors.mobilePhone.message}</p>
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
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block">Employment Status</label>
                <select
                    {...register("employmentStatus")}
                    className="w-full rounded border px-3 py-2"
                >
                    <option value="EMPLOYED">Employed</option>
                    <option value="SELF_EMPLOYED">Self Employed</option>
                    <option value="STUDENT">Student</option>
                    <option value="UNEMPLOYED">Unemployed</option>
                </select>
                {errors.employmentStatus && (
                    <p className="text-sm text-red-600">
                        {errors.employmentStatus.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block">Employer / Company Name</label>
                <input
                    {...register("employerName")}
                    className="w-full rounded border px-3 py-2"
                />
                {errors.employerName && (
                    <p className="text-sm text-red-600">{errors.employerName.message}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block">Monthly Income</label>
                <input
                    type="number"
                    step="0.01"
                    {...register("monthlyIncome")}
                    className="w-full rounded border px-3 py-2"
                />
                {errors.monthlyIncome && (
                    <p className="text-sm text-red-600">{errors.monthlyIncome.message}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block">City</label>
                <input
                    {...register("city")}
                    className="w-full rounded border px-3 py-2"
                />
                {errors.city && (
                    <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block">Postal Code</label>
                <input
                    {...register("postalCode")}
                    className="w-full rounded border px-3 py-2"
                />
                {errors.postalCode && (
                    <p className="text-sm text-red-600">{errors.postalCode.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded bg-black px-4 py-2 text-white"
            >
                {isSubmitting ? "Submitting..." : "Submit Application"}
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