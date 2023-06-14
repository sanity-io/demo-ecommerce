/**
 * Annotations are ways of marking up text in the block content editor.
 *
 * Read more: https://www.sanity.io/docs/customization#f924645007e1
 */
// @ts-expect-error incompatibility with node16 resolution
import {EnvelopeIcon} from '@sanity/icons';
import {defineField} from 'sanity';

export default defineField({
  title: 'Email link',
  name: 'annotationLinkEmail',
  type: 'object',
  // @ts-ignore - TODO - fix these TS errors
  blockEditor: {
    icon: () => <EnvelopeIcon />,
    // @ts-ignore
    render: ({children}) => (
      <span>
        <EnvelopeIcon
          style={{
            marginLeft: '0.05em',
            marginRight: '0.1em',
            width: '0.75em',
          }}
        />
        {children}
      </span>
    ),
  },
  fields: [
    // Email
    {
      title: 'Email',
      name: 'email',
      type: 'email',
    },
  ],
});