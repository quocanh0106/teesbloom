import './facet.scss';

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);

    this.facetForm = this.querySelector('form');
    this.main();

  }

  main() {
    this.querySelector('.submit-button')?.addEventListener('click', (event) => {
      this.onSubmitHandler(event)
      this.querySelector('toggle-filter').toggle()
    })
    
    if (this.classList.contains('sort-by')) {
      this.accordion = this.querySelector('accordion-toggle')
      this.summary = this.accordion.querySelector('.summary');
      this.details = this.accordion.querySelector('.details');
      this.select = this.querySelector('#SortBy');

      this.accordion.querySelectorAll('li').forEach((item) => {
        item.addEventListener('click', (e) => {
          this.accordion.querySelector('li.active').classList.remove('active');
          item.classList.add('active');
          this.select.value = item.dataset.value;
          this.select.querySelectorAll('option').forEach((option) => {
            option.removeAttribute('selected');
            if (option.value == item.dataset.value) {
              option.setAttribute('selected', 'selected');
            }
          })
          this.summary.querySelector('span').textContent = item.textContent;
          this.summary.querySelector('span').dataset.value = item.dataset.value;
          this.onSubmitHandler(e);
          this.details.style.maxHeight = 0;
          this.accordion.classList.remove('active');
          window.scrollTo(0, 0);
        })
      })
    }
  }

  static setListeners() {
    const onHistoryChange = (event) => {
      const searchParams = event.state ? event.state.searchParams : FacetFiltersForm.searchParamsInitial;
      if (searchParams === FacetFiltersForm.searchParamsPrev) return;
      FacetFiltersForm.renderPage(searchParams, null, false);
    };
    window.addEventListener('popstate', onHistoryChange);
  }

  static toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable);
    });
  }

  static renderPage(searchParams, event, updateURLHash = true, loadmore = false) {
    FacetFiltersForm.searchParamsPrev = searchParams;
    const sections = FacetFiltersForm.getSections();

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = (element) => element.url === url;

      FacetFiltersForm.filterData.some(filterDataUrl)
        ? FacetFiltersForm.renderSectionFromCache(filterDataUrl, event, loadmore)
        : FacetFiltersForm.renderSectionFromFetch(url, event, loadmore);
    });
    if (document.querySelector('collection-loadmore') && loadmore == false) {
      let nexttPage = parseInt(document.querySelector('#product-grid').dataset.currentPage) + 1;
      document.querySelector('collection-loadmore').updateCurrentPageToFirst(nexttPage);
    }

    if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
  }

  static renderSectionFromFetch(url, event, loadmore) {
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText;
        FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
        FacetFiltersForm.renderFilters(html, event);
        FacetFiltersForm.renderProductGridContainer(html, loadmore);
        FacetFiltersForm.renderProductCount(html);
        if (typeof initializeScrollAnimationTrigger === 'function') initializeScrollAnimationTrigger(html.innerHTML);
      }).finally(() => {
      });
  }

  static renderSectionFromCache(filterDataUrl, event, loadmore) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
    FacetFiltersForm.renderFilters(html, event);
    FacetFiltersForm.renderProductGridContainer(html, loadmore);
    FacetFiltersForm.renderProductCount(html);
    if (typeof initializeScrollAnimationTrigger === 'function') initializeScrollAnimationTrigger(html.innerHTML);
  }

  static renderProductGridContainer(html, type) {
    type ?
      ((document.getElementById('main-collection-product').innerHTML += new DOMParser()
        .parseFromString(html, 'text/html')
        .getElementById('main-collection-product').innerHTML)) :
      ((document.getElementById('main-collection-product').innerHTML = new DOMParser()
        .parseFromString(html, 'text/html')
        .getElementById('main-collection-product').innerHTML))
  }

  static renderProductCount(html) {
    const counthead = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductCount').innerHTML;

    const containerCount = document.getElementById('ProductCount');

    if (containerCount) {
      containerCount.innerHTML = counthead;
    }
  }

  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
    const facetDetailsElements = parsedHTML.querySelectorAll(
      '#FacetFiltersForm .js-filter'
    );
    const matchesIndex = (element) => {
      const jsFilter = event ? event.target.closest('.js-filter') : undefined;
      return jsFilter ? element.dataset.index === jsFilter.dataset.index : false;
    };
    const facetsToRender = Array.from(facetDetailsElements).filter((element) => !matchesIndex(element));
    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

    facetsToRender.forEach((element) => {
      document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
    });

    FacetFiltersForm.renderActiveFacets(parsedHTML);

    if (countsToRender) FacetFiltersForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
  }

  static renderActiveFacets() {
    FacetFiltersForm.toggleActiveFacets(false);
  }

  static renderCounts(source, target) {
    const targetElement = target.querySelector('.facets__selected');
    const sourceElement = source.querySelector('.facets__selected');

    const targetElementAccessibility = target.querySelector('.facets__summary');
    const sourceElementAccessibility = source.querySelector('.facets__summary');

    if (sourceElement && targetElement) {
      target.querySelector('.facets__selected').outerHTML = source.querySelector('.facets__selected').outerHTML;
    }

    if (targetElementAccessibility && sourceElementAccessibility) {
      target.querySelector('.facets__summary').outerHTML = source.querySelector('.facets__summary').outerHTML;
    }
  }

  static updateURLHash(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  }

  static getSections() {
    return [
      {
        section: document.getElementById('ProductGridContainer').dataset.id,
      },
    ];
  }

  createSearchParams(form) {
    const formData = new FormData(form);
    return new URLSearchParams(formData).toString();
  }

  onSubmitForm(searchParams, event) {
    FacetFiltersForm.renderPage(searchParams, event);
  }

  onSubmitHandler(event) {
    event.preventDefault();
    const sortFilterForms = document.querySelectorAll('facet-filters-form form');
    const forms = [];
    sortFilterForms.forEach((form) => {
      if (form.id === 'FacetSortForm' || form.id === 'FacetFiltersForm') {
        forms.push(this.createSearchParams(form));
      }
    });
    this.onSubmitForm(forms.join('&'), event);
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    FacetFiltersForm.toggleActiveFacets();
    const url = event.currentTarget.href.indexOf('?') == -1 ? '' : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
    FacetFiltersForm.renderPage(url);
  }
}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('facet-filters-form', FacetFiltersForm);
FacetFiltersForm.setListeners();

class PriceRange extends HTMLElement {
  constructor() {
    super();
    this.inputValues = this.querySelectorAll('.range-values input')
    this.rangeInputs = this.querySelectorAll('.range-slider input')
    this.rangeInputs.forEach((input) => {
      if (input.type === 'range') {
        input.addEventListener('input', this.getVals.bind(this))
      }
    })

    this.inputValues.forEach((input) => {
      input.addEventListener('input', this.getRangeVals.bind(this))
    })
  }

  getVals() {
    var slide1 = parseFloat(this.rangeInputs[0].value)
    var slide2 = parseFloat(this.rangeInputs[1].value)

    if (slide1 > slide2) { 
      var tmp = slide2
      slide2 = slide1
      slide1 = tmp
    }

    this.inputValues[0].value = parseFloat(slide1)
    this.inputValues[1].value = parseFloat(slide2)
  }

  getRangeVals() {
    var slide1 = parseFloat(this.inputValues[0].value)
    var slide2 = parseFloat(this.inputValues[1].value)
    
    this.rangeInputs[0].value = parseFloat(slide1)
    this.rangeInputs[1].value = parseFloat(slide2)
  }
}

customElements.define('price-range', PriceRange)

class FacetRemove extends HTMLElement {
  constructor() {
    super();
    const facetLink = this.querySelector('a');
    facetLink.setAttribute('role', 'button');
    facetLink.addEventListener('click', this.closeFilter.bind(this));
    facetLink.addEventListener('keyup', (event) => {
      event.preventDefault();
      if (event.code.toUpperCase() === 'SPACE') this.closeFilter(event);
    });
  }

  closeFilter(event) {
    event.preventDefault();
    const form = this.closest('facet-filters-form') || document.querySelector('facet-filters-form');
    form.onActiveFilterClick(event);
  }
}

customElements.define('facet-remove', FacetRemove);

class Loadmore extends HTMLElement {
  constructor() {
    super();
    this.currentPage = document.querySelector('#product-grid').dataset.currentPage;
    this.productPerPage = document.querySelector('#product-grid').dataset.pagination;
    this.collectionGrid = document.querySelector('#main-collection-product');
    this.buttonLoadmore = this.querySelector('.load-more_btn');
    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), { threshold: 0.5 });
    this.observer.observe(this);
  }

  updateCurrentPageToFirst(currentPage) {
    this.querySelector('.load-more_btn').dataset.href = this.buttonLoadmore.dataset.href.replace(`page=${currentPage}`, 'page=2');
    document.querySelector('#product-grid').dataset.currentPage = 1;
  }
  handleIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.handleLoadmore();
      }
    });
  }
  handleLoadmore() {
    this.currentPage = document.querySelector('#product-grid').dataset.currentPage;
    let params = this.getAllUrlParams();
    if (params.page) {
      this.currentPage = params.page;
    }
    this.currentPage++;
    document.querySelector('#product-grid').dataset.currentPage = this.currentPage;
    this.buttonLoadmore.dataset.href = this.buttonLoadmore.dataset.href.replace(`page=${this.currentPage}`, `page=${this.currentPage + 1}`);
    params.page = this.currentPage;

    let searchParams = new URLSearchParams();
    for (let [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        for (let v of value) {
          searchParams.append(key, v);
        }
      } else {
        searchParams.append(key, value);
      }
    }
    let queryString = searchParams.toString();
    FacetFiltersForm.renderPage(queryString, null, false, true);
  }

  getAllUrlParams() {
    let urlSearchParams = new URLSearchParams(window.location.search);
    let params = {};
    for (let [key, value] of urlSearchParams) {
      params[key] ? params[key].push(value) : (params[key] = [value]);
    }
    return params;
  }
}

customElements.define('collection-loadmore', Loadmore);

class ToggleFilter extends HTMLElement {
  constructor() {
    super();
    this.toggleButton = this.querySelector('button');
    this.toggleButton.addEventListener('click', this.toggle.bind(this))
  }
  toggle() {
    document.querySelector('.facet').classList.toggle('active');
    document.querySelector('#product-grid').classList.toggle('active');
    document.body.classList.toggle('overflow-hidden');
  }
}

customElements.define('toggle-filter', ToggleFilter);

window.facetHeight = document.querySelector('#product-grid').offsetTop;

document.addEventListener('scroll', () => {
  const scrollTopFacet = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTopFacet > window.facetHeight) {
    document.body.classList.add('sticky-facet');
  } else {
    document.body.classList.remove('sticky-facet');
  }
}, { passive: true });