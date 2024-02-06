import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '~/prisma.server'
import ReactMarkdown from 'react-markdown'

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

export default function PostDetail() {
    const loaderData = useLoaderData<typeof loader>()
    return (
        <div className="p-12">
            <div className="prose">
                <h1>{loaderData.post.title}</h1>
                <ReactMarkdown>{loaderData.post.content}</ReactMarkdown>
            </div>
        </div>
    )
}