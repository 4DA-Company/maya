import { Component } from './base.js';

export class Label extends Component {
  constructor() {
    super();
  }

  initialize() {
    this.state = {
      text: this.getAttribute('text') || '',
      variant: this.getAttribute('variant') || 'default' // header-tag | status | warning | note
    };
  }

  render() {
    const text = this.getAttribute('text') ?? this.state.text;
    const variant = this.getAttribute('variant') ?? this.state.variant;
    const partMap = {
      'header-tag': 'tag',
      'status': 'status-text',
      'warning': 'warning-text',
      'note': 'runstate-note'
    };
    const partName = partMap[variant] || 'tag';

    this.shadowRoot.innerHTML = `
      <span part="${partName}">${text}</span>
    `;
    this.listen();
  }
}