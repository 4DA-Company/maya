import { Component } from './base.js';

export class Dashboard extends Component {
  constructor() {
    super();
  }

  get header() {
    return this.get('header');
  }

  get menu() {
    return this.get('menu');
  }

  get canvas() {
    return this.get('canvas');
  }

  initialize() {
    this.state = {
      active: 0,
      running: false,
      runStateText: 'Estado: preparado · sin ejecución activa',
      runId: '—',
      validationStatus: 'pendiente'
    };
  }

  update(payload) {
    super.update(payload);
    this.syncChildren();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div part="shell">
        <main-header
          id="header"
          exportparts="header,brand,brand-sub,tag">
        </main-header>

        <main part="main">
          <main-menu
            id="menu"
            exportparts="top,panel,panel-title,row,row-actions,row-config,field,label,select,btn,btn-primary,btn-stop,runstate-note,note,progress,step,step-active,step-done,step-locked,step-title,step-sub">
          </main-menu>

          <main-canvas
            id="canvas"
            exportparts="workspace,kpis,kpi,section-h3,section-h3-mt,kpi-val,kpi-unit,kpi-sub,layout,panel,panel-title,pipe,stage,stage-active,stage-title,stage-sub,dot,dot-active,metrics,metric,metric-label,metric-val,note,subgrid,table,table-mt,th,td,warning-text,footer,row,btn,btn-quiet">
          </main-canvas>
        </main>
      </div>
    `;
    this.syncChildren();
    this.listen();
  }

  syncChildren() {
    if (this.menu) {
      this.menu.update({
        data: {
          active: this.state.active,
          running: this.state.running,
          runStateText: this.state.runStateText
        }
      });
    }
    if (this.canvas) {
      this.canvas.update({
        data: {
          running: this.state.running,
          runId: this.state.runId,
          validationStatus: this.state.validationStatus
        }
      });
    }
  }

  handleAction(action) {
    switch (action) {
      case 'start':
        if (this.state.running || this.state.active > 3) return;
        this.state.running = true;
        this.state.runId = 'T2-' + Date.now().toString().slice(-8);
        this.state.runStateText = `Estado: D${this.state.active} en ejecución · demostración`;
        this.syncChildren();
        break;

      case 'stop':
        if (!this.state.running) return;
        this.state.running = false;
        let msg = `Estado: D${this.state.active} detenido · demostración`;
        if (this.state.active < 3) {
          this.state.active += 1;
          msg += ` · D${this.state.active} habilitado para la siguiente etapa`;
        }
        this.state.runStateText = msg;
        this.syncChildren();
        break;

      case 'export-results':
        alert('Exportación disponible al conectar el registro de ejecución.');
        break;

      case 'open-history':
        alert('Historial disponible al conectar el registro de ejecución.');
        break;
    }
  }

  listen() {
    const wire = (comp) => {
      if (!comp) return;
      comp.on = (data) => {
        const { target, action, payload } = data;
        switch (target) {
          case 'b':
            this.on({ action, payload });
            break;
          case 'f':
            this.handleAction(action, payload);
            break;
          default:
            console.log('not possible, check the code');
        }
      };
    };

    wire(this.header);
    wire(this.menu);
    wire(this.canvas);
  }
}