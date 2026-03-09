import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/validations/register";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const parsed = registerSchema.safeParse(body);

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
                role: "CUSTOMER",
                status: "PENDING",
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Registration submitted successfully. Wait for admin approval.",
                data: {
                    id: user.id,
                    email: user.email,
                    status: user.status,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}