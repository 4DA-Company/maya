import { Component } from './base.js';

export class Header extends Component {
  constructor() {
    super();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <header part="header">
        <div part="brand">
          <div part="logo">4DA</div>
          <div>
            <b part="brand-title">TDPnet</b>
            <div part="muted">EXPERIMENTAL CONSOLE</div>
          </div>
        </div>
        <ui-label text="T1 · DATA PROCESSING" variant="pill" exportparts="pill"></ui-label>
      </header>
    `;
    this.listen();
  }

  initialize() { }
}