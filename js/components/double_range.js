// A stab at a minimal double range slider component

const BASE_STYLES = Object.freeze({
    sliderTrackColor: "#383e4a",
    sliderFillColor: "#126eba",
    sliderTrackBorderColor: "#aba9a9",
    sliderBorderRadius:  "5rem",
});

const SLIDER_PRESETS = Object.freeze({
    minBound: 0,
    maxBound: 100,
    minPreset: 10,
    maxPreset: 50
});

const CONSTANTS = Object.freeze({
    minSlider: "min-slider",
    maxSlider: "max-slider",
    sliderTrack: "slider-track"
});

// style child nodes of element
const template = document.createElement("template");
template.innerHTML = `
<style>
    .slider-container {
        display: inline-block;
        position: relative;
        width: 100%;
        min-width: 200px;
        height: 20px;
    }

    .slider-track {
        width: 99%;
        height: 2px;
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        border-radius: ${BASE_STYLES.sliderBorderRadius};
        border: 1px solid ${BASE_STYLES.sliderTrackBorderColor};
    }

    .slider-track:hover {
        filter: brightness(0.95);
    }

    .slider-container>input[type="range"] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 100%;
        outline: none;
        background-color: transparent;
        pointer-events: none;
    }

    .slider-container>input[type="range"]::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        height: 5px;
    }

    .slider-container>input[type="range"]::-moz-range-track {
        -moz-appearance: none;
        height: 5px;
    }

    .slider-container>input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        margin-top: -6px;
        height: 1rem;
        width: 0.6rem;
        border: 1px solid #686d73;
        border-radius: 5rem;
        background-color: #686d73;
        cursor: pointer;
        pointer-events: auto;
    }

    .slider-container>input[type="range"]::-webkit-slider-thumb:hover {
        filter: brightness(1.2);
    }

    .slider-container>input[type="range"]::-moz-range-thumb {
        -moz-appearance: none;
        height: 1em;
        width: 1rem;
        cursor: pointer;
        border: none;
        border-radius: 50%;
        background-color: ${BASE_STYLES.sliderFillColor};
        pointer-events: auto;
    }

    .slider-container>input[type="range"]::-moz-range-thumb:hover {
        filter: brightness(1.2);
    }
</style>

<div class="slider-container">
    <div class="slider-track" id="slider-track"></div>
    <input type="range" class="range-slider" id="min-slider">
    <input type="range" class="range-slider" id="max-slider">
</div>  
`;

class DoubleRange extends HTMLElement {

    constructor() {
        super();
        // encapsulatead part of the web component
        this.shadow = this.attachShadow({mode: "open"});

        //allows us to acces the shadom DOM via the shadow root
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    get min() {
        const minSlider = this.getChild(`#${CONSTANTS.minSlider}`);
        return minSlider.value;
    }

    get max() {
        const maxSlider = this.getChild(`#${CONSTANTS.maxSlider}`);
        return maxSlider.value;
    }

    get minBound() {
        return this.getAttribute("min-bound");
    }

    set minBound(minBound) {
        this.setAttribute("min-bound", minBound);
    }

    get maxBound() {
        return this.getAttribute("max-bound");
    }

    set maxBound(maxBound) {
        this.setAttribute("max-bound", maxBound);
    }

    /*
    HTMLElement override method; track changes to tag attributes. 
    */
    static get observedAttributes() {
        return [
            "min-bound",
            "max-bound",
        ];
    }

    /*
    HTMLElement life-cycle override method register changes to element attributes, 

    @param {String} attribute Element attribute to change.
    @param {String} oldValue  Current attribute value.
    @param {String} newValue  New attribute value to be signed.
    */
    attributeChangedCallback(attribute, oldValue, newValue) {
        switch (attribute) {
            case "min-bound":
                if (isNaN(newValue) || oldValue == newValue) {
                    return;
                }
                this.minBound = newValue;
                break;
            case "max-bound":
                if (isNaN(newValue) || oldValue == newValue) {
                    return;
                }
                this.maxBound = newValue;
                break;

            default:
                break;
        }
        this.init();
    }

    /*
    Helper function for custom range slider.
    */
    fillRange() {
        const minSlider = this.getChild(`#${CONSTANTS.minSlider}`);
        const maxSlider = this.getChild(`#${CONSTANTS.maxSlider}`);
        const sliderTrack = this.getChild(`#${CONSTANTS.sliderTrack}`);
        
        const rangeInterval = minSlider.max - minSlider.min;
        const percentOne = 
            (parseInt(minSlider.value - minSlider.min) / rangeInterval) * 100;
        const percentTwo = 
            (parseInt(maxSlider.value - maxSlider.min) / rangeInterval) * 100;
        sliderTrack.style.background = 
        `linear-gradient(to right, ${BASE_STYLES.sliderTrackColor} ${percentOne}%,
            ${BASE_STYLES.sliderFillColor} ${percentOne}%, 
            ${BASE_STYLES.sliderFillColor} ${percentTwo}%, 
            ${BASE_STYLES.sliderTrackColor} ${percentTwo}%)`;
    }

    /*
    Event listener for cunstom range slider

    @param {Event} e Range slider oninput event.
    */
    updateRange(e) {
        const minSlider = this.getChild(`#${CONSTANTS.minSlider}`);
        const maxSlider = this.getChild(`#${CONSTANTS.maxSlider}`);

        const minGap = 0;
        const id = e.target.id;
        if (parseInt(maxSlider.value) - parseInt(minSlider.value) <= minGap) {
            if (id === CONSTANTS.minSlider) {
                minSlider.value = parseInt(maxSlider.value) - minGap;
            }
            if (id === CONSTANTS.maxSlider) {
                maxSlider.value = parseInt(minSlider.value) + minGap;
            }
        }
        this.fillRange();
    }

    /*
    HTMLElement life-cycle override method: define the element's behaviour once it is loaded 
    into the page. 
    */
    connectedCallback() {
        const minSlider = this.getChild(`#${CONSTANTS.minSlider}`);
        const maxSlider = this.getChild(`#${CONSTANTS.maxSlider}`);

        minSlider.oninput = this.updateRange.bind(this);
        maxSlider.oninput = this.updateRange.bind(this);
        this.init();
        this.fillRange();
    }

    /* 
    HTMLElement life-cycle override method: remove all event listeners
    from component
    */
    disconnectedCallback() {
        const minSlider = this.getChild(`#${CONSTANTS.minSlider}`);
        const maxSlider = this.getChild(`#${CONSTANTS.maxSlider}`);

        maxSlider.removeEventListener('oninput');
        minSlider.removeEventListener('oninput');
        this.removeEventListener('oninput');
    }

    /*
    @return a sub-component of our DoubleSlider.
    */
    getChild(id) {
        return this.shadowRoot.querySelector(id);
    }

    /*
    Set min-max attributes of the component's underlying sliders. 
    */
    init() {
        const minSlider = this.getChild(`#${CONSTANTS.minSlider}`);
        const maxSlider = this.getChild(`#${CONSTANTS.maxSlider}`);

        if (this.minBound && this.minBound < this.maxBound) {
            minSlider.min = this.minBound;
            maxSlider.min = this.minBound;
        } else {
            this.minBound = SLIDER_PRESETS.minBound;
            minSlider.min = SLIDER_PRESETS.minBound
            maxSlider.min = SLIDER_PRESETS.minBound;
        }

        if (this.maxBound && this.maxBound > this.minBound) {
            minSlider.max = this.maxBound;
            maxSlider.max = this.maxBound;
        } else {
            this.maxBound = SLIDER_PRESETS.maxBound;
            minSlider.max = SLIDER_PRESETS.maxBound
            maxSlider.max = SLIDER_PRESETS.maxBound;
        }
        minSlider.value = this.minBound;
        maxSlider.value = this.maxBound;
    }
}

// allow instances of our custom element
window.customElements.define("double-range", DoubleRange);

export { DoubleRange }