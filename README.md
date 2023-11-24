# Ecommerce Demo - AKVA

This demo is an enhanced version of our [AKVA][standard-akva] demo, powered by Sanity + Hydrogen. This demo is compatible with `@shopify/hydrogen ~= 2023.10.2`.

<img src="https://user-images.githubusercontent.com/209129/173065853-77b26be2-dd15-4b4d-8164-850e70247b88.png" width="1000" />

[Demo][hydrogen-sanity-demo] | [Sanity Connect for Shopify][sanity-connect]

# About

## About the storefront

AKVA is our customized [Hydrogen][hydrogen-github] starter that presents a real-world example of how Sanity and Structured Content can elevate your custom Shopify storefronts. This is an enhanced version demonstrating some additional features such as enhanced structured content for products and the addition of a "guide" content type, all of which lead to richer PDPs (Product Display Pages). These additions include:

- A material document type to tell a story about the materials a product is made up of. A product can be composed of multiple materials. The PDP is updated to display this information as well as cross-sell other products made of the same material.
- A people document type allows details to be added for makers of the products. Again, this content is displayed on the PDP with a short biography and link through to the catalogue of the artists work.
- The guide document type is an example of how content and sales strategies can work together through structured content. If a guide references a product, then any hotspotted images are pulled onto any relevant PDPs in order to show products in context.

This demo also features an embedded version of our pre-configured Studio and [Sanity Connect for Shopify][sanity-connect], which syncs products and collections from your Shopify storefront to your Sanity dataset.

This starter showcases a few patterns you can adopt when creating your own custom storefronts. Use Sanity and Hydrogen to delight customers with rich, shoppable editorial experiences that best tell your story.

## About the Studio

This studio is based on our [Shopify Studio][standard-studio] template, which has a [number of features][standard-studio-features]. In addition to this, we've modelled some additional content as detailed above.

# Storefront Features

**[View the feature gallery][about]**

This TypeScript demo adopts many of Hydrogen's [framework conventions and third-party libraries][hydrogen-framework]. If you've used Hydrogen then you should hopefully feel at home here.

# Fetching Sanity data

This demo comes with a custom `useSanityQuery` hook that allows you to query your Sanity dataset directly from server components.

```js
// MyServerComponent.server.jsx
import useSanityQuery from "./hooks/useSanityQuery";

const QUERY = `*[_type == 'page' && slug.current == $slug]`;
const PARAMS = { slug: "about" };

export default function MyServerComponent() {
  const { data, error } = useSanityQuery({
    // Required
    query: QUERY,
    // Optional
    params: PARAMS,
    // Optional: pass through any useQuery options
    options: {
      preload: false,
    },
  });
  return <div>{JSON.stringify(data)}</div>;
}
```

[The hook itself][use-sanity-query-hook] is super lightweight - it uses our official [`@sanity/client`][sanity-js-client] library wrapped in a Hydrogen [`useQuery`][hydrogen-use-query] hook to make it suspense-friendly. That's it!

# Opinions

We've taken the following opinions on how we've approached this demo.

<details>
<summary><strong>Shopify is the source of truth for non-editorial content</strong></summary>

- For products, this includes titles, handles, variant images and product options.
- For collections, this includes titles and collection images.

</details>

<details>
<summary><strong>Shopify data stored in our Sanity dataset is used to improve the editor experience</strong></summary>

- This allows us to display things like product status, prices and even inventory levels right in our Sanity Studio.
- Our application always fetches from Shopify's Storefront API at runtime to ensure we have the freshest data possible, especially important when dealing with fast-moving inventory.

</details>

<details>
<summary><strong>Collections are managed entirely by Shopify</strong></summary>

- Shopify is used to handle collection rules and sort orders. Sanity is used to enhance the content displayed on the storefront.

</details>

<details>
<summary><strong>Product options are customized in Sanity</strong></summary>

- Data added to specific product options (for example, associating a hex value with the color 'Red', or a string value with the Poster size 'A2') is done in Sanity.
- We treat this quite simply and manage these in a dedicated field within the `Settings` section of our studio. We also make sure to query this field whenever querying products in our Sanity dataset.
- This could alternatively be managed with Shopify's metatags.

</details>

<details>
<summary><strong>We don't surface Shopify HTML descriptions and metatags</strong></summary>

- For this demo, Shopify tags are used purely as a non-visual organizational tool (to drive automated collections) and we use Portable Text over Shopify's description HTML field. However, Hydrogen makes it very easy to surface these in your application if needed.

</details>

<details>
<summary><strong>Non-product (regular) pages are managed entirely by Sanity</strong></summary>

- Shopify pages and blog posts (associated with the Online Store) channel aren't used in this demo. A dedicated `page` document type in Sanity has been created for this purpose.

</details>

<details>
<summary><strong>We query our Sanity dataset when building sitemap.xml entries</strong></summary>

- We use Sanity as the source of truth when determining whether a product or collection page is _visible_.
- This gives us the flexibility to add custom logic to control whether certain pages should be visible or not. For example, if you wanted to hide product pages within a specific date range, or hide collections that didn't have any editorial modules assigned to them.

</details>

# Getting started

## Requirements:

- Node.js version 16.5.0 or higher
- Npm

## Installation

These installation instructions assume you have already installed and configured [Sanity Connect][sanity-connect] on your Shopify store.

1.  Duplicate the `.env.example` file to `.env` and replace the values to point to your Sanity project's `dataset` and `projectId`, and your Shopify storefront's `storeDomain` and `storefrontToken`. Use [Shopify's Headless app][shopify-headless-app] to manage tokens for the Storefront API.

2.  Install dependencies and start the development server

    ```bash
    npm install
    npm run dev
    ```

3.  Visit the development environment running at http://localhost:3000.

## Previewing a production build

To run a local preview of your Hydrogen app in an environment similar to Oxygen, build your Hydrogen app and then run `yarn preview`:

```bash
npm run build
npm run preview
```

## Building for production

```bash
npm run build
```

Then, you can run a local `server.js` using the production build with:

```bash
npm run serve
```

## Deployment

See [Hydrogen's documentation on deployment][hydrogen-framework-deployment]

# License

This repository is published under the [MIT][license] license.

[standard-akva]: https://github.com/sanity-io/hydrogen-sanity-demo
[standard-studio]: https://github.com/sanity-io/sanity-shopify-studio
[standard-studio-features]: https://github.com/sanity-io/sanity-shopify-studio/blob/main/docs/features.md
[about]: https://demo-ecommerce.sanity.build/pages/about
[hydrogen-sanity-demo]: https://demo-ecommerce.sanity.build/
[hydrogen-github]: https://github.com/Shopify/hydrogen
[hydrogen-framework]: https://shopify.dev/api/hydrogen/framework
[hydrogen-framework-deployment]: https://shopify.dev/custom-storefronts/hydrogen/deployment
[hydrogen-product-components]: https://shopify.dev/api/hydrogen/components/product-variant
[hydrogen-use-query]: https://shopify.dev/api/hydrogen/hooks/global/usequery
[shopify-headless-app]: https://apps.shopify.com/headless
[license]: https://github.com/sanity-io/sanity/blob/next/LICENSE
[sanity-connect]: https://www.sanity.io/docs/sanity-connect-for-shopify
[sanity-js-client]: https://www.sanity.io/docs/js-client
[sanity-portable-text]: https://www.sanity.io/guides/introduction-to-portable-text
[sanity-structured-content-patterns]: https://www.sanity.io/guides/structured-content-patterns-for-e-commerce
[shopify-storefront-api]: https://shopify.dev/api/storefront
[shopify-analytics]: https://shopify.dev/api/hydrogen/components/framework/shopifyanalytics
[use-sanity-query-hook]: ./src/hooks/useSanityQuery.ts
