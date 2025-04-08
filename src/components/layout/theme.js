import './theme.scss';

function debounce(fn, wait) {
  let t;
  return function () {
    var args = arguments;
    clearTimeout(t);
    t = setTimeout(function () {
      fn.apply(this, args);
    }, wait);
  };
}

if (!customElements.get('modal-opener')) {
  class ModalOpener extends HTMLElement {
    constructor() {
      super();
      this.id = this?.dataset?.id;
      this.addEventListener('click', () => {
        this.id == '#predictive-search' ? document.querySelector(this.id).openSearchMobile() : document.querySelector(this.id).open()
      });
    }
  }

  customElements.define('modal-opener', ModalOpener);
}

if (!customElements.get('modal-dialog')) {
  class ModalDialog extends HTMLElement {
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
  }

  customElements.define('modal-dialog', ModalDialog);
  
  class SelectCountry extends ModalDialog {
    constructor() {
      super();
      this.select = this.querySelector('select')
  
      this.select.value = localStorage.getItem('country') ? localStorage.getItem('country') : 'US'
      this.submit = this.querySelector('.submit')
      this.submit.addEventListener('click', () => {
        this.updateCountry()
      })
    }
  
    updateCountry() {
      document.querySelector('delivery-wrapper').changeForAllElement(this.select.value)
      this.hide()
    }
  }
  
  if (!customElements.get('select-country')) {
    customElements.define('select-country', SelectCountry);
  }
}

if (!customElements.get('accordion-toggle')) {
  class Accordion extends HTMLElement {
    constructor() {
      super();
      this.init();
    }

    init() {
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
          document.addEventListener('click', (e) => {
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

  customElements.define('accordion-toggle', Accordion);
}

if (!customElements.get('copy-link')) {
  class CopyLink extends HTMLElement {
    constructor() {
      super();
      this.href = this.getAttribute('href');
      this.tooltip = this.querySelector('.tooltip')
      this.addEventListener('click', () => {
        navigator.clipboard.writeText(this.href);
        if (this.tooltip) {
          this.tooltip.innerHTML = this.tooltip.dataset.click;
          setTimeout(() => {
            this.tooltip.innerHTML = this.tooltip.dataset.normal;
          }, 5000)
        }
      });
    }
  }

  customElements.define('copy-link', CopyLink);
}

if (!customElements.get('slider-component')) {
  class SliderComponent extends HTMLElement {
    constructor() {
      super();
      this.slider = this.querySelector('.slider-wrapper');
      this.sliderItems = this.querySelectorAll('.slider-slide');
      if (this.dataset.loop == 'true') {
        this.enableSliderLooping = true;
      } else {
        this.enableSliderLooping = false;
      }
      this.currentPageElement = this.querySelector('.slider-counter--current');
      this.pageTotalElement = this.querySelector('.slider-counter--total');
      this.prevButton = this.querySelector('button[name="previous"]');
      this.nextButton = this.querySelector('button[name="next"]');
      this.dots = this.querySelector('.slider-dots')
      this.seemore = this.querySelector('.truncate-section');
      if (this.dataset.autoplay) {
        this.autoplay = parseInt(this.dataset.autoplay);
      }
      if (this.seemore) {
        this.limit = parseInt(this.dataset.limit) - 1;

        this.seemore.addEventListener('click', () => {
          this.sliderItems.forEach((li, key) => {
            if (key > this.limit && li.classList.contains('!hidden') || key > this.limit && li.classList.contains('lg:!hidden')) {
              li.classList.remove('!hidden');
              li.classList.remove('lg:!hidden');
              this.seemore.classList.add('active');
            } else if (key > this.limit && !li.classList.contains('!hidden') || key > this.limit && !li.classList.contains('lg:!hidden')) {
              li.classList.add('!hidden');
              li.classList.add('lg:!hidden');
              this.seemore.classList.remove('active');
            }
          });
        });
      }
      if (!this.slider || !this.nextButton) return;

      this.initPages();
      const resizeObserver = new ResizeObserver(() => this.initPages());

      resizeObserver.observe(this.slider);

      this.slider.addEventListener('scroll', this.update.bind(this));
      this.prevButton.addEventListener('click', this.onButtonClick.bind(this));
      this.nextButton.addEventListener('click', this.onButtonClick.bind(this));

      if (this.autoplay && this.nextButton) {
        setInterval(() => {
          this.onButtonClick();
        }, this.autoplay);
      }
    }

    initPages() {
      this.slider = this.querySelector('.slider-wrapper');
      this.sliderItems = this.querySelectorAll('.slider-slide');
      this.sliderItemsToShow = Array.from(this.sliderItems).filter((element) => element.clientWidth > 0);
      if (this.sliderItemsToShow.length < 2) return;
      this.sliderItemOffset = this.sliderItemsToShow[1].offsetLeft - this.sliderItemsToShow[0].offsetLeft;
      this.slidesPerPage = Math.floor(
        (this.slider.clientWidth - this.sliderItemsToShow[0].offsetLeft) / this.sliderItemOffset
      );
      this.totalPages = this.sliderItemsToShow.length - this.slidesPerPage + 1;
      if (!this.classList.contains('gallery')) {
        this.generateDots(this.totalPages);
      }
      this.update();
    }

    resetPages() {
      this.sliderItems = this.querySelectorAll('.slider-slide');
      this.initPages();
    }

    generateDots(totalPages) {
      let html = ''
      for (let i = 1; i < totalPages; i++) {
        let active = '';
        if (i == 1) active = 'active';
        html += `<span class="slider-dot ${active}" data-position="${i}"></span>`
      }
      this.dots.innerHTML = html;
    }

    generateDotsGallery() {
      this.dots.querySelectorAll('.slider-dot').forEach((dot, index) => {
        dot.dataset.position = index + 1
      })
    }

    update() {
      if (!this.slider || !this.nextButton) return;

      const previousPage = this.currentPage;
      this.currentPage = Math.round(this.slider.scrollLeft / this.sliderItemOffset) + 1;

      if (this.currentPageElement && this.pageTotalElement) {
        this.currentPageElement.textContent = this.currentPage;
        this.pageTotalElement.textContent = this.totalPages;
      }
      this.updateDots(this.currentPage);

      if (this.currentPage != previousPage) {
        this.dispatchEvent(
          new CustomEvent('slideChanged', {
            detail: {
              currentPage: this.currentPage,
              currentElement: this.sliderItemsToShow[this.currentPage - 1],
            },
          })
        );
      }
      if (this.getAttribute('visibility') == 'true') {
        this.sliderItemsToShow.forEach((slide) => {
          if (this.isSlideVisible(slide)) {
            slide.classList.add('slide-visible');
          } else {
            slide.classList.remove('slide-visible');
          }
        })
      }

      if (this.enableSliderLooping) return;

      if (this.isSlideVisible(this.sliderItemsToShow[0]) && this.slider.scrollLeft === 0) {
        this.prevButton.setAttribute('disabled', 'disabled');
      } else {
        this.prevButton.removeAttribute('disabled');
      }

      if (this.isSlideVisible(this.sliderItemsToShow[this.sliderItemsToShow.length - 1])) {
        this.nextButton.setAttribute('disabled', 'disabled');
      } else {
        this.nextButton.removeAttribute('disabled');
      }
    }

    updateDots(currentPage) {
      this.dots.querySelectorAll('.slider-dot').forEach((dot) => {
        if (dot.dataset.position == currentPage) {
          this.querySelector('.slider-dot.active')?.classList.remove('active');
          dot.classList.add('active')
        }
        dot.addEventListener('click', (event) => {
          this.onDotClick(event, currentPage)
        })
      })
    }

    isSlideVisible(element, offset = 0) {
      const lastVisibleSlide = this.slider.clientWidth + this.slider.scrollLeft - offset;
      return element.offsetLeft + element.clientWidth <= lastVisibleSlide && element.offsetLeft >= this.slider.scrollLeft;
    }

    onButtonClick(event) {
      event?.preventDefault();
      const side = event?.currentTarget?.name || 'next';
      const step = event?.currentTarget?.dataset?.step || 1;
      this.slideScrollPosition = side === 'next' ? this.slider.scrollLeft + step * this.sliderItemOffset : this.slider.scrollLeft - step * this.sliderItemOffset;
      this.setSlidePosition(this.slideScrollPosition);
    }

    onDotClick(event, currentPage) {
      event.preventDefault();
      const activePosition = parseInt(currentPage);
      const newActivePosition = parseInt(event.target.dataset.position)
      let to = 'next';
      if (newActivePosition < activePosition) to = 'prev';
      const step = Math.abs(newActivePosition - activePosition) || 1;
      this.slideScrollPosition = to === 'next' ? this.slider.scrollLeft + step * this.sliderItemOffset : this.slider.scrollLeft - step * this.sliderItemOffset;
      this.setSlidePosition(this.slideScrollPosition);
    }

    setSlidePosition(position) {
      if (this.enableSliderLooping) {
        if (position >= this.slider.scrollWidth) {
          // Cuộn mượt đến slide đầu tiên
          this.slider.scrollTo({
            left: 0,
            behavior: 'auto'
          });
        } else if (position < 0) {
          this.slider.scrollTo({
            left: this.slider.scrollWidth,
            behavior: 'auto'
          });
        } else {
          this.slider.scrollTo({
            left: position,
            behavior: 'auto'
          });
        }
      }
      else {
        this.slider.scrollTo({
          left: position,
          behavior: 'auto'

        });
      }
    }

    backToFirst() {
      this.setSlidePosition(0);
    }
  }

  customElements.define('slider-component', SliderComponent);
}

class SearchForm extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input[type="search"]');
    this.form = this.querySelector('form');
    this.resetButton = this.querySelector('button[type="reset"]');
    if (this.input) {
      this.input.form.addEventListener('reset', this.onFormReset.bind(this));
      this.resetButton.addEventListener(
        'click',
        this.closeSearchMobile.bind(this),
      );
      this.input.addEventListener(
        'input',
        debounce(event => {
          this.onChange(event);
        }, 300).bind(this),
      );
    }
  }
  openSearchMobile() {
    this.onFocus();
    this.classList.remove('opacity-0', 'invisible');
    document.body.classList.add('search-active');
  }
  closeSearchMobile() {
    this.classList.add('opacity-0', 'invisible');
    document.body.classList.remove('search-active');
  }
  onChange() { }
  shouldResetForm() {
    return !document.querySelector('[aria-selected="true"] a');
  }
  onFormReset(event) {
    // Prevent default so the form reset doesn't set the value gotten from the url on page load
    event.preventDefault();
    if (document.body.classList.contains('sticky-header')) {
      document.body.classList.remove('header-on-top');
    }
    // Don't reset if the user has selected an element on the predictive search dropdown
    if (this.shouldResetForm()) {
      this.input.value = '';
    }
  }
}
customElements.define('search-form', SearchForm);


if (!customElements.get('predictive-search')) {
  class PredictiveSearch extends SearchForm {
    constructor() {
      super();
      this.cachedResults = {};
      this.predictiveSearchResults = this.querySelector('[data-predictive-search]');
      this.allPredictiveSearchInstances = document.querySelectorAll('predictive-search');
      this.isOpen = false;
      this.abortController = new AbortController();
      this.searchTerm = '';
      this.setupEventListeners();
    }

    setupEventListeners() {
      this.input.form.addEventListener('submit', this.onFormSubmit.bind(this));
      this.input.addEventListener('focus', this.onFocus.bind(this));
      this.addEventListener('focusout', this.onFocusOut.bind(this));
      this.addEventListener('keyup', this.onKeyup.bind(this));
      this.addEventListener('keydown', this.onKeydown.bind(this));
    }

    getQuery() {
      return this.input.value.trim();
    }

    onChange() {
      super.onChange();
      const newSearchTerm = this.getQuery();
      if (!this.searchTerm || !newSearchTerm.startsWith(this.searchTerm)) {
        this.querySelector('#predictive-search-results-groups-wrapper')?.remove();
      }

      // Update the term asap, don't wait for the predictive search query to finish loading
      this.updateSearchForTerm(this.searchTerm, newSearchTerm);

      this.searchTerm = newSearchTerm;

      if (!this.searchTerm.length) {
        this.close(true);
        return;
      }

      this.getSearchResults(this.searchTerm);
    }

    onFormSubmit(event) {
      if (
        !this.getQuery().length ||
        this.querySelector('[aria-selected="true"] a')
      )
        event.preventDefault();
    }

    onFormReset(event) {
      super.onFormReset(event);
      if (super.shouldResetForm()) {
        this.searchTerm = '';
        this.abortController.abort();
        this.abortController = new AbortController();
        this.closeResults(true);
      }
    }

    onFocus() {
      const currentSearchTerm = this.getQuery();
      this.open();
      setTimeout(() => {
        this.input.focus();
      }, 500)
      if (this.searchTerm !== currentSearchTerm) {
        // Search term was changed from other search input, treat it as a user change
        this.onChange();
      } else {
        if (currentSearchTerm != '') {
          this.getSearchResults(this.searchTerm);
        } else {
          this.getSearchRecommend('empty');
        }
      }
    }

    onFocusOut() {
      setTimeout(() => {
        if (!this.contains(document.activeElement)) {
          this.close();
        }
      });
    }

    onKeyup(event) {
      if (!this.getQuery().length) this.close(true);
      event.preventDefault();

      switch (event.code) {
        case 'ArrowUp':
          this.switchOption('up');
          break;
        case 'ArrowDown':
          this.switchOption('down');
          break;
        case 'Enter':
          this.selectOption();
          break;
      }
    }

    onKeydown(event) {
      // Prevent the cursor from moving in the input when using the up and down arrow keys
      if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
        event.preventDefault();
      }
    }

    updateSearchForTerm(previousTerm, newTerm) {
      const searchForTextElement = this.querySelector(
        '[data-predictive-search-search-for-text]',
      );
      const currentButtonText = searchForTextElement?.innerText;
      if (currentButtonText) {
        if (currentButtonText.match(new RegExp(previousTerm, 'g')).length > 1) {
          // The new term matches part of the button text and not just the search term, do not replace to avoid mistakes
          return;
        }
        const newButtonText = currentButtonText.replace(previousTerm, newTerm);
        searchForTextElement.innerText = newButtonText;
      }
    }

    switchOption(direction) {
      if (!this.getAttribute('open')) return;

      const moveUp = direction === 'up';
      const selectedElement = this.querySelector('[aria-selected="true"]');

      // Filter out hidden elements (duplicated page and article resources) thanks
      // to this https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
      const allVisibleElements = Array.from(
        this.querySelectorAll('li, button.predictive-search__item'),
      ).filter(element => element.offsetParent !== null);
      let activeElementIndex = 0;

      if (moveUp && !selectedElement) return;

      let selectedElementIndex = -1;
      let i = 0;

      while (selectedElementIndex === -1 && i <= allVisibleElements.length) {
        if (allVisibleElements[i] === selectedElement) {
          selectedElementIndex = i;
        }
        i++;
      }

      this.statusElement.textContent = '';

      if (!moveUp && selectedElement) {
        activeElementIndex =
          selectedElementIndex === allVisibleElements.length - 1
            ? 0
            : selectedElementIndex + 1;
      } else if (moveUp) {
        activeElementIndex =
          selectedElementIndex === 0
            ? allVisibleElements.length - 1
            : selectedElementIndex - 1;
      }

      if (activeElementIndex === selectedElementIndex) return;

      const activeElement = allVisibleElements[activeElementIndex];

      activeElement.setAttribute('aria-selected', true);
      if (selectedElement) selectedElement.setAttribute('aria-selected', false);

      this.input.setAttribute('aria-activedescendant', activeElement.id);
    }

    selectOption() {
      const selectedOption = this.querySelector(
        '[aria-selected="true"] a, button[aria-selected="true"]',
      );

      if (selectedOption) selectedOption.click();
    }

    getSearchResults(searchTerm) {
      const queryKey = searchTerm.replace(' ', '-').toLowerCase();
      this.setLiveRegionLoadingState();

      if (this.cachedResults[queryKey]) {
        this.renderSearchResults(this.cachedResults[queryKey]);
        return;
      }

      fetch(
        `${routes.predictive_search_url}?q=${encodeURIComponent(
          searchTerm,
        )}&section_id=predictive-search`,
        { signal: this.abortController.signal },
      )
        .then(response => {
          if (!response.ok) {
            var error = new Error(response.status);
            this.close();
            throw error;
          }

          return response.text();
        })
        .then(text => {
          const resultsMarkup = new DOMParser()
            .parseFromString(text, 'text/html')
            .querySelector('#shopify-section-predictive-search').innerHTML;
          // Save bandwidth keeping the cache in all instances synced
          this.allPredictiveSearchInstances.forEach(predictiveSearchInstance => {
            predictiveSearchInstance.cachedResults[queryKey] = resultsMarkup;
          });
          this.renderSearchResults(resultsMarkup);
        })
        .catch(error => {
          if (error?.code === 20) {
            // Code 20 means the call was aborted
            return;
          }
          this.close();
          throw error;
        });
    }

    getSearchRecommend(searchTerm) {
      this.setLiveRegionLoadingState();

      fetch(
        `${routes.predictive_search_url}?q=${encodeURIComponent(
          searchTerm,
        )}&section_id=predictive-search-recommend`,
        { signal: this.abortController.signal },
      )
        .then(response => {
          if (!response.ok) {
            var error = new Error(response.status);
            this.close();
            throw error;
          }

          return response.text();
        })
        .then(text => {
          const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search-recommend').innerHTML;
          this.renderSearchResults(resultsMarkup);
        })
        .catch(error => {
          if (error?.code === 20) {
            // Code 20 means the call was aborted
            return;
          }
          this.close();
          throw error;
        });
    }

    setLiveRegionLoadingState() {
      this.statusElement =
        this.statusElement || this.querySelector('.predictive-search-status');
      this.loadingText =
        this.loadingText || this.getAttribute('data-loading-text');

      this.setLiveRegionText(this.loadingText);
      this.setAttribute('loading', true);
    }

    setLiveRegionText(statusText) {
      this.statusElement.setAttribute('aria-hidden', 'false');
      this.statusElement.textContent = statusText;

      setTimeout(() => {
        this.statusElement.setAttribute('aria-hidden', 'true');
      }, 1000);
    }

    renderSearchResults(resultsMarkup) {
      this.predictiveSearchResults.innerHTML = resultsMarkup;
      this.setAttribute('results', true);

      this.setLiveRegionResults();
      this.open();
    }

    setLiveRegionResults() {
      this.removeAttribute('loading');
      this.setLiveRegionText(this.querySelector('[data-predictive-search-live-region-count-value]').textContent);
    }

    open() {
      this.setAttribute('open', true);
      this.input.setAttribute('aria-expanded', true);
      this.isOpen = true;
      document.body.classList.add('overflow-hidden');
    }

    close(clearSearchTerm = false) {
      this.closeResults(clearSearchTerm);
      this.isOpen = false;
      document.body.classList.remove('overflow-hidden');
    }

    closeResults(clearSearchTerm = false) {
      if (clearSearchTerm) {
        this.input.value = '';
        this.removeAttribute('results');
      }
      const selected = this.querySelector('[aria-selected="true"]');

      if (selected) selected.setAttribute('aria-selected', false);

      this.input.setAttribute('aria-activedescendant', '');
      this.removeAttribute('loading');
      this.removeAttribute('open');
      this.input.setAttribute('aria-expanded', false);
      this.resultsMaxHeight = false;
      this.predictiveSearchResults.removeAttribute('style');
    }
  }

  customElements.define('predictive-search', PredictiveSearch);
}

class TabsComponent extends HTMLElement {
  constructor() {
    super();
    this.tabs = this.querySelectorAll('.tab-heading');
    this.tabs.forEach(tab => {
      tab.addEventListener('click', (event) => {
        event.preventDefault();
        this.handleTabClick(tab);
      });
    });

  }

  handleTabClick(clickedTab) {
    if (!clickedTab.classList.contains('active')) {
      const activeTab = this.querySelector('.tab-heading.active');
      const activeTabId = activeTab.dataset.id;
      const targetId = clickedTab.dataset.id;

      this.hideTab(activeTabId);
      this.showTab(targetId);

      activeTab.classList.remove('active');
      clickedTab.classList.add('active');
    }
  }

  hideTab(tabId) {
    this.querySelector(`.tab-detail[data-id='${tabId}']`).classList.add('hidden');
  }

  showTab(tabId) {
    this.querySelector(`.tab-detail[data-id='${tabId}']`).classList.remove('hidden');
  }
}

if (!customElements.get('tabs-component')) {
  customElements.define('tabs-component', TabsComponent);
}

if (!customElements.get('scroll-to-top')) {
  class ScrollToTop extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('click', () => {
        window.scrollTo(0, 0);
      })
    }
  }

  customElements.define('scroll-to-top', ScrollToTop)
}

if (!customElements.get('validate-form')) {
  class ValidateForm extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(event) {
      event.preventDefault();
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
              field.classList.add('error')
              this.showValidationMessage(field, window.form.phone);
            } else {
              field.classList.remove('error')
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
        this.querySelector('form').submit();
      }
    }

    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    validateName(name) {
      const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ-' ]+$/;
      return nameRegex.test(name);
    }

    validateBody(body) {
      return body.length > 0;
    }

    validatePhoneNumber(phone) {
      const phoneRegex = /^(\+?\d+[\s\-]*)+$/;
      return phoneRegex.test(phone);
    }

    showValidationMessage(field, message) {
      const errorSpan = document.createElement('span');
      errorSpan.textContent = message;
      errorSpan.classList.add('error-message');

      const existingError = field.parentElement.querySelector('.error-message');
      if (existingError) {
        existingError.textContent = message;
      } else {
        field.parentElement.appendChild(errorSpan);
      }
    }

    hideValidationMessage(field) {
      const existingError = field.parentElement.querySelector('.error-message');
      if (existingError) {
        existingError.remove();
      }
    }
  }

  customElements.define('validate-form', ValidateForm);
}

if (!customElements.get('localization-form')) {
  customElements.define(
    'localization-form',
    class LocalizationForm extends HTMLElement {
      constructor() {
        super();
        this.elements = {
          input: this.querySelector('input[name="locale_code"], input[name="country_code"]'),
          button: this.querySelector('button'),
          panel: this.querySelector('.disclosure__list-wrapper'),
        };
        this.elements.button.addEventListener('click', this.openSelector.bind(this));
        this.elements.button.addEventListener('focusout', this.closeSelector.bind(this));
        this.addEventListener('keyup', this.onContainerKeyUp.bind(this));

        this.querySelectorAll('a').forEach((item) => item.addEventListener('click', this.onItemClick.bind(this)));
      }

      hidePanel() {
        this.elements.button.setAttribute('aria-expanded', 'false');
        this.elements.panel.setAttribute('hidden', true);
      }

      onContainerKeyUp(event) {
        if (event.code.toUpperCase() !== 'ESCAPE') return;

        if (this.elements.button.getAttribute('aria-expanded') == 'false') return;
        this.hidePanel();
        event.stopPropagation();
        this.elements.button.focus();
      }

      onItemClick(event) {
        event.preventDefault();
        const form = this.querySelector('form');
        this.elements.input.value = event.currentTarget.dataset.value;
        if (form) form.submit();
      }

      openSelector() {
        this.elements.button.focus();
        this.elements.panel.toggleAttribute('hidden');
        this.elements.button.setAttribute(
          'aria-expanded',
          (this.elements.button.getAttribute('aria-expanded') === 'false').toString()
        );
      }

      closeSelector(event) {
        const isChild =
          this.elements.panel.contains(event.relatedTarget) || this.elements.button.contains(event.relatedTarget);
        if (!event.relatedTarget || !isChild) {
          this.hidePanel();
        }
      }
    }
  );
}

class CountDownTimer extends HTMLElement {
  constructor() {
    super();
    this.min = this.querySelector('.min')
    this.sec = this.querySelector('.sec')
    this.countDown = this.querySelector('.countdown')
    this.finishCountDown = this.querySelector('.finish-countdown')

    this.times = parseInt(this.dataset.times) * 60
    this.interval = null
  }

  connectedCallback() {
    this.startCountDown()
  }

  startCountDown() {
    this.updateDisplay()

    this.interval = setInterval(() => {
      if (this.times > 0) {
        this.times--
        this.updateDisplay()
      } else {
        clearInterval(this.interval)
        this.countDown.classList.add('!hidden')
        this.finishCountDown.classList.remove('hidden')
      }
    }, 1000)
  }

  updateDisplay() {
    const minutes = Math.floor(this.times / 60)
    const seconds = this.times % 60
    
    if (this.min) this.min.textContent = String(minutes).padStart(2, '0')
    if (this.sec) this.sec.textContent = String(seconds).padStart(2, '0')
  }

  disconnectedCallback() {
    clearInterval(this.interval)
  }
}

if (!customElements.get('count-down-timer')) {
  customElements.define('count-down-timer', CountDownTimer)
}

class KlaviyoSubscribe extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    this.success = this.querySelector('.success');
    this.form.addEventListener('submit', (event) => { this.submit(event); });
  }

  submit(event) {
    event.preventDefault();

    const hiddenForm = document.createElement('form');
    hiddenForm.action = this.dataset.action;
    hiddenForm.method = 'POST';

    const newTab = window.open('', '_blank');

    Array.from(this.form.elements).forEach(element => {
      if (element.name) {
        const inputClone = document.createElement('input');
        inputClone.type = 'hidden';
        inputClone.name = element.name;
        inputClone.value = element.value;
        hiddenForm.appendChild(inputClone);
      }
    });

    newTab.document.body.appendChild(hiddenForm);

    hiddenForm.submit();

    this.form.classList.add('hidden');
    this.success.classList.remove('hidden');
    
    setTimeout(() => {
      newTab.close();
    }, 500)
  }
}

if (!customElements.get('klaviyo-subscribe')) {
  customElements.define('klaviyo-subscribe', KlaviyoSubscribe);
}

class ToggleShippingProtection extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input')
    this.cart = document.querySelector('cart-items')
    this.input.addEventListener('input', () => {
      this.eventChange()
    })
  }

  eventChange() {
    if(this.input.checked) {
      this.addItemToCart()
    } else {
      this.cart.updateQuantity(document.querySelector('#cart-count').dataset.protectIndex, 0);
    }
  }

  removeItem() {
    this.cart.updateQuantity(document.querySelector('#cart-count').dataset.protectIndex, 0);
  }

  async addItemToCart() {
    const config = this.fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];
    const formData = new FormData();
    formData.append('sections', this.cart.getSectionsToRender().map((section) => section.id));
    formData.append('id', this.input.value);
    formData.append('quantity', 1)
    config.body = formData;
    await fetch(`${routes.cart_add_url}`, config)
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        this.cart.renderContents(response)
      })
      .catch((e) => {
        console.error(e);
      })
  }

  fetchConfig(type = 'json') {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
    };
  }
}

if (!customElements.get('toggle-shipping-protection')) {
  customElements.define('toggle-shipping-protection', ToggleShippingProtection);
}

class ToggleRushProduction extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input')
    this.cart = document.querySelector('cart-items')
    this.input.addEventListener('input', () => {
      this.eventChange()
    })
  }

  eventChange() {
    if(this.input.checked) {
      this.addItemToCart()
    } else {
      this.cart.updateQuantity(document.querySelector('#cart-count').dataset.rushIndex, 0);
    }
  }

  removeItem() {
    this.cart.updateQuantity(document.querySelector('#cart-count').dataset.rushIndex, 0);
  }

  async addItemToCart() {
    const config = this.fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];
    const formData = new FormData();
    formData.append('sections', this.cart.getSectionsToRender().map((section) => section.id));
    formData.append('id', this.input.value);
    formData.append('quantity', 1)
    config.body = formData;
    await fetch(`${routes.cart_add_url}`, config)
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        this.cart.renderContents(response)
      })
      .catch((e) => {
        console.error(e);
      })
  }

  fetchConfig(type = 'json') {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
    };
  }
}

if (!customElements.get('toggle-rush-production')) {
  customElements.define('toggle-rush-production', ToggleRushProduction);
}