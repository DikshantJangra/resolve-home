import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_API_URL,
    fetchOptions: {
        credentials: "include"
    }
})

export const { signIn, signUp, useSession, signOut } = authClient;
