import groq from 'groq';
import {MARK_DEFS} from '../portableText/markDefs';

export const MODULE_SHARED_TEXT = groq`
  _key,
  'content': @->.content[]{
    ...,
    markDefs[] {
      ${MARK_DEFS}
    }
  }
`;
