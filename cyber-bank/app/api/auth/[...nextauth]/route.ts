//Handles authentication requests
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

//Handles GET and POST requests for authentication
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };