import { createContext, useContext } from "react";

export const LabLocale = createContext("ar");
export function useLabText() {
  const locale = useContext(LabLocale);
  return (ar, en) => (locale === "ar" ? ar : en);
}

// Keep technical runs in reading order inside Arabic paragraphs.
export function LabParagraph({ children, ...props }) {
  const locale = useContext(LabLocale);
  const content =
    locale !== "ar" || typeof children !== "string"
      ? children
      : children
          .split(
            /((?:[A-Za-z][A-Za-z0-9/]*|[−-]?\d+(?:\.\d+)?)(?:\s*(?:[A-Za-z][A-Za-z0-9/²·]*|\d+(?:\.\d+)?|°C|%))*)/g,
          )
          .map((part, index) =>
            index % 2 ? (
              <bdi dir="ltr" key={index}>
                {part}
              </bdi>
            ) : (
              part
            ),
          );
  return <p {...props}>{content}</p>;
}
