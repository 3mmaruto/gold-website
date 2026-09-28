import { useEffect, useRef } from "react";
import ResponsivePicture from "./ResponsivePicture";
import { revealOnce } from "../lib/revealOnce";

// Coordinates follow the physical image, never the reading direction.
const leaders = {
  insulation: [
    { side: "right", point: [620, 226], desktop: "M620 226 L745 95 H815", mobile: "M700 293 L750 460 V665" },
    { side: "left", point: [452, 300], desktop: "M452 300 L290 330 H185", mobile: "M420 417 L250 530 V665" },
  ],
  section: [
    { side: "left", point: [445, 225], desktop: "M445 225 L290 95 H185", mobile: "M408 290 L250 490 V665" },
    { side: "right", point: [540, 298], desktop: "M540 298 L760 330 H815", mobile: "M567 413 L750 580 V665" },
  ],
  service: [
    { side: "left", point: [505, 108], desktop: "M505 108 L300 95 H185", mobile: "M508 97 L250 420 V665" },
    { side: "right", point: [440, 160], desktop: "M440 160 L730 330 H815", mobile: "M400 183 L750 460 V665" },
  ],
};

export default function CylinderAnatomy({ source, content, variant, locale }) {
  const stageRef = useRef(null);
  useEffect(() => revealOnce(stageRef.current), []);

  return (
    <figure className={`cylinder-anatomy cylinder-anatomy--${variant}`}>
      <div className="cylinder-anatomy-stage" ref={stageRef}>
        <ResponsivePicture source={source} alt={content.alt} className="cylinder-anatomy-image" sizes="(max-width: 1000px) 95vw, 60vw" />
        <svg className="cylinder-leaders cylinder-leaders--desktop" viewBox="0 0 1000 500" aria-hidden="true" focusable="false">
          {leaders[variant].map((leader, index) => <g key={leader.side} style={{ "--leader-delay": `${index * 180}ms` }}><path d={leader.desktop} pathLength="1" /><circle cx={leader.point[0]} cy={leader.point[1]} r="4" /></g>)}
        </svg>
        <svg className="cylinder-leaders cylinder-leaders--mobile" viewBox="0 0 1000 667" aria-hidden="true" focusable="false">
          {leaders[variant].map((leader, index) => <g key={leader.side} style={{ "--leader-delay": `${index * 180}ms` }}><path d={leader.mobile} pathLength="1" /><circle cx={(leader.point[0] - 200) / 0.6} cy={(leader.point[1] - 50) / 0.6} r="6" /></g>)}
        </svg>
        <div className="cylinder-anatomy-notes">
          {content.notes.map((note, index) => <div className={`cylinder-callout cylinder-callout--${leaders[variant][index].side}`} key={note.title} dir={locale === "ar" ? "rtl" : "ltr"} style={{ "--leader-delay": `${index * 180 + 350}ms` }}>
            <span className="cylinder-callout-title">{note.title}</span>
            <strong><bdi dir="ltr">{note.value}</bdi>{note.unit && <> <span>{note.unit}</span></>}</strong>
            <p>{note.detail}</p>
          </div>)}
        </div>
      </div>
      <figcaption>{content.caption}</figcaption>
    </figure>
  );
}
