import { Component } from './base.js';

export class Menu extends Component {
  constructor() {
    super();
  }

  initialize() {
    this.state = {
      corpus: 'NYC TLC',
      config: 'B',
      load: 'Base',
      running: false,
      runId: 'ID: —',
      stateText: '● Lista para iniciar'
    };
  }

  render() {
    const { corpus, config, load, running, runId, stateText } = this.state;

    const corpora = [
      { id: 'NYC TLC', icon: '🚕', name: 'NYC TLC', desc: 'Transporte' },
      { id: 'SEC EDGAR', icon: '🏛', name: 'SEC EDGAR', desc: 'Información financiera' },
      { id: 'EIA-930', icon: '⚡', name: 'EIA-930', desc: 'Sistema energético' }
    ];

    const configs = [
      { id: 'B', title: 'B', line1: 'R03 + R04', line2: 'Procesamiento distribuido' },
      { id: 'C', title: 'C', line1: 'R01 + R02 + R03 + R04', line2: 'Configuración combinada' }
    ];

    const loads = ['Base', 'Intermedia', 'Alta'];

    this.shadowRoot.innerHTML = `
      <div part="col">
        <!-- 01. Seleccionar corpus -->
        <section part="card">
          <div part="head">
            <span><i part="num">01</i>Seleccionar corpus</span>
            <span part="small">Fuente de datos</span>
          </div>
          <div part="grid3">
            ${corpora.map((c) => {
              const active = corpus === c.id;
              return `
                <button type="button" data-corpus="${c.id}" part="pick ${active ? 'pick-active' : ''}" ${running ? 'disabled' : ''}>
                  <strong part="pick-title">${c.icon} ${c.name}</strong>
                  <span part="pick-sub">${c.desc}</span>
                  ${active ? '<em part="pick-em">✓ SELECCIONADO</em>' : ''}
                </button>
              `;
            }).join('')}
          </div>
          <div part="status">
            <span>Disponibilidad: <b part="ok">● Disponible</b></span>
            <span>Integridad: <b part="ok">● Verificada</b></span>
            <span>Versión: <b>2024</b></span>
          </div>
        </section>

        <!-- 02. Configuración experimental -->
        <section part="card">
          <div part="head">
            <span><i part="num">02</i>Configuración experimental</span>
          </div>
          <div part="label label-flush">Configuración de recursos</div>
          <div part="grid2">
            ${configs.map((cfg) => {
              const active = config === cfg.id;
              return `
                <button type="button" data-config="${cfg.id}" part="config ${active ? 'config-active' : ''}" ${running ? 'disabled' : ''}>
                  <strong part="config-title">${cfg.title}</strong>
                  <p part="config-p">${cfg.line1}</p>
                  <p part="config-p">${cfg.line2}</p>
                </button>
              `;
            }).join('')}
          </div>

          <div part="label">Escenario de carga</div>
          <div part="grid3">
            ${loads.map((l) => {
              const active = load === l;
              return `
                <button type="button" data-load="${l}" part="load ${active ? 'load-active' : ''}" ${running ? 'disabled' : ''}>
                  ${l}
                </button>
              `;
            }).join('')}
          </div>
        </section>

        <!-- 03. Control de ejecución -->
        <section part="card">
          <div part="head">
            <span><i part="num">03</i>Control de ejecución</span>
            <span part="small">${runId}</span>
          </div>
          <div part="actions">
            <button id="start" type="button" part="btn btn-start" ${running ? 'disabled' : ''}>▶ START</button>
            <button id="stop" type="button" part="btn btn-stop" ${!running ? 'disabled' : ''}>■ STOP</button>
            <span part="state">${stateText}</span>
          </div>
          <p part="small small-note">
            START valida la configuración e inicia la prueba. STOP solicita una detención controlada y conserva los resultados parciales.
          </p>
        </section>
      </div>
    `;
    this.listen();
  }

  listen() {
    const emit = (action, payload = {}) => {
      this.on({ target: 'f', action, payload });
      this.on({ target: 'b', action, payload });
    };

    this.listall('[data-corpus]').forEach((btn) => {
      btn.onclick = () => {
        if (this.state.running) return;
        emit('select-corpus', { corpus: btn.dataset.corpus });
      };
    });

    this.listall('[data-config]').forEach((btn) => {
      btn.onclick = () => {
        if (this.state.running) return;
        emit('select-config', { config: btn.dataset.config });
      };
    });

    this.listall('[data-load]').forEach((btn) => {
      btn.onclick = () => {
        if (this.state.running) return;
        emit('select-load', { load: btn.dataset.load });
      };
    });

    const startBtn = this.get('start');
    const stopBtn = this.get('stop');

    if (startBtn) {
      startBtn.onclick = () => emit('start', {
        corpus: this.state.corpus,
        config: this.state.config,
        load: this.state.load
      });
    }

    if (stopBtn) {
      stopBtn.onclick = () => emit('stop', {});
    }
  }
}