import './styles/base.css';
import './styles/layout.css';
import './styles/widgets.css';
import { startRouter } from './app/router.js';

const root = document.getElementById('view');

if (!root) {
  throw new Error('缺少 #view 挂载点，请检查 index.html');
}

startRouter(root);
