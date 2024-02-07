import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { Input, Button } from '@nextui-org/react';
import { prisma } from '~/prisma.server';

export const action = async (c: ActionFunctionArgs) => {
    const formData = await c.request.formData();

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    await prisma.user.create({
        data: {
            username: username,
            password: password,
        }
    })

    return redirect("/signin")
}


export default function Signup() {
    return (
        <Form method='POST'>
            <div className="p-12 flex flex-col gap-3">
                <Input name='username' label="用户名" />
                <Input name="password" type='password' label="密码" />
                <Button type="submit" color='primary'>注册</Button>
            </div>
        </Form>
    )
}