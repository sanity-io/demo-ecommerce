import {useState, useEffect} from 'react';
import {Studio} from 'sanity';
import config from '../../sanity.config';

import './studio.css';

export default function StudioPage() {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <Studio config={config} /> : <></>;
}
