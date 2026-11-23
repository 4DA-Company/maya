import { Component } from './base.js';

export class Label extends Component {
  constructor() {
    super();
  }

  initialize() {
    this.state = {
      text: this.getAttribute('text') || '',
      variant: this.getAttribute('variant') || 'default' // default | running | done | tag
    };
  }

  render() {
    const text = this.getAttribute('text') ?? this.state.text;
    const variant = this.getAttribute('variant') ?? this.state.variant;
    const partName = variant === 'tag' ? 'tag' : `status status-${variant}`;

    this.shadowRoot.innerHTML = `
      <span part="${partName}">${text}</span>
    `;
    this.listen();
  }
}