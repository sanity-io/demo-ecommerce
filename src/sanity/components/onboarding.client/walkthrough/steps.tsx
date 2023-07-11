import {Steps} from './components/types';
import {Code, ContentModel, Documents, Refs, Roles, Shopify} from './assets';

export const steps: Steps[] = [
  {
    target: 'body',
    url: null,
    placement: 'center',
    content: null,
    title: 'Welcome to the Sanity demo',
    subtitle: 'This three-part tour will cover the basics of Sanity:',
    type: 'modal',
  },
  {
    target: "[data-ui='Navbar'] [data-ui='Button']", // logo
    url: null,
    chapter: 'Sanity Studio',
    themeColor: '#4E91FC',
    chapterPosition: 1,
    chapterLength: 3,
    title: 'The Sanity Studio is where content editing happens',
    disableBeacon: true,
    placement: 'bottom-start',
    content:
      'Every Sanity Studio is different. This is a Studio for an e-commerce store called AKVA.',
    type: 'step',
  },
  {
    target: 'form > [data-ui="Stack"] > [data-ui="Stack"]:nth-child(4)',
    url: '/studio/desk/pages;1051150e-042e-45a6-881a-49ca2759ea63',
    chapter: 'Sanity Studio',
    themeColor: '#4E91FC',
    chapterPosition: 2,
    chapterLength: 3,
    title: 'Unlimited flexibility',
    disableBeacon: true,
    image: Code,
    placement: 'left',
    externalLink: {
      url: 'https://www.sanity.io/studio',
      text: 'Learn more about the Studio',
    },
    content:
      'Your Studio is completely customizable. You can customize everything from input components—like this one—to content workflows that fit your team or business.',
    type: 'step',
  },
  {
    target: "[data-testid='permission-check-banner']",
    url: '/studio/desk/pages;1051150e-042e-45a6-881a-49ca2759ea63',
    chapter: 'Sanity Studio',
    themeColor: '#4E91FC',
    chapterPosition: 3,
    chapterLength: 3,
    title: 'Simple access management',
    image: Roles,
    disableBeacon: true,
    placement: 'bottom-start',
    externalLink: {
      url: 'https://www.sanity.io/docs/roles',
      text: 'Learn more about roles and permissions',
    },
    content:
      'Access can be tailored through both default and custom roles. In this Studio, you currently have the Viewer role and can therefore not edit the content.',
    type: 'step',
  },
  {
    target: '[data-testid="pane-content"]',
    url: '/studio/desk/pages;1051150e-042e-45a6-881a-49ca2759ea63',
    chapter: 'Content Modeling',
    themeColor: '#F36458',
    chapterPosition: 1,
    chapterLength: 3,
    title: 'Content models without restrictions',
    image: ContentModel,
    disableBeacon: true,
    placement: 'right-start',
    type: 'step',
    externalLink: {
      url: 'https://www.sanity.io/content-modeling',
      text: 'Read our Content Modeling guide',
    },
    content:
      'With Sanity you can organize your content through content models to match your business. Rather than thinking in terms of pages or templates, think in terms of how it will be used.',
  },
  {
    target: "[data-testid='field-hero.content']",
    url: '/studio/desk/pages;1051150e-042e-45a6-881a-49ca2759ea63',
    chapter: 'Content Modeling',
    themeColor: '#F36458',
    chapterPosition: 2,
    chapterLength: 3,
    title: 'Documents and references',
    disableBeacon: true,
    placement: 'left-end',
    image: Documents,
    content:
      'A document can reference other documents—in this example an image contains references to multiple products. References let you reuse and keep content up-to-date at scale.',
    type: 'step',
  },
  {
    target: "[data-ui='DialogCard']",
    url: '/studio/desk/pages;1051150e-042e-45a6-881a-49ca2759ea63%2Cinspect%3Don',
    chapter: 'Content Modeling',
    themeColor: '#F36458',
    chapterPosition: 3,
    chapterLength: 3,
    title: 'Content is data',
    image: Refs,
    disableBeacon: true,
    placement: 'left-start',
    content:
      'Treating content as data makes it easy to  access, combine, assemble and reassemble that data across all your products and channels.',
    type: 'step',
  },
  {
    target: "[data-testid='document-panel-portal'] fieldset:nth-child(3)", // 2nd child
    url: '/studio/desk/pages;1051150e-042e-45a6-881a-49ca2759ea63',
    afterLoad: async () =>
      Promise.resolve()
        .then(() => setTimeout(() => {}, 500))
        .then(() => {
          document
            .querySelector<HTMLButtonElement>(
              "[data-testid='document-panel-portal'] button",
            )
            ?.click();
        })
        .then(() => setTimeout(() => {}, 333))
        .then(() => {
          document
            .querySelector<HTMLButtonElement>(
              "[data-testid='field-hero.content'] button",
            )
            ?.click();
        }),
    chapter: 'Sanity for E-commerce',
    themeColor: '#43D675',
    chapterPosition: 1,
    chapterLength: 3,
    title: 'Enrich your products through storytelling',
    disableBeacon: true,
    placement: 'left-start',
    content:
      'Break out of stale e-commerce templates. Let visitors explore products through stories and rich interactive experiences.',
    type: 'step',
  },
  {
    target: "fieldset[data-level='2']",
    url: '/studio/desk/pages;1051150e-042e-45a6-881a-49ca2759ea63',
    afterLoad: async () => {
      const getTarget = () =>
        document.querySelector<HTMLButtonElement>(
          "[data-testid='document-panel-portal'] [data-as='button']",
        );
      const target = getTarget();

      Promise.resolve()
        .then(() => {
          if (!target) {
            document
              .querySelector<HTMLButtonElement>(
                "[data-testid='field-hero.content'] button",
              )
              ?.click();
            return new Promise((resolve) => setTimeout(resolve, 333));
          }
        })
        .then(() => getTarget()?.click());
    },
    chapter: 'Sanity for E-commerce',
    themeColor: '#43D675',
    chapterPosition: 2,
    chapterLength: 3,
    title: 'Sync with any third-party',
    disableBeacon: true,
    placement: 'left',
    image: Shopify,
    externalLink: {
      url: 'https://www.sanity.io/shopify',
      text: 'Learn more about Sanity + Shopify',
    },
    content:
      'Natively sync product information to and from Shopify, with support for any other third-party e-commerce platform through Sanity’s powerful APIs.',
    type: 'step',
  },
  {
    target: "[data-ui='TabList']",
    url: '/studio/desk/pages;1051150e-042e-45a6-881a-49ca2759ea63%2Cview%3Dpreview',
    hideWhileSpinning: true,
    afterLoad: async () => {
      Promise.resolve().then(() => {
        document
          .querySelector<HTMLButtonElement>(
            "[data-testid='document-panel-portal'] button",
          )
          ?.click();
      });
    },
    chapter: 'Sanity for E-commerce',
    themeColor: '#43D675',
    chapterPosition: 3,
    chapterLength: 3,
    title: 'Live previews, side by side',
    disableBeacon: true,
    placement: 'left-start',
    content:
      'See changes in real time and gain increased confidence before you and your team hit the Publish button.',
    type: 'step',
  },
  {
    target: 'body',
    url: '/studio/desk',
    afterLoad: async () => {
      Promise.resolve().then(() => {
        document
          .querySelector<HTMLButtonElement>(
            "[data-testid='document-panel-portal'] button",
          )
          ?.click();
      });
    },
    placement: 'center',
    content: null,
    title: 'That’s a wrap!',
    subtitle:
      '... and we haven’t even shown you features like Workspaces, real-time editing, revision history, image cropping, mobile responsiveness, accessibility, AI content assistants — and so much more!',
    type: 'modal',
  },
];
