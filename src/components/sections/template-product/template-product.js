import './template-product.scss';
import './template-product-uk.scss';

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': `application/json, application/${type}, text/${type}` }
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
    document.querySelector('.gallery').setSlidePosition(0);

    if (!currentVariant) return;
    if (!currentVariant.featured_media) return;

    const mediaGalleries = document.querySelectorAll(`[id^="MediaGallery-${this.dataset.section}"]`);
    mediaGalleries.forEach(mediaGallery => mediaGallery.setActiveMedia(`${this.dataset.section}-${currentVariant.featured_media.id}`, true));

    const modalContent = document.querySelector(`#ProductModal-${this.dataset.section} .product-media-modal__content`);
    if (!modalContent) return;
    const newMediaModal = modalContent.querySelector( `[data-media-id="${currentVariant.featured_media.id}"]`);
    modalContent.prepend(newMediaModal);
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
    const formData = new FormData(this.form);
    if (this.cart) {
      formData.append('sections', this.getSectionsToRender().map((section) => section.id));
      formData.append('sections_url', window.location.pathname);
    } else {
      formData.append('sections', this.getSectionsCartPageToRender().map((section) => section.id));
      formData.append('sections_url', window.routes.cart_url);
    }
    config.body = formData;
    console.log(config, formData)
    
    fetch(`${routes.cart_add_url}`, config)
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        if (this.cart) {
          this.cart.open();
          this.renderContents(response);
        } else {
          this.renderCartPageContents(response);
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
        id: 'cart-icon-bubble-drawer',
        section: 'cart-icon-bubble-drawer',
        selector: '.shopify-section'
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
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

class StickyAddCart extends HTMLElement {
  constructor() {
    super();
    window.addEventListener('scroll', function() {
      document.querySelector('sticky-add-to-cart').init();
    }, { once: true, passive: true });
  }

  init() {
    this.observe = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting === true) {
        entries[0].target.querySelector('.product-form__buttons').classList.remove('btn-wrapper-sticky');
        if(document.querySelector('scroll-to-top')) {
          document.querySelector('scroll-to-top').classList.remove('space-sticky');
        }
        if(document.querySelector('#fc_frame')) {
          document.querySelector('#fc_frame').classList.remove('space-sticky');
        }
      } else {
        entries[0].target.querySelector('.product-form__buttons').classList.add('btn-wrapper-sticky');
        if(document.querySelector('scroll-to-top')) {
          document.querySelector('scroll-to-top').classList.add('space-sticky');
        }
        if(document.querySelector('#fc_frame')) {
          document.querySelector('#fc_frame').classList.add('space-sticky');
        }
      }
    },
    {threshold: 0});

    this.observe.observe(this);
  }
}

if (!customElements.get('sticky-add-to-cart')) {
  customElements.define('sticky-add-to-cart', StickyAddCart);
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