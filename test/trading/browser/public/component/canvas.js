import { Component } from './base.js';

export class Canvas extends Component {
  constructor() {
    super();
  }

  initialize() {
    this.state = {
      running: false,
      runId: '—',
      validationStatus: 'pendiente'
    };
  }

  render() {
    const { running, runId, validationStatus } = this.state;

    const stages = [
      ['Receive', 'Recepción de transacciones'],
      ['Decode', 'Decodificación'],
      ['FIFO Window', 'Ventana de transacciones'],
      ['Statistical Baseline', 'Línea base calculada desde FIFO'],
      ['Anomaly Analysis', 'Análisis de anomalías'],
      ['Real-Time Anomaly Intelligence', 'Resultado final disponible']
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

    this.shadowRoot.innerHTML = `
      <div part="workspace">
        <!-- KPI Strip -->
        <section part="kpis">
          <div part="kpi">
            <h3 part="section-h3">Recepción</h3>
            <div part="kpi-val">— <small part="kpi-unit">tx/s</small></div>
            <div part="kpi-sub">Transacciones recibidas por segundo</div>
          </div>
          <div part="kpi">
            <h3 part="section-h3">Productividad efectiva</h3>
            <div part="kpi-val">— <small part="kpi-unit">tx/s</small></div>
            <div part="kpi-sub">Transacciones que completan el pipeline</div>
          </div>
          <div part="kpi">
            <h3 part="section-h3">Latencia extremo a extremo</h3>
            <div part="kpi-val">— <small part="kpi-unit">ms · P95</small></div>
            <div part="kpi-sub">Receive → Real-Time Anomaly Intelligence</div>
          </div>
          <div part="kpi">
            <h3 part="section-h3">Pendientes</h3>
            <div part="kpi-val">—</div>
            <div part="kpi-sub">Transacciones pendientes de estado final</div>
          </div>
        </section>

        <!-- Primary Layout: Pipeline Aladino + Latencia y FIFO -->
        <section part="layout">
          <div part="panel">
            <h2 part="panel-title">Pipeline Aladino · estado por etapa</h2>
            <div part="pipe">${stagesHtml}</div>

            <h3 part="section-h3 section-h3-mt">Conciliación de transacciones</h3>
            <div part="metrics">
              <div part="metric"><span part="metric-label">Recibidas</span><b part="metric-val">—</b></div>
              <div part="metric"><span part="metric-label">Procesadas correctamente</span><b part="metric-val">—</b></div>
              <div part="metric"><span part="metric-label">Descartadas · con motivo</span><b part="metric-val">—</b></div>
              <div part="metric"><span part="metric-label">Fallidas</span><b part="metric-val">—</b></div>
              <div part="metric"><span part="metric-label">Pendientes</span><b part="metric-val">—</b></div>
              <div part="metric"><span part="metric-label">Duplicadas · identificadas aparte</span><b part="metric-val">—</b></div>
            </div>
            <div part="note">
              Control de integridad: recibidas = procesadas + descartadas + pendientes + fallidas. Duplicadas se identifican por separado.
            </div>
          </div>

          <div part="panel">
            <h2 part="panel-title">Latencia y FIFO</h2>
            <div part="metrics">
              <div part="metric"><span part="metric-label">Latencia promedio</span><b part="metric-val">— ms</b></div>
              <div part="metric"><span part="metric-label">P50</span><b part="metric-val">— ms</b></div>
              <div part="metric"><span part="metric-label">P95</span><b part="metric-val">— ms</b></div>
              <div part="metric"><span part="metric-label">P99</span><b part="metric-val">— ms</b></div>
              <div part="metric"><span part="metric-label">Ocupación FIFO</span><b part="metric-val">—</b></div>
              <div part="metric"><span part="metric-label">Memoria FIFO</span><b part="metric-val">—</b></div>
              <div part="metric"><span part="metric-label">Tiempo de actualización</span><b part="metric-val">—</b></div>
              <div part="metric"><span part="metric-label">Antigüedad de ventana</span><b part="metric-val">—</b></div>
            </div>
            <div part="note">
              Los percentiles se mostrarán cuando exista volumen suficiente de observaciones. La profundidad de referencia para escalamiento queda fijada tras la caracterización y aprobación del CTO.
            </div>
          </div>
        </section>

        <!-- Secondary 2x2 Subgrid -->
        <section part="subgrid">
          <div part="panel">
            <h2 part="panel-title">Recursos y distribución</h2>
            <table part="table">
              <thead>
                <tr><th part="th">Indicador</th><th part="th">Valor</th><th part="th">Detalle</th></tr>
              </thead>
              <tbody>
                <tr><td part="td">CPU</td><td part="td">—</td><td part="td">Por nodo</td></tr>
                <tr><td part="td">RAM</td><td part="td">—</td><td part="td">Uso y evolución</td></tr>
                <tr><td part="td">Almacenamiento</td><td part="td">—</td><td part="td">Ocupación / lectura-escritura</td></tr>
                <tr><td part="td">Red</td><td part="td">—</td><td part="td">Tráfico / ancho de banda / latencia</td></tr>
                <tr><td part="td">Coordinación</td><td part="td">—</td><td part="td">Sobrecarga de distribución</td></tr>
              </tbody>
            </table>
            <div part="note">
              Nodos, ubicaciones, enlaces y recursos participantes se cargarán desde la topología aprobada. No se presupone una distribución geográfica.
            </div>
          </div>

          <div part="panel">
            <h2 part="panel-title">Energía</h2>
            <div part="metrics">
              <div part="metric"><span part="metric-label">Consumo total</span><b part="metric-val">— kWh</b></div>
              <div part="metric"><span part="metric-label">kWh / 1.000 tx</span><b part="metric-val">—</b></div>
              <div part="metric"><span part="metric-label">Productividad energética</span><b part="metric-val">— tx/kWh</b></div>
              <div part="metric"><span part="metric-label">Consumo por nodo</span><b part="metric-val">—</b></div>
            </div>
            <div part="note">
              Medición directa en equipos físicos cuando sea posible. Datos cloud o estimaciones documentadas aparecerán identificados como tales.
            </div>
          </div>

          <div part="panel">
            <h2 part="panel-title">Costes</h2>
            <div part="metrics">
              <div part="metric"><span part="metric-label">CAPEX</span><b part="metric-val">—</b></div>
              <div part="metric"><span part="metric-label">OPEX</span><b part="metric-val">—</b></div>
              <div part="metric"><span part="metric-label">TCO</span><b part="metric-val">—</b></div>
              <div part="metric"><span part="metric-label">Coste / 1.000 tx</span><b part="metric-val">—</b></div>
            </div>
            <div part="note">
              Incluir costes operativos atribuibles y, cuando corresponda, coste de oportunidad de equipos existentes. No tratar los recursos existentes como gratuitos.
            </div>
          </div>

          <div part="panel">
            <h2 part="panel-title">Estabilidad e incidencias</h2>
            <div part="metrics">
              <div part="metric"><span part="metric-label">Interrupciones</span><b part="metric-val">—</b></div>
              <div part="metric"><span part="metric-label">Errores</span><b part="metric-val">—</b></div>
              <div part="metric"><span part="metric-label">Transacciones pendientes</span><b part="metric-val">—</b></div>
              <div part="metric"><span part="metric-label">Tiempo de operación</span><b part="metric-val">—</b></div>
            </div>
            <table part="table table-mt">
              <thead>
                <tr><th part="th">Hora</th><th part="th">Incidencia</th><th part="th">Estado</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td part="td">—</td>
                  <td part="td">Sin datos de ejecución</td>
                  <td part="td"><ui-label text="Pendiente" variant="warning" exportparts="warning-text"></ui-label></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Footer -->
        <footer part="footer">
          <div part="note">Registro de ejecución · Run ID: ${runId} · Estado de validación: ${validationStatus}</div>
          <div part="row">
            <button id="exportResults" type="button" part="btn btn-quiet">EXPORTAR RESULTADOS</button>
            <button id="viewHistory" type="button" part="btn btn-quiet">HISTORIAL</button>
          </div>
        </footer>
      </div>
    `;
    this.listen();
  }

  listen() {
    const emit = (action) => {
      this.on({ target: 'f', action, payload: {} });
      this.on({ target: 'b', action, payload: {} });
    };

    const exportBtn = this.get('exportResults');
    const historyBtn = this.get('viewHistory');

    if (exportBtn) exportBtn.onclick = () => emit('export-results');
    if (historyBtn) historyBtn.onclick = () => emit('open-history');
  }
}