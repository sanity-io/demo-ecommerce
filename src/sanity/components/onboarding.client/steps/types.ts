import {TooltipRenderProps, Step} from 'react-joyride';

export type Steps = Step & {
  subtitle?: string;
  chapter?: string;
  nextUrl?: string;
  nextUrlTarget?: string;
  themeColor?: string;
  chapterPosition?: number;
  chapterLength?: number;
  type: 'step' | 'modal';
};

export type TooltipProps = TooltipRenderProps & {
  setIndex: (n: number) => void;
  step: Steps;
};
