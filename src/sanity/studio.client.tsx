import {useState, useEffect} from 'react';

import {Studio, defineConfig, AssetSource, isDev} from 'sanity';
import {deskTool} from 'sanity/desk';

import {visionTool} from '@sanity/vision';
import {colorInput} from '@sanity/color-input';
import {imageHotspotArrayPlugin} from 'sanity-plugin-hotspot-array';
import {media, mediaAssetSource} from 'sanity-plugin-media';
import {customDocumentActions} from './plugins/customDocumentActions/index';

import {schemaTypes} from './schemas/index';
import {structure} from './desk/index';

import './studio.css';

const devOnlyPlugins = [visionTool()];

const config = defineConfig({
  name: 'default',
  title: 'AKVA',
  basePath: `/studio`,

  // To do - move to env variables
  projectId: 'k4hg38xw',
  dataset: 'production',
  apiVersion: '2022-05-01',

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

export default function StudioPage() {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <Studio config={config} /> : <></>;
}
