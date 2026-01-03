import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" } // "admin" or "customer"
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const role = credentials.role || "customer" // Default to customer

        if (role === "admin") {
          // Check AdminUser
          const admin = await db.adminUser.findUnique({
            where: { email: credentials.email }
          })

          if (!admin) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            admin.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: "admin",
          }
        } else {
          // Check User (customer)
          const user = await db.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: "customer",
          }
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // Default to customer login
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = ((user as any).role as "admin" | "customer") || "customer"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role || "customer") as "admin" | "customer"
      }
      return session
    },
  },
}

