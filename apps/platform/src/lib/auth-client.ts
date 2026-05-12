import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001',
    fetchOptions: {
        credentials: "include",
    }
})

export const { signIn, signUp, useSession, signOut } = authClient;
