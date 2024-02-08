import { LoaderFunctionArgs, ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { useLoaderData, Form, useNavigation, useFetcher } from '@remix-run/react'
import { prisma } from '~/prisma.server'
import { Input, Button, Textarea } from '@nextui-org/react'
import { auth } from '~/serssion.server'

export const loader = async (c: LoaderFunctionArgs) => {
    const user = await auth(c.request);
    if (!user.username) {
        return redirect('/');
    }

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
    const postId = c.params.postId as string
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

    const deleteFetcher = useFetcher()

    const isUpdating = navigation.state === 'submitting' && navigation.formData?.get('action') === 'edit'
    const isDeleting = deleteFetcher.state === 'submitting'

    return (
        <div className="p-12">
            <Form method="POST">
                <div className="flex flex-col gap-3">
                    <Input label="slug" name="slug" defaultValue={loaderData.post.id} />
                    <Input label="标题" name="title" defaultValue={loaderData.post.title} />
                    <Textarea minRows={10} label="正文" name="content" defaultValue={loaderData.post.content} />
                    <Button name="action" value="edit" type="submit" color="primary" isLoading={isUpdating}>更新</Button>
                </div>
            </Form>
            <div>
                <deleteFetcher.Form className="mt-1 flex flex-col" method="POST" action={`/posts/${loaderData.post.id}/delete`}>
                    <Button name="action" value="delete" isLoading={isDeleting} type="submit" color="danger">删除</Button>
                </deleteFetcher.Form>
            </div>
        </div>
    )
}
