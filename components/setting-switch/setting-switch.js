const settingSwitchStyle = `
  * {
    padding: 0;
    margin: 0;
  }
  p {
    display: flex;
    padding: 5px 0;
  }
  span {
    flex-grow: 1;
  }
`
const settingSwitchTemplate = document.createElement('template')
settingSwitchTemplate.innerHTML = `
  <style>${settingSwitchStyle}</style>

  <p>
    <span><slot></slot></span>
    <simple-switch></simple-switch>
  </p>
`

class SettingSwitch extends HTMLElement {
  defaultHeight = 24
  height = this.defaultHeight
  fontHeight = this.height * .6

  constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })
    shadow.append(settingSwitchTemplate.content.cloneNode(true))

    this.p = shadow.querySelector('p')
    this.simpleSwitch = shadow.querySelector('simple-switch')
  }

  static get observedAttributes() {
    return ['height']
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (attributeName === 'height') this.updateHeight(newValue)
  }

  updateHeight(newHeight) {
    this.height = newHeight ?? this.defaultHeight
    this.fontHeight = this.height * .6

    this.p.style.fontSize = `${this.fontHeight}px`

    this.p.style.height = `${this.height}px`
    this.p.style.lineHeight = `${this.height}px`

    this.simpleSwitch.setAttribute('height', this.height)
  }
}

customElements.define('setting-switch', SettingSwitch)
