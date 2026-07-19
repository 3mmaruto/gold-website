import { useEffect } from "react";
import { useLocation } from "react-router";

export default function MotionController() {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = [...document.querySelectorAll("[data-reveal]")];

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.setAttribute("data-visible", "true"));
      return undefined;
    }

    root.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
