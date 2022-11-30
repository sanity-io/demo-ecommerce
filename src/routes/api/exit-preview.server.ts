import {
  type HydrogenApiRouteOptions,
  type HydrogenRequest,
} from '@shopify/hydrogen';

export async function api(
  request: HydrogenRequest,
  {session}: HydrogenApiRouteOptions,
) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');

  if (!slug) {
    return new Response(JSON.stringify({message: 'No slug in query'}), {
      status: 401,
    });
  }

  if (!slug.startsWith('/')) {
    return new Response(JSON.stringify({message: 'Slug must be a URL path'}), {
      status: 401,
    });
  }

  await session?.destroy();

  // TODO: set alternative dataset from query param?
  // TODO: add additional security to cookie to prevent preview for those that shouldn't have it!

  return new Response(null, {
    status: 307,
    headers: {Location: slug},
  });
}
