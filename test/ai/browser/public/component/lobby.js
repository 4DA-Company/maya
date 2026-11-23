import { Component } from "./base.js";

export class Lobby extends Component {
  constructor() {
    super();
    this.width = this.width || 360;
    this._messageText = "";
    this._messageType = "info"; // "info", "error", or "success"
    
    // Default domains dataset
    this.domains = [];
  }

  set password(value){
    this.get('password')?.setAttribute('value', value)
  }

  get password(){
    return this.get('password')?.value
  }

  get domain(){
    return this.get('domain')?.value
  }

  get accesskey(){
    return this.get('access-key')?.value.trim()
  }

  get address(){
    return this.get('address')?.value.trim()
  }

  set address(value){
      this.get('address')?.setAttribute('value', value)
  }

  set message(msg) {
    if (typeof msg === "string") {
      this._messageText = msg;
      this._messageType = "info";
    } else if (typeof msg === "object" && msg !== null) {
      this._messageText = msg.text || "";
      this._messageType = msg.type || "info";
    }

    const msgEl = this.get("message-box");
    if (msgEl) {
      msgEl.textContent = this._messageText;
      msgEl.setAttribute('part', `message-box message-box-${this._messageType} ${this._messageText ? 'message-box-show' : ''}`);
    }
  }

  /**
   * Applies the imported JSON payload data structure onto the form.
   * @param {Object} data 
   */
  applyImportedData(data) {
    try {
      if (!data) return;

      // 1. Update domains dropdown if provided
      if (Array.isArray(data.domains) && data.domains.length > 0) {
        this.domains = data.domains;
        this.renderDomainOptions();
      }

      // 2. Populate credentials fields
      if (data.credential) {
        const { accesskey, password, address } = data.credential;

        const accessKeyEl = this.get("access-key");
        const passwordEl = this.get("password");
        const addressEl = this.get("address");

        if (accessKeyEl && accesskey !== undefined) accessKeyEl.value = accesskey;
        if (passwordEl && password !== undefined) passwordEl.value = password;
        if (addressEl && address !== undefined) addressEl.value = address;
      }

      this.message = { text: "Configuration loaded successfully!", type: "success" };
    } catch (err) {
      console.error("Failed to parse configuration data:", err);
      this.message = { text: "Invalid JSON configuration format.", type: "error" };
    }
  }

  renderDomainOptions() {
    const domainSelect = this.get("domain");
    if (!domainSelect) return;

    domainSelect.innerHTML = this.domains.map(d => `
      <option value="${d.host}">${d.name || d.host}</option>
    `).join('');
  }

  render() {
    const domainOptionsHtml = this.domains.map(d => `
      <option value="${d.host}">${d.name || d.host}</option>
    `).join('') || '<option value="nodomain">No domain</option>';

    this.shadowRoot.innerHTML = `
      <div class="container" part="container">
        <!-- Logotype -->
        <div class="header-logo" part="header-logo">
          <img src="logo.jpeg" alt="Logo" part="logo-img"> ALADINO ADMIN
        </div>

        <!-- Quick Import Action Buttons (Beneath Logotype) -->
        <div class="quick-actions" part="quick-actions">
          <button type="button" class="btn-action" part="btn-action" id="btn-paste" title="Paste configuration from Clipboard">
            <svg viewBox="0 0 24 24" part="btn-action-svg">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
            Paste
          </button>

          <button type="button" class="btn-action" part="btn-action" id="btn-upload" title="Upload JSON configuration file">
            <svg viewBox="0 0 24 24" part="btn-action-svg">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload
          </button>
        </div>

        <!-- Hidden File Input Element -->
        <input type="file" id="file-input" accept=".json" style="display: none;" />

        <form class="form-card" part="form-card" id="access-form">

          <!-- Domain Dropdown -->
          <div class="field-group" part="field-group">
            <label for="domain" part="label">Domain</label>
            <select id="domain" part="select" required>
              ${domainOptionsHtml}
            </select>
          </div>

          <!-- Access Key -->
          <div class="field-group" part="field-group">
            <label for="access-key" part="label">Access Key</label>
            <input type="text" id="access-key" part="input" placeholder="Enter access key..." required value="XXXXXX" />
          </div>

          <!-- Password -->
          <div class="field-group" part="field-group">
            <label for="password" part="label">Password</label>
            <input type="password" id="password" part="input" placeholder="••••••••••••" required value="PASSWRD" />
          </div>

          <!-- Address -->
          <div class="field-group" part="field-group">
            <label for="address" part="label">Address</label>
            <input type="text" id="address" part="input" placeholder="e.g. btcsrc.pipe.aladino.maya.4da" required value="xxxxxx.aladino.solution.4da" />
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn-submit" part="btn-submit" id="btn-submit">Connect</button>

          <!-- Message Box -->
          <div id="message-box" part="message-box message-box-${this._messageType} ${this._messageText ? 'message-box-show' : ''}">
            ${this._messageText}
          </div>
        </form>
      </div>
    `;

    this.listen();
  }

  listen() {
    // 1. Form Submission Handler
    const form = this.get('access-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const credentials = {
          domain: this.domain,
          accessKey: this.accesskey,
          password: this.password,
          address: this.address
        };

        this.on({
          action: 'access',
          payload: credentials
        });
      });
    }

    // 2. Clipboard Paste Handler
    const pasteBtn = this.get('btn-paste');
    if (pasteBtn) {
      pasteBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          const text = await navigator.clipboard.readText();
          if (!text) {
            this.message = { text: "Clipboard is empty.", type: "error" };
            return;
          }
          const data = JSON.parse(text);
          this.applyImportedData(data);
        } catch (err) {
          console.error("Paste error:", err);
          this.message = { text: "Failed to read JSON from clipboard.", type: "error" };
        }
      });
    }

    // 3. Local Machine File Upload Handler
    const uploadBtn = this.get('btn-upload');
    const fileInput = this.get('file-input');

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            this.applyImportedData(data);
          } catch (err) {
            console.error("File parse error:", err);
            this.message = { text: "Invalid JSON file structure.", type: "error" };
          }
          fileInput.value = ""; // Reset for re-uploads
        };
        reader.readAsText(file);
      });
    }
  }

  show() {
    super.show();
    this.clear();
  }

  clear() {
    this.password = '';
    this.address = '';
    this.domains = [];
    this.render();
  }

  connectedCallback(){
    super.connectedCallback();
    this.clear();
  }
}