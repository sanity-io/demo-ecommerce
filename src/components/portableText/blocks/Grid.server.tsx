// @ts-expect-error incompatibility with node16 resolution
import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';
import type {SanityModuleGrid} from '../../../types';
import PortableText from '../PortableText.server';
import SanityImage from '../../media/SanityImage.client';

type Props = {
  node: PortableTextBlock & SanityModuleGrid;
};

export default function GridBlock({node}: Props) {
  return (
    <div
      className={clsx(
        'first:mt-0 last:mb-0', //
        'my-8 grid grid-cols-1 gap-x-3',
        'md:grid-cols-2',
      )}
    >
      {node?.items?.map((item: SanityModuleGrid['items'][number]) => (
        <div
          className="flex items-start gap-3 border-t border-t-gray py-3"
          key={item._key}
        >
          <div className="relative flex aspect-square w-[5rem] shrink-0 items-center justify-center overflow-hidden rounded-sm bg-lightGray">
            {item.image && (
              <SanityImage
                alt={item.image?.altText}
                crop={item.image?.crop}
                dataset={import.meta.env.PUBLIC_SANITY_DATASET}
                hotspot={item.image?.hotspot}
                layout="fill"
                objectFit="cover"
                projectId={import.meta.env.PUBLIC_SANITY_PROJECT_ID}
                sizes="25vw"
                src={item.image?.asset?._ref}
              />
            )}
          </div>
          <div className="space-y-1">
            <div className="text-md font-bold">{item.title}</div>
            <PortableText className="text-sm" blocks={item.body} />
          </div>
        </div>
      ))}
    </div>
  );
}
