const productRecommendationsSection = document.querySelector('.product-recommendations');
const url = productRecommendationsSection.dataset.url;

fetch(url)
  .then(response => response.text())
  .then(text => {
    const html = document.createElement('div');
    html.innerHTML = text;
    const recommendations = html.querySelector('.product-recommendations');
    if (recommendations && recommendations.innerHTML.trim().length) {
      productRecommendationsSection.innerHTML = recommendations.innerHTML;
    }
  })
  .catch(e => {
    console.error(e);
  });

class CustomLoadmore extends HTMLElement {
  constructor() {
    super(); 
    this.button = this.querySelector('.loadmore');
    this.button.addEventListener('click', this.loadMore.bind(this))
  }

  loadMore() {
    this.button.classList.remove('!block');
    this.button.classList.add('!hidden');
    this.querySelectorAll('li').forEach((product) => {
      product.classList.remove('hidden', 'md:hidden', 'lg:hidden');
    })
  }
}
if (!customElements.get('custom-loadmore')) {
  customElements.define('custom-loadmore', CustomLoadmore);
}