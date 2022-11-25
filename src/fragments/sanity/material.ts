import groq from 'groq';
import {MARK_DEFS} from './portableText/markDefs';

export const MATERIAL = groq`
  _key,
  'material': @->{
    name,
    attributes,
    story[]{
      ...,
      markDefs[] {
        ${MARK_DEFS}
      }
    }
  }
`;
