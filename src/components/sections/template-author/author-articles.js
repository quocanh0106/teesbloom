class PaginationCustom extends HTMLElement {
  constructor() {
    super(); 
    this.itemPerPage = parseInt(this.dataset.limit);
    this.countItem = parseInt(this.dataset.length);
    this.maxPage = Math.ceil(this.countItem / this.itemPerPage);
    this.button = this.querySelector('.loadmore');
    this.items = this.querySelectorAll('.item');
    this.button.addEventListener('click', this.loadMore.bind(this));
  }

  loadMore() {
    this.currentPage = parseInt(this.dataset.currentPage);
    this.nextPage = this.currentPage + 1;

    for(let i = (this.currentPage*this.itemPerPage); i < (this.nextPage*this.itemPerPage); i ++) {
      if(this.items[i]) {
        this.items[i].classList.remove('hidden');
      } else {
        this.button.classList.add('!hidden');
        break;
      }
    }
    this.dataset.currentPage = this.nextPage;
  }
}
if (!customElements.get('pagination-custom')) {
  customElements.define('pagination-custom', PaginationCustom);
}