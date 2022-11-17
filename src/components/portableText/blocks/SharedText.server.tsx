// @ts-expect-error incompatibility with node16 resolution
import type {PortableTextBlock} from '@portabletext/types';
import BlockContent from '@sanity/block-content-to-react';
import clsx from 'clsx';
import {SanityModuleSharedText} from '../../../types';
import LinkEmailAnnotation from '../annotations/LinkEmail';
import LinkExternalAnnotation from '../annotations/LinkExternal';
import LinkInternalAnnotation from '../annotations/LinkInternal';
import Block from './Block';

type Props = {
  node: PortableTextBlock & SanityModuleSharedText;
};

export default function SharedText({node}: Props) {
  return (
    <BlockContent
      blocks={node.content}
      className={clsx('portableText')}
      serializers={{
        marks: {
          annotationLinkEmail: LinkEmailAnnotation,
          annotationLinkExternal: LinkExternalAnnotation,
          annotationLinkInternal: LinkInternalAnnotation,
        },
        types: {
          block: Block,
        },
      }}
    />
  );
}
