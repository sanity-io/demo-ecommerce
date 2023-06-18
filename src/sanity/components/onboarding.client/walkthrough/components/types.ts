import {TooltipRenderProps, Step} from 'react-joyride';
import {Theme} from '../styles';

export type Steps = Step & {
  subtitle?: string;
  chapter?: string;
  url: string | null;
  themeColor?: string;
  image?: () => JSX.Element;
  chapterPosition?: number;
  chapterLength?: number;
  externalLink?: {url: string; text: string};
  type: 'step' | 'modal';
  hideWhileSpinning?: boolean;
  afterLoad?: () => void;
};

export type TooltipProps = TooltipRenderProps & {
  setIndex: (n: number) => void;
  step: Steps;
  styleConfig: Theme;
  isDarkMode: boolean;
  spin: boolean;
  nextStep: (p: any, i?: number) => (e: any) => void;
};
