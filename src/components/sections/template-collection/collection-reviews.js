import './collection-reviews.scss';

class CollectionReviews extends HTMLElement {
  constructor() {
    super();
    this.data = this.getData();
    this.wrapper = this.querySelector('.collection-reviews-wrapper');
    this.limit = parseInt(this.dataset.limit);
    this.button = this.querySelector('.loadmore');
    this.sort = document.querySelector('.reviews-sort');

    this.sort.querySelectorAll('li').forEach((item) => {
      item.addEventListener('click', () => {
        this.sortBy(item)
      })
    })
    if(this.button) this.button.addEventListener('click', this.loadMore.bind(this))
  }

  loadMore() {
    this.dom = '';
    this.currentPage = parseInt(this.dataset.currentPage);
    this.newPage = this.currentPage + 1;
    document.querySelector('.js-current-reviews').textContent = parseInt(document.querySelector('.js-current-reviews').textContent) + this.limit;
    for (var index = this.limit * this.currentPage; index < this.limit * this.newPage; index++) {
      if (index >= this.data.length) {
        this.button.classList.add('!hidden');
        document.querySelector('.js-current-reviews').textContent = this.data.length;
        break;// Đảm bảo không truy cập phần tử vượt quá độ dài của mảng
      }
      this.dom += this.reviewCard(this.data[index]);
    }
    this.wrapper.innerHTML += this.dom;
    this.dataset.currentPage = this.newPage;
  }

  reLoadSort() {
    document.querySelector('.js-current-reviews').textContent = this.limit < this.data.length ? this.limit : this.data.length;
    this.dom = '';
    for (var index = 0; index < this.limit ; index++) {
      if (index >= this.data.length) {
        this.button.classList.add('!hidden');
        document.querySelector('.js-current-reviews').textContent = this.data.length;
        break;// Đảm bảo không truy cập phần tử vượt quá độ dài của mảng
      }
      this.dom += this.reviewCard(this.data[index]);
    }
    this.wrapper.innerHTML = this.dom;
    this.dataset.currentPage = 1
  }

  sortBy(item) {

    this.sort.querySelector('li.active').classList.remove('active');
    item.classList.add('active');
    this.sort.querySelector('.summary').querySelector('span').textContent = item.textContent;
    this.sort.querySelector('.summary').querySelector('span').dataset.value = item.dataset.value;
    this.sort.querySelector('.details').style.maxHeight = 0;
    this.sort.classList.remove('active');

    this.data = this.getData();
    if(item.dataset.value == 'news') {
      this.data = this.data.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    else if(item.dataset.value == 'pictures-first') {
      this.data = this.data.sort((a, b) => {
        if (a.reviewPics.length > 0 && b.reviewPics.length === 0) {
          return -1;
        } else if (a.reviewPics.length === 0 && b.reviewPics.length > 0) {
          return 1;
        } else {
          return new Date(b.date) - new Date(a.date);
        }
      });
    }

    this.reLoadSort();
  }

  reviewCard(review) {

    let imgs = '';
    let index = 1;
    for (const pic of review.reviewPics) {
      imgs += `
       <modal-opener class="relative cursor-pointer" data-id="#preview-image-${review.author.replaceAll(' ','')}-${index}"> 
        <img src="${pic}" class="h-13.5 w-auto lg:h-25 rounded" width="1024" height="1024" loading="lazy">
       </modal-opener> 
       <modal-dialog class="hidden fixed w-full h-full bg-black bg-opacity-20 top-0 left-0 z-20" id="preview-image-${review.author.replaceAll(' ','')}-${index}"> 
        <div class="text-center p-4 lg:p-12 rounded-xl shadow-popup max-w-[calc(100vw_-_32px)] max-h-[calc(100vh_-_32px)] w-[860px] overflow-auto bg-background absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2"> 
          <img src="${pic}" class="h-full w-full block object-cover leading-none !max-w-full !max-h-full" width="1024" height="1024" loading="lazy"> 
          <span class="text-primary shadow-megamenu cursor-pointer bg-background w-10 h-10 flex items-center justify-center rounded-full absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full lg:top-7 lg:right-7 lg:left-auto lg:translate-y-0 lg:translate-x-0 close"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="w-6 h-6" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M6.46967 6.46967C6.76256 6.17678 7.23744 6.17678 7.53033 6.46967L17.5303 16.4697C17.8232 16.7626 17.8232 17.2374 17.5303 17.5303C17.2374 17.8232 16.7626 17.8232 16.4697 17.5303L6.46967 7.53033C6.17678 7.23744 6.17678 6.76256 6.46967 6.46967Z" fill="currentColor"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5303 6.46967C17.8232 6.76256 17.8232 7.23744 17.5303 7.53033L7.53033 17.5303C7.23744 17.8232 6.76256 17.8232 6.46967 17.5303C6.17678 17.2374 6.17678 16.7626 6.46967 16.4697L16.4697 6.46967C16.7626 6.17678 17.2374 6.17678 17.5303 6.46967Z" fill="currentColor"/>
            </svg>
          </span> 
        </div> 
       </modal-dialog>`;
       index++
    }

    let rate = this.renderStars(review.rate)

    return `
    <div class="py-5 last:border-b border-t border-primary flex flex-wrap gap-2.5 lg:gap-4">
      <div class="flex items-center gap-1.5 w-full lg:max-w-[207px] h-fit">
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" class="w-4 h-4 text-secondary flex-none" viewBox="0 0 17 17" fill="none">
          <path d="M13.9547 3.29023C13.0608 3.19549 12.181 2.99658 11.3333 2.69757C10.5557 2.4228 9.80968 2.06566 9.108 1.63223C8.92498 1.52022 8.71458 1.46094 8.5 1.46094C8.28542 1.46094 8.07502 1.52022 7.892 1.63223C7.19033 2.06567 6.4443 2.42281 5.66667 2.69757C4.81897 2.99658 3.93922 3.19549 3.04533 3.29023C2.7586 3.31977 2.49301 3.45458 2.29992 3.66861C2.10683 3.88263 1.99997 4.16065 2 4.4489V7.9129C2.00056 9.19089 2.34262 10.4455 2.99079 11.5469C3.63896 12.6484 4.5697 13.5566 5.68667 14.1776L7.93333 15.4256C8.10647 15.5225 8.30158 15.5734 8.5 15.5734C8.69842 15.5734 8.89353 15.5225 9.06667 15.4256L11.3133 14.1776C12.4303 13.5566 13.361 12.6484 14.0092 11.5469C14.6574 10.4455 14.9994 9.19089 15 7.9129V4.4489C15 4.16065 14.8932 3.88263 14.7001 3.66861C14.507 3.45458 14.2414 3.31977 13.9547 3.29023Z" fill="#2F2F2F"/>
          <path d="M8.02886 10.657C7.83292 10.6574 7.64371 10.5855 7.49753 10.455L5.59753 8.7663C5.51572 8.69749 5.44854 8.61298 5.39994 8.51776C5.35134 8.42255 5.32232 8.31856 5.31459 8.21194C5.30686 8.10532 5.32058 7.99823 5.35494 7.897C5.38929 7.79577 5.44358 7.70245 5.51461 7.62256C5.58564 7.54266 5.67195 7.47781 5.76846 7.43184C5.86497 7.38587 5.96972 7.35971 6.07651 7.3549C6.1833 7.35009 6.28998 7.36673 6.39023 7.40384C6.49048 7.44096 6.58228 7.49778 6.6602 7.57097L7.9782 8.74164L10.6115 5.9323C10.7567 5.77768 10.9573 5.68698 11.1693 5.68011C11.3813 5.67323 11.5873 5.75075 11.7422 5.89564C11.8971 6.04075 11.9881 6.24143 11.9951 6.45357C12.0021 6.66572 11.9245 6.87196 11.7795 7.02697L8.61286 10.4043C8.53821 10.4845 8.44781 10.5484 8.34732 10.5919C8.24682 10.6355 8.13841 10.6579 8.02886 10.6576V10.657Z" fill="#FEFEFE"/>
        </svg>
        <span class="text-base font-medium font-heading text-primary capitalize">${review.author}</span>
      </div>
      <div class="lg:max-w-[calc(100%_-_223px)] w-full">
        <div class="flex items-center justify-between gap-1 w-full">
          <div class="flex items-center gap-1">
            ${rate}
          </div>
          <span class="text-sm text-primary">${new Date(review.date).toLocaleDateString('en-GB',{ day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
        <span class="text-base font-normal text-primary font-body mb-1">${review.reviewTitle}</span>
        <div class="text-sm text-primary font-body mb-2.5 lg:mb-3">
          ${review.reviewBody}
        </div>
        <div class="flex flex-wrap gap-2.5 lg:gap-3 mb-2.5 lg:mb-3">
          ${imgs}
        </div>
        <span-link href="${review.productUrl}" class="flex items-center gap-1.5 text-sm font-semibold font-heading text-secondary hover:text-primary">
          <span class="truncate-line oneline overflow-hidden whitespace-nowrap">${review.productTitle}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" class="w-3.5 h-3.5 flex-none" viewBox="0 0 16 17" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.83203 2.5C8.83203 2.22386 9.05589 2 9.33203 2H13.9987C14.2748 2 14.4987 2.22386 14.4987 2.5V7.16667C14.4987 7.44281 14.2748 7.66667 13.9987 7.66667C13.7226 7.66667 13.4987 7.44281 13.4987 7.16667V3H9.33203C9.05589 3 8.83203 2.77614 8.83203 2.5Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3 3C2.72386 3 2.5 3.22386 2.5 3.5V13.5C2.5 13.7762 2.72385 14 3 14H13C13.2762 14 13.5 13.7762 13.5 13.5V10.3246C13.5 10.0484 13.7239 9.82457 14 9.82457C14.2761 9.82457 14.5 10.0484 14.5 10.3246V13.5C14.5 14.3284 13.8284 15 13 15H3C2.17158 15 1.5 14.3284 1.5 13.5V3.5C1.5 2.67157 2.17157 2 3 2H6C6.27614 2 6.5 2.22386 6.5 2.5C6.5 2.77614 6.27614 3 6 3H3Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0551 2.44723C14.2504 2.64249 14.2504 2.95907 14.0551 3.15433L8.95512 8.25434C8.75985 8.4496 8.44327 8.4496 8.24801 8.25434C8.05275 8.05908 8.05275 7.74249 8.24801 7.54723L13.348 2.44723C13.5433 2.25197 13.8599 2.25197 14.0551 2.44723Z" fill="currentColor"/>
          </svg>
        </span-link>
      </div>
    </div>
  `;
  }
  renderStars(rate) {
    let html = '';
    const starCount = parseInt(rate) || 0;
    const emptyStarCount = 5 - starCount;
    for (let i = 0; i < starCount; i++) {
      html += `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" class="w-3 h-3" viewBox="0 0 12 13" fill="none">
                <path d="M11.2184 5.64822L8.88256 7.92522L9.43418 11.1412C9.446 11.2102 9.43829 11.2811 9.41192 11.3459C9.38555 11.4107 9.34157 11.4668 9.28496 11.508C9.22835 11.5491 9.16137 11.5735 9.09158 11.5786C9.02179 11.5836 8.95199 11.569 8.89006 11.5365L6.00181 10.0181L3.11393 11.5361C3.052 11.5687 2.9822 11.5832 2.91241 11.5782C2.84263 11.5732 2.77564 11.5487 2.71903 11.5076C2.66242 11.4665 2.61845 11.4103 2.59208 11.3455C2.56571 11.2807 2.55799 11.2098 2.56981 11.1408L3.12144 7.92484L0.785185 5.64822C0.735039 5.59936 0.699572 5.53744 0.682798 5.46947C0.666023 5.4015 0.668612 5.33019 0.690271 5.26361C0.71193 5.19704 0.751794 5.13785 0.80535 5.09276C0.858907 5.04767 0.924017 5.01847 0.99331 5.00847L4.22168 4.53972L5.66543 1.61397C5.79181 1.35784 6.21181 1.35784 6.33818 1.61397L7.78193 4.53972L11.0103 5.00847C11.0794 5.01873 11.1443 5.04807 11.1977 5.0932C11.2511 5.13832 11.2908 5.19744 11.3125 5.2639C11.3341 5.33037 11.3367 5.40155 11.3201 5.46944C11.3035 5.53733 11.2683 5.59924 11.2184 5.64822Z" fill="currentColor"/>
              </svg>`;
    }
    for (let i = 0; i < emptyStarCount; i++) {
      html += `<svg width="12" height="12" class="w-3 h-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_14368_81989)">
                  <path d="M8.61885 7.15865L8.47767 7.29626L8.511 7.49057L9.06262 10.7065L6.17435 9.18812L5.99987 9.09639L5.82538 9.18811L2.9375 10.7061L2.93747 10.7061L3.48908 7.49019L3.52242 7.29585L3.3812 7.15823L1.04495 4.8816L1.04492 4.88158L1.04524 4.88153L4.27362 4.41278L4.46876 4.38445L4.55602 4.20762L5.99108 1.29947C5.99369 1.29907 5.99665 1.29883 5.99986 1.29883C6.00306 1.29883 6.00602 1.29907 6.00863 1.29947L7.4437 4.20762L7.53096 4.38445L7.7261 4.41278L10.9533 4.88136L10.9537 4.88153L10.9539 4.88187L10.9539 4.88228L10.9537 4.88262L10.9537 4.88263L8.61885 7.15865ZM5.99994 1.28185L5.99995 1.28187L5.99994 1.28185Z" stroke="currentColor" stroke-width="0.75"/>
                </g>
                <defs>
                  <clipPath id="clip0_14368_81989">
                    <rect width="12" height="12" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              `;
    }
    return html;
  }
  getData() {
    return JSON.parse(this.querySelector('[type="application/json"]').textContent);
  }
}

customElements.define('collection-reviews', CollectionReviews);