import {useState} from 'react';
import {TooltipProps} from './types';
// @ts-expect-error incompatibility with node16 resolution
import {CheckmarkIcon, RevertIcon, UploadIcon} from '@sanity/icons';

export default function WalkthroughModal(props: TooltipProps) {
  const {index, size} = props;
  const isLastStep = index + 1 >= size;
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
        {props.step.subtitle}
      </span>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
          ...(isLastStep && {color: '#9EA6B3'}),
        }}
      >
        <Button
          completed={index > 2}
          completedColor="#2276FC"
          onClick={() => props.setIndex(1)}
          title="The Studio"
        />
        <Button
          completed={index > 5}
          completedColor="#F36458"
          onClick={() => props.setIndex(2)}
          title="The Sanity way"
        />
        <Button
          completed={index >= 8}
          completedColor="#43D675"
          onClick={() => props.setIndex(3)}
          title="Ecommerce use case"
        />
        {isLastStep && (
          <button onClick={() => props.setIndex(0)}>
            Retake Tour <RevertIcon />
          </button>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <button
          style={{color: isLastStep ? '#FFFFFF' : '#9EA6B3'}}
          {...props.closeProps}
        >
          {isLastStep ? 'Explore on your own' : 'Keep exploring'}
        </button>
        {isLastStep ? (
          <span>
            <button
              style={{
                padding: '.5em .8em',
                border: '1px solid #F36458',
                borderRadius: '3px',
                margin: '0 .5em',
              }}
              onClick={() => {
                window.postMessage({studio: 'contact sales'});
              }}
            >
              Contact Sales
            </button>
            <button
              style={{
                padding: '.5em .8em',
                color: '#000000',
                background: '#FFFFFF',
                borderRadius: '3px',
                margin: '0 .5em',
              }}
              onClick={() => {
                window.postMessage({studio: 'share'});
              }}
            >
              Share Demo <UploadIcon />
            </button>
          </span>
        ) : (
          <button
            style={{
              color: '#101112',
              background: '#FFFFFF',
              borderRadius: '3px',
              padding: '6px 10px',
            }}
            {...props.primaryProps}
          >
            🪂 <span style={{padding: '0 0.4em'}}>Take the tour</span>
            <span style={{fontSize: '15px', verticalAlign: 'bottom'}}> →</span>
          </button>
        )}
      </div>
    </>
  );
}

function Button({
  onClick,
  title,
  completed,
  completedColor,
}: {
  onClick: () => void;
  title: string;
  completed: boolean;
  completedColor: string;
}) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        /* Auto layout */
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 10px',
        gap: '6px',

        width: '258px',
        height: '33px',
        background: '#111B29',
        borderRadius: '3px',
        border: '2px solid #111B29',

        /* Inside auto layout */
        flex: 'none',
        order: 0,
        alignSelf: 'center',
        flexGrow: 0,

        /* Font */
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '13px',
        lineHeight: '17px',
        boxSizing: 'border-box',
        ...(isHovering && {border: '2px solid #4E91FC'}),
      }}
      onClick={onClick}
    >
      {title}
      <CheckmarkIcon
        style={{
          /* white */
          background: '#FFFFFF',
          /* white */
          maxWidth: '15px',
          maxHeight: '15px',
          mixBlendMode: 'screen',
          opacity: 0.15,
          transform: 'zoom(1.5)',

          /* Inside auto layout */
          fontWeight: 'bold',
          flex: 'none',
          order: 3,
          flexGrow: 0,

          border: '2px solid #FFFFFF',
          borderRadius: '50%',
          ...(completed && {
            background: completedColor,
            borderColor: completedColor,
            opacity: 1,
          }),
        }}
      />
    </button>
  );
}
