import { Component } from './base.js';

export class Canvas extends Component {
  constructor() {
    super();
  }

  initialize() {
    this.state = {
      activeStep: -1,
      done: false,
      pct: 0,
      historyId: '—',
      incidentsText: 'No hay incidencias registradas.',
      pipeNames: [
        'Data Ingestion',
        'Data Validation',
        'Data Cleaning',
        'Data Normalization',
        'Data Transformation',
        'Data Aggregation',
        'Analytical Processing',
        'Output & Verification'
      ]
    };
  }

  render() {
    const { activeStep, done, pct, historyId, incidentsText, pipeNames } = this.state;

    const pipesHtml = pipeNames.map((name, i) => {
      const status = i < activeStep
        ? 'Completado'
        : i === activeStep && !done
          ? 'En ejecución'
          : 'Pendiente';
      const code = `P${String(i + 1).padStart(2, '0')}`;
      return `
        <div part="pipe">
          <span part="code">${code}</span>
          <b>${name}</b>
          <small part="pipe-status">${status}</small>
        </div>
      `;
    }).join('');

    const resources = [
      'R01 · Cloud server',
      'R02 · Physical server',
      'R03 · Mini PCs',
      'R04 · Laptops'
    ];

    this.shadowRoot.innerHTML = `
      <div part="canvas-grid">
        <!-- Left Lower Cards: 04 & 06 -->
        <div part="col">
          <!-- 04. Supervisión del procesamiento -->
          <section part="card">
            <div part="head">
              <span><i part="num">04</i>Supervisión del procesamiento</span>
              <span part="small">${pct} %</span>
            </div>
            <div part="pipes">${pipesHtml}</div>
            <div part="bar"><div part="fill" style="width:${pct}%"></div></div>

            <div part="head head-spaced">
              <span>Recursos participantes</span>
              <span part="small">Estado de conexión</span>
            </div>
            <div part="resources">
              ${resources.map((r) => `
                <div part="resource">
                  ${r}
                  <ui-label text="Sin conexión" variant="tag" exportparts="tag"></ui-label>
                </div>
              `).join('')}
            </div>
            <p part="small small-note">
              Durante la ejecución se mostrarán Bridges activos, CPU y memoria por equipo.
            </p>
          </section>

          <!-- 06. Detalle del procesamiento -->
          <section part="card">
            <div part="head">
              <span><i part="num">06</i>Detalle del procesamiento</span>
              <span part="small">Datos de la ejecución</span>
            </div>
            <div part="data">
              <div part="datum"><span part="datum-label">Archivos de entrada</span><strong part="datum-val">—</strong></div>
              <div part="datum"><span part="datum-label">Registros procesados</span><strong part="datum-val">—</strong></div>
              <div part="datum"><span part="datum-label">Registros rechazados</span><strong part="datum-val">—</strong></div>
              <div part="datum"><span part="datum-label">Duplicados detectados</span><strong part="datum-val">—</strong></div>
              <div part="datum"><span part="datum-label">Registros transformados</span><strong part="datum-val">—</strong></div>
              <div part="datum"><span part="datum-label">Resultados generados</span><strong part="datum-val">—</strong></div>
            </div>

            <div part="label">Parámetros calculados</div>
            <table part="table">
              <thead>
                <tr><th part="th">Parámetro</th><th part="th th-right">Resultado</th></tr>
              </thead>
              <tbody>
                <tr><td part="td">AVG</td><td part="td td-right">—</td></tr>
                <tr><td part="td">P95</td><td part="td td-right">—</td></tr>
                <tr><td part="td">Máximo / mínimo</td><td part="td td-right">—</td></tr>
                <tr><td part="td">Variaciones</td><td part="td td-right">—</td></tr>
                <tr><td part="td">Indicadores analíticos</td><td part="td td-right">—</td></tr>
              </tbody>
            </table>
            <p part="small small-note">
              Los parámetros, unidades y resultados dependen de las operaciones específicas de cada corpus.
            </p>
          </section>
        </div>

        <!-- Right Column Cards: 05, 07, 08 -->
        <aside part="col">
          <!-- 05. Resultados principales -->
          <section part="card">
            <div part="head">
              <span><i part="num">05</i>Resultados principales</span>
            </div>
            <div part="metrics">
              <div part="metric"><span part="metric-label">Tiempo total</span><strong part="metric-val">—</strong></div>
              <div part="metric"><span part="metric-label">Throughput</span><strong part="metric-val">—</strong></div>
              <div part="metric"><span part="metric-label">CPU / Memoria</span><strong part="metric-val">—</strong></div>
              <div part="metric"><span part="metric-label">Energía</span><strong part="metric-val">—</strong></div>
              <div part="metric"><span part="metric-label">Productividad CPU</span><strong part="metric-val">—</strong></div>
              <div part="metric"><span part="metric-label">Coste por millón de registros</span><strong part="metric-val">—</strong></div>
            </div>
            <p part="small small-note">Distinguir siempre valores medidos, calculados y estimados.</p>
          </section>

          <!-- 07. Incidencias -->
          <section part="card">
            <div part="head">
              <span><i part="num">07</i>Incidencias</span>
            </div>
            <div part="note">${incidentsText}</div>
          </section>

          <!-- 08. Historial y exportación -->
          <section part="card">
            <div part="head">
              <span><i part="num">08</i>Historial y exportación</span>
            </div>
            <div part="history">
              <span>ID de ejecución</span>
              <b>${historyId}</b>
            </div>
            <div part="history">
              <span>Historial de ejecuciones</span>
              <span part="small">Consultar registro</span>
            </div>
            <div part="exports">
              <button type="button" data-export="CSV" part="export-btn">CSV</button>
              <button type="button" data-export="JSON" part="export-btn">JSON</button>
              <button type="button" data-export="PDF" part="export-btn">PDF</button>
            </div>
          </section>
        </aside>
      </div>
    `;
    this.listen();
  }

  listen() {
    this.listall('[data-export]').forEach((btn) => {
      btn.onclick = () => {
        const format = btn.dataset.export;
        this.on({ target: 'f', action: 'export', payload: { format } });
        this.on({ target: 'b', action: 'export', payload: { format } });
      };
    });
  }
}