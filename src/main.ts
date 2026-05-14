import './styles.css';
import { BlockmancerGame } from './game/BlockmancerGame';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Missing #app root element.');
}

if ('orientation' in screen && typeof (screen as any).orientation?.lock === 'function') {
  (screen as any).orientation.lock('portrait').catch(() => {
    // Orientation lock is best-effort only.
  });
}

new BlockmancerGame(app);
