import { Component } from './base.js';

export class Header extends Component {
  constructor() {
    super();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <header part="header">
        <div part="brand">
          <div part="mark">4DA</div>
          <div>
            <strong part="brand-title">4DA GLOBAL HOLDING</strong>
            <small part="brand-sub">Infraestructura digital distribuida</small>
          </div>
        </div>
        <div part="head-right">
          ENTORNO DE EXPERIMENTACIÓN<br>T3 · CAPACIDAD DE BRIDGES
        </div>
      </header>
    `;
    this.listen();
  }

  initialize() { }
}