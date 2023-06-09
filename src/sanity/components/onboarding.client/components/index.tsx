import WalkthroughModal from './modal';
import WalkthroughStep from './step';
import {TooltipProps} from './types';

export default function createWalkthrough(
  setIndex: (n: number) => void,
  styleConfig: {
    isDarkMode: boolean;
    backgroundColor: string;
    titleTextColor: string;
    contentTextColor: string;
  },
) {
  const {isDarkMode, backgroundColor} = styleConfig;

  return function (props: TooltipProps) {
    if (!props.step.type) {
      throw new Error('Missing step type');
    }

    const isModalMode = props.step.type !== 'step';
    const Dialog = {
      modal: WalkthroughModal,
      step: WalkthroughStep,
    }[props.step.type];
    return (
      <div
        ref={props.tooltipProps.ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: isModalMode ? 'space-between' : 'flex-start',
          padding: '20px',
          width: isModalMode ? '500px' : '315px',
          height: isModalMode ? '385px' : 'auto',
          color: '#FFFFFF',
          background: backgroundColor,
          border: '1px solid rgba(255, 255, 255, 0.002)',
          borderRadius: '6px',

          // fontFamily: 'SF Pro Text',
          fontFamily: 'sans-serif',
          fontSize: '13px',
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: '17px',
          letterSpacing: '0em',
          textAlign: 'left',
        }}
      >
        <Dialog {...props} setIndex={setIndex} styleConfig={styleConfig} />
      </div>
    );
  };
}
