import { FiPause, FiPlay, FiRotateCcw, FiFastForward } from "react-icons/fi";
import { fmt, HOURS } from "./energy-model";
import { useLabText } from "./locale";

export default function SimulationClock(p) {
  const t = useLabText();
  const day = Math.floor(p.hour / 24),
    h = Math.floor(p.hour % 24),
    minute = Math.floor((p.hour % 1) * 60);
  return (
    <section
      className="gl-clockbar"
      aria-label={t("التحكم بالزمن", "Simulation time controls")}
    >
      <div className="gl-clockface" aria-hidden="true">
        <span
          className="gl-clockhand"
          style={{ transform: `rotate(${p.hour * 30}deg)` }}
        />
        <i />
      </div>
      <div className="gl-time-readout">
        <span>{t("زمن التجربة", "Elapsed time")}</span>
        <strong>
          <bdi>{fmt(day)}</bdi> {t("يوم", day === 1 ? "day" : "days")}{" "}
          <bdi className="gl-digital">
            {String(h).padStart(2, "0")}:{String(minute).padStart(2, "0")}
          </bdi>
        </strong>
      </div>
      <div className="gl-timeline">
        <div>
          <span>
            {p.hour >= HOURS
              ? t("اكتملت المقارنة", "Comparison complete")
              : p.running
                ? t("التجربة تعمل", "Simulation running")
                : p.hour > 0
                  ? t("متوقفة مؤقتاً", "Paused")
                  : t("جاهزة للتشغيل", "Ready to start")}
          </span>
          <span>{t("30 يومًا", "30 days")}</span>
        </div>
        <progress
          value={p.hour}
          max={HOURS}
          aria-label={t("تقدم تجربة 30 يوماً", "30-day simulation progress")}
        />
      </div>
      <div className="gl-clockactions">
        <button className="gl-primary-button" onClick={p.onRun}>
          {p.running ? <FiPause aria-hidden /> : <FiPlay aria-hidden />}
          {p.running
            ? t("إيقاف مؤقت", "Pause")
            : p.hour >= HOURS
              ? t("تشغيل من جديد", "Run again")
              : t("ابدأ التجربة", "Start simulation")}
        </button>
        <select
          aria-label={t("سرعة الزمن", "Simulation speed")}
          className="gl-speed-select"
          value={p.speed}
          onChange={(e) => p.onSpeed(Number(e.target.value))}
        >
          {[1, 6, 24, 72].map((n) => (
            <option key={n} value={n}>
              {n} {t("ساعة / ث", "h / s")}
            </option>
          ))}
        </select>
        <button
          onClick={p.onFinish}
          title={t("الانتقال إلى نتيجة اليوم 30", "Jump to the day-30 result")}
        >
          <FiFastForward aria-hidden />
          {t("اليوم 30", "Day 30")}
        </button>
        <button
          onClick={p.onReset}
          aria-label={t("إعادة ضبط الزمن", "Reset the clock")}
        >
          <FiRotateCcw aria-hidden />
        </button>
      </div>
    </section>
  );
}
