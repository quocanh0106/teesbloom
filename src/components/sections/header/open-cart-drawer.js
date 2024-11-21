class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.wrapper = this.querySelector('.cart-drawer-wrapper');
    this.body = this.wrapper.querySelector('.cart-drawer-body');
    this.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', this.hide.bind(this, !1));
    });
    this.addEventListener('keyup', blur => {
      'ESCAPE' === blur.code.toUpperCase() && this.hide();
    });
    this.addEventListener('click', event => {
      if (event.target === this) this.hide();
    });

  }

  open() {
    document.body.classList.add('!overflow-hidden');
    document.querySelector('#fc_frame')?.classList.add('!hidden');
    this.classList.remove('before:opacity-0', 'before:invisible');
    this.wrapper.classList.remove('invisible','opacity-0', '-translate-x-10');
    this.wrapper.classList.add('spinning-cart');

    fetch(`${routes.cart_ajax_url}`)
    .then(response => {
      return response.text();
    })
    .then((response) => {
      let dom = new DOMParser().parseFromString(response, 'text/html');
      this.setInnerHTML(dom.querySelector('#MainContent .shopify-section'));
      this.body.innerHTML = dom.querySelector('#MainContent .shopify-section').innerHTML;
    })
    .finally(() => {
      this.wrapper.classList.remove('spinning-cart');
    })
  }

  hide() {
    document.body.classList.remove('!overflow-hidden');
    document.querySelector('#fc_frame')?.classList.remove('!hidden');
    this.classList.add('before:opacity-0', 'before:invisible');
    this.wrapper.classList.add('invisible','opacity-0', '-translate-x-10');
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