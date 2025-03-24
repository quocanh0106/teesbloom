import './template-product.scss';
import './template-product-customily.scss';

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
  };
}

if (!customElements.get('quantity-input')) {

  class QuantityInput extends HTMLElement {
    constructor() {
      super();
      this.input = this.querySelector('input');
      this.line = this.dataset.index;
      this.removePopup = document.querySelector(`#Popup-Remove-${this.line}`)
      this.changeEvent = new Event('change', { bubbles: true });

      this.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', this.onButtonClick.bind(this));
      });
    }

    onButtonClick(event) {
      event.preventDefault();
      const previousValue = this.input.value;
      event.target.name == 'plus' ? this.input.stepUp() : this.input.stepDown();

      if (previousValue !== this.input.value)
      
      if (this.input.value == '0') {
        this.removePopup?.open();
        this.input.stepUp();
      } else {
        this.input.dispatchEvent(this.changeEvent);
      }

    }
  }

  customElements.define('quantity-input', QuantityInput);
}

class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.init();
    this.querySelectorAll('fieldset').forEach(sector=> sector.addEventListener('change', this.onVariantChange.bind(this))) 
  }
  
  init() {
    this.initCheckOption(document.querySelector(`#product-form-${this.dataset.section} input[name="id"]`).value)

    if(!window.location.href.includes('variant=') && this.getVariantData().length > 1) {
      this.querySelectorAll('label, input').forEach(el => {el.classList.remove('active');el.checked=false})
      this.querySelectorAll('.selected-value').forEach(el => el.textContent = '');
      document.querySelector(`#product-form-${this.dataset.section} input[name="id"]`).value = ''
      this.toggleAddButton(true, '', false);
      this.setUnavailable();
      document.getElementById(`product-form-${this.dataset.section}`).querySelector('.button-unavailable').classList.add('onload')
    }
  }
  
  initCheckOption(id) {
    var data = this.getVariantData();
    var currentOption = data.filter(variant => {return variant.id == id});
    document.querySelectorAll('.data-layer-1 label, .data-layer-1 input, .data-layer-2 label, .data-layer-2 input').forEach(el => el.classList.remove('active'));
    var available_products = data.filter(variant => {return variant.option1 == currentOption[0].option1});
    if (available_products && available_products.length > 0) {
      this.refresh = [...new Set(available_products.map(o => o.option2))];
      this.refresh.push(...new Set(available_products.map(o => o.option3)));
      this.changeValue(`input[value='${currentOption[0].option2}']`);
      this.changeValue(`input[value='${currentOption[0].option3}']`,false)
      document.querySelectorAll('.data-layer-1 .form__label .selected-value').forEach((item) => {
        item.innerHTML = currentOption[0].option2.replace('-1', '').replace('-2', '').replace('-3', '').replace('-4', '').replace('-5', '');
      })
      document.querySelectorAll('.data-layer-2 .form__label .selected-value').forEach((item) => {
        item.innerHTML = currentOption[0].option3.replace('-1', '').replace('-2', '').replace('-3', '').replace('-4', '').replace('-5', '');
      })
      document.querySelectorAll('.data-layer-1 label, .data-layer-1 input, .data-layer-2 label, .data-layer-2 input').forEach(el => el.classList.add('hidden'))
    }
    if (this.refresh) this.refresh.map(item => this.setDisable(item))
  }

  checkOption(option_name, option_value) {
    var data = this.getVariantData(); 
    document.getElementById(`product-form-${this.dataset.section}`).querySelector('.button-unavailable').classList.remove('onload')
    switch (parseInt(option_name)) {
      case 0:
        document.querySelectorAll('.data-layer-1 label, .data-layer-1 input, .data-layer-2 label, .data-layer-2 input').forEach(el => el.classList.remove('active'));
        var available_products = data.filter(variant => {return variant.option1 == option_value});
        this.fakeCurrentVariant = available_products[0];

        if (available_products && available_products.length > 0) {
          if(document.querySelector('.size-popup')) {
            document.querySelector('.size-popup').dataset.active = available_products[0].option1;
          }
          if(document.querySelector('.section-product-description')) {
            document.querySelectorAll('.section-product-description .tab-heading').forEach((tab) => {
              if(tab.textContent.trim().toLowerCase() == available_products[0].option1.trim().toLowerCase()) tab.click();
            })
          }
          this.refresh= [...new Set(available_products.map(o => o.option2))]
          this.refresh.push(...new Set(available_products.map(o => o.option3)));
          document.querySelector('.data-layer-0 .require-option')?.classList.add('hidden');
          document.querySelector('.data-layer-0 .form__label .selected-value').innerHTML = option_value;
          if(document.querySelector('.data-layer-1 .message-option')) document.querySelector('.data-layer-1 .message-option').classList.add('hidden');
          if(document.querySelector('.data-layer-2 .message-option')) document.querySelector('.data-layer-2 .message-option').classList.add('hidden');
          document.querySelectorAll('.data-layer-1 .form__label .selected-value').forEach((item) => {
            item.innerHTML = '';
          })
          document.querySelectorAll('.data-layer-2 .form__label .selected-value').forEach((item) => {
            item.innerHTML = ''
          })

          document.querySelectorAll('.data-layer-2 label, .data-layer-2 input, .data-layer-1 label, .data-layer-1 input').forEach(el => el.classList.add('hidden'))
        }
        break;
      case 1:
        document.querySelectorAll('.data-layer-1 label, .data-layer-1 input, .data-layer-2 label, .data-layer-2 input').forEach(el => el.classList.remove('active'))
        let option1_value = document.querySelector('.data-layer-0 .form__label .selected-value').textContent
        var available_products = data.filter(variant => {return variant.option1 == option1_value && variant.option2 == option_value;});
        this.fakeCurrentVariant = available_products[0];
        if(document.querySelector('.data-layer-0 .selected-value')?.textContent == '') document.querySelector('.data-layer-1 .message-option')?.classList.remove('hidden')

        if (available_products && available_products.length > 0) {
          this.refresh = [...new Set(available_products.map(o => o.option3))];
          document.querySelector('.data-layer-1 .require-option').classList.add('hidden');
          if(document.querySelector('.data-layer-2 .message-option')) document.querySelector('.data-layer-2 .message-option').classList.add('hidden');
          
          document.querySelectorAll('.data-layer-1 .form__label .selected-value').forEach((item) => {
            item.innerHTML = option_value.replace('-1', '').replace('-2', '').replace('-3', '').replace('-4', '').replace('-5', '');
          })
          document.querySelectorAll('.data-layer-2 .form__label .selected-value').forEach((item) => {
            item.innerHTML = ''
          })
          document.querySelectorAll('.data-layer-2 label, .data-layer-2 input').forEach(el => el.classList.add('hidden'))
        }
        break;
      case 2:
        document.querySelectorAll('.data-layer-2 label, .data-layer-2 input').forEach(el => el.classList.remove('active'))
        document.querySelector('.data-layer-2 .require-option')?.classList.add('hidden');
        document.querySelector('.data-layer-2 .message-option')?.classList.add('hidden')
        if(document.querySelector('.data-layer-1 .selected-value')?.textContent == '') {
          document.querySelector('.data-layer-2 .message-option')?.classList.remove('hidden')
        }
        this.fakeCurrentVariant = false;
        break;
      default:         
        document.querySelectorAll('.data-layer-0 label, .data-layer-0 input').forEach(el => el.classList.remove('active'))
        var available_products = data.filter(variant => {return variant.option1 == option_value})
        if (available_products && available_products.length > 0) {
          this.refresh= [...new Set(available_products.map(o => o.option2))]
          this.refresh.push(...new Set(available_products.map(o => o.option3)));

          document.querySelectorAll('.data-layer-2 label, .data-layer-2 input, .data-layer-1 label, .data-layer-1 input').forEach(el => el.classList.add('hidden'))
        }
        break;
    }
    if (this.refresh) this.refresh.map(item => this.setDisable(item))
  }
  
  updateOptionsAvailable(evt) {
    this.target = evt.target;
    if(parseInt(evt.target.getAttribute('data-index')) == 0) this.querySelectorAll('.data-layer-0 label, .data-layer-0 input').forEach(el => el.classList.remove('active'));
    this.checkOption(evt.target.getAttribute('data-index'), evt.target.value);
    if(parseInt(evt.target.getAttribute('data-index')) != 1 && parseInt(evt.target.getAttribute('data-index')) != 2) this.querySelectorAll('.data-layer-1 label, .data-layer-1 input').forEach(el => {el.classList.remove('active');el.checked=false});
    if(parseInt(evt.target.getAttribute('data-index')) == 1 && document.querySelector('.data-layer-0 .selected-value').textContent == '') {
      this.querySelectorAll('.data-layer-1 label, .data-layer-1 input').forEach(el => {el.classList.remove('active');el.checked=false});
      this.querySelectorAll('.data-layer-2 label, .data-layer-2 input').forEach(el => {el.classList.remove('active');el.checked=false});
    }
    if(parseInt(evt.target.getAttribute('data-index')) != 2) this.querySelectorAll('.data-layer-2 label, .data-layer-2 input').forEach(el => {el.classList.remove('active');el.checked=false});
    if(parseInt(evt.target.getAttribute('data-index')) == 2 && document.querySelector('.data-layer-1 .selected-value').textContent == '') {
      this.querySelectorAll('.data-layer-2 label, .data-layer-2 input').forEach(el => {el.classList.remove('active');el.checked=false});
    } else {
      evt.target.classList.add('active');
      this.querySelector(`label[for="${evt.target.id}"]`).classList.add('active');
    }
  }
  
  changeValue(selector) {
    if (this.querySelector(selector)) {
      this.querySelector(selector).checked = true;
      this.querySelector(`label[for="${this.querySelector(selector).id}"]`).classList.add('active')
    }
  }

  setDisable(item) {
    var el = this.querySelector(`input[value='${item}']`)
    if (el) {
      el.classList.remove('hidden');
      this.querySelector(`label[for="${el.id}"]`).classList.remove('hidden')
    }
  }

  onVariantChange(evt) {
    this.updateOptionsAvailable(evt);
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.removeErrorMessage();
    if (!this.currentVariant) {
      if(this.fakeCurrentVariant) {
        this.updateMedia();
        this.updateURL();
        this.updateVariantInput();
        this.renderProductInfo();
      }
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      var select = this.target.closest('.product-form__input');
      if (evt.target.closest('input') && select.querySelector('.selected-value')) {
        var it = evt.target.closest('input').getAttribute('value') ;
        select.querySelector('.selected-value').innerHTML = it.replace('-1', '').replace('-2', '').replace('-3', '').replace('-4', '').replace('-5', '');
      }
    }
  }

  updateOptions() {
    this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }

  updateMedia() {
    let currentVariant = this.currentVariant || this.fakeCurrentVariant;
    const mediaGalleries = document.querySelector(`[id^="MediaGallery-${this.dataset.section}"]`);
    
    if (!currentVariant) return;
    if (!currentVariant.featured_media) return;

    const mediaGalleriesWrapper = document.querySelector(`#MediaGallery-${this.dataset.section} .slider-wrapper`);
    const mediaGalleriesDot = document.querySelector(`#MediaGallery-${this.dataset.section} .slider-dots`);

    mediaGalleriesWrapper.prepend(mediaGalleriesWrapper.querySelector(`[data-media="${currentVariant.featured_media.id}"]`))
    mediaGalleriesDot.prepend(mediaGalleriesDot.querySelector(`[data-media="${currentVariant.featured_media.id}"]`))
    mediaGalleries.generateDotsGallery()
    mediaGalleries.backToFirst()
  }

  updateURL() {
    let currentVariant = this.currentVariant || this.fakeCurrentVariant;
    if (!currentVariant) return;
    let prevURL = window.location.href;
    if(window.location.href.indexOf('variant=') > -1) {
      let prevVariantId = window.location.href.split('variant=')[1].split('&')[0]
      let newUrl = prevURL.replace(prevVariantId, currentVariant.id);
      window.history.replaceState({ }, '', `${newUrl}`);
    } else {
      window.history.replaceState({ }, '', `${this.dataset.url}?variant=${currentVariant.id}`);
    }
  }

  updateVariantInput() {
    let currentVariant = this.currentVariant || this.fakeCurrentVariant;
    document.querySelector(`#product-form-${this.dataset.section} input[name="id"]`).value = currentVariant.id;
    document.querySelector(`#product-form-${this.dataset.section} input[name="id"]`).dispatchEvent(new Event('change', { bubbles: true }));
  }

  removeErrorMessage() {
    const section = this.closest('section');
    if (!section) return;

    const productForm = section.querySelector('product-form');
    if (productForm) productForm.handleErrorMessage();
  }

  renderProductInfo() {
    let currentVariant = this.currentVariant || this.fakeCurrentVariant;
    fetch(`${this.dataset.url}?variant=${currentVariant.id}&section_id=${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html')
        const destination = document.getElementById(`price-${this.dataset.section}`);
        const source = html.getElementById(`price-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`);
        if(document.querySelector('.size-popup')) {
          const activeType = document.querySelector('.size-popup').dataset.active;
          if(document.querySelector('.sizeguide')) {
            if(document.querySelector(`.sizeguide li[data-value="${activeType}"`)) {
              document.querySelector(`.sizeguide li[data-value="${activeType}"`).click();
            }
          }
        }
        if (source && destination) destination.innerHTML = source.innerHTML;

        const price = document.getElementById(`price-${this.dataset.section}`);

        if (price) price.classList.remove('visibility-hidden');
        if (this.currentVariant) {
          this.toggleAddButton(!this.currentVariant.available, window.variantStrings.soldOut);
        }
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(`product-form-${this.dataset.section}`);
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', 'disabled');
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButtonText.textContent = window.variantStrings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(`product-form-${this.dataset.section}`);
    const addButton = button.querySelector('[name="add"]');
    const buttonUnavailable = button.querySelector('.button-unavailable');
    buttonUnavailable.addEventListener('click', () => {
      if(document.querySelector('.data-layer-0 .selected-value') && document.querySelector('.data-layer-0 .selected-value').textContent == '') document.querySelector('.data-layer-0 .require-option').classList.remove('hidden');
      if(document.querySelector('.data-layer-1 .selected-value') && document.querySelector('.data-layer-1 .selected-value').textContent == '') document.querySelector('.data-layer-1 .require-option').classList.remove('hidden');
      if(document.querySelector('.data-layer-2 .selected-value') && document.querySelector('.data-layer-2 .selected-value').textContent == '') document.querySelector('.data-layer-2 .require-option').classList.remove('hidden');
      if(window.innerWidth >= 1024) {window.scrollTo(0, this.offsetTop - 250)} else { window.scrollTo(0, this.offsetTop - 200) }
    })

    if (!addButton) return;
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}

if (!customElements.get('variant-selects')) {
  customElements.define('variant-selects', VariantSelects);
}

class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll('fieldset'));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked)?.value;
    });
  }
}

if (!customElements.get('variant-radios')) {
  customElements.define('variant-radios', VariantRadios);
}

class ProductForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    this.form.querySelector('[name=id]').disabled = false;
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.cart = document.querySelector('cart-drawer');
    this.cartNoti = document.querySelector('cart-notification');
    this.submitButton = this.querySelector('[type="submit"]');
    this.addEventListener('click', (event) => {
      if(this.contains(event.target)) {
        document.querySelector('.gallery').setSlidePosition(0);
      }
    })
  }

  onSubmitHandler(evt) {
    evt.preventDefault();
    if (this.submitButton.getAttribute('aria-disabled') === 'true') return;
    this.handleErrorMessage();

    this.submitButton.setAttribute('aria-disabled', true);
    this.submitButton.classList.add('spinning');

    const config = fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];
    const formData = new FormData(this.form);
    if (this.cart) {
      formData.append('sections', this.getSectionsToRender().map((section) => section.id));
      formData.append('sections_url', window.location.pathname);
    } else {
      formData.append('sections', this.getSectionsCartPageToRender().map((section) => section.id));
      formData.append('sections_url', window.routes.cart_url);
    }
    config.body = formData;
    
    fetch(`${routes.cart_add_url}`, config)
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        if (this.cartNoti) {
          this.cart.open();
          this.renderContents(response);
          this.cartNoti?.renderContents(response);
        } else {
          window.location.href = window.routes.cart_url
        }
        if (response.status) {
          this.handleErrorMessage(response.description);
          const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
          if (!soldOutMessage) return;
          this.submitButton.setAttribute('aria-disabled', true);
          this.submitButton.querySelector('span')?.classList.add('hidden');
          soldOutMessage.classList.remove('hidden');
          this.error = true;
          return;
        }
      })
      .catch((e) => {
        console.error(e);
      }).finally(() => {
        this.submitButton.setAttribute('aria-disabled', false);
        this.submitButton.classList.remove('spinning');
      }) 
      
  }

  handleErrorMessage(errorMessage = false) {
    this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
    if (!this.errorMessageWrapper) return;
    this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

    if (errorMessage) {
      this.errorMessageWrapper.removeAttribute('hidden');
      this.errorMessage.textContent = errorMessage;
      setTimeout(() => {
        this.errorMessageWrapper.setAttribute('hidden', '');
      }, 2000)
    } else {
      this.errorMessageWrapper.setAttribute('hidden', '');
      this.errorMessage.textContent = '';
    }
  }

  renderContents(parsedState) {
    this.cartItemKey = parsedState.key;
    this.getSectionsToRender().forEach((section) => {
      const elementToReplace = document.getElementById(section.id)?.querySelector(section.selector) || document.getElementById(section.id);
      if(elementToReplace && parsedState.sections) {
        elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState?.sections[section?.section], section?.selector);
      }
    });
  }

  renderCartPageContents(parsedState) {
    this.cartItemKey = parsedState.key;
    this.getSectionsCartPageToRender().forEach((section) => {
      const elementToReplace = document.getElementById(section.id)?.querySelector(section.selector) || document.getElementById(section.id);
      if(elementToReplace) {
        elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
      }
    });
  }


  getSectionsToRender() {
    return [
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      },
      {
        id: 'cart-notification-product',
        section: 'cart-notification-product',
        selector: `[id="cart-notification-product-${this.cartItemKey}"]`,
      }
    ];
  }

  getSectionsCartPageToRender() {
    return [
      {
        id: 'cart-items',
        section: 'cart-items',
        selector: '.shopify-section'
      }
    ];
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }
}

if (!customElements.get('product-form')) {
  customElements.define('product-form', ProductForm);
}

class ProductInfor extends HTMLElement {
  constructor() {
    super();
    this.listProduct = JSON.parse(localStorage.getItem('recentlyViewedProducts')) || [];
    this.recentlyLimit = parseInt(this.dataset.recentlyView);
    this.product = this.dataset.product;
    this.pushToLocalStorage(this.product);
  }

  pushToLocalStorage() {
    if (localStorage.getItem('recentlyViewedProducts')) {
      if(!this.listProduct.includes(this.product)) {
        this.listProduct.unshift(this.product);
        if(this.listProduct.length > this.recentlyLimit) {
          this.listProduct.pop();
        }
        localStorage.setItem('recentlyViewedProducts', JSON.stringify(this.listProduct));
      }
    } else {
      this.listProduct.unshift(this.product);
      localStorage.setItem('recentlyViewedProducts', JSON.stringify(this.listProduct));
    }
  }
}

if (!customElements.get('product-infor')) {
  customElements.define('product-infor', ProductInfor);
}

class CaculatorSize extends HTMLElement {
  constructor() {
    super();
    this.options = this.querySelectorAll('.change-resize');
    this.caculator(this.querySelector('.change-resize.active'))
    this.options.forEach((item) => {
      item.addEventListener('click', () => {
        if(item.dataset.unit != this.dataset.unit) {
          this.caculator(item);
        }
      })
    })
  }
  
  caculator(item) {
    this.dataset.unit = item.dataset.unit;
    if(item.dataset.unit == 'cm') {
      this.querySelectorAll('td').forEach((num) => {
        num.textContent = parseFloat(2.54 * parseFloat(num.textContent)).toFixed(0);
      })
    } else {
      this.querySelectorAll('td').forEach((num) => {
        num.textContent = num.dataset.in;
      })
    }
  }
}

if (!customElements.get('caculator-size')) {
  customElements.define('caculator-size', CaculatorSize);
}

class AddToCart extends HTMLElement {
  constructor() {
    super();
    window.addEventListener('scroll', function() {
      document.querySelector('add-to-cart').init();
    }, { once: true, passive: true });
  }

  init() {
    if(document.querySelector('scroll-to-top')) {
      document.querySelector('scroll-to-top').classList.add('space-sticky');
    }
    this.observe = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting === true) {
        entries[0].target.querySelector('.product-form__buttons').classList.remove('btn-wrapper-sticky');
        if(document.querySelector('scroll-to-top')) {
          document.querySelector('scroll-to-top').classList.remove('space-sticky');
        }
        if(document.querySelector('#fc_frame')) {
          document.querySelector('#fc_frame').classList.add('space-sticky');
        }
      } else {
        entries[0].target.querySelector('.product-form__buttons').classList.add('btn-wrapper-sticky');
        if(document.querySelector('scroll-to-top')) {
          document.querySelector('scroll-to-top').classList.add('space-sticky');
        }
        if(document.querySelector('#fc_frame')) {
          document.querySelector('#fc_frame').classList.remove('space-sticky');
        }
      }
    },
    {threshold: 0});

    this.observe.observe(this);
  }

  addToCart() {
    this.customilyAddToCart = this.querySelector('#customily-cart-btn') || this.querySelector('.product-form__submit')
    this.buttonUnavailable = this.querySelector('.button-unavailable')

    if(this.customilyAddToCart.disabled || this.buttonUnavailable.classList.contains('onload')) {
      this.buttonUnavailable.click()
    } else {
      this.customilyAddToCart.click()
    }
  }
}

if (!customElements.get('add-to-cart')) {
  customElements.define('add-to-cart', AddToCart);
}

document.addEventListener('jdgm.doneSetup', () => {
  document.querySelectorAll('.jdgm-widget').forEach((review) => {
    review.classList.remove('jdgm-hidden');
    review.removeAttribute('style');
  })

})

if (!customElements.get('select-toggle')) {
  class SelectToggle extends HTMLElement {
    constructor() {
      super();
      this.summary = this.querySelector('.summary');
      this.details = this.querySelector('.details');
      this.summary.addEventListener('click', this.toggle.bind(this));
    }

    toggle() {
      if (this.classList.contains('active')) {
        this.details.style.maxHeight = 0;
      } else {
        this.details.style.maxHeight = this.details.scrollHeight + 'px';

        if (this.classList.contains('clickout-accordion')) {
          this.closest('tabs-component').addEventListener('click', (e) => {
            if (!this.contains(e.target)) {
              this.details.style.maxHeight = 0;
              this.classList.remove('active');
            }
          }, false);
        }

        
      }
      this.classList.toggle('active');
    }
  }

  customElements.define('select-toggle', SelectToggle);
}

if (!customElements.get('max-height')) {
  class MaxHeight extends HTMLElement {
    constructor() {
      super();
      this.maxHeightDesktop = parseInt(this.dataset.desktop);
      this.maxHeightMobile = parseInt(this.dataset.mobile);
      this.id = this.dataset.id;
      this.showmore = document.querySelector(`.description-showmore[data-id="${this.id}"]`);
      if(this.scrollHeight <= this.maxHeightMobile) {
        this.showmore.classList.add('!hidden')
      } else {
        this.showmore.classList.add('!flex')
      }
      if(this.scrollHeight <= this.maxHeightDesktop) {
        this.showmore.classList.add('lg:!hidden')
      } else {
        this.showmore.classList.add('lg:!flex')
      }
      this.showmore.addEventListener('click', () => {
        this.style.maxHeight = this.scrollHeight + 'px';
        this.showmore.classList.remove('lg:!hidden', 'lg:!flex', '!flex');
        this.showmore.classList.add('!hidden');
      })
    }
  }

  customElements.define('max-height', MaxHeight)
}

class DeliveryWrapper extends HTMLElement {
  constructor() {
    super();
    
    this.content = JSON.parse(this.dataset.content)
    this.assetsFolderUrl = this.dataset.assetsFolder.split('/').slice(0, -1).join('/');
    this.flags = {
      'AD': 'Andorra',
      'AE': 'United Arab Emirates',
      'AF': 'Afghanistan',
      'AG': 'Antigua and Barbuda',
      'AI': 'Anguilla',
      'AL': 'Albania',
      'AM': 'Armenia',
      'AO': 'Angola',
      'AQ': 'Antarctica',
      'AR': 'Argentina',
      'AS': 'American Samoa',
      'AT': 'Austria',
      'AU': 'Australia',
      'AW': 'Aruba',
      'AX': '\u00c5land Islands',
      'AZ': 'Azerbaijan',
      'BA': 'Bosnia and Herzegovina',
      'BB': 'Barbados',
      'BD': 'Bangladesh',
      'BE': 'Belgium',
      'BF': 'Burkina Faso',
      'BG': 'Bulgaria',
      'BH': 'Bahrain',
      'BI': 'Burundi',
      'BJ': 'Benin',
      'BL': 'Saint Barthélemy',
      'BM': 'Bermuda',
      'BN': 'Brunei Darussalam',
      'BO': 'Bolivia, Plurinational State of',
      'BQ': 'Caribbean Netherlands',
      'BR': 'Brazil',
      'BS': 'Bahamas',
      'BT': 'Bhutan',
      'BV': 'Bouvet Island',
      'BW': 'Botswana',
      'BY': 'Belarus',
      'BZ': 'Belize',
      'CA': 'Canada',
      'CC': 'Cocos (Keeling) Islands',
      'CD': 'Congo, the Democratic Republic of the',
      'CF': 'Central African Republic',
      'CG': 'Republic of the Congo',
      'CH': 'Switzerland',
      'CI': "C\u00f4te d'Ivoire",
      'CK': 'Cook Islands',
      'CL': 'Chile',
      'CM': 'Cameroon',
      'CN': "China (People's Republic of China)",
      'CO': 'Colombia',
      'CR': 'Costa Rica',
      'CU': 'Cuba',
      'CV': 'Cape Verde',
      'CW': 'Cura\u00e7ao',
      'CX': 'Christmas Island',
      'CY': 'Cyprus',
      'CZ': 'Czech Republic',
      'DE': 'Germany',
      'DJ': 'Djibouti',
      'DK': 'Denmark',
      'DM': 'Dominica',
      'DO': 'Dominican Republic',
      'DZ': 'Algeria',
      'EC': 'Ecuador',
      'EE': 'Estonia',
      'EG': 'Egypt',
      'EH': 'Western Sahara',
      'ER': 'Eritrea',
      'ES': 'Spain',
      'ET': 'Ethiopia',
      'EU': 'Europe',
      'FI': 'Finland',
      'FJ': 'Fiji',
      'FK': 'Falkland Islands (Malvinas)',
      'FM': 'Micronesia, Federated States of',
      'FO': 'Faroe Islands',
      'FR': 'France',
      'GA': 'Gabon',
      'GB-ENG': 'England',
      'GB-NIR': 'Northern Ireland',
      'GB-SCT': 'Scotland',
      'GB-WLS': 'Wales',
      'GB': 'United Kingdom',
      'GD': 'Grenada',
      'GE': 'Georgia',
      'GF': 'French Guiana',
      'GG': 'Guernsey',
      'GH': 'Ghana',
      'GI': 'Gibraltar',
      'GL': 'Greenland',
      'GM': 'Gambia',
      'GN': 'Guinea',
      'GP': 'Guadeloupe',
      'GQ': 'Equatorial Guinea',
      'GR': 'Greece',
      'GS': 'South Georgia and the South Sandwich Islands',
      'GT': 'Guatemala',
      'GU': 'Guam',
      'GW': 'Guinea-Bissau',
      'GY': 'Guyana',
      'HK': 'Hong Kong',
      'HM': 'Heard Island and McDonald Islands',
      'HN': 'Honduras',
      'HR': 'Croatia',
      'HT': 'Haiti',
      'HU': 'Hungary',
      'ID': 'Indonesia',
      'IE': 'Ireland',
      'IL': 'Israel',
      'IM': 'Isle of Man',
      'IN': 'India',
      'IO': 'British Indian Ocean Territory',
      'IQ': 'Iraq',
      'IR': 'Iran, Islamic Republic of',
      'IS': 'Iceland',
      'IT': 'Italy',
      'JE': 'Jersey',
      'JM': 'Jamaica',
      'JO': 'Jordan',
      'JP': 'Japan',
      'KE': 'Kenya',
      'KG': 'Kyrgyzstan',
      'KH': 'Cambodia',
      'KI': 'Kiribati',
      'KM': 'Comoros',
      'KN': 'Saint Kitts and Nevis',
      'KP': "Korea, Democratic People's Republic of",
      'KR': 'Korea, Republic of',
      'KW': 'Kuwait',
      'KY': 'Cayman Islands',
      'KZ': 'Kazakhstan',
      'LA': "Laos (Lao People's Democratic Republic)",
      'LB': 'Lebanon',
      'LC': 'Saint Lucia',
      'LI': 'Liechtenstein',
      'LK': 'Sri Lanka',
      'LR': 'Liberia',
      'LS': 'Lesotho',
      'LT': 'Lithuania',
      'LU': 'Luxembourg',
      'LV': 'Latvia',
      'LY': 'Libya',
      'MA': 'Morocco',
      'MC': 'Monaco',
      'MD': 'Moldova, Republic of',
      'ME': 'Montenegro',
      'MF': 'Saint Martin',
      'MG': 'Madagascar',
      'MH': 'Marshall Islands',
      'MK': 'North Macedonia',
      'ML': 'Mali',
      'MM': 'Myanmar',
      'MN': 'Mongolia',
      'MO': 'Macao',
      'MP': 'Northern Mariana Islands',
      'MQ': 'Martinique',
      'MR': 'Mauritania',
      'MS': 'Montserrat',
      'MT': 'Malta',
      'MU': 'Mauritius',
      'MV': 'Maldives',
      'MW': 'Malawi',
      'MX': 'Mexico',
      'MY': 'Malaysia',
      'MZ': 'Mozambique',
      'NA': 'Namibia',
      'NC': 'New Caledonia',
      'NE': 'Niger',
      'NF': 'Norfolk Island',
      'NG': 'Nigeria',
      'NI': 'Nicaragua',
      'NL': 'Netherlands',
      'NO': 'Norway',
      'NP': 'Nepal',
      'NR': 'Nauru',
      'NU': 'Niue',
      'NZ': 'New Zealand',
      'OM': 'Oman',
      'PA': 'Panama',
      'PE': 'Peru',
      'PF': 'French Polynesia',
      'PG': 'Papua New Guinea',
      'PH': 'Philippines',
      'PK': 'Pakistan',
      'PL': 'Poland',
      'PM': 'Saint Pierre and Miquelon',
      'PN': 'Pitcairn',
      'PR': 'Puerto Rico',
      'PS': 'Palestine',
      'PT': 'Portugal',
      'PW': 'Palau',
      'PY': 'Paraguay',
      'QA': 'Qatar',
      'RE': 'Réunion',
      'RO': 'Romania',
      'RS': 'Serbia',
      'RU': 'Russian Federation',
      'RW': 'Rwanda',
      'SA': 'Saudi Arabia',
      'SB': 'Solomon Islands',
      'SC': 'Seychelles',
      'SD': 'Sudan',
      'SE': 'Sweden',
      'SG': 'Singapore',
      'SH': 'Saint Helena, Ascension and Tristan da Cunha',
      'SI': 'Slovenia',
      'SJ': 'Svalbard and Jan Mayen Islands',
      'SK': 'Slovakia',
      'SL': 'Sierra Leone',
      'SM': 'San Marino',
      'SN': 'Senegal',
      'SO': 'Somalia',
      'SR': 'Suriname',
      'SS': 'South Sudan',
      'ST': 'Sao Tome and Principe',
      'SV': 'El Salvador',
      'SX': 'Sint Maarten (Dutch part)',
      'SY': 'Syrian Arab Republic',
      'SZ': 'Kingdom of Eswatini',
      'TC': 'Turks and Caicos Islands',
      'TD': 'Chad',
      'TF': 'French Southern Territories',
      'TG': 'Togo',
      'TH': 'Thailand',
      'TJ': 'Tajikistan',
      'TK': 'Tokelau',
      'TL': 'Timor-Leste',
      'TM': 'Turkmenistan',
      'TN': 'Tunisia',
      'TO': 'Tonga',
      'TR': 'Republic of Türkiye',
      'TT': 'Trinidad and Tobago',
      'TV': 'Tuvalu',
      'TW': 'Taiwan (Republic of China)',
      'TZ': 'Tanzania, United Republic of',
      'UA': 'Ukraine',
      'UG': 'Uganda',
      'UM': 'US Minor Outlying Islands',
      'US': 'United States',
      'UY': 'Uruguay',
      'UZ': 'Uzbekistan',
      'VA': 'Holy See (Vatican City State)',
      'VC': 'Saint Vincent and the Grenadines',
      'VE': 'Venezuela, Bolivarian Republic of',
      'VG': 'Virgin Islands, British',
      'VI': 'Virgin Islands, U.S.',
      'VN': 'Vietnam',
      'VU': 'Vanuatu',
      'WF': 'Wallis and Futuna Islands',
      'WS': 'Samoa',
      'XK': 'Kosovo',
      'YE': 'Yemen',
      'YT': 'Mayotte',
      'ZA': 'South Africa',
      'ZM': 'Zambia',
      'ZW': 'Zimbabwe'
    }

    this.EU = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'EL', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'EU'];
    this.select = this.querySelector('#select-country-form')
    this.countryName = this.querySelectorAll('.country-name')
    this.estimateArrivalWrapper = this.querySelectorAll('.estimate-arrival')
    this.orderShipWrapper = this.querySelectorAll('.order-ship')

    this.getLocation()
  }

  genDom() {
    this.estimateArrivalWrapper.forEach((dom) => {
      dom.innerHTML = this.processEstimateArrival()
    })

    this.orderShipWrapper.forEach((dom) => {
      dom.innerHTML = this.processOrderShip()
    })
  }

  changeLocation(countryCode) {
    localStorage.setItem('country', countryCode)

    this.countryName.forEach((dom) => {
      dom.innerHTML = this.getCountryName(countryCode)
    })

    if(this.EU.includes(countryCode)) {
      this.genFlag(countryCode)
      this.location = 'EU'
    } else if(countryCode == 'CN') {
      this.genFlag(countryCode)
      this.location = 'CN'
    } else if(countryCode == 'UK') {
      this.genFlag(countryCode)
      this.location = 'UK'
    } else if(countryCode == 'US') {
      this.genFlag(countryCode)
      this.location = 'US'
    } else if(countryCode == 'VN') {
      this.genFlag(countryCode)
      this.location = 'VN'
    } else {
      this.genFlag(countryCode)
      this.location = 'WW'
    }

    if(this.location == 'EU') {
      this.estimateArrival = this.content?.estimate_arrival_eu || '5-7'
      this.orderShip = this.content?.order_ship_eu || '2-3'
    } else if(this.location == 'UK') {
      this.estimateArrival = this.content?.estimate_arrival_uk || '5-7'
      this.orderShip = this.content?.order_ship_uk || '2-3'
    } else if(this.location == 'US') {
      this.estimateArrival = this.content?.estimate_arrival_us || '5-7'
      this.orderShip = this.content?.order_ship_us || '2-3'
    } else {
      this.estimateArrival = this.content?.estimate_arrival_ww || '5-7'
      this.orderShip = this.content?.order_ship_ww || '2-3'
    }

    this.genDom()
  }

  changeForAllElement(countryCode) {
    document.querySelectorAll('delivery-wrapper').forEach((deliveryWrapper) => {
      deliveryWrapper.changeLocation(countryCode)
    })
  }

  async getLocation() {
    const result = !localStorage.getItem('country') ? await fetch('https://ipinfo.io/json?token=93329ec3c2d129')
    .then(response => response.json())
    .then(data => { return data }) : { country: localStorage.getItem('country') }
    if(!localStorage.getItem('country')) {
      localStorage.setItem('country', result.country)
    }

    this.countryName.forEach((dom) => {
      dom.innerHTML = this.getCountryName(result.country)
    })

    if(this.select) {
      this.select.value = result.country
    }

    if(this.EU.includes(result.country)) {
      this.genFlag(result.country)
      this.location = 'EU'
    } else if(result.country == 'CN') {
      this.genFlag(result.country)
      this.location = 'CN'
    } else if(result.country == 'UK') {
      this.genFlag(result.country)
      this.location = 'UK'
    } else if(result.country == 'US') {
      this.genFlag(result.country)
      this.location = 'US'
    } else if(result.country == 'VN') {
      this.genFlag(result.country)
      this.location = 'VN'
    } else {
      this.genFlag(result.country)
      this.location = 'WW'
    }

    if(this.location == 'EU') {
      this.estimateArrival = this.content?.estimate_arrival_eu
      this.orderShip = this.content?.order_ship_eu
    } else if(this.location == 'CN') {
      this.estimateArrival = this.content?.estimate_arrival_cn
      this.orderShip = this.content?.order_ship_cn
    } else if(this.location == 'UK') {
      this.estimateArrival = this.content?.estimate_arrival_uk
      this.orderShip = this.content?.order_ship_uk
    } else if(this.location == 'US') {
      this.estimateArrival = this.content?.estimate_arrival_us
      this.orderShip = this.content?.order_ship_us
    } else {
      this.estimateArrival = this.content?.estimate_arrival_ww || '5-7'
      this.orderShip = this.content?.order_ship_ww || '2-3'
    }

    this.genDom()
  }

  async genFlag(countryCode) {
    if(this.querySelector('.flag')) {
      this.querySelector('.flag').src = this.assetsFolderUrl + '/' + countryCode.toLowerCase() + '.svg';
    }
  }

  getCountryName(countryCode) {
    return this.flags[countryCode]
  }

  calculateSeconds(minValue, maxValue) {
    const weekendDays = {
      'Sat': true,
      'Sun': true,
    };
  
    function addDaysSkippingWeekends(startDate, daysToAdd) {
      let currentDate = new Date(startDate);
      while (daysToAdd > 0) {
        currentDate.setDate(currentDate.getDate() + 1);
        let dayName = currentDate.toLocaleString('en-US', { weekday: 'short' });
        if (!weekendDays[dayName]) {
          daysToAdd--;
        }
      }
      return currentDate;
    }
  
    let startDate = new Date();
    let minDate = addDaysSkippingWeekends(startDate, minValue);
    let maxDate = addDaysSkippingWeekends(startDate, maxValue);
  
    let options = { month: 'short', day: 'numeric' };
    let minDateFormatted = minDate.toLocaleString('en-US', options);
    let maxDateFormatted = maxDate.toLocaleString('en-US', options);
  
    if (minDate.getMonth() === maxDate.getMonth()) {
      let month = minDate.toLocaleString('en-US', { month: 'short' });
      let minDay = minDate.getDate();
      let maxDay = maxDate.getDate();
      return `${month} ${minDay}-${maxDay}`;
    }
  
    return `${minDateFormatted} - ${maxDateFormatted}`;
  }
  
  
  processEstimateArrival() {
    let minArrival, maxArrival;
  
    if (this.estimateArrival) {
      const arrivalSplit = this.estimateArrival.replace(/\s/g, '').split('-');
      minArrival = parseInt(arrivalSplit[0], 10);
      maxArrival = parseInt(arrivalSplit[1], 10);
    }
  
    return this.calculateSeconds(minArrival, maxArrival);
  }
  
  processOrderShip() {
    let minOrderShip, maxOrderShip;
  
    if (this.orderShip) {
      const shipSplit = this.orderShip.replace(/\s/g, '').split('-');
      minOrderShip = parseInt(shipSplit[0], 10);
      maxOrderShip = parseInt(shipSplit[1], 10);
    }
  
    return this.calculateSeconds(minOrderShip, maxOrderShip);
  }
}

if (!customElements.get('delivery-wrapper')) {
  customElements.define('delivery-wrapper', DeliveryWrapper);
}


class CartNotification extends HTMLElement {
  constructor() {
    super();
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
    document.body.classList.add('overflow-hidden');
    this.classList.remove('hidden');
  }

  hide() {
    document.body.classList.remove('overflow-hidden');
    this.classList.add('hidden');
  }

  renderContents(parsedState) {
      this.cartItemKey = parsedState.key;
      this.getSectionsToRender().forEach((section => {
        document.getElementById(section.id).innerHTML =
          this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
      }));

      if (this.header) this.header.reveal();
      this.open();
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-notification-product',
        selector: `[id="cart-notification-product-${this.cartItemKey}"]`,
      }
    ];
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }
}

customElements.define('cart-notification', CartNotification);