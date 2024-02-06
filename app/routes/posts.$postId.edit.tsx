import { LoaderFunctionArgs, ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { useLoaderData, Form, useNavigation } from '@remix-run/react';
import { prisma } from '~/prisma.server'
import { Input, Button, Textarea } from '@nextui-org/react';

export const loader = async (c: LoaderFunctionArgs) => {
    const postId = c.params.postId as string
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        }
    })
    if (!post) {
        throw new Response("找不到文章", {
            status: 404
        })
    }

    return json({
        post
    })
}

export const action = async (c: ActionFunctionArgs) => {
    const postId = c.params.postId as string;
    const formData = await c.request.formData()

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const slug = formData.get('slug') as string

    await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            id: slug,
            title,
            content
        }
    })

    return redirect(`/posts/${slug}`)
}

export default function Page() {
    const loaderData = useLoaderData<typeof loader>()
    const navigation = useNavigation()

    return (
        <div className="p-12">
            <Form method="POST">
                <div className="flex flex-col gap-3">
                    <Input label="slug" name="slug" defaultValue={loaderData.post.id} />
                    <Input label="标题" name="title" defaultValue={loaderData.post.title} />
                    <Textarea minRows={10} label="正文" name="content" defaultValue={loaderData.post.content} />
                    <Button type="submit" color="primary" isLoading={navigation.state === 'submitting'}>更新</Button>
                </div>
            </Form>
        </div>
    )
}
