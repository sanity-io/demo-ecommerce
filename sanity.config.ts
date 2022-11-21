/**
 * This config is used to set up Sanity Studio that's mounted on the `/studio` route
 */

import {defineConfig, AssetSource, isDev} from 'sanity';
import {deskTool} from 'sanity/desk';

import {visionTool} from '@sanity/vision';
import {colorInput} from '@sanity/color-input';
import {imageHotspotArrayPlugin} from 'sanity-plugin-hotspot-array';
import {media, mediaAssetSource} from 'sanity-plugin-media';
import {customDocumentActions} from './src/sanity/plugins/customDocumentActions/index';

import {schemaTypes} from './src/sanity/schemas';
import {structure} from './src/sanity/desk';

const BASE_PATH = '/studio';
const devOnlyPlugins = [visionTool()];

export default defineConfig({
  name: 'default',
  title: 'AKVA',
  basePath: BASE_PATH,

  // To do - move to env variables
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION,

  plugins: [
    deskTool({structure}),
    colorInput(),
    imageHotspotArrayPlugin(),
    customDocumentActions(),
    media(),
    ...(isDev ? devOnlyPlugins : []),
  ],

  schema: {
    types: schemaTypes,
  },

  form: {
    file: {
      assetSources: (previousAssetSources: AssetSource[]) => {
        return previousAssetSources.filter(
          (assetSource) => assetSource !== mediaAssetSource,
        );
      },
    },
    image: {
      assetSources: (previousAssetSources: AssetSource[]) => {
        return previousAssetSources.filter(
          (assetSource) => assetSource === mediaAssetSource,
        );
      },
    },
  },
});

/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */

// import {visionTool} from '@sanity/vision';
// import {defineConfig} from 'sanity';
// import {deskTool} from 'sanity/desk';
// import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash';

// import {MARKETS} from './lib/constants';
// import {defaultDocumentNode, structure} from './lib/structure';
// import {schemaTypes} from './schemas';

// // @TODO: update next-sanity/studio to automatically set this when needed
// const BASE_PATH = '/studio';

// const pluginsBase = (marketName?: string) => [
//   deskTool({
//     structure: (S, context) => structure(S, context, marketName),
//     defaultDocumentNode,
//   }),
//   unsplashImageAsset(),
//   visionTool({
//     defaultApiVersion: '2022-08-08',
//   }),
// ];

// const configBase = {
//   basePath: BASE_PATH + `/global`,
//   name: 'global',
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//   dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
//   title: process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || 'Marketing.',
//   schema: {
//     types: schemaTypes,
//     // TODO: Get initial templates working
//     // templates: (prev) => schemaTemplates(prev),
//   },
//   plugins: pluginsBase(),
// };

// export default defineConfig([
//   ...MARKETS.map((market) => ({
//     ...configBase,
//     basePath: BASE_PATH + `/` + market.name.toLowerCase(),
//     name: market.name,
//     title: `${market.name} | ${configBase.title}`,
//     plugins: pluginsBase(market.name),
//   })),
//   configBase,
// ]);

// // TODO: Get document badge showing the `market` of the document
// // document: {
// //   badges: (prev, ctx, ...rest) => {
// //     console.log(prev, ctx, rest)

// //     return [
// //       ...prev
// //     ]
// //   }
// // }
// // document: {
// // productionUrl: getProductionUrl,
// // Hide 'Settings' from new document options
// // https://user-images.githubusercontent.com/81981/195728798-e0c6cf7e-d442-4e58-af3a-8cd99d7fcc28.png
// // newDocumentOptions: (prev, { creationContext }) => {
// //   if (creationContext.type === 'global') {
// //     return prev.filter(
// //       (templateItem) => templateItem.templateId !== settingsType.name
// //     )
// //   }
// //   return prev
// // },
// // Removes the "duplicate" action on the "settings" singleton
// // actions: (prev, { schemaType }) => {
// //   if (schemaType === settingsType.name) {
// //     return prev.filter(({ action }) => action !== 'duplicate')
// //   }
// //   return prev
// // },
// // },
