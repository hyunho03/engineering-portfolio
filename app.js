const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const tabs = [...document.querySelectorAll('[data-panel]')];
const panels = [...document.querySelectorAll('.architecture-panels article')];
document.querySelector('.architecture-tabs').hidden = false;
function selectPanel(button) {
  for (const item of tabs) item.setAttribute('aria-pressed', String(item === button));
  for (const panel of panels) panel.hidden = panel.id !== `panel-${button.dataset.panel}`;
}
tabs.forEach(button => button.addEventListener('click', () => selectPanel(button)));
selectPanel(tabs[0]);

const gallery = document.querySelector('#gallery');
const previous = document.querySelector('#gallery-prev');
const next = document.querySelector('#gallery-next');
document.querySelector('.gallery-controls').hidden = false;
function updateGallery() {
  previous.disabled = gallery.scrollLeft <= 2;
  next.disabled = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 2;
}
function moveGallery(direction) {
  const distance = gallery.querySelector('figure').getBoundingClientRect().width + parseFloat(getComputedStyle(gallery).gap);
  gallery.scrollBy({left: direction * distance, behavior: motionOK ? 'smooth' : 'instant'});
}
previous.addEventListener('click', () => moveGallery(-1));
next.addEventListener('click', () => moveGallery(1));
gallery.addEventListener('scroll', updateGallery, {passive: true});
window.addEventListener('resize', updateGallery);
updateGallery();

// Content is visible before JavaScript runs and when reduced motion is requested.
if (motionOK && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('reveal-running');
      observer.unobserve(entry.target);
    }
  }, {threshold: 0.08});
  document.querySelectorAll('h1,h2,h3,.hero-bottom>*,.project-intro>*,.gallery figure,.contributions article>div,.flow,.about-columns p,.result-columns>div,.footer-github').forEach((element,index) => {
    element.style.animationDelay = `${(index % 3) * 70}ms`;
    observer.observe(element);
  });
}
