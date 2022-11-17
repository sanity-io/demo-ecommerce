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

  const pathname = slug ?? `/`;
  await session?.destroy();

  // TODO: set alternative dataset from query param?
  // TODO: add additional security to cookie to prevent preview for those that shouldn't have it!

  return new Response(null, {
    status: 307,
    headers: {Location: pathname},
  });
}
