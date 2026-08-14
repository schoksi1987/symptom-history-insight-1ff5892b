import { Helmet } from "react-helmet-async";

const SITE = "https://symptom.ai";

export interface SeoProps {
  title: string;
  description: string;
  /** Route path, e.g. "/how-it-works". Omit for the homepage. */
  path?: string;
  noIndex?: boolean;
}

/**
 * Per-route head metadata. Titles are suffixed with the product wordmark
 * so every route has a descriptive, unique title.
 */
export function Seo({ title, description, path = "/", noIndex }: SeoProps) {
  const url = `${SITE}${path === "/" ? "/" : path}`;
  const fullTitle = title.includes("Predict Disease")
    ? title
    : `${title} | Predict Disease by symptom.ai`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {noIndex && <meta name="robots" content="noindex" />}
    </Helmet>
  );
}

export default Seo;
