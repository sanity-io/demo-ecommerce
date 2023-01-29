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

const {muxInput} = await import('sanity-plugin-mux-input');

import {schemaTypes} from './src/sanity/schemas';
import {structure} from './src/sanity/desk';
import {defaultDocumentNode} from './src/sanity/desk/preview';
import resolveProductionUrl from './src/sanity/utils/resolveProductionUrl';

const BASE_PATH = '/studio';
const devOnlyPlugins = [visionTool()];

export default defineConfig({
  name: 'default',
  title: 'AKVA',
  basePath: BASE_PATH,

  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION,

  plugins: [
    deskTool({
      structure,
      defaultDocumentNode,
    }),
    colorInput(),
    imageHotspotArrayPlugin(),
    customDocumentActions(),
    media(),
    muxInput({mp4_support: 'standard'}),
    ...(isDev ? devOnlyPlugins : []),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    productionUrl: resolveProductionUrl,
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
