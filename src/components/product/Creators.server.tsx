// @ts-expect-error incompatibility with node16 resolution
import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';
import sanityConfig from '../../../sanity.config';
import SanityImage from '../media/SanityImage.client';
import {SanityCreator, SanityPerson} from '../../types';
import PortableText from '../portableText/PortableText.server';

type Props = {
  creators: SanityCreator[];
};

const PersonCard = ({person, role}: {person: SanityPerson; role: string}) => {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="relative flex aspect-square w-[5rem] shrink-0 items-center justify-center overflow-hidden rounded-sm bg-lightGray">
        {person.image && (
          <SanityImage
            alt={person.image?.altText}
            crop={person.image?.crop}
            dataset={sanityConfig.dataset}
            hotspot={person.image?.hotspot}
            layout="fill"
            objectFit="cover"
            projectId={sanityConfig.projectId}
            sizes="25vw"
            src={person.image?.asset._ref}
          />
        )}
      </div>
      <div className="space-y-1">
        <div className="text-md font-bold">
          {person.name}, {role}
        </div>
        <PortableText className="text-sm" blocks={person.bio} />
      </div>
    </div>
  );
};

export default function Creators({creators}: Props) {
  return (
    <div
      className={clsx(
        'px-4 py-8', //
        'md:px-8',
      )}
    >
      <h3
        className={clsx(
          'mb-6 text-lg font-bold', //
          'md:text-xl',
        )}
      >
        Meet the people behind the product
      </h3>
      <div
        className={clsx(
          'grid grid-cols-2 gap-3 pb-6', //
          'md:grid-cols-4',
        )}
      >
        {creators.map((creator) => (
          <PersonCard
            key={creator._key}
            person={creator.person}
            role={creator.role}
          />
        ))}
      </div>
    </div>
  );
}
