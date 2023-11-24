import { defineField, defineType } from "sanity";
import {StarIcon} from "@sanity/icons"

export default defineType({
    name: 'badge',
    title: 'Badge',
    type: 'document',
    icon: StarIcon,
    fields: [
        defineField({
            name: 'text',
            type: 'internationalizedArrayString',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'colorTheme',
            title: 'Color theme',
            type: 'reference',
            to: [{type: 'colorTheme'}],
        }),
        defineField({
            name: 'mappingType',
            title: 'Mapping Type',
            description: 'Choose how you want to map this badge to products',
            type: 'string',
            options: {
                list: ['tag'],
                layout: 'radio'
            }
        }),
        defineField({
            name: 'tag',
            title: 'Tag',
            type: 'string',
            hidden: (context) => context?.document?.mappingType !== 'tag'
        })
    ],
    preview: {
        select: {
            title: "text.0.value"
        }
    }
})