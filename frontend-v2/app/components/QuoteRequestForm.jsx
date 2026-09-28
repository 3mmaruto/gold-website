import { useEffect, useRef, useState } from "react";
import { FiCheckCircle, FiMail, FiPhone, FiSend } from "react-icons/fi";
import { intakeCopy } from "../lib/intake-copy.js";
import { buildIntakePayload, createAttemptTracker, IntakeError, resolveIntakeConfig, sourceMetadata, submitIntake, validateIntake } from "../lib/quote-intake.js";
import { getTurnstileToken } from "../lib/turnstile.js";
import "../styles/quote-intake.css";

const EMPTY = { name: "", phone: "+963", location: "", area_sqm: "", description: "", consent: false };
const BUILD_ENV = import.meta.env;

export default function QuoteRequestForm({ locale, contact, environment = BUILD_ENV, requestToken = getTurnstileToken }) {
  const copy = intakeCopy[locale === "ar" ? "ar" : "en"];
  const labels = contact.form;
  const [config, setConfig] = useState(() => resolveIntakeConfig());
  const [values, setValues] = useState({ ...EMPTY });
  const [plan, setPlan] = useState(null);
  const [pending, setPending] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [offline, setOffline] = useState(false);
  const [ready, setReady] = useState(false);
  const busyRef = useRef(false);
  const attemptRef = useRef(null);
  const metadataRef = useRef({});
  const abortRef = useRef(null);
  const mountedRef = useRef(false);
  const challengeRef = useRef(null);
  const statusRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    setConfig(resolveIntakeConfig(environment, window.location.origin));
    metadataRef.current = sourceMetadata(window.location.href);
    attemptRef.current = createAttemptTracker();
    setReady(true);
    const connection = () => setOffline(navigator.onLine === false);
    connection();
    window.addEventListener("online", connection);
    window.addEventListener("offline", connection);
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
      window.removeEventListener("online", connection);
      window.removeEventListener("offline", connection);
    };
  }, [environment]);

  useEffect(() => {
    if (error || success) statusRef.current?.focus();
  }, [error, success]);

  function edit(name, value) {
    if (busyRef.current) return;
    attemptRef.current?.reset();
    setValues((previous) => ({ ...previous, [name]: value }));
    setError(null);
  }

  function changePlan(file) {
    if (busyRef.current) return;
    attemptRef.current?.reset();
    setPlan(file || null);
    setError(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (busyRef.current || success || !config.enabled) return;
    if (navigator.onLine === false) { setOffline(true); return; }
    const payload = buildIntakePayload(values, locale, metadataRef.current);
    const fields = validateIntake(payload, plan, config.allowPlan);
    if (Object.keys(fields).length) { setError(new IntakeError("validation", fields)); return; }

    busyRef.current = true;
    setError(null);
    setPending(config.localWithoutChallenge ? "sending" : "verifying");
    const controller = new AbortController();
    abortRef.current = controller;
    let timer;
    try {
      const key = await attemptRef.current.keyFor(payload, plan);
      const token = config.localWithoutChallenge ? null : await requestToken({ container: challengeRef.current, siteKey: config.siteKey, locale, signal: controller.signal });
      if (controller.signal.aborted) return;
      setPending("sending");
      timer = setTimeout(() => controller.abort(), 30000);
      const result = await submitIntake({ config, payload, plan, key, token, signal: controller.signal });
      if (mountedRef.current) {
        setSuccess(result);
        setValues({ ...EMPTY });
        setPlan(null);
        attemptRef.current.reset();
      }
    } catch (failure) {
      if (mountedRef.current) setError(failure instanceof IntakeError ? failure : new IntakeError("unconfirmed"));
    } finally {
      clearTimeout(timer);
      busyRef.current = false;
      abortRef.current = null;
      if (mountedRef.current) setPending("");
    }
  }

  const fieldError = (name) => error?.fields?.[name] && <small className="intake-field-error" id={`intake-${name}-error`}>{copy.fields[name]}</small>;
  const inputProps = (name, hint) => ({
    id: `intake-${name}`,
    name,
    value: values[name],
    onChange: (event) => edit(name, event.target.value),
    "aria-invalid": error?.fields?.[name] ? true : undefined,
    "aria-describedby": [hint, error?.fields?.[name] ? `intake-${name}-error` : ""].filter(Boolean).join(" ") || undefined,
  });
  const contacts = <div className="intake-contact-options"><a href="tel:+963948529207"><FiPhone aria-hidden="true" />{copy.call}</a><a href={`mailto:${contact.email}`}><FiMail aria-hidden="true" />{copy.email}</a></div>;

  if (success) return <section className="contact-form intake-form intake-success" aria-labelledby="intake-success-title">
    <div ref={statusRef} tabIndex={-1} role="status"><FiCheckCircle aria-hidden="true" /><h2 id="intake-success-title">{copy.success}</h2><p>{copy.successBody}</p><span>{copy.reference}</span><strong className="intake-reference"><bdi>{success.reference}</bdi></strong></div>
    <button type="button" className="button button--dark" onClick={() => { setSuccess(null); setError(null); }}>{copy.another}</button>
    {contacts}
  </section>;

  return <form className="contact-form intake-form" onSubmit={handleSubmit} noValidate aria-label={labels.title} aria-busy={!ready || Boolean(pending)}>
    <div className="form-heading"><span>01</span><div><p className="eyebrow">{labels.eyebrow}</p><h2>{labels.title}</h2></div></div>
    {!ready ? <p className="intake-hint" role="status">{copy.initializing}</p> : !config.enabled ? <div className="intake-unavailable" role="status"><h3>{copy.unavailableTitle}</h3><p>{copy.unavailable}</p>{contacts}</div> : <>
      <p className="intake-hint">{copy.intro}</p>
      {error && <div className="intake-error" role="alert" tabIndex={-1} ref={statusRef}><strong>{copy.errorTitle}</strong><p>{copy[error.code] || copy.unconfirmed}</p>{error.fields?.turnstile_token && <p>{copy.fields.turnstile_token}</p>}</div>}
      <fieldset disabled={Boolean(pending)}>
        <label htmlFor="intake-name"><span>{labels.name}</span><input {...inputProps("name")} autoComplete="name" required maxLength={255} />{fieldError("name")}</label>
        <div className="form-row">
          <label htmlFor="intake-phone"><span>{labels.phone}</span><input {...inputProps("phone", "intake-phone-hint")} type="tel" autoComplete="tel" dir="ltr" required maxLength={32} />{fieldError("phone")}</label>
          <label htmlFor="intake-area_sqm"><span>{labels.area} ({labels.areaUnit})</span><input {...inputProps("area_sqm")} type="number" inputMode="decimal" min="0.01" max="1000000" step="0.01" dir="ltr" required />{fieldError("area_sqm")}</label>
        </div>
        <p id="intake-phone-hint" className="intake-hint">{copy.phoneHint}</p>
        <label htmlFor="intake-location"><span>{labels.address}</span><input {...inputProps("location")} autoComplete="street-address" required maxLength={500} />{fieldError("location")}</label>
        <label htmlFor="intake-description"><span>{copy.description}</span><textarea {...inputProps("description", "intake-description-hint")} rows={4} maxLength={3000} /><small id="intake-description-hint">{copy.descriptionHint}</small>{fieldError("description")}</label>
        {config.allowPlan && <div className="intake-plan"><label htmlFor="intake-plan"><span>{copy.plan}</span><input ref={fileRef} id="intake-plan" name="plan" type="file" accept="application/pdf,.pdf" onChange={(event) => changePlan(event.target.files?.[0])} aria-describedby="intake-plan-hint intake-plan-error" aria-invalid={error?.fields?.plan ? true : undefined} /><small id="intake-plan-hint">{copy.planHint}</small>{fieldError("plan")}</label>{plan && <button className="intake-remove" type="button" onClick={() => { changePlan(null); if (fileRef.current) fileRef.current.value = ""; }}>{copy.removePlan}</button>}</div>}
        <label className="intake-consent" htmlFor="intake-consent"><input id="intake-consent" name="consent" type="checkbox" checked={values.consent} required onChange={(event) => edit("consent", event.target.checked)} aria-invalid={error?.fields?.consent ? true : undefined} aria-describedby={error?.fields?.consent ? "intake-consent-error intake-privacy" : "intake-privacy"} /><span>{config.allowPlan ? copy.consentWithPlan : copy.consent}</span></label>
        {fieldError("consent")}
        <p className="intake-hint" id="intake-privacy">{copy.privacy}</p>
      </fieldset>
      <div ref={challengeRef} className="intake-challenge" />
      {offline && <p role="status" className="intake-error">{copy.offline}</p>}
      <button className="button button--primary form-submit" type="submit" disabled={Boolean(pending) || offline || error?.code === "conflict"} aria-busy={Boolean(pending)}><FiSend aria-hidden="true" /><span>{pending ? copy[pending] : copy.send}</span></button>
      {contacts}
    </>}
    {!ready && <noscript><p>{copy.unavailable}</p>{contacts}</noscript>}
  </form>;
}
