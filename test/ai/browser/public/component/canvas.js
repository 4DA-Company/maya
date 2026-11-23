import { Component } from './base.js';

export class Canvas extends Component {
  constructor() {
    super();
  }

  initialize() {
    this.state = {
      mode: 'A',
      running: false,
      history: []
    };
  }

  render() {
    const { mode, running, history } = this.state;
    const isModeB = mode === 'B';

    const kpiCaption = isModeB
      ? 'Modalidad B · Operaciones paralelas'
      : 'Modalidad A · Solicitudes independientes';

    const flowCaption = isModeB
      ? 'Seguimiento de operaciones, suboperaciones y recomposición'
      : 'Seguimiento de solicitudes a través de TDPnet';

    const coordIndicator = isModeB ? 'Indicador relevante' : 'Indicador complementario';

    const stages = [
      ['Solicitud', 'Recepción'],
      ['Asignación', 'Bridge destino'],
      ['Procesamiento', 'Operaciones Trailer'],
      ['Generación', 'Tokens de salida'],
      ['Respuesta', 'Entrega'],
      ['Registro', 'Evidencia']
    ];

    const stagesHtml = stages.map(([title, sub], idx) => {
      const active = running && idx < 3;
      return `
        <div part="stage ${active ? 'stage-active' : ''}">
          <b part="stage-title"><i part="dot ${active ? 'dot-active' : ''}"></i>${title}</b>
          <small part="stage-sub">${sub}</small>
        </div>
      `;
    }).join('');

    const historyRows = history.length
      ? history.map((x) => `
          <tr>
            <td part="td">${x.id}</td>
            <td part="td">${x.mode}</td>
            <td part="td">${x.model.split(' · ')[0]}</td>
            <td part="td">${x.config}</td>
            <td part="td">${x.status}</td>
            <td part="td">${x.date}</td>
          </tr>
        `).join('')
      : `<tr><td colspan="6" part="td empty">No hay ejecuciones registradas en este prototipo.</td></tr>`;

    this.shadowRoot.innerHTML = `
      <div part="right-col">
        <!-- 4. Rendimiento de la red -->
        <section part="card">
          <div part="statusline">
            <div>
              <h2 part="card-title card-title-flush">4. Rendimiento de la red</h2>
              <div part="sub">${kpiCaption}</div>
            </div>
            <ui-label text="Lectura en tiempo real · Sin conexión" variant="tag" exportparts="tag"></ui-label>
          </div>

          <div part="kpis">
            <div part="kpi"><span part="kpi-label">Solicitudes completadas / s</span><strong part="kpi-val">—</strong><small part="kpi-unit">Solicitudes/s</small></div>
            <div part="kpi"><span part="kpi-label">Tokens de entrada / s</span><strong part="kpi-val">—</strong><small part="kpi-unit">Tokens/s</small></div>
            <div part="kpi"><span part="kpi-label">Tokens de salida / s</span><strong part="kpi-val">—</strong><small part="kpi-unit">Tokens/s</small></div>
            <div part="kpi"><span part="kpi-label">Latencia total P95</span><strong part="kpi-val">—</strong><small part="kpi-unit">Milisegundos</small></div>
          </div>

          <div part="two two-spaced">
            <div part="rows">
              <div part="rowitem"><span part="row-label">TTFT · Primer token</span><b part="row-val">—</b></div>
              <div part="rowitem"><span part="row-label">ITL · Intervalo entre tokens</span><b part="row-val">—</b></div>
              <div part="rowitem"><span part="row-label">Latencia P50 / P90 / P99 / P99.9</span><b part="row-val">—</b></div>
            </div>
            <div part="rows">
              <div part="rowitem"><span part="row-label">Solicitudes recibidas</span><b part="row-val">—</b></div>
              <div part="rowitem"><span part="row-label">Pendientes / rechazadas / fallidas</span><b part="row-val">—</b></div>
              <div part="rowitem"><span part="row-label">Capacidad máxima sostenible</span><b part="row-val">Por determinar</b></div>
            </div>
          </div>
        </section>

        <!-- 5. Flujo de procesamiento -->
        <section part="card">
          <div part="statusline">
            <div>
              <h2 part="card-title card-title-flush">5. Flujo de procesamiento</h2>
              <div part="sub">${flowCaption}</div>
            </div>
            <ui-label text="Estados de ejecución" variant="tag" exportparts="tag"></ui-label>
          </div>
          <div part="pipeline">${stagesHtml}</div>
          ${isModeB ? `
            <div part="notice notice-mt">
              Modalidad B: mostrar aquí las operaciones/suboperaciones distribuidas, los Bridges ejecutores y la recomposición del resultado, únicamente cuando el mecanismo haya sido validado por el CTO.
            </div>
          ` : ''}
        </section>

        <!-- 6 & 7. Bridges/recursos + Comunicación -->
        <div part="two">
          <section part="card">
            <h2 part="card-title">6. Bridges y recursos</h2>
            <div part="rows">
              <div>
                <div part="rowitem"><span part="row-label">CPU · uso por Bridge</span><b part="row-val">—</b></div>
                <div part="meter"><i part="meter-bar"></i></div>
              </div>
              <div>
                <div part="rowitem"><span part="row-label">RAM · uso por Bridge</span><b part="row-val">—</b></div>
                <div part="meter"><i part="meter-bar"></i></div>
              </div>
              <div part="rowitem"><span part="row-label">Trabajo ejecutado por Bridge</span><b part="row-val">—</b></div>
              <div part="rowitem"><span part="row-label">Bridges disponibles / utilizados</span><b part="row-val">—</b></div>
              <div part="rowitem"><span part="row-label">Balance de carga</span><b part="row-val">—</b></div>
            </div>
          </section>

          <section part="card">
            <h2 part="card-title">7. Comunicación y coordinación</h2>
            <div part="rows">
              <div part="rowitem"><span part="row-label">Tráfico de red</span><b part="row-val">—</b></div>
              <div part="rowitem"><span part="row-label">Transferencia entre Bridges</span><b part="row-val">—</b></div>
              <div part="rowitem"><span part="row-label">Tiempo de asignación</span><b part="row-val">—</b></div>
              <div part="rowitem"><span part="row-label">Tiempo de coordinación</span><b part="row-val">No aplica como métrica central</b></div>
              <div part="rowitem"><span part="row-label">Desbalance / espera</span><b part="row-val">${coordIndicator}</b></div>
            </div>
          </section>
        </div>

        <!-- 8 & 9. Energía + Costos -->
        <div part="two">
          <section part="card">
            <h2 part="card-title">8. Energía y eficiencia</h2>
            <div part="rows">
              <div part="rowitem"><span part="row-label">Consumo energético total</span><b part="row-val">— kWh</b></div>
              <div part="rowitem"><span part="row-label">Solicitudes / kWh</span><b part="row-val">—</b></div>
              <div part="rowitem"><span part="row-label">Millones de tokens / kWh</span><b part="row-val">—</b></div>
              <div part="rowitem"><span part="row-label">Wh / solicitud</span><b part="row-val">—</b></div>
            </div>
          </section>

          <section part="card">
            <h2 part="card-title">9. Costos y escalamiento</h2>
            <div part="rows">
              <div part="rowitem"><span part="row-label">CAPEX</span><b part="row-val">—</b></div>
              <div part="rowitem"><span part="row-label">OPEX</span><b part="row-val">—</b></div>
              <div part="rowitem"><span part="row-label">Costo / millón de tokens</span><b part="row-val">—</b></div>
              <div part="rowitem"><span part="row-label">Costo incremental de capacidad</span><b part="row-val">—</b></div>
            </div>
          </section>
        </div>

        <!-- 10. Incidencias e historial -->
        <section part="card">
          <div part="statusline">
            <div>
              <h2 part="card-title card-title-flush">10. Incidencias e historial</h2>
              <div part="sub">Conservar ejecuciones individuales y evidencia original</div>
            </div>
            <button id="export" type="button" part="btn btn-secondary btn-auto">Exportar CSV</button>
          </div>
          <table part="log">
            <thead>
              <tr>
                <th part="th">ID</th>
                <th part="th">Modalidad</th>
                <th part="th">Modelo</th>
                <th part="th">Config.</th>
                <th part="th">Estado</th>
                <th part="th">Fecha/hora</th>
              </tr>
            </thead>
            <tbody>${historyRows}</tbody>
          </table>
          <div part="rowitem rowitem-mt">
            <span part="row-label">Incidencias / eventos</span>
            <b part="row-val">Sin datos</b>
          </div>
        </section>

        <div part="notice">
          <b>Nota de integridad experimental:</b> esta interfaz es un prototipo visual. No genera mediciones ni se conecta a TDPnet. Los campos sin telemetría aparecen como “—”. Diferenciar siempre valores medidos, calculados y estimados; no atribuir capacidad a equipos o Bridges que no hayan participado efectivamente.
        </div>
      </div>
    `;
    this.listen();
  }

  listen() {
    const exportBtn = this.get('export');
    if (exportBtn) {
      exportBtn.onclick = () => {
        this.on({ target: 'f', action: 'export-csv', payload: {} });
        this.on({ target: 'b', action: 'export-csv', payload: {} });
      };
    }
  }
}