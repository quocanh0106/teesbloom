class RecentlyViewedProducts extends HTMLElement {
  constructor() {
    super();

    this.listProduct = JSON.parse(localStorage.getItem('recentlyViewedProducts'));
    this.section = this.dataset.sectionId;
    if(document.querySelector('product-infor')) {
      this.listProduct = this.listProduct.filter(item => item !== document.querySelector('product-infor').dataset.product)
    }
    this.parser = new DOMParser();

    if(!this.listProduct || this.listProduct.length == 0) {
      this.closest('section').classList.add('hidden')
    } else {
      this.ProductGrid();
    }
  }

  async ProductGrid() {
    this.dom = '';
    this.products = await Promise.all(this.listProduct.map((value) => {return fetch(`/products/${value}`).then(response => response.text())})).then(response => {return response});
    
    this.products.forEach((product) => {
      if(this.productCard(product)) {
        this.dom += this.productCard(product);
      }
    })


    this.querySelector('.product-wrapper').innerHTML = this.dom;
  }

  productCard(product) {
    return this.parser.parseFromString(product, 'text/html').querySelector('#product-card')?.innerText;
  }
}

customElements.define('recently-viewed', RecentlyViewedProducts)