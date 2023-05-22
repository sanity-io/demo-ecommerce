import {TooltipRenderProps, Step} from 'react-joyride';

export type Steps = Step & {
  subtitle?: string;
  nextUrl?: string;
  nextUrlTarget?: string;
  type: 'step' | 'intro' | 'final';
};

export type TooltipProps = TooltipRenderProps & {
  setIndex: (n: number) => void;
  step: Steps;
};
