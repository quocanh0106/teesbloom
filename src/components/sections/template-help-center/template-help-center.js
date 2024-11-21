import './template-help-center.scss';

class NewTabsComponent extends HTMLElement {
  constructor() {
    super();
    this.tabs = this.querySelectorAll('.tab-heading');
    this.param = new URLSearchParams(window.location.search);

    this.tabs.forEach(tab => {
      if(this.param.get('section')) {
        if(this.param.get('section').includes(tab.dataset.url)) {
          this.handleTabClick(tab);
        }
      }
      tab.addEventListener('click', (event) => {
        event.preventDefault();
        this.handleTabClick(tab);
      });
    });
    this.summaries = this.querySelectorAll('summary');
    if(this.summaries.length) {
      this.summaries.forEach((summary) => {
        summary.addEventListener('click', () => {
          this.querySelectorAll('.tab-detail:not(.hidden) details[open]').forEach((details) => {
            if (!details.contains(summary)) {
              details.removeAttribute('open')
            }
          })
        })
      })
    }


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


    if (this.querySelector(`.tab-link[data-id='${tabId}']`)) {
      this.querySelector(`.tab-link[data-id='${tabId}']`).classList.add('hidden');
    }
  }

  showTab(tabId) {
    this.querySelector(`.tab-detail[data-id='${tabId}']`).classList.remove('hidden');

    if(this.classList.contains('product-infortab')) {
      let newHieght = this.querySelector(`.tab-detail[data-id='${tabId}']`).scrollHeight + this.querySelector('.tab-headings').scrollHeight  + 10;
      let oldtabHieght = this.scrollHeight - this.querySelector('.tab-headings').scrollHeight  + 10;

      if(!this.querySelector(`.tab-detail[data-id='${tabId}']`).classList.contains('review')) {
        animateMaxHeight(this.querySelector(`.tab-detail[data-id='${tabId}']`), oldtabHieght, this.querySelector(`.tab-detail[data-id='${tabId}']`).scrollHeight, 500);
        animateMaxHeight(this, this.scrollHeight, newHieght, 500);
      } else {
        this.querySelector(`.tab-detail[data-id='${tabId}']`).style.height = '100%';
        this.style.height = '100%';
      }

    }
    if (this.querySelector(`.tab-link[data-id='${tabId}']`)) {
      this.querySelector(`.tab-link[data-id='${tabId}']`).classList.remove(
        'hidden',
      );
    }
  }
}

if (!customElements.get('new-tabs-component')) {
  customElements.define('new-tabs-component', NewTabsComponent);
}