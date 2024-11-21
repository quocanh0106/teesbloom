import './template-article.scss';

let observe = new IntersectionObserver(function(entries) {
  if (entries[0].isIntersecting === true) {
    addGreyToAllHeading();
    document.querySelector(`a[href="#${entries[0].target.id}"`).classList.remove('!text-primary');
  }
},
{threshold: 0});

document.querySelectorAll('.article-template__content h2, .article-template__content h3').forEach((heading) => {
  observe.observe(heading);
})

function addGreyToAllHeading() {
  document.querySelectorAll('.toc ul a').forEach((heading) => {
    heading.classList.add('!text-primary');
  })
}