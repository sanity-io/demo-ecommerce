import groq from 'groq';
import {MODULE_IMAGE} from './image';

export const MODULE_IMAGES = groq`
  "fullWidth": select(
    count(modules) > 1 && ^._type != 'product' => true,
    fullWidth,
  ),
  "test": ^._type,
  layout,
  modules[] {
    _key,
    ${MODULE_IMAGE}
  }
`;
