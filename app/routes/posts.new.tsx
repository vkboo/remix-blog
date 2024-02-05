import { Button, Input, Textarea } from "@nextui-org/react";
import { Form } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { prisma } from '~/prisma.server';

export const action = async (c: ActionFunctionArgs) => {
    const formData = await c.request.formData();
    const slug = formData.get('slug') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    prisma.post.create({
        data: {
            id: slug,
            title,
            content
        }
    });

    return redirect('/');
}

export default function Page() {
    return (
        <div>
            <Form method="POST">
                <div className="flex flex-col gap-3 p-12">
                    <h1 className="text-xl font-black">发布文章</h1>
                    <Input name="slug" label="slug" />
                    <Input name="title" label="文章标题" />
                    <Textarea name="content" label="内容" />
                    <Button type="submit" color="primary">
                        发布
                    </Button>
                </div>
            </Form>
        </div>
    )
}
