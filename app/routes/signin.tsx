import { json, ActionFunctionArgs, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { Input, Button } from '@nextui-org/react'
import { prisma } from '~/prisma.server'
import { userSessionStorage } from '~/session.session'

export const action = async (c: ActionFunctionArgs) => {
    const formData = await c.request.formData()
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        }
    })
    if (!user || user.password !== password) {
        return json({
            success: false,
            errors: {
                password: '用户名密码不正确',
            }
        })
    }
    const cookie = c.request.headers.get('Cookie');
    const session = await userSessionStorage.getSession(cookie);
    session.set('username', username);

    return redirect('/', {
        headers: {
            'Set-Cookie': await userSessionStorage.commitSession(session),
        }
    })
}

export default function Signin() {
    const actionData = useActionData<typeof action>()

    return (
        <Form method='POST'>
            <div className="flex flex-col gap-3 p-12">
                <Input label="用户名" name="username" />
                <Input label="密码" name="password" type="password" />
                <Button color='primary' type="submit">登录</Button>
            </div>
        </Form>
    )
}