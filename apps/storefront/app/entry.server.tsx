import { RemixServer } from "@remix-run/react";
import { createContentSecurityPolicy } from "@shopify/hydrogen";
import type { EntryContext } from "@shopify/remix-oxygen";
import isbot from "isbot";
import { renderToReadableStream } from "react-dom/server";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    imgSrc: ["https://cdn.shopify.com", "https://cdn.sanity.io"],
    styleSrc: [`'self'`, `'unsafe-inline'`, "https://fonts.googleapis.com"],
    scriptSrc: [`'self'`, "www.instagram.com"],
    fontSrc: ["https://fonts.gstatic.com"],
    frameSrc: ["https://www.instagram.com"],
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
