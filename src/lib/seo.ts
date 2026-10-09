export interface SeoMetadataOptions {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  type?: 'website' | 'article';
}

const DEFAULT_SEO = {
  title: 'JK Interior | Interior Design Studio in Mumbai',
  description: 'JK Interior creates residential and commercial interiors across Mumbai.',
  siteUrl: typeof window !== 'undefined' ? window.location.origin : 'https://jkinterior.in'
};

/**
 * Updates dynamic meta tags, canonical URL, and structured data on the client side
 */
export function updatePageSeo(options: SeoMetadataOptions = {}) {
  if (typeof document === 'undefined') return;

  const siteUrl = DEFAULT_SEO.siteUrl;
  const pageTitle = options.title || DEFAULT_SEO.title;
  const pageDescription = options.description || DEFAULT_SEO.description;
  const canonicalUrl = options.canonicalPath
    ? `${siteUrl}${options.canonicalPath.startsWith('/') ? options.canonicalPath : `/${options.canonicalPath}`}`
    : typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : siteUrl;
  const ogImageUrl = options.ogImage;

  // 1. Page Title
  document.title = pageTitle;

  // 2. Meta Description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', pageDescription);

  // 3. Canonical URL
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // 4. OpenGraph Tags
  const setMetaProperty = (property: string, content: string) => {
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', property);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMetaProperty('og:title', pageTitle);
  setMetaProperty('og:description', pageDescription);
  setMetaProperty('og:url', canonicalUrl);
  setMetaProperty('og:type', options.type || 'website');
  setMetaProperty('og:site_name', 'JK Interior');
  if (ogImageUrl) {
    setMetaProperty('og:image', ogImageUrl);
  } else {
    document.querySelector('meta[property="og:image"]')?.remove();
  }

  // 5. Twitter Card Tags
  const setMetaName = (name: string, content: string) => {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMetaName('twitter:card', 'summary_large_image');
  setMetaName('twitter:title', pageTitle);
  setMetaName('twitter:description', pageDescription);
  if (ogImageUrl) {
    setMetaName('twitter:image', ogImageUrl);
  } else {
    document.querySelector('meta[name="twitter:image"]')?.remove();
  }

  // 6. Schema.org Structured Data
  let ldJsonScript = document.getElementById('jk-structured-data');
  if (!ldJsonScript) {
    ldJsonScript = document.createElement('script');
    ldJsonScript.id = 'jk-structured-data';
    ldJsonScript.setAttribute('type', 'application/ld+json');
    document.head.appendChild(ldJsonScript);
  }

  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    'name': 'JK Interior',
    'founder': {
      '@type': 'Person',
      'name': 'Kishorilal Sharma',
      'jobTitle': 'Founder & Master Craftsman'
    },
    'description': pageDescription,
    'url': siteUrl,
    'areaServed': {
      '@type': 'City',
      'name': 'Mumbai'
    }
  };

  // If breadcrumbs are provided, include BreadcrumbList
  if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    const breadcrumbList = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': options.breadcrumbs.map((item, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': item.name,
        'item': item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`
      }))
    };
    ldJsonScript.textContent = JSON.stringify([structuredData, breadcrumbList]);
  } else {
    ldJsonScript.textContent = JSON.stringify(structuredData);
  }
}
