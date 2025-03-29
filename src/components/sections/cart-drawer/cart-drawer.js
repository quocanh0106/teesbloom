import './cart-drawer.scss';

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

if (!customElements.get('quantity-input')) {

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
        this.removePopup?.open();
        this.input.stepUp();
      } else {
        this.input.dispatchEvent(this.changeEvent);
      }

    }
  }

  customElements.define('quantity-input', QuantityInput);
}

if (!customElements.get('cart-remove-button')) {
  class CartRemoveButton extends HTMLElement {
    constructor() {
      super();

      this.addEventListener('click', event => {
        event.preventDefault();
        this.remove(this.dataset.index)
      });
    }

    remove(dataIndex) {
      const cartItems = document.querySelector('cart-items');
      cartItems.updateQuantity(dataIndex, 0);
    }
  }

  customElements.define('cart-remove-button', CartRemoveButton);
}



if (!customElements.get('cart-items')) {
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
          id: 'cart-drawer-total',
          section: 'cart-drawer-total',
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

          const cartFooter = document.getElementById('main-cart-footer');
          const quantityElement = this.querySelector(`input[data-index="${line}"]`);

          if (parsedState.errors) {
            quantityElement.value = quantityElement.getAttribute('value');
            this.updateLiveRegions(line, parsedState.errors);
            return;
          }

          if (cartFooter) {
            if(parsedState.item_count == 0) {
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
        const quantityElement = this.querySelector(`input[data-index="${line}"]`);
        this.querySelector(`.cart-item__error-text[data-index="${line}"]`).innerHTML =
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
}