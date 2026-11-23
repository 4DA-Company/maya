import {Menu} from './component/menu.js';
import {Canvas} from './component/canvas.js';
import { Dashboard } from './component/dashboard.js';
import { Lobby } from './component/lobby.js';

customElements.define('main-menu', Menu);
customElements.define('main-canvas', Canvas);
customElements.define('main-dashboard', Dashboard);
customElements.define('main-lobby', Lobby);

import { Proxy } from "./backfront.js";

new class extends Proxy {
    /*Customize the Proxy class to handle specific events and actions for the dashboard component*/
}   