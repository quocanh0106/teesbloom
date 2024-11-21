if (!customElements.get('truncate-paragraph')) {
  class TruncateParagraph extends HTMLElement {
    constructor() {
      super();
      this.button = this.querySelector('.toggle-truncate');
      this.button.addEventListener('click', () => {
        this.classList.toggle('active');
        if(window.facetHeight) {
          window.facetHeight = document.querySelector('#product-grid').offsetTop;
        }
      });
    }
  }

  customElements.define('truncate-paragraph', TruncateParagraph);
}