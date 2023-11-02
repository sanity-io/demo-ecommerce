import {
  type ActionFunction,
  type ActionFunctionArgs,
  type AppLoadContext,
  type LoaderFunctionArgs,
  redirect,
} from "@shopify/remix-oxygen";

import { cartUpdateBuyerIdentity } from "~/routes/_store.($lang).cart";

export async function doLogout(context: AppLoadContext) {
  const { session } = context;
  session.unset("customerAccessToken");
  const cartId = session.get("cartId");

  const localeCountry = context?.storefront?.i18n?.country;

  if (cartId) {
    await cartUpdateBuyerIdentity({
      cartId,
      buyerIdentity: {
        customerAccessToken: null,
        countryCode: localeCountry,
      },
      storefront: context.storefront,
    });
  }

  return redirect(`${context.storefront.i18n.pathPrefix}/account/login`, {
    headers: {
      "Set-Cookie": await session.commit(),
    },
  });
}

export async function loader({ context }: LoaderFunctionArgs) {
  return redirect(context.storefront.i18n.pathPrefix);
}

export const action: ActionFunction = async ({
  context,
}: ActionFunctionArgs) => {
  return doLogout(context);
};
