import { Component } from './base.js';

export class Dashboard extends Component {
  constructor() {
    super();
  }

  get component() {
    return this.get('component');
  }

  initialize() { }

  update(payload) {
    super.update(payload);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div part="container">
        <main-menu id="menu" part="menu"></main-menu>
        <main-canvas id="canvas" part="canvas" exportparts="action-btn"></main-canvas>
      </div>
    `;
    this.listen();
  }

  listen() {
    if (this.component) {
      this.component.on = (data) => {
        const { target, action, payload } = data;

        switch (target) {
          case 'b': 
            this.on({ action, payload }); 
            break;
          case 'f': 
            console.log("from component:", data); 
            break;
          default: 
            console.log('not possible, check the code');
        }
      };
    }
  }
}