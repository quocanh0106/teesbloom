import './template-cart.scss';

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: `application/${type}`,
    },
  };
}

Shopify.formatMoney = function (cents, format) {
  if (typeof cents == 'string') {
    cents = cents.replace('.', '');
  }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = format || this.money_format;

  function defaultOption(opt, def) {
    return typeof opt == 'undefined' ? def : opt;
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);

    var parts = number.split('.'),
      dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
      cents = parts[1] ? decimal + parts[1] : '';

    return dollars + cents;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};
class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.line = this.dataset.lineitem;
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
      this.removePopup.open();
      this.input.stepUp();
    } else {
      this.input.dispatchEvent(this.changeEvent);
    }

  }
}

customElements.define('quantity-input', QuantityInput);

class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', event => {
      event.preventDefault();
      const cartItems = this.closest('cart-items');
      cartItems.updateQuantity(this.dataset.index, 0);
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartItems extends HTMLElement {
  constructor() {
    super();
    this.currentItemCount = Array.from(
      this.querySelectorAll('[name="updates[]"]'),
    ).reduce(
      (total, quantityInput) => total + parseInt(quantityInput.value),
      0,
    );

    this.debouncedOnChange = debounce(event => {
      this.onChange(event);
    }, 500);

    this.addEventListener('change', this.debouncedOnChange.bind(this));
  }

  onChange(event) {
    this.updateQuantity(event.target.dataset.index, event.target.value);
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
      {
        id: 'cart-total',
        section: 'cart-total',
        selector: '.shopify-section',
      }
    ];
  }

  updateQuantity(line, quantity) {
    const body = JSON.stringify({
      line,
      sections: this.getSectionsToRender().map(section => section.section),
      sections_url: window.location.pathname,
      quantity,
    });

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then(response => {
        return response.text();
      })
      .then(state => {
        const parsedState = JSON.parse(state);
        this.classList.toggle('!hidden', parsedState.item_count === 0);
        const quantityElement = this.querySelector(`input[data-key="${key}"]`);
        if (parsedState.errors) {
          quantityElement.value = quantityElement.getAttribute('value');
          this.updateLiveRegions(key, parsedState.errors);
          return;
        }
        const cartFooter = document.getElementById('main-cart-footer');
        const itemCount = document.getElementById('item-count');
        if (itemCount) {itemCount.innerHTML = parsedState.item_count;}
        if (cartFooter) {
          if(parsedState.item_count == 0) {
            document.querySelector('.cart-heading').classList.add('!hidden');
            cartFooter.classList.add('!hidden');
            document.querySelector('.cart-empty').classList.remove('hidden');
          }
        }
        const lineItem = document.querySelector(`[data-index="${line}"]`);

        if (parseInt(quantity) == 0) {
          lineItem.remove();
        }

        this.getSectionsToRender().forEach(section => {
          const elementToReplace = document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
          if(elementToReplace) {
            elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
          }
        });
      })
      .catch(() => {
        const errors = document.getElementById('cart-errors');
        if (errors) {
          errors.textContent = window.cartStrings.error;
        }
      });
  }

  updateLiveRegions(line, itemCount) {
    this.currentItemCount = itemCount;

    if (this.currentItemCount === itemCount) {
      const quantityElement = this.querySelector(`input[data-key="${line}"]`);
      this.querySelector(`.cart-item__error-text[data-key="${line}"]`).innerHTML =
        window.cartStrings.quantityError.replace(
          '[quantity]',
          quantityElement.value,
        );
    }
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }
}

customElements.define('cart-items', CartItems);

if (!customElements.get('cart-note')) {
  customElements.define(
    'cart-note',
    class CartNote extends HTMLElement {
      constructor() {
        super();

        this.addEventListener(
          'change',
          debounce(event => {
            const body = JSON.stringify({ note: event.target.value });
            fetch(`${routes.cart_update_url}`, {
              ...fetchConfig(),
              ...{ body },
            });
          }, 300),
        );
      }
    },
  );
}

class OpenEdit extends HTMLElement {
  constructor() {
    super();
    this.id = this?.dataset?.id;
    this.href = this.dataset.href;
    this.key = this.dataset.key;
    this.addEventListener('click', () => {
      window.history.replaceState({}, '', `${this.href}`);
      document.querySelector(this.id).open(this.href, this.key);
    });
  }
}

if (!customElements.get('open-edit')) {
  customElements.define('open-edit', OpenEdit);
}

class EditLineItem extends HTMLElement {
  constructor() {
    super();
    this.wrapper = this.querySelector('.edit-wrapper');
    this.querySelectorAll('.close').forEach(button => {
      button.addEventListener('click', this.hide.bind(this, !1));
    });
    this.addEventListener('keyup', blur => {
      'ESCAPE' === blur.code.toUpperCase() && this.hide();
    });
    this.addEventListener('click', event => {
      if (event.target === this) this.hide(event);
    });
  }

  open(href, key) {
    document.body.classList.add('!overflow-hidden');
    this.classList.remove('hidden');
    this.controller = new AbortController();
    let signal = this.controller.signal
    fetch(href, { signal })
      .then(res => {
        return res.text();
      })
      .then(html => {
        this.parser = new DOMParser();
        this.wrapper.innerHTML = this.parser.parseFromString(html, 'text/html').querySelector('.page-width').innerHTML;
        this.setInnerHTML(this.wrapper);

      }).finally(() => {
        this.wrapper.querySelector('product-form').setAttribute('data-key', key);
      });
  }

  hide() {
    if(this.controller) {
      this.controller.abort();
    }
    document.body.classList.remove('!overflow-hidden');
    this.classList.add('hidden');
    this.removeInnerHTML(this.wrapper);
  }

  setInnerHTML(element) {
    element.querySelectorAll('script').forEach(oldScriptTag => {
      const newScriptTag = document.createElement('script');
      Array.from(oldScriptTag.attributes).forEach(attribute => {
        newScriptTag.setAttribute(attribute.name, attribute.value);
      });
      newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML));
      oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
    });
  }

  removeInnerHTML(element) {
    this.serializer = new XMLSerializer();
    element.querySelectorAll('script').forEach(oldScriptTag => {
      oldScriptTag.outerHTML = '';
    });
    document.querySelectorAll('script').forEach(script => {
      if (this.serializer.serializeToString(script).includes('customily')) {
        script.outerHTML = '';
      }
    });
    document.querySelectorAll('.vue-portal-target').forEach(element => {
      if (this.serializer.serializeToString(element).includes('customily')) {
        element.outerHTML = '';
      }
    });
    document.querySelectorAll('link').forEach(link => {
      if (this.serializer.serializeToString(link).includes('customily')) {
        link.outerHTML = '';
      }
    });
  }
}

if (!customElements.get('edit-lineitem')) {
  customElements.define('edit-lineitem', EditLineItem);
}

class StickyCheckout extends HTMLElement {
  constructor() {
    super();
    this.observe = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting === true) {
        entries[0].target.querySelector('.checkout-button').classList.remove('btn-wrapper-sticky');
        if(document.querySelector('scroll-to-top')) {
          document.querySelector('scroll-to-top').classList.remove('space-sticky');
        }
        if(document.querySelector('#fc_frame')) {
          document.querySelector('#fc_frame').classList.remove('space-sticky');
        }
      } else {
        entries[0].target.querySelector('.checkout-button').classList.add('btn-wrapper-sticky');
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

if (!customElements.get('sticky-checkout')) {
  customElements.define('sticky-checkout', StickyCheckout);
}

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