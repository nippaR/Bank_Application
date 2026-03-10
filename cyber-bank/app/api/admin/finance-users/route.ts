//Receives user data from the frontend and creates a new finance user
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

//Schema for validating the finance user data
const createFinanceUserSchema = z.object({
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
});

//Handles POST requests to create a new finance user
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = createFinanceUserSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    errors: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const { fullName, email, phone, password } = parsed.data;

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { phone }],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email or phone already exists",
                },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                phone,
                passwordHash,
                role: "FINANCE",
                status: "ACTIVE",
            },
        });
        //Returns the created finance user
        return NextResponse.json(
            {
                success: true,
                message: "Finance user created successfully",
                data: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                },
            },
            { status: 201 }
        );
    } catch (error) {   //Handles errors
        console.error("Create finance user error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}