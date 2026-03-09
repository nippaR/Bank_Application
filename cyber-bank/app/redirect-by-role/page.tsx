import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RedirectByRolePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const role = (session.user as any).role;

    if (role === "ADMIN") {
        redirect("/admin/dashboard");
    }

    if (role === "FINANCE") {
        redirect("/finance/dashboard");
    }

    redirect("/customer/dashboard");
}