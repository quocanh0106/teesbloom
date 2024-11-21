class MenuHoverEffect extends HTMLElement {
  constructor() {
    super();
    this.menu = this?.querySelectorAll('.menu-effect');
    if (this.querySelectorAll('.parent-menu-effect').length) {
      this.menu = this.querySelectorAll('.parent-menu-effect');
    }
    this.menu.forEach(menuchild => {
      menuchild?.addEventListener('mouseover', () => {
        this.menu.forEach(item => {
          item.classList.add('opacity-40');
        });
      });

      menuchild?.addEventListener('mouseout', () => {
        this.menu.forEach(item => {
          item.classList.remove('opacity-40');
        });
      });
    });
  }
}

customElements.define('menu-hover-effect', MenuHoverEffect);

class RecentSearch extends HTMLElement {
  constructor() {
    super();
    this.dom = this.querySelector('.recent-list');
    this.list = JSON.parse(localStorage.getItem('recentSearch')) || [];
    if(this.list.length > 0) {
      this.list.forEach((item) => {
        this.dom.innerHTML += `
          <span class="flex w-full items-center gap-1.5 recent-search">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" class="w-3.5 h-3.5" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.69531 2.02344C1.93694 2.02344 2.13281 2.21931 2.13281 2.46094V4.14464H3.81653C4.05816 4.14464 4.25403 4.34052 4.25403 4.58214C4.25403 4.82377 4.05816 5.01964 3.81653 5.01964H1.69531C1.45369 5.01964 1.25781 4.82377 1.25781 4.58214V2.46094C1.25781 2.21931 1.45369 2.02344 1.69531 2.02344Z" fill="currentColor"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.56611 4.36107C2.64978 2.48817 4.67601 1.22656 6.9974 1.22656C10.4607 1.22656 13.2682 4.03411 13.2682 7.4974C13.2682 10.9607 10.4607 13.7682 6.9974 13.7682C3.53411 13.7682 0.726562 10.9607 0.726562 7.4974C0.726562 7.25577 0.922438 7.0599 1.16406 7.0599C1.40569 7.0599 1.60156 7.25577 1.60156 7.4974C1.60156 10.4774 4.01736 12.8932 6.9974 12.8932C9.97743 12.8932 12.3932 10.4774 12.3932 7.4974C12.3932 4.51736 9.97743 2.10156 6.9974 2.10156C5.00095 2.10156 3.25715 3.1856 2.32347 4.79928C2.20246 5.00842 1.93482 5.07986 1.72568 4.95885C1.51654 4.83785 1.4451 4.57021 1.56611 4.36107Z" fill="currentColor"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.00039 3.5625C7.24202 3.56252 7.43787 3.75842 7.43785 4.00004L7.43752 7.32137L9.78252 9.66637C9.95337 9.83722 9.95337 10.1142 9.78252 10.2851C9.61166 10.4559 9.33465 10.4559 9.1638 10.2851L6.69064 7.81193C6.60858 7.72987 6.56249 7.61857 6.5625 7.50252L6.56285 3.99996C6.56287 3.75833 6.75877 3.56248 7.00039 3.5625Z" fill="currentColor"/>
            </svg>
            <a href="/search?q=${encodeURIComponent(item)}" class="truncate-line one-line overflow-hidden break-words cursor-pointer text-sm font-normal font-heading leading-2">${item}</a>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" class="w-4 h-4 ml-auto text-primary hover:text-primary cursor-pointer transition-all remove" data-recent-search="${item}" viewBox="0 0 16 17" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M4.31246 4.81319C4.50772 4.61793 4.82431 4.61793 5.01957 4.81319L11.6862 11.4799C11.8815 11.6751 11.8815 11.9917 11.6862 12.187C11.491 12.3822 11.1744 12.3822 10.9791 12.187L4.31246 5.5203C4.1172 5.32504 4.1172 5.00846 4.31246 4.81319Z" fill="currentColor"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6862 4.81319C11.8815 5.00846 11.8815 5.32504 11.6862 5.5203L5.01957 12.187C4.82431 12.3822 4.50772 12.3822 4.31246 12.187C4.1172 11.9917 4.1172 11.6751 4.31246 11.4799L10.9791 4.81319C11.1744 4.61793 11.491 4.61793 11.6862 4.81319Z" fill="currentColor"/>
            </svg>
          </span>`
      })
    } else {
      this.classList.add('hidden');
    }
    this.querySelectorAll('.remove').forEach((remove) => {
      remove.addEventListener('click', (event) => {
        event.target.closest('.recent-search').classList.add('!hidden');
        this.removeItem(event.target.dataset.recentSearch);
      })
    });
  }

  removeItem(item) {
    this.list.splice(this.list.indexOf(item), 1);
    localStorage.setItem('recentSearch', JSON.stringify(this.list));
    if(JSON.parse(localStorage.getItem('recentSearch')).length == 0) {
      this.classList.add('hidden')
    }
  }
}

customElements.define('recent-search', RecentSearch);

class MenuDrawer extends HTMLElement {
  constructor() {
    super();
    this.menu = this.querySelector('.megamenu');
    this.summaries = this.querySelectorAll('.summary-head');
    this.back = this.querySelectorAll('.back');
    this.close = this.querySelector('.close-menu');
    this.addEventListener('click', event => {
      if (event.target.nodeName === 'MENU-DRAWER') this.hide();
    });
    this.close?.addEventListener('click', this.hide.bind(this));
    this.summaries.forEach(summary => {
      if(summary.nextElementSibling) {
        summary.addEventListener('click', () => {
          summary.nextElementSibling.classList.add('!visible', '!opacity-100');
          summary.nextElementSibling.classList.remove('-translate-x-full');
        });
      }
    });
    this.back.forEach(prev => {
      if(prev.closest('.details-head')) {
        prev.addEventListener('click', () => {
          prev.closest('.details-head').classList.remove('!visible', '!opacity-100');
          prev.closest('.details-head').classList.add('-translate-x-full');
        });
      }
    });
  }
  
  open() {
    this.classList.remove('invisible');
    this.menu.classList.add('translate-x-0');
    document.body.classList.add('overflow-hidden');
  }

  hide() {
    this.classList.add('invisible');
    this.menu.classList.remove('translate-x-0');
    document.body.classList.remove('overflow-hidden');
  }
}

customElements.define('menu-drawer', MenuDrawer);

let lastScrollTop = 0;
let headerHeight = document.querySelector('#shopify-section-announcement-bar').scrollHeight;
document.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > headerHeight && scrollTop > lastScrollTop) {
    document.body.classList.remove('sticky-header');
    document.body.classList.remove('header-on-top');
  } else if(scrollTop > headerHeight && scrollTop < lastScrollTop) {
    document.body.classList.add('sticky-header');
    document.body.classList.remove('header-on-top');
  } else if(scrollTop <= headerHeight ) {
    document.body.classList.remove('sticky-header');
    document.body.classList.add('header-on-top');
  }
  lastScrollTop = scrollTop;
}, {passive: true});

