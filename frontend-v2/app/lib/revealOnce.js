/** Content stays visible without JS, IntersectionObserver, or animation support. */
export function revealOnce(element, environment = window) {
  if (!element || !environment.IntersectionObserver || environment.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return () => {};
  const observer = new environment.IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      element.classList.add("is-revealed");
      observer.disconnect();
    }
  }, { threshold: 0.2 });
  observer.observe(element);
  return () => observer.disconnect();
}
