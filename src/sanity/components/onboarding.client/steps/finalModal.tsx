import {TooltipProps} from './types';

export default function WalkthroughModal(props: TooltipProps) {
  return (
    <>
      <header
        style={{
          fontSize: '27px',
          fontWeight: '700',
          lineHeight: '33px',
          letterSpacing: '0.5px',
          textAlign: 'center',
        }}
      >
        {props.step.title}
      </header>
      <span
        style={{
          fontSize: '16px',
          fontWeight: '400',
          lineHeight: '21px',
          letterSpacing: '0em',
          textAlign: 'center',
          width: '385px',
        }}
      >
        Super short about where we are and what this tour is (3 short steps)
      </span>
      <button onClick={() => props.setIndex(1)}>The Studio</button>
      <button onClick={() => props.setIndex(2)}>The Sanity way</button>
      <button onClick={() => props.setIndex(3)}>Ecommerce use case</button>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <button style={{color: '#9EA6B3'}} {...props.closeProps}>
          Keep exploring
        </button>
        <button style={{color: '#9EA6B3'}} {...props.closeProps}>
          Contact Sales
        </button>
        <button
          style={{
            color: '#101112',
            background: '#FFFFFF',
            borderRadius: '3px',
            padding: '6px 10px',
          }}
          {...props.primaryProps}
        >
          Share Demo
        </button>
      </div>
    </>
  );
}
