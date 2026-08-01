import { FiDownload, FiFileText } from "react-icons/fi";
import Button from "./Button";
import ResponsivePicture from "./ResponsivePicture";

export default function ManufacturerDocumentCard({
  document,
  labels,
  compact = false,
}) {
  const isFirstPageScan = document.sourceExtent === "first-page-scan";

  return (
    <article
      id={compact ? undefined : document.id}
      className={`manufacturer-document-card${document.featured ? " is-featured" : ""}${compact ? " is-compact" : ""}`}
      data-reveal
    >
      <div className="manufacturer-document-preview">
        <ResponsivePicture
          source={document.preview}
          alt={document.alt}
          className="manufacturer-document-picture"
          imgClassName="manufacturer-document-image"
          sizes={compact
            ? "(max-width: 820px) 32vw, 180px"
            : "(max-width: 820px) 82vw, (max-width: 1440px) 38vw, 520px"}
        />
        <span className={`manufacturer-document-extent${isFirstPageScan ? " is-partial" : ""}`}>
          <FiFileText aria-hidden="true" />
          {isFirstPageScan
            ? (compact ? labels.firstPageScanShort : labels.firstPageScan)
            : (compact ? labels.completeDocumentShort : labels.completeDocument)}
        </span>
      </div>

      <div className="manufacturer-document-copy">
        <p className="eyebrow">{document.type}</p>
        <h3>{document.title}</h3>
        {compact ? null : <p className="manufacturer-document-summary">{document.summary}</p>}

        <dl className="manufacturer-document-meta">
          {compact ? null : (
            <div className="manufacturer-document-holder">
              <dt>{labels.rightsHolder}</dt>
              <dd dir="ltr">{document.rightsHolder}</dd>
            </div>
          )}
          <div>
            <dt>{labels.patentNumber}</dt>
            <dd dir="ltr">{document.patentNumber}</dd>
          </div>
          <div>
            <dt>{labels.publicationNumber}</dt>
            <dd dir="ltr">{document.publicationNumber}</dd>
          </div>
          {compact ? null : (
            <>
              <div>
                <dt>{labels.applicationDate}</dt>
                <dd><time dateTime={document.applicationDate} dir="ltr">{document.applicationDate}</time></dd>
              </div>
              <div>
                <dt>{labels.grantPublicationDate}</dt>
                <dd><time dateTime={document.grantPublicationDate} dir="ltr">{document.grantPublicationDate}</time></dd>
              </div>
            </>
          )}
        </dl>

        {compact ? null : (
          <div className="manufacturer-document-actions">
            <span>{labels.sourceLanguage}: {labels.chinese}</span>
            <Button
              href={document.pdf}
              variant="dark"
              target="_blank"
              rel="noreferrer"
              aria-label={`${labels.openPdf}: ${document.title}`}
            >
              <FiDownload aria-hidden="true" /> {labels.openPdf}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
