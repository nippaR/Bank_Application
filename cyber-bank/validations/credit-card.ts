import { z } from "zod";

export const creditCardSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(4, "Full name must be at least 4 characters")
        .max(60, "Full name must be at most 60 characters")
        .regex(/^[A-Za-z\s]+$/, "Only alphabetic characters and spaces allowed"),

    dateOfBirth: z
        .string()
        .refine((value) => !isNaN(Date.parse(value)), {
            message: "Invalid date of birth",
        })
        .refine(
            (value) => {
                const dob = new Date(value);
                const today = new Date();

                if (dob > today) return false;

                let age = today.getFullYear() - dob.getFullYear();
                const monthDiff = today.getMonth() - dob.getMonth();

                if (
                    monthDiff < 0 ||
                    (monthDiff === 0 && today.getDate() < dob.getDate())
                ) {
                    age--;
                }

                return age >= 18 && age <= 65;
            },
            {
                message: "Age must be between 18 and 65 and cannot be a future date",
            }
        ),

    nicPassportNumber: z
        .string()
        .trim()
        .regex(
            /^(\d{9}[VvXx]|\d{12})$/,
            "NIC must be old format 123456789V or new format 200012345678"
        ),

    residentialAddress: z
        .string()
        .trim()
        .min(5, "Residential address is required")
        .regex(
            /^[A-Za-z0-9\s,.-]+$/,
            "Address cannot contain special symbols except commas and periods"
        ),

    mobilePhone: z
        .string()
        .trim()
        .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),

    email: z
        .string()
        .trim()
        .email("Invalid email address"),

    employmentStatus: z.enum([
        "EMPLOYED",
        "SELF_EMPLOYED",
        "STUDENT",
        "UNEMPLOYED",
    ]),

    employerName: z
        .string()
        .trim()
        .min(2, "Employer name is required"),

    monthlyIncome: z
        .string()
        .trim()
        .min(1, "Monthly income is required")
        .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
            message: "Monthly income must be greater than 0",
        }),

    city: z.string().trim().min(2, "City is required"),

    postalCode: z
        .string()
        .trim()
        .min(3, "Postal code is required")
        .max(10, "Postal code is too long"),
});

export type CreditCardInput = z.infer<typeof creditCardSchema>;