import WalkthroughIntro from './introModal';
import WalkthroughFinal from './finalModal';
import WalkthroughStep from './step';
import {TooltipProps} from './types';

export default function createWalkthrough(setIndex: (n: number) => void) {
  return function (props: TooltipProps) {
    if (!props.step.type) {
      throw new Error('Missing step type');
    }

    const isModalMode = props.step.type !== 'step';
    const Dialog = {
      intro: WalkthroughIntro,
      step: WalkthroughStep,
      final: WalkthroughFinal,
    }[props.step.type];
    return (
      <div
        ref={props.tooltipProps.ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '18px 20px 0 20px',
          width: isModalMode ? '500px' : '315px',
          height: '385px',
          color: '#FFFFFF',
          background: '#101112',
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
        <Dialog {...props} setIndex={setIndex} />
      </div>
    );
  };
}
