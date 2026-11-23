import { Header } from './component/header.js';
import { Menu } from './component/menu.js';
import { Canvas } from './component/canvas.js';
import { Label } from './component/label.js';
import { Dashboard } from './component/dashboard.js';
import { Proxy } from './backfront.js';

customElements.define('main-header', Header);
customElements.define('main-menu', Menu);
customElements.define('main-canvas', Canvas);
customElements.define('ui-label', Label);
customElements.define('main-dashboard', Dashboard);

new class extends Proxy {
    /* Customize the Proxy class to handle T3 console telemetry and backend events */
};