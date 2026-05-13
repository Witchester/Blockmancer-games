import './styles.css';
import { BlockmancerGame } from './game/BlockmancerGame';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Missing #app root element.');
}

new BlockmancerGame(app);
