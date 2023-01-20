import {
  type HydrogenApiRouteOptions,
  type HydrogenRequest,
} from '@shopify/hydrogen';

export async function api(
  request: HydrogenRequest,
  {session}: HydrogenApiRouteOptions,
) {
  const corsOrigin = import.meta.env.PUBLIC_PREVIEW_URL;

  const headers = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Credentials': 'true',
  };

  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  const slug = url.searchParams.get('slug');
  const previewSecret = import.meta.env.PUBLIC_PREVIEW_SECRET;

  if (!secret || secret !== previewSecret) {
    return new Response(JSON.stringify({message: 'Invalid Secret'}), {
      headers,
      status: 401,
    });
  }

  if (!slug) {
    return new Response(JSON.stringify({message: 'No slug in query'}), {
      headers,
      status: 401,
    });
  }

  const pathname = `/${slug}` ?? `/`;
  await session?.set('preview', `${true}`);

  // TODO: set alternative dataset from query param?
  // TODO: add additional security to cookie to prevent preview for those that shouldn't have it!

  return new Response(null, {
    status: 307,
    headers: {Location: pathname},
  });
}
