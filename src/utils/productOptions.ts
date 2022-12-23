import {OptionWithValues} from '@shopify/hydrogen';
// @ts-expect-error
import pluralize from 'pluralize-esm';

export const hasMultipleProductOptions = (options?: OptionWithValues[]) => {
  const firstOption = options?.[0];
  if (!firstOption) {
    return false;
  }

  return (
    firstOption.name !== 'Title' && firstOption.values[0] !== 'Default Title'
  );
};

export const getProductOptionString = (options?: OptionWithValues[]) => {
  return options
    ?.map(({name, values}) => pluralize(name, values.length, true))
    .join(' / ');
};
