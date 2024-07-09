import {LitElement, html, css} from 'lit';
import {customElement, state, property} from 'lit/decorators.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

declare const SERVER_URL: string; // This is defined through web-bundler envs in application.properties


@customElement('my-comp')
class MyComp extends LitElement {

    @property()
    prop: string;

    @state()
    private name: string = "";

    connectedCallback() {
        super.connectedCallback();
    }

    render() {
        return html`${this.name}`;
    }

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            align-items: center;
            justify-content: center;
            padding: 5px;
            gap: 10px;
            font-family: 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        }
    `;

}