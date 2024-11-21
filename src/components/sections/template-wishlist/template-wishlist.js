class WishlistWrapper extends HTMLElement {
  constructor() {
    super();
    this.listProduct = JSON.parse(localStorage.getItem('wishlistItems'));
    this.parser = new DOMParser();
    if(this.listProduct) {
      this.ProductGrid();
    }
  }

  async ProductGrid() {
    this.dom = '';
    this.products = await Promise.all(this.listProduct.map((value) => {return fetch(`/products/${value}`).then(response => response.text())})).then(response => {return response});
    if(this.products.length) {
      document.querySelector('[data-id="#PopupModal-ClearWishlist"]').classList.remove('hidden')
    }
    this.products.forEach((product) => {
      if(this.productCard(product)) {
        let newProduct = this.productCard(product).replace('<li class="slider-slide w-full">', '').replace('</li>', '')
        this.dom += newProduct;
      }
    })

    this.querySelector('#whislist-wrapper').innerHTML = this.dom;
  }

  productCard(product) {
    return this.parser.parseFromString(product, 'text/html').querySelector('#product-card')?.innerText;
  }
}

customElements.define('wishlist-wrapper', WishlistWrapper);

class WishlistClear extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', () => {
      localStorage.removeItem('wishlistItems');
      document.querySelector('#whislist-wrapper').innerHTML = '';
      document.querySelector('[data-id="#PopupModal-ClearWishlist"]').classList.add('hidden');
      document.querySelectorAll('wishlist-count').forEach(count => {
        count.update();
      });
      document.querySelectorAll('wishlist-button').forEach(button => {
        button.update();
      });
    })
  }
}

customElements.define('wishlist-clear', WishlistClear);

class WishlistButton extends HTMLElement {
  constructor() {
    super();
    this.product = this.dataset.productHandle;
    this.listProduct = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    this.update();
    this.addEventListener('click', (e) => {
      e.preventDefault();
      this.pushToLocalStorage();
    });
  }
  update() {
    this.listProduct = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    if (this.listProduct.includes(this.product)) {
      this.classList.add('active');
    } else {
      this.classList.remove('active');
    }
  }
  pushToLocalStorage() {
    this.listProduct = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    if (localStorage.getItem('wishlistItems')) {
      if (this.listProduct.includes(this.product)) {
        if (this.listProduct.indexOf(this.product) != -1) {
          this.listProduct.splice(this.listProduct.indexOf(this.product), 1);
          localStorage.setItem('wishlistItems', JSON.stringify(this.listProduct));
          this.classList.remove('active');
          this.hidden();
          document.querySelectorAll(`[data-product-handle=${this.product}]`).forEach((item) => {
            item.classList.remove('active');
          })
        }
      } else {
        this.listProduct.unshift(this.product);
        localStorage.setItem('wishlistItems', JSON.stringify(this.listProduct));
        this.classList.add('active');
        this.push();
        document.querySelectorAll(`[data-product-handle=${this.product}]`).forEach((item) => {
          item.classList.add('active');
        })
        this.openNotify();
      }
    } else {
      this.classList.add('active');
      this.listProduct.unshift(this.product);
      localStorage.setItem('wishlistItems', JSON.stringify(this.listProduct));
      this.classList.add('active');
      this.push();
      document.querySelectorAll(`[data-product-handle=${this.product}]`).forEach((item) => {
        item.classList.add('active');
      })
      this.openNotify();
    }
    document.querySelectorAll('wishlist-count').forEach(count => {
      count.update();
    });
  }
  openNotify() {
    if(document.querySelector('#wishlist-notifycation')) {
      document.querySelector('#wishlist-notifycation').open()
    }
  }
  hidden() {
    if(document.querySelector(`wishlist-wrapper .product-card-wrapper[data-handle="${this.product}"]`)) {
      document.querySelector(`wishlist-wrapper .product-card-wrapper[data-handle="${this.product}"]`).remove();;
      if (!JSON.parse(localStorage.getItem('wishlistItems')) || JSON.parse(localStorage.getItem('wishlistItems')).length == 0) {
        document.querySelector('[data-id="#PopupModal-ClearWishlist"]').classList.add('hidden');
      }
    }
  }
  push() {
    document.querySelector('wishlist-wrapper #whislist-wrapper').innerHTML = document.querySelector(`.product-card-wrapper[data-handle="${this.product}"]`).outerHTML + document.querySelector('wishlist-wrapper #whislist-wrapper').innerHTML;
    document.querySelector('[data-id="#PopupModal-ClearWishlist"]').classList.remove('hidden');
  }
}

if (!customElements.get('wishlist-button')) {
  customElements.define('wishlist-button', WishlistButton);
}

if (!customElements.get('wishlist-count')) {
  class wishlistCount extends HTMLElement {
    constructor() {
      super();
      this.update();
    }
  
    update() {
      if (localStorage.getItem('wishlistItems')) {
        if (JSON.parse(localStorage.getItem('wishlistItems')).length > 0) {
          this.classList.remove('hidden');
          if(this.classList.contains('absolute')) {
            this.querySelector('span').innerHTML = JSON.parse(localStorage.getItem('wishlistItems')).length;
          } else {
            if(JSON.parse(localStorage.getItem('wishlistItems')).length > 1) {
              this.querySelector('span').innerHTML = JSON.parse(localStorage.getItem('wishlistItems')).length + window.count.items;
            } else {
              this.querySelector('span').innerHTML = JSON.parse(localStorage.getItem('wishlistItems')).length + window.count.item;
            }
          }
          document.querySelector('#whislist-wrapper').classList.remove('hidden');
          document.querySelector('#whislist-blank').classList.add('hidden');
        } else {
          this.classList.add('hidden');
          document.querySelector('#whislist-wrapper').classList.add('hidden');
          document.querySelector('#whislist-blank').classList.remove('hidden');
        }
      } else {
        this.classList.add('hidden');
        document.querySelector('#whislist-wrapper').classList.add('hidden');
        document.querySelector('#whislist-blank').classList.remove('hidden');
      }
    }
  }
  customElements.define('wishlist-count', wishlistCount);
}