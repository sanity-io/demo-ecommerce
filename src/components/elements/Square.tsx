import {CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';

type Props = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export default function Square(props: Props) {
  const {children, className, style} = props;

  return (
    <div className={clsx('aspect-square', className)} style={style}>
      {children}
    </div>
  );
}
