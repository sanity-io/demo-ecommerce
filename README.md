# Ecommerce Demo - AKVA

This demo is an enhanced version of our [simpler Shopify AKVA demo][standard-akva], powered by Sanity + Hydrogen. This demo is compatible with `@shopify/hydrogen ~= 2023.10.2`.

Please read the documentation on the [simpler template repo][standard-akva] to understand the [features][standard-akva-features], [data fetching][standard-akva-data-fetching] and [opinions][standard-akva-opinions] of this implementation.

## Additional Features

In addition to the features of the standard template, this more fully featured demo includes:

* A monorepo approach, with applications for the Hydrogen storefront and the Sanity Studio. These can run independently, and this repo also illustrates running the same Studio application in a route within the Hydrogen app.
* Additional content models, such as People, Material and Guides. These illustate structured content and how Sanity facilitates relationships between content entries.
* Live Preview throughout the storefront and Studio. We've applied the [Live Preview][standard-akva-live-preview] from the simpler template across all relevant content types.
* Internationalisation - this demo illustates using Sanity to power i18n across the storefront, including document level and field level translations. This also follows the assumption of the initial template that some data, such as product titles, resides in Shopify (via the Translate & Adapt app).


# License

This repository is published under the [MIT][license] license.

[standard-akva]: https://github.com/sanity-io/hydrogen-sanity-demo
[standard-akva-features]: https://github.com/sanity-io/hydrogen-sanity-demo?tab=readme-ov-file#features
[standard-akva-data-fetching]: https://github.com/sanity-io/hydrogen-sanity-demo?tab=readme-ov-file#fetching-sanity-data
[standard-akva-live-preview]: https://github.com/sanity-io/hydrogen-sanity-demo?tab=readme-ov-file#live-preview
[standard-akva-opinions]: https://github.com/sanity-io/hydrogen-sanity-demo?tab=readme-ov-file#opinions
[license]: https://github.com/sanity-io/sanity/blob/next/LICENSE