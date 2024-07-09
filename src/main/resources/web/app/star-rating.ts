import {LitElement, html, css} from 'lit';
import {customElement, state, property} from 'lit/decorators.js';
import round from 'lodash.round';


declare const SERVER_URL: string; // This is defined through web-bundler envs in application.properties

interface Rating {
    rating: number,
    count: number
}

@customElement('star-rating')
class StartRating extends LitElement {

    @property()
    ref: string;

    @state()
    private total: Rating = {rating: 0, count: 0};
    
    @state()
    private rating: number;

    @state()
    private message: string;


    connectedCallback() {
        super.connectedCallback();
        this.fetchRating();
    }

    render() {
        let stars = this.rating || Math.floor(this.total.rating);
        return html`
          <div class="rating">${round(this.total.rating, 1)}</div>
          <div class="stars">
            <input id="rating-5" type="radio" name="rating" value="5" .checked=${stars == 5} @click=${this.rate}/>
            <label for="rating-5">
              <fas-icon icon="star"></fas-icon>
            </label>
            <input id="rating-4" type="radio" name="rating" value="4" .checked=${stars == 4} @click=${this.rate}/>
            <label for="rating-4">
              <fas-icon icon="star"></fas-icon>
            </label>
            <input id="rating-3" type="radio" name="rating" value="3" .checked=${stars == 3} @click=${this.rate}/>
            <label for="rating-3">
              <fas-icon icon="star"></fas-icon>
            </label>
            <input id="rating-2" type="radio" name="rating" value="2" .checked=${stars == 2} @click=${this.rate}/>
            <label for="rating-2">
              <fas-icon icon="star"></fas-icon>
            </label>
            <input id="rating-1" type="radio" name="rating" value="1" .checked=${stars == 1} @click=${this.rate}/>
            <label for="rating-1">
              <fas-icon icon="star"></fas-icon>
            </label>
          </div>
          <div class="total">(${this.total.count})</div>
          <div class="message">${this.message}</div>
        `;
    }

    private fetchRating() {
        fetch(`${SERVER_URL}/rating/${this.ref}`)
            .then(r => r.json())
            .then(r => {
                this.total = r;
            }).catch(e => console.error(e));

    }

    private rate(event: any) {
        this.rating = event.target.value;
        this.postRating();
    }

    private postRating() {
        fetch(SERVER_URL + "/rating", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ref: this.ref, rating: this.rating})
        })
            .then(r => {
                let prev = this.rating;
                if (!r.ok) {
                    this.rating = undefined;
                    r.text().then(r => this.message = r);
                    return;
                }
                this.message = `You rated ${prev}!`;
                r.json().then(r => this.total = r);
            }).catch(e => console.error(e));


    }

    static styles = css`
        :host {
            display: flex;
            flex-direction: row;
            overflow: hidden;
            align-items: center;
            padding: 5px;
            gap: 10px;
            font-family: monospace;
        }

        .total, .rating {
            font-size: 20px;
        }

        .message {
            color: #666;
        }

        .stars {
            direction: rtl;
            unicode-bidi: bidi-override;
            color: #ddd; /* Personal choice */

        }

        .stars label {
            cursor: pointer;
        }

        .stars input {
            display: none;
        }

        .stars label:hover,
        .stars label:hover ~ label,
        .stars input:checked + label,
        .stars input:checked + label ~ label {
            color: #ffc107; /* Personal color choice. Lifted from Bootstrap 4 */
        }
    `;


}