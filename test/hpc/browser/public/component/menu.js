import { Component } from './base.js';

export class Menu extends Component {
  constructor() {
    super();
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
      model: 'Qwen3-14B · Principal',
      profile: 'P3',
      test: 'Carga progresiva',
      load: 'Tasa de llegada controlada',
      operation: 'Definida por configuración técnica validada',
      configs: [
        ['C0', '2 Bridges'],
        ['C1', '3 Bridges'],
        ['C2', '4–5 Bridges'],
        ['C3', 'Todos disponibles'],
        ['C4', 'C3 + adicionales']
      ]
    };
  }

  render() {
    const {
      mode, stage, running, canClose, runId,
      statusText, statusVariant, model, profile, test, load, operation, configs
    } = this.state;

    const isModeB = mode === 'B';
    const modeNote = isModeB
      ? 'Modalidad B: se distribuyen operaciones o suboperaciones Trailer técnicamente compatibles. La coordinación y recomposición se miden por separado.'
      : 'Modalidad A: cada solicitud completa se asigna a un Bridge disponible. La unidad principal de medición es la solicitud completada.';

    const configBoxes = configs.map((c, i) => {
      const parts = ['config'];
      if (i < stage) parts.push('config-done');
      if (i === stage) parts.push('config-current');
      return `
        <div part="${parts.join(' ')}">
          <b part="config-code">${c[0]}</b>
          <small part="config-desc">${c[1]}</small>
        </div>
      `;
    }).join('');

    const currentConfigLabel = `${configs[stage][0]}${stage === 0 ? ' · Referencia' : ' · Etapa'}`;

    this.shadowRoot.innerHTML = `
      <aside part="sidebar">
        <!-- 1. Configuración experimental -->
        <section part="card">
          <h2 part="card-title">1. Configuración experimental</h2>

          <div part="field">
            <label part="label">MODALIDAD DE EJECUCIÓN</label>
            <div part="mode-grid">
              <button id="modeA" type="button" part="mode-btn ${!isModeB ? 'mode-btn-active' : ''}">
                <b part="mode-btn-title">A · Solicitudes completas</b>
                <span part="mode-btn-sub">Distribución de solicitudes independientes entre Bridges.</span>
              </button>
              <button id="modeB" type="button" part="mode-btn ${isModeB ? 'mode-btn-active' : ''}">
                <b part="mode-btn-title">B · Operaciones paralelas</b>
                <span part="mode-btn-sub">Distribución colaborativa de operaciones Trailer.</span>
              </button>
            </div>
          </div>

          <div part="field">
            <label part="label" for="model">MODELO</label>
            <select id="model" part="select">
              <option ${model === 'Qwen3-14B · Principal' ? 'selected' : ''}>Qwen3-14B · Principal</option>
              <option ${model === 'Qwen3-8B · Complementario' ? 'selected' : ''}>Qwen3-8B · Complementario</option>
            </select>
          </div>

          <div part="field">
            <label part="label" for="profile">PERFIL DE CARGA</label>
            <select id="profile" part="select">
              <option value="P1" ${profile === 'P1' ? 'selected' : ''}>P1 · Muy corto (256 / 256 tokens)</option>
              <option value="P2" ${profile === 'P2' ? 'selected' : ''}>P2 · Corto (512 / 512 tokens)</option>
              <option value="P3" ${profile === 'P3' ? 'selected' : ''}>P3 · Medio (2.048 / 1.024 tokens)</option>
              <option value="P4" ${profile === 'P4' ? 'selected' : ''}>P4 · Largo (4.096 / 1.024 tokens)</option>
              <option value="P5" ${profile === 'P5' ? 'selected' : ''}>P5 · Extremo (6.144 / 1.024 tokens)</option>
            </select>
          </div>

          <div part="field">
            <label part="label" for="test">TIPO DE PRUEBA</label>
            <select id="test" part="select">
              <option ${test === 'Carga progresiva' ? 'selected' : ''}>Carga progresiva</option>
              <option ${test === 'Concurrencia creciente' ? 'selected' : ''}>Concurrencia creciente</option>
              <option ${test === 'Carga sostenida · 2 h' ? 'selected' : ''}>Carga sostenida · 2 h</option>
              <option ${test === 'Resistencia · 8 h' ? 'selected' : ''}>Resistencia · 8 h</option>
              <option ${test === 'Operación extendida · 24 h' ? 'selected' : ''}>Operación extendida · 24 h</option>
              <option ${test === 'Estrés / sobrecarga · 30 min' ? 'selected' : ''}>Estrés / sobrecarga · 30 min</option>
              <option ${test === 'Adaptación dinámica' ? 'selected' : ''}>Adaptación dinámica</option>
            </select>
          </div>

          <div part="field">
            <label part="label" for="load">MECANISMO DE GENERACIÓN DE CARGA</label>
            <select id="load" part="select">
              <option ${load === 'Tasa de llegada controlada' ? 'selected' : ''}>Tasa de llegada controlada</option>
              <option ${load === 'Concurrencia creciente' ? 'selected' : ''}>Concurrencia creciente</option>
              <option ${load === 'Ráfaga' ? 'selected' : ''}>Ráfaga</option>
              <option ${load === 'Carga variable' ? 'selected' : ''}>Carga variable</option>
              <option ${load === 'Carga mixta' ? 'selected' : ''}>Carga mixta</option>
            </select>
          </div>

          ${isModeB ? `
            <div part="field">
              <label part="label" for="operation">OPERACIÓN PARA MODALIDAD B</label>
              <select id="operation" part="select">
                <option ${operation === 'Definida por configuración técnica validada' ? 'selected' : ''}>Definida por configuración técnica validada</option>
                <option ${operation === 'Operaciones independientes' ? 'selected' : ''}>Operaciones independientes</option>
                <option ${operation === 'Suboperaciones distribuibles' ? 'selected' : ''}>Suboperaciones distribuibles</option>
              </select>
            </div>
          ` : ''}

          <div part="notice">${modeNote}</div>
        </section>

        <!-- 2. Escalamiento progresivo -->
        <section part="card">
          <h2 part="card-title">2. Escalamiento progresivo</h2>
          <div part="configs">${configBoxes}</div>
          <div part="config-note">
            Las cantidades son las propuestas del protocolo. La composición definitiva depende del inventario y la topología aprobados por el CTO.
          </div>
          <div part="rows rows-spaced">
            <div part="rowitem"><span part="row-label">Bridges habilitados</span><b part="row-val">Pendiente de inventario</b></div>
            <div part="rowitem"><span part="row-label">Bridges participantes</span><b part="row-val">Pendiente de telemetría</b></div>
            <div part="rowitem"><span part="row-label">Equipos físicos activos</span><b part="row-val">Pendiente de inventario</b></div>
            <div part="rowitem"><span part="row-label">Configuración actual</span><b part="row-val">${currentConfigLabel}</b></div>
          </div>
        </section>

        <!-- 3. Control de ejecución -->
        <section part="card">
          <h2 part="card-title">3. Control de ejecución</h2>
          <div part="statusline">
            <span part="sub">Estado de la prueba</span>
            <ui-label id="statusBadge" text="${statusText}" variant="${statusVariant}" exportparts="status,status-default,status-running,status-done"></ui-label>
          </div>
          <div part="rowitem rowitem-mb">
            <span part="row-label">ID de ejecución</span>
            <b part="row-val">${runId}</b>
          </div>
          <div part="actions">
            <button id="start" type="button" part="btn btn-start" ${running ? 'disabled' : ''}>▶ Iniciar</button>
            <button id="stop" type="button" part="btn btn-stop" ${!running ? 'disabled' : ''}>■ Detener</button>
          </div>
          <button id="close" type="button" part="btn btn-secondary btn-full" ${!canClose ? 'disabled' : ''}>
            Cerrar y registrar ejecución
          </button>
          <div part="config-note">
            El avance C0→C4 se habilita después de cerrar una ejecución. Este prototipo no controla Bridges reales.
          </div>
        </section>
      </aside>
    `;
    this.listen();
  }

  listen() {
    const emit = (action, payload = {}) => {
      this.on({ target: 'f', action, payload });
      this.on({ target: 'b', action, payload });
    };

    const modeA = this.get('modeA');
    const modeB = this.get('modeB');
    if (modeA) modeA.onclick = () => emit('mode-change', { mode: 'A' });
    if (modeB) modeB.onclick = () => emit('mode-change', { mode: 'B' });

    ['model', 'profile', 'test', 'load', 'operation'].forEach((fieldId) => {
      const el = this.get(fieldId);
      if (el) {
        el.onchange = (e) => {
          this.state[fieldId] = e.target.value;
          emit('config-change', { field: fieldId, value: e.target.value });
        };
      }
    });

    const startBtn = this.get('start');
    const stopBtn = this.get('stop');
    const closeBtn = this.get('close');

    if (startBtn) startBtn.onclick = () => emit('start', { config: this.getFormConfig() });
    if (stopBtn) stopBtn.onclick = () => emit('stop', {});
    if (closeBtn) closeBtn.onclick = () => emit('close-run', { config: this.getFormConfig() });
  }

  getFormConfig() {
    return {
      mode: this.state.mode,
      model: this.state.model,
      profile: this.state.profile,
      test: this.state.test,
      load: this.state.load,
      operation: this.state.operation
    };
  }
}