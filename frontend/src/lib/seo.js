import { useEffect } from "react";

// Lightweight head management. The app is a single page build, so titles,
// descriptions and structured data have to be written on mount and cleaned up
// on unmount rather than rendered server side.

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  return el;
}

/**
 * useSeo({ title, description, image, canonical, jsonLd })
 *
 * jsonLd is an object or array of objects. It is injected as a script tag and
 * removed when the component unmounts, so listing pages do not leak schema
 * from one vehicle onto the next.
 */
export function useSeo({ title, description, image, canonical, jsonLd } = {}) {
  // Serialised once so the effect has a stable, statically checkable dependency
  // rather than an object identity that changes on every render.
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : null;

  useEffect(() => {
    const previousTitle = document.title;
    if (title) document.title = title;

    if (description) {
      upsertMeta('meta[name="description"]', { name: "description", content: description });
      upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
      upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    }
    if (title) {
      upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
      upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
      upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    }
    if (image) {
      upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
      upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
    }
    const url = canonical || window.location.href.split("?")[0];
    upsertLink("canonical", url);
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });

    let script;
    if (jsonLdKey) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = jsonLdKey;
      document.head.appendChild(script);
    }

    return () => {
      document.title = previousTitle;
      if (script && script.parentNode) script.parentNode.removeChild(script);
    };
  }, [title, description, image, canonical, jsonLdKey]);
}

/** Schema.org Vehicle offer for a sale listing. */
export function vehicleJsonLd(v, url) {
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${v.year} ${v.make} ${v.model}`,
    brand: { "@type": "Brand", name: v.make },
    model: v.model,
    vehicleModelDate: String(v.year),
    color: v.colour,
    fuelType: v.fuel,
    vehicleTransmission: v.transmission,
    numberOfDoors: 5,
    seatingCapacity: v.seats,
    vehicleConfiguration: v.vehicle_type,
    mileageFromOdometer: { "@type": "QuantitativeValue", value: v.mileage, unitCode: "SMI" },
    itemCondition: "https://schema.org/UsedCondition",
    image: v.photos,
    description: v.description,
    offers: {
      "@type": "Offer",
      price: v.price,
      priceCurrency: "GBP",
      availability: v.status === "available"
        ? "https://schema.org/InStock"
        : "https://schema.org/LimitedAvailability",
      url,
      areaServed: v.city,
      seller: { "@type": "Organization", name: "Kharo" },
    },
  };
}

/** Schema.org FAQPage, used on the city landing pages. */
export function faqJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

/** Schema.org BreadcrumbList. */
export function breadcrumbJsonLd(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${window.location.origin}${t.to}`,
    })),
  };
}
