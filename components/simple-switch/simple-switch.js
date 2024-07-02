const simpleSwitchStyle = `
  :host {
    --switch-height: 24px;
    --switch-slider-margin: calc(var(--switch-height) / 6);
    --switch-slider-size: calc(var(--switch-height) - 2 * var(--switch-slider-margin));
    --transition-duration: .2s;
    --inter-red: #c20c18;
    --switch-blue: #2196F3;
    --switch-color: var(--inter-red);
  }

  * {
    padding: 0;
    margin: 0;
  }

  /* The switch - the box around the slider */
  .simple-switch {
    position: relative;
    display: inline-block;
    width: calc((var(--switch-height) - var(--switch-slider-margin)) * 2);
    height: var(--switch-height);
  }

  /* Hide default HTML checkbox */
  .simple-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .simple-switch .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: var(--transition-duration);
    border-radius: var(--switch-height);
  }

  .simple-switch .slider:before {
    position: absolute;
    content: "";
    height: var(--switch-slider-size);
    width: var(--switch-slider-size);
    left: var(--switch-slider-margin);
    bottom: var(--switch-slider-margin);
    background-color: white;
    transition: var(--transition-duration);
    border-radius: 50%;
  }

  .simple-switch input:checked+.slider {
    background-color: var(--switch-color);
  }

  .simple-switch input:focus+.slider {
    box-shadow: 0 0 1px var(--switch-color);
  }

  .simple-switch input:checked+.slider:before {
    -webkit-transform: translateX(var(--switch-slider-size));
    -ms-transform: translateX(var(--switch-slider-size));
    transform: translateX(var(--switch-slider-size));
  }
`

const simpleSwitchTemplate = document.createElement('template')
simpleSwitchTemplate.innerHTML = `
  <style>${simpleSwitchStyle}</style>

  <label class="simple-switch">
    <input type="checkbox" />
    <span class="slider"></span>
  </label>
`
class SimpleSwitch extends HTMLElement {
  defaultHeight = 24
  height = this.defaultHeight

  constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })
    shadow.append(simpleSwitchTemplate.content.cloneNode(true))
  }

  static get observedAttributes() {
    return ['height']
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (attributeName === 'height') this.updateHeight(newValue)
  }

  updateHeight(newHeight) {
    this.height = newHeight ?? this.defaultHeight
    this.style.setProperty('--switch-height', `${this.height}px`)
  }
}

customElements.define('simple-switch', SimpleSwitch)
