import { Component } from './base.js';

export class Header extends Component {
  constructor() {
    super();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <header part="header">
        <div part="brand">
          4DA GLOBAL HOLDING
          <small part="brand-sub">TDPnet · MDCD MAYA · Aladino</small>
        </div>
        <ui-label text="T2 · BLOCKCHAIN RPC" variant="header-tag" exportparts="tag"></ui-label>
      </header>
    `;
    this.listen();
  }

  initialize() { }
}