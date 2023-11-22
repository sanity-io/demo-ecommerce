import { RemixServer } from "@remix-run/react";
import { createContentSecurityPolicy } from "@shopify/hydrogen";
import type { AppLoadContext, EntryContext } from "@shopify/remix-oxygen";
import isbot from "isbot";
import { renderToReadableStream } from "react-dom/server";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext
) {
  const { SANITY_PROJECT_ID: projectId } = context.env;
  const isDev = process.env.NODE_ENV === "development";

  /**
   * @see https://shopify.dev/docs/api/hydrogen/2023-10/utilities/createcontentsecuritypolicy
   */
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    imgSrc: [
      `'self'`,
      "https://cdn.shopify.com",
      "https://cdn.sanity.io",
      "https://lh3.googleusercontent.com",
    ],
    styleSrc: [`'self'`, `'unsafe-inline'`, "https://fonts.googleapis.com"],
    scriptSrc: [`'self'`, "www.instagram.com"],
    fontSrc: [`'self'`, "https://fonts.gstatic.com"],
    frameAncestors: [`'self'`, ...(isDev ? ["http://localhost:3333"] : [])],
    frameSrc: [`'self'`, "https://www.instagram.com"],
    connectSrc: [
      `'self'`,
      "https://monorail-edge.shopifysvc.com",
      `https://${projectId}.api.sanity.io`,
      `wss://${projectId}.api.sanity.io`,
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    }
  );

  if (isbot(request.headers.get("user-agent"))) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  responseHeaders.set("Content-Security-Policy", header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
