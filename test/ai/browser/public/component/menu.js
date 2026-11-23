import { Component } from './base.js';

export class Menu extends Component {
  constructor() {
    super();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div class="container" part="menu">
      </div>
    `;
    this.listen();
  }

  listen() {
    const button = this.shadowRoot.querySelector('button');
    if (button) {
      button.addEventListener('click', () => {
        this.on({ target: 'f', action: 'click', payload: {} });
        this.on({ target: 'b', action: 'click', payload: {} });
      });
    }
  }

  initialize() { }
}