import './account.scss';

class TogglePassword extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.eye = this.querySelector('.eye');
    this.eye.addEventListener('click', this.togglePassword.bind(this));
  }

  togglePassword() {
    if (this.input.type == 'password') {
      this.input.type = 'text';
      this.eye.classList.add('active');
    } else {
      this.input.type = 'password';
      this.eye.classList.remove('active');
    }
  }
}

customElements.define('toggle-password', TogglePassword);

class Logout extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', () => {
      window.location.href = window.routes.accountLogout;
    })
  }
}

customElements.define('logout-account', Logout);

class AccountInformation extends HTMLElement {
  constructor() {
    super();

    this.form = this.querySelector('form');
    this.buttonSubmit = this.form.querySelector('button')

    this.buttonSubmit && this.buttonSubmit.addEventListener('click', this.onFormSubmit.bind(this));
    this.form.addEventListener('input', () => {
      this.buttonSubmit.removeAttribute('disabled');
    })
  }

  onFormSubmit(e) {
    e.preventDefault();
    const formFields = this.querySelectorAll('input, select, textarea');

    let isValid = true;

    formFields.forEach(field => {
      const fieldName = field.dataset.name;
      const fieldValue = field.value.trim();
      switch (fieldName) {
        case 'email':
          if (!this.validateEmail(fieldValue)) {
            isValid = false;
            field.classList.add('error');
            this.showValidationMessage(field, window.form.email);
          } else {
            field.classList.remove('error');
            this.hideValidationMessage(field);
          }
          break;
        case 'username':
          if (!this.validateName(fieldValue)) {
            isValid = false;
            field.classList.add('error');
            this.showValidationMessage(field, window.form.username);
          } else {
            field.classList.remove('error');
            this.hideValidationMessage(field);
          }
          break;
        case 'body':
          if (!this.validateBody(fieldValue)) {
            isValid = false;
            field.classList.add('error')
            this.showValidationMessage(field, window.form.body);
          } else {
            field.classList.remove('error')
            this.hideValidationMessage(field);
          }
          break;
        case 'phone':
          if (!this.validatePhoneNumber(fieldValue)) {
            isValid = false;
            field.classList.add('error');
            this.showValidationMessage(field, window.form.phone);
          } else {
            field.classList.remove('error');
            this.hideValidationMessage(field);
          }
          break;
        default:
          if (!fieldValue) {
            isValid = false;
            field.classList.add('error')
            this.showValidationMessage(field, window.form.default);
          } else {
            field.classList.remove('error')
            this.hideValidationMessage(field);
          }
      }
    });

    if (isValid) {
      this.form.submit();
    }
  }
  
  validateEmail(email) {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateName(name) {
    // Regular expression for name validation (allow letters, spaces, and hyphens)
    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ-' ]+$/;
    return nameRegex.test(name);
  }

  validateBody(body) {
    // Regular expression for name validation (allow letters, spaces, and hyphens)
    return body.length > 0;
  }

  validatePhoneNumber(phone) {
    // Regular expression for phone number validation (allow numbers, spaces, and hyphens)
    const phoneRegex = /^(\+?\d+[\s\-]*)+$/;
    return phoneRegex.test(phone);
  }

  showValidationMessage(field, message) {
    // Display validation message for the field
    const errorSpan = document.createElement('span');
    errorSpan.textContent = message;
    errorSpan.classList.add('error-message');

    let existingError = field.parentElement.querySelector('.error-message') ;
    if (existingError) {
      existingError.textContent = message;
    } else {
      field.parentElement.appendChild(errorSpan);
    }
  }

  hideValidationMessage(field) {
    // Hide validation message for the field
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
  }
}

if (!customElements.get('account-information')) {
  customElements.define('account-information', AccountInformation);
}

class AddressInformation extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    this.buttonSubmit = this.form.querySelector('button[type="submit"]');
    this.form.addEventListener('input', () => {
      this.buttonSubmit.removeAttribute('disabled');
    })
  }
}

if (!customElements.get('account-address-form')) {
  customElements.define('account-address-form', AddressInformation);
}