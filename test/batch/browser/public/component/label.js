import { Component } from './base.js';

export class Label extends Component {
  constructor() {
    super();
  }

  initialize() {
    this.state = {
      text: this.getAttribute('text') || '',
      variant: this.getAttribute('variant') || 'tag' // pill | tag | ok | state
    };
  }

  render() {
    const text = this.getAttribute('text') ?? this.state.text;
    const variant = this.getAttribute('variant') ?? this.state.variant;

    this.shadowRoot.innerHTML = `
      <span part="${variant}">${text}</span>
    `;
    this.listen();
  }
}