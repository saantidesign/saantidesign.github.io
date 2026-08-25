// Highlights the current section in the top nav as the user scrolls.
const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-item');

const setActive = (id) => {
  navItems.forEach((item) => {
    const isActive = item.getAttribute('href') === `#${id}`;
    item.style.borderBottomColor = isActive ? 'var(--ink)' : 'transparent';
  });
};

if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}
