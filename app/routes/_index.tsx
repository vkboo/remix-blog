import { LoaderFunctionArgs, json } from '@remix-run/node';
import { prisma } from '~/prisma.server';

export const loader = async (c: LoaderFunctionArgs) => {
  const posts = await prisma.post.findMany({
    orderBy: {
      created_at: "desc"
    }
  })

  return json({
    posts
  })
}
