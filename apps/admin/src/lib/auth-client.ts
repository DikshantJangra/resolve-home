import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: '',
    fetchOptions: {
        credentials: "include",
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }
})

export const { signIn, signUp, useSession, signOut } = authClient;
