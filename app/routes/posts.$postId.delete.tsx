import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { prisma } from '~/prisma.server'

export const action = async (c: ActionFunctionArgs) => {
    const postId = c.params.postId as string
    await prisma.post.delete({
        where: {
            id: postId
        }
    })
    return redirect('/');
}