import { z } from "zod";

export const registerSchema = z
    .object({
        fullName: z
            .string()
            .trim()
            .min(4, "Full name must be at least 4 characters")
            .max(60, "Full name must be at most 60 characters")
            .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),

        email: z
            .string()
            .trim()
            .email("Invalid email address"),

        phone: z
            .string()
            .trim()
            .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export type RegisterInput = z.infer<typeof registerSchema>;