class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.wrapper = this.querySelector('.cart-drawer-wrapper');
    this.body = this.wrapper.querySelector('.cart-drawer-body');
  }

  open() {
    fetch(`${routes.cart_ajax_url}`)
    .then(response => {
      return response.text();
    })
    .then((response) => {
      let dom = new DOMParser().parseFromString(response, 'text/html');
      console.log(dom);
      
      this.setInnerHTML(dom.querySelector('#MainContent .shopify-section'));
      this.body.innerHTML = dom.querySelector('#MainContent .shopify-section').innerHTML;
    })
    .finally(() => {
      this.wrapper.classList.remove('spinning-cart');
    })
  }

  setInnerHTML(element) {
      // Wait for scripts to load and execute
    const scriptPromises = Array.from(element.querySelectorAll('script')).map(script => {
      const newScriptTag = document.createElement('script');
      Array.from(script.attributes).forEach(attribute => {
        newScriptTag.setAttribute(attribute.name, attribute.value);
      });
      newScriptTag.appendChild(document.createTextNode(script.innerHTML));
      document.body.appendChild(newScriptTag);
      return new Promise(resolve => newScriptTag.onload = resolve);
    });

    // Wait for all scripts to be loaded and executed
    Promise.all(scriptPromises)
      .then(() => {this.body.innerHTML = element.querySelector('#MainContent .shopify-section').innerHTML;})
  }
}

if (!customElements.get('cart-drawer')) {
  customElements.define('cart-drawer', CartDrawer)
}