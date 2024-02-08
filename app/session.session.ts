import { createCookieSessionStorage } from '@remix-run/node'

export type UserSessionData = {
    username: string;
}

export const userSessionStorage = createCookieSessionStorage<UserSessionData>({
    cookie: {
        name: '__session',
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        path: '/',
        sameSite: 'lax',
        secrets: [process.env.SESSION_SECRET as string],
        secure: true,
    }
});