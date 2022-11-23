// @ts-expect-error incompatibility with node16 resolution
import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';
import {SanityCreator, ProductWithNodes, SanityProductPage} from '../../types';
import Creator from './Creator.server';
import Composition from './Composition.server';
import Square from '../elements/Square';
import PortableText from '../portableText/PortableText.server';

type Props = {
  sanityProduct: SanityProductPage;
  storefrontProduct: ProductWithNodes;
  creators: SanityCreator[];
};

export default function Magazine({
  storefrontProduct,
  sanityProduct,
  creators,
}: Props) {
  const compositionStories = sanityProduct.composition.filter(
    (block) => block?.material?.story !== null,
  );

  return (
    <div
      className={clsx(
        'w-full', //
        'lg:w-[calc(100%-315px)]',
        'mb-10 p-5',
      )}
    >
      {creators &&
        creators.map((creator) => (
          <Creator
            storefrontProduct={storefrontProduct}
            creator={creator}
            key={creator._key}
          />
        ))}

      <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
        <div className="col-span-2">
          <Square className="overflow-hidden rounded bg-purple-500">
            {/* eslint-disable-next-line hydrogen/prefer-image-component */}
            <img
              src="https://cdn.myportfolio.com/ad803868292c892b9e8b7723af165616/d2698f8c-5c3f-48b6-99a6-36b5c7fd1607_rw_3840.JPG?h=e7acf2d04734f3e34bc09dff18991782"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              alt=""
            />
          </Square>
        </div>
        <div className="col-span-2">
          <Square className="bg-magenta-300 overflow-hidden rounded">
            {/* eslint-disable-next-line hydrogen/prefer-image-component */}
            <img
              src="https://images.unsplash.com/photo-1557672172-298e090bd0f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              alt=""
            />
          </Square>
        </div>
        <div className="col-span-2 grid aspect-[2/3] grid-cols-2 grid-rows-3 gap-3">
          <Square className="overflow-hidden rounded bg-red"></Square>
          <Square className="col-span-2 overflow-hidden rounded bg-darkGray"></Square>
        </div>

        {compositionStories.length > 0 && (
          <Composition compositionStories={compositionStories} />
        )}
      </div>
    </div>
  );
}
