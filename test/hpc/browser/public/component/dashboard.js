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
      mode: 'A',
      stage: 0,
      running: false,
      canClose: false,
      runId: 'No asignado',
      statusText: 'Preparada',
      statusVariant: 'default',
      history: [],
      configs: ['C0', 'C1', 'C2', 'C3', 'C4']
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
          exportparts="header,brand,mark,brand-title,brand-sub,head-right">
        </main-header>

        <main part="main">
          <div part="topline">
            <div>
              <h1 part="page-title">Consola de experimentación T3</h1>
              <div part="sub">Distribución, escalamiento y evaluación de capacidad computacional</div>
            </div>
            <ui-label text="Prototipo de interfaz · Datos no conectados" variant="tag" exportparts="tag"></ui-label>
          </div>

          <div part="layout">
            <main-menu
              id="menu"
              exportparts="sidebar,card,card-title,field,label,mode-grid,mode-btn,mode-btn-active,mode-btn-title,mode-btn-sub,select,notice,configs,config,config-done,config-current,config-code,config-desc,config-note,rows,rows-spaced,rowitem,rowitem-mb,row-label,row-val,statusline,sub,status,status-default,status-running,status-done,actions,btn,btn-start,btn-stop,btn-secondary,btn-full">
            </main-menu>

            <main-canvas
              id="canvas"
              exportparts="right-col,card,card-title,card-title-flush,statusline,sub,tag,kpis,kpi,kpi-label,kpi-val,kpi-unit,two,two-spaced,rows,rowitem,rowitem-mt,row-label,row-val,pipeline,stage,stage-active,stage-title,stage-sub,dot,dot-active,notice,notice-mt,meter,meter-bar,btn,btn-secondary,btn-auto,log,th,td,empty">
            </main-canvas>
          </div>

          <footer part="footer">
            4DA GLOBAL HOLDING · T3 · Prototipo de consola para revisión funcional
          </footer>
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
          mode: this.state.mode,
          stage: this.state.stage,
          running: this.state.running,
          canClose: this.state.canClose,
          runId: this.state.runId,
          statusText: this.state.statusText,
          statusVariant: this.state.statusVariant
        }
      });
    }
    if (this.canvas) {
      this.canvas.update({
        data: {
          mode: this.state.mode,
          running: this.state.running,
          history: this.state.history
        }
      });
    }
  }

  handleAction(action, payload) {
    console.log(this.state, action, payload)
    switch (action) {
      case 'mode-change':
        this.state.mode = payload.mode;
        this.syncChildren();
        break;

      case 'start':
        if (this.state.running) return;
        this.state.running = true;
        this.state.canClose = false;
        this.state.statusText = 'En ejecución';
        this.state.statusVariant = 'running';
        this.state.runId = 'T3-' + Date.now().toString().slice(-8);
        this.syncChildren();
        this.on({action, payload})
        break;

      case 'stop':
        if (!this.state.running) return;
        this.state.running = false;
        this.state.canClose = true;
        this.state.statusText = 'Detenida · Pendiente de cierre';
        this.state.statusVariant = 'default';
        this.syncChildren();
        break;

      case 'close-run': {
        if (!this.state.canClose) return;
        const cfg = payload.config || {};
        const item = {
          id: this.state.runId,
          mode: this.state.mode,
          model: cfg.model || 'Qwen3-14B · Principal',
          config: this.state.configs[this.state.stage],
          status: 'Cerrada',
          date: new Date().toLocaleString('es-MX')
        };
        this.state.history = [item, ...this.state.history];
        this.state.canClose = false;
        this.state.statusText = 'Cerrada';
        this.state.statusVariant = 'done';
        if (this.state.stage < 4) {
          this.state.stage += 1;
        }
        this.syncChildren();
        break;
      }

      case 'export-csv':
        this.exportCsv();
        break;
    }
  }

  exportCsv() {
    const rows = [
      ['ID', 'Modalidad', 'Modelo', 'Configuración', 'Estado', 'Fecha/hora'],
      ...this.state.history.map((x) => [x.id, x.mode, x.model, x.config, x.status, x.date])
    ];
    const csv = rows
      .map((r) => r.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(','))
      .join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'T3_historial_prototipo.csv';
    a.click();
    URL.revokeObjectURL(a.href);
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