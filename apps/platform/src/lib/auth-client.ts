import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001',
    fetchOptions: {
        credentials: "include",
        onRequest(options: any) {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('auth_token')
                if (token) {
                    console.log(`[AuthClient] Attaching Bearer token to ${options.method} request: ${options.baseURL}`)
                    options.headers = {
                        ...(options.headers || {}),
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        }
    }
})

export const { signIn, signUp, useSession, signOut } = authClient;
