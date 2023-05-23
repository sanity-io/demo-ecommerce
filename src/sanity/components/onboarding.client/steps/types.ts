import {TooltipRenderProps, Step} from 'react-joyride';

export type Steps = Step & {
  subtitle?: string;
  nextUrl?: string;
  nextUrlTarget?: string;
  type: 'step' | 'modal';
};

export type TooltipProps = TooltipRenderProps & {
  setIndex: (n: number) => void;
  step: Steps;
};
