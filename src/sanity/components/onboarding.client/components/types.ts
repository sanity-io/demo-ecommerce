import {TooltipRenderProps, Step} from 'react-joyride';

export type Steps = Step & {
  subtitle?: string;
  chapter?: string;
  nextUrl?: string;
  nextUrlTarget?: string;
  themeColor?: string;
  image?: () => JSX.Element;
  chapterPosition?: number;
  chapterLength?: number;
  type: 'step' | 'modal';
};

export type TooltipProps = TooltipRenderProps & {
  setIndex: (n: number) => void;
  step: Steps;
};
