import {Studio} from 'sanity';
import config from '../../sanity.config';
import './SanityStudio.css';

export default function SanityStudio() {
  return <Studio config={config} unstable_noAuthBoundary={true} />;
}
