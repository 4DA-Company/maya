import { Component } from './base.js';

export class Dashboard extends Component {
  constructor() {
    super();
    this.timer = null;
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
      corpus: 'NYC TLC',
      config: 'B',
      load: 'Base',
      running: false,
      step: 0,
      activeStep: -1,
      done: false,
      pct: 0,
      runId: 'ID: —',
      historyId: '—',
      stateText: '● Lista para iniciar',
      incidentsText: 'No hay incidencias registradas.'
    };
  }

  update(payload) {
    super.update(payload);
    this.syncChildren();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div part="wrap">
        <main-header
          id="header"
          exportparts="header,brand,logo,brand-title,muted,pill">
        </main-header>

        <h1 part="page-title">Procesamiento de datos</h1>
        <p part="sub">Configura, ejecuta y supervisa las pruebas experimentales de T1 desde una sola pantalla.</p>

        <div part="layout">
          <main-menu
            id="menu"
            exportparts="col,card,head,num,small,small-note,grid3,grid2,pick,pick-active,pick-title,pick-sub,pick-em,status,ok,label,label-flush,config,config-active,config-title,config-p,load,load-active,actions,btn,btn-start,btn-stop,state">
          </main-menu>

          <main-canvas
            id="canvas"
            exportparts="canvas-grid,col,card,head,head-spaced,num,small,small-note,pipes,pipe,code,pipe-status,bar,fill,resources,resource,tag,data,datum,datum-label,datum-val,label,table,th,th-right,td,td-right,metrics,metric,metric-label,metric-val,note,history,exports,export-btn">
          </main-canvas>
        </div>

        <footer part="footer">
          4DA GLOBAL HOLDING · TDPnet Experimental Console · Diseño conceptual T1
        </footer>
      </div>
    `;
    this.syncChildren();
    this.listen();
  }

  syncChildren() {
    if (this.menu) {
      this.menu.update({
        data: {
          corpus: this.state.corpus,
          config: this.state.config,
          load: this.state.load,
          running: this.state.running,
          runId: this.state.runId,
          stateText: this.state.stateText
        }
      });
    }
    if (this.canvas) {
      this.canvas.update({
        data: {
          activeStep: this.state.activeStep,
          done: this.state.done,
          pct: this.state.pct,
          historyId: this.state.historyId,
          incidentsText: this.state.incidentsText
        }
      });
    }
  }

  handleAction(action, payload) {
    switch (action) {
      case 'select-corpus':
        this.state.corpus = payload.corpus;
        this.syncChildren();
        break;

      case 'select-config':
        this.state.config = payload.config;
        this.syncChildren();
        break;

      case 'select-load':
        this.state.load = payload.load;
        this.syncChildren();
        break;

      case 'start': {
        if (this.state.running) return;
        const id = 'T1-' + new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
        this.state.running = true;
        this.state.step = 0;
        this.state.activeStep = 0;
        this.state.done = false;
        this.state.pct = 0;
        this.state.runId = 'ID: ' + id;
        this.state.historyId = id;
        this.state.stateText = '● Ejecutando · simulación visual';
        this.state.incidentsText = 'Sin incidencias registradas.';
        this.syncChildren();

        this.timer = setInterval(() => {
          this.state.step += 1;
          this.state.activeStep = this.state.step;
          this.state.pct = Math.round((this.state.step / 8) * 100);

          if (this.state.step >= 8) {
            clearInterval(this.timer);
            this.timer = null;
            this.state.running = false;
            this.state.done = true;
            this.state.stateText = '● Finalizada · simulación visual';
          }
          this.syncChildren();
        }, 850);
        break;
      }

      case 'stop':
        if (!this.state.running) return;
        if (!confirm('¿Deseas detener la ejecución? Se conservará el progreso parcial.')) return;
        clearInterval(this.timer);
        this.timer = null;
        this.state.running = false;
        this.state.stateText = '● Detenida manualmente · simulación visual';
        this.state.incidentsText = 'Ejecución detenida manualmente. En la versión conectada se conservarán los registros parciales.';
        this.syncChildren();
        break;

      case 'export': {
        const msgMap = {
          CSV: 'La exportación CSV se conectará al motor experimental.',
          JSON: 'La exportación JSON se conectará al motor experimental.',
          PDF: 'La generación PDF se conectará al motor experimental.'
        };
        alert(msgMap[payload.format] || 'Exportación pendiente de conexión.');
        break;
      }
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