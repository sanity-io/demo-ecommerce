// @ts-expect-error incompatibility with node16 resolution
import type {PortableTextBlock} from '@portabletext/types';
import {SanityModuleSharedText} from '../../../types';
import PortableText from '../PortableText.server';

type Props = {
  node: PortableTextBlock & SanityModuleSharedText;
};

export default function SharedText({node}: Props) {
  return <PortableText blocks={node.content} />;
}
