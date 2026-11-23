import { Component } from './base.js';

export class Menu extends Component {
  constructor() {
    super();
  }

  initialize() {
    this.state = {
      active: 0,
      running: false,
      runStateText: 'Estado: preparado · sin ejecución activa',
      source: 'Ethereum · principal',
      mode: 'Flujo en vivo · principal',
      test: 'Escalamiento progresivo',
      fifo: 'Por aprobar por CTO',
      steps: [
        ['D0', 'Configuración inicial', 'D0 · Inicial'],
        ['D1', 'D0 + recurso', 'D1 · D0 + recurso'],
        ['D2', 'D1 + recursos', 'D2 · D1 + recursos'],
        ['D3', 'D2 + recursos restantes', 'D3 · D2 + recursos restantes']
      ]
    };
  }

  render() {
    const { active, running, runStateText, source, mode, test, fifo, steps } = this.state;

    const stepsHtml = steps.map((s, i) => {
      const statePart = i < active ? 'step-done' : i === active ? 'step-active' : 'step-locked';
      return `
        <div part="step ${statePart}" data-step="${i}">
          <strong part="step-title">${s[0]}</strong>
          <span part="step-sub">${s[1]}</span>
        </div>
      `;
    }).join('');

    const configOptions = steps.map((s, i) => {
      const locked = i > active;
      const label = i === 0 ? s[2] : `${s[2]}${locked ? ' · Bloqueada' : ''}`;
      return `<option value="${i}" ${i === active ? 'selected' : ''} ${locked ? 'disabled' : ''}>${label}</option>`;
    }).join('');

    const startLabel = active === 0 ? 'INICIAR D0' : `INICIAR D${active}`;

    this.shadowRoot.innerHTML = `
      <section part="top">
        <!-- Left Panel: Control de experimento -->
        <div part="panel">
          <h2 part="panel-title">Control de experimento</h2>
          <div part="row">
            <div part="field">
              <label part="label" for="source">Fuente blockchain</label>
              <select id="source" part="select">
                <option ${source === 'Ethereum · principal' ? 'selected' : ''}>Ethereum · principal</option>
                <option disabled>Bitcoin · etapa posterior</option>
              </select>
            </div>
            <div part="field">
              <label part="label" for="mode">Modalidad</label>
              <select id="mode" part="select">
                <option ${mode === 'Flujo en vivo · principal' ? 'selected' : ''}>Flujo en vivo · principal</option>
                <option ${mode === 'Replay · captura controlada' ? 'selected' : ''}>Replay · captura controlada</option>
              </select>
            </div>
            <div part="field">
              <label part="label" for="test">Tipo de prueba</label>
              <select id="test" part="select">
                <option ${test === 'Escalamiento progresivo' ? 'selected' : ''}>Escalamiento progresivo</option>
                <option ${test === 'Verificación funcional' ? 'selected' : ''}>Verificación funcional</option>
                <option ${test === 'Caracterización FIFO' ? 'selected' : ''}>Caracterización FIFO</option>
                <option ${test === 'Operación sostenida' ? 'selected' : ''}>Operación sostenida</option>
                <option ${test === 'Variación de carga' ? 'selected' : ''}>Variación de carga</option>
                <option ${test === 'Resiliencia · con aprobación CTO' ? 'selected' : ''}>Resiliencia · con aprobación CTO</option>
              </select>
            </div>
          </div>

          <div part="row row-actions">
            <button id="start" type="button" part="btn btn-primary" ${running || active > 3 ? 'disabled' : ''}>${startLabel}</button>
            <button id="stop" type="button" part="btn btn-stop" ${!running ? 'disabled' : ''}>DETENER</button>
            <ui-label id="runstate" text="${runStateText}" variant="note" exportparts="runstate-note"></ui-label>
          </div>

          <div part="note">
            El inicio/paro de este prototipo es demostrativo; la conexión real con Aladino y TDPnet queda para implementación.
          </div>
        </div>

        <!-- Right Panel: Escalamiento de recursos -->
        <div part="panel">
          <h2 part="panel-title">Escalamiento de recursos</h2>
          <div part="progress">${stepsHtml}</div>

          <div part="row row-config">
            <div part="field">
              <label part="label" for="config">Configuración activa</label>
              <select id="config" part="select">${configOptions}</select>
            </div>
            <div part="field">
              <label part="label" for="fifo">FIFO de referencia</label>
              <select id="fifo" part="select">
                <option ${fifo === 'Por aprobar por CTO' ? 'selected' : ''}>Por aprobar por CTO</option>
                <option disabled>1.000 · caracterización</option>
                <option disabled>10.000 · caracterización</option>
                <option disabled>50.000 · caracterización</option>
              </select>
            </div>
          </div>

          <div part="note">
            D1–D3 se habilitan en secuencia tras cerrar y registrar la etapa anterior. La composición de cada configuración provendrá del inventario/topología aprobados por CTO.
          </div>
        </div>
      </section>
    `;
    this.listen();
  }

  listen() {
    const emit = (action, payload = {}) => {
      this.on({ target: 'f', action, payload });
      this.on({ target: 'b', action, payload });
    };

    ['source', 'mode', 'test', 'fifo'].forEach((id) => {
      const el = this.get(id);
      if (el) {
        el.onchange = (e) => {
          this.state[id] = e.target.value;
          emit('config-change', { field: id, value: e.target.value });
        };
      }
    });

    const configEl = this.get('config');
    if (configEl) {
      configEl.onchange = () => {
        configEl.value = String(this.state.active);
      };
    }

    const startBtn = this.get('start');
    const stopBtn = this.get('stop');

    if (startBtn) {
      startBtn.onclick = () => emit('start', {
        source: this.state.source,
        mode: this.state.mode,
        test: this.state.test,
        fifo: this.state.fifo
      });
    }

    if (stopBtn) {
      stopBtn.onclick = () => emit('stop', {});
    }
  }
}