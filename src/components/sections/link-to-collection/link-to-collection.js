class LinkToCollection extends HTMLElement {
  constructor() {
    super();
    this.collectionLinks = this.querySelector('.collection-links');
    this.collectionHeading = this.collectionLinks.querySelector('.summary span');
    this.collectionList = this.collectionLinks.querySelectorAll('li');
    
    this.paramLinks = this.querySelector('.param-links');
    this.paramHeading = this.paramLinks.querySelector('.summary span');
    this.paramList = this.paramLinks.querySelectorAll('li');
    
    this.submit = this.querySelector('.submit');
    
    this.collectionList.forEach((collection) => {
      collection.addEventListener('click', () => {
        this.onClickCollection(collection);
      });
    });
    
    this.paramList.forEach((param) => {
      param.addEventListener('click', () => {
        this.onClickParam(param);
      });
    });
  }

  onClickCollection(element) {
    this.submit.href = element.dataset.value;
    this.collectionHeading.dataset.value = element.dataset.value;
    this.collectionList.forEach((item) => {
      item.classList.remove('active');
    });
    element.classList.add('active');
    element.closest('.details').style.maxHeight = '0';
    element.closest('accordion-toggle').classList.remove('active');
    this.collectionHeading.textContent = element.textContent;
    this.paramHeading.textContent = this.paramHeading.dataset.default;
  }

  onClickParam(element) {
    this.submit.href = `${this.collectionHeading.dataset.value}?filter.p.m.custom.occasions=${encodeURI(element.dataset.value)}`;
    this.paramList.forEach((item) => {
      item.classList.remove('active');
    });
    element.classList.add('active');
    element.closest('.details').style.maxHeight = '0';
    element.closest('accordion-toggle').classList.remove('active');
    this.paramHeading.textContent = element.textContent;
  }
}

customElements.define('link-to-collection', LinkToCollection);
