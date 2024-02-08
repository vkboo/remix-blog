import { userSessionStorage } from './session.session'

export const auth = async (request: Request) => {
    const cookie = request.headers.get('Cookie')
    const session = await userSessionStorage.getSession(cookie)
    const username = session.get('username')
    return { username }
}