import {Studio} from 'sanity';
import config from '../../sanity.config';
import './studio.css';

export default function SanityStudio() {
  return <Studio config={config} />;
}
