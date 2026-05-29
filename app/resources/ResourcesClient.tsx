// app/resources/ResourcesClient.tsx
// Client component for Resources page - handles filtering, coupon copy, and resource card display

"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import {
  Search,
  ExternalLink,
  Download,
  Copy,
  Check,
  Star,
  BookOpen,
  Tag,
  Layers,
  BadgePercent,
} from "lucide-react"

// Type definition for a resource record from Supabase
type Resource = {
  id: string
  title: string
  url: string
  description: string | null
  my_take: string | null
  resource_type: string | null
  pricing_model: string | null
  category_id: string | null
  tags: string[] | null
  logo_url: string | null
  is_downloadable: boolean
  is_affiliate: boolean
  coupon_code: string | null
  discount_amount: string | null
  click_count: number
  featured: boolean
  published: boolean
  pinned_order: number | null
  created_at: string
  updated_at: string
}

const ALL_FILTER = "All"

const PRICING_COLORS: Record<string, { bg: string; color: string }> = {
  Free:        { bg: "#dcfce7", color: "#16a34a" },
  Freemium:    { bg: "#fef9c3", color: "#ca8a04" },
  Paid:        { bg: "#fee2e2", color: "#dc2626" },
  "Open Source": { bg: "#dbeafe", color: "#2563eb" },
}

// CouponButton - allows copying coupon codes with a click
function CouponButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        background: "var(--accent-subtle)",
        border: "1.5px dashed var(--accent)",
        color: "var(--accent)",
        borderRadius: "0.375rem",
        padding: "0.35rem 0.85rem",
        fontSize: "0.8rem",
        fontWeight: 700,
        cursor: "pointer",
        letterSpacing: "0.05em",
        transition: "all 0.2s ease",
        fontFamily: "monospace",
      }}
      title="Click to copy coupon code"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied!" : code}
    </button>
  )
}

export default function ResourcesClient({
  resources,
}: {
  resources: Resource[]
}) {
  const [search, setSearch]           = useState("")
  const [activeType, setActiveType]   = useState(ALL_FILTER)
  const [activePricing, setPricing]   = useState(ALL_FILTER)

  // Collect unique resource types
  const allTypes = useMemo(() => {
    const set = new Set<string>()
    resources.forEach((r) => r.resource_type && set.add(r.resource_type))
    return [ALL_FILTER, ...Array.from(set).sort()]
  }, [resources])

  // Collect unique pricing models
  const allPricing = useMemo(() => {
    const set = new Set<string>()
    resources.forEach((r) => r.pricing_model && set.add(r.pricing_model))
    return [ALL_FILTER, ...Array.from(set).sort()]
  }, [resources])

  // Filter resources
  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch =
        search.trim() === "" ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        (r.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (r.my_take ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (r.tags ?? []).some((t) =>
          t.toLowerCase().includes(search.toLowerCase())
        )
      const matchesType =
        activeType === ALL_FILTER || r.resource_type === activeType
      const matchesPricing =
        activePricing === ALL_FILTER || r.pricing_model === activePricing
      return matchesSearch && matchesType && matchesPricing
    })
  }, [resources, search, activeType, activePricing])

  const featured = filtered.filter((r) => r.featured)
  const regular  = filtered.filter((r) => !r.featured)

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Page header */}
      <section
        style={{
          padding: "5rem 0 3rem",
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container">
          <p
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "1rem",
            }}
          >
            Curated
          </p>
          <h1
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            Resources
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              maxWidth: "560px",
              lineHeight: 1.7,
            }}
          >
            Tools, books, courses, and references I personally use and
            recommend — curated for developers and learners.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section
        style={{
          padding: "2rem 0",
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: "4rem",
          zIndex: 10,
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Search, filters and result count — all in one row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  minWidth: "220px",
                  maxWidth: "340px",
                }}
              >
                <Search
                  size={15}
                  style={{
                    position: "absolute",
                    left: "0.85rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    paddingLeft: "2.25rem",
                    paddingRight: "1rem",
                    paddingTop: "0.6rem",
                    paddingBottom: "0.6rem",
                    borderRadius: "0.375rem",
                    border: "1.5px solid var(--border)",
                    background: "var(--surface)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>

              {/* Type filter pills */}
              {allTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  style={{
                    padding: "0.3rem 0.8rem",
                    borderRadius: "999px",
                    border: "1.5px solid",
                    borderColor:
                      activeType === type ? "var(--accent)" : "var(--border)",
                    background:
                      activeType === type
                        ? "var(--accent-subtle)"
                        : "var(--surface)",
                    color:
                      activeType === type
                        ? "var(--accent)"
                        : "var(--text-secondary)",
                    fontSize: "0.8rem",
                    fontWeight: activeType === type ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {type}
                </button>
              ))}

              {/* Pricing filter pills */}
              {allPricing.filter((p) => p !== ALL_FILTER).map((pricing) => {
                const colors = PRICING_COLORS[pricing]
                return (
                  <button
                    key={pricing}
                    onClick={() =>
                      setPricing(activePricing === pricing ? ALL_FILTER : pricing)
                    }
                    style={{
                      padding: "0.3rem 0.8rem",
                      borderRadius: "999px",
                      border: "1.5px solid",
                      borderColor:
                        activePricing === pricing
                          ? colors?.color ?? "var(--accent)"
                          : "var(--border)",
                      background:
                        activePricing === pricing
                          ? colors?.bg ?? "var(--accent-subtle)"
                          : "var(--surface)",
                      color:
                        activePricing === pricing
                          ? colors?.color ?? "var(--accent)"
                          : "var(--text-secondary)",
                      fontSize: "0.8rem",
                      fontWeight: activePricing === pricing ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {pricing}
                  </button>
                )
              })}

              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                  marginLeft: "auto",
                }}
              >
                {filtered.length} resource{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Resources content */}
      <section className="section">
        <div className="container">

          {/* Empty state */}
          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 0",
                color: "var(--text-muted)",
              }}
            >
              <Layers
                size={48}
                style={{ margin: "0 auto 1rem", opacity: 0.4 }}
              />
              <h3
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "1.5rem",
                  color: "var(--text-secondary)",
                  marginBottom: "0.5rem",
                }}
              >
                {resources.length === 0
                  ? "No resources yet"
                  : "No resources match your filters"}
              </h3>
              <p style={{ fontSize: "0.95rem" }}>
                {resources.length === 0
                  ? "Resources will appear here once published from the admin dashboard."
                  : "Try adjusting your search or filters."}
              </p>
            </div>
          )}

          {/* Featured resources */}
          {featured.length > 0 && (
            <div style={{ marginBottom: "4rem" }}>
              <h2
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "1.5rem",
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Star size={18} color="var(--accent)" />
                Featured
              </h2>
              <div className="divider" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1.5rem",
                  marginTop: "1.5rem",
                }}
              >
                {featured.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    featured
                  />
                ))}
              </div>
            </div>
          )}

          {/* All other resources */}
          {regular.length > 0 && (
            <div>
              {featured.length > 0 && (
                <>
                  <h2
                    style={{
                      fontFamily: "DM Serif Display, serif",
                      fontSize: "1.5rem",
                      color: "var(--text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    All Resources
                  </h2>
                  <div className="divider" />
                </>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1.5rem",
                  marginTop: "1.5rem",
                }}
              >
                {regular.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// Individual resource card component
function ResourceCard({
  resource,
  featured = false,
}: {
  resource: Resource
  featured?: boolean
}) {
  const pricingColors =
    PRICING_COLORS[resource.pricing_model ?? ""] ?? null

  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0",
        padding: "1.5rem",
        borderColor: featured ? "var(--accent)" : undefined,
        position: "relative",
      }}
    >
      {/* Affiliate indicator */}
      {resource.is_affiliate && (
        <span
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            fontSize: "0.65rem",
            color: "var(--text-muted)",
            background: "var(--bg-secondary)",
            padding: "0.15rem 0.5rem",
            borderRadius: "999px",
            border: "1px solid var(--border)",
          }}
        >
          Affiliate
        </span>
      )}

      {/* Header: logo and type */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        {resource.logo_url ? (
          <div
            style={{
              width: "2.5rem",
              height: "2.5rem",
              minWidth: "2.5rem",
              borderRadius: "0.5rem",
              overflow: "hidden",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              position: "relative",
            }}
          >
            <Image
              src={resource.logo_url}
              alt={resource.title}
              fill
              sizes="40px"
              style={{ objectFit: "contain", padding: "4px" }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "2.5rem",
              height: "2.5rem",
              minWidth: "2.5rem",
              borderRadius: "0.5rem",
              background: "var(--accent-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={16} color="var(--accent)" />
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          {resource.resource_type && (
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              {resource.resource_type}
            </span>
          )}
        </div>

        {/* Pricing badge */}
        {resource.pricing_model && (
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "0.2rem 0.6rem",
              borderRadius: "999px",
              background: pricingColors?.bg ?? "var(--bg-secondary)",
              color: pricingColors?.color ?? "var(--text-muted)",
              whiteSpace: "nowrap",
            }}
          >
            {resource.pricing_model}
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "DM Serif Display, serif",
          fontSize: "1.15rem",
          color: "var(--text-primary)",
          marginBottom: "0.5rem",
          lineHeight: 1.3,
        }}
      >
        {resource.title}
      </h3>

      {/* Description */}
      {resource.description && (
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
            lineHeight: 1.65,
            marginBottom: "0.75rem",
          }}
        >
          {resource.description}
        </p>
      )}

      {/* My take */}
      {resource.my_take && (
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderLeft: "3px solid var(--accent)",
            borderRadius: "0 0.375rem 0.375rem 0",
            padding: "0.65rem 0.85rem",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            <strong
              style={{
                fontStyle: "normal",
                color: "var(--accent)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "0.25rem",
              }}
            >
              My take
            </strong>
            {resource.my_take}
          </p>
        </div>
      )}

      {/* Discount badge */}
      {resource.discount_amount && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          <BadgePercent size={14} color="var(--accent)" />
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--accent)",
            }}
          >
            {resource.discount_amount}
          </span>
        </div>
      )}

      {/* Coupon code */}
      {resource.coupon_code && (
        <div style={{ marginBottom: "1rem" }}>
          <CouponButton code={resource.coupon_code} />
        </div>
      )}

      {/* Tags */}
      {resource.tags && resource.tags.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
            marginBottom: "1.25rem",
          }}
        >
          {resource.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                padding: "0.2rem 0.55rem",
                borderRadius: "999px",
              }}
            >
              <Tag size={9} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action button */}
      <div style={{ marginTop: "auto" }}>
        <a
          href={resource.url}
          target={resource.is_downloadable ? "_self" : "_blank"}
          rel="noopener noreferrer"
          download={resource.is_downloadable || undefined}
          className="btn-primary"
          style={{ fontSize: "0.85rem", padding: "0.55rem 1.1rem", width: "100%", justifyContent: "center" }}
        >
          {resource.is_downloadable ? (
            <>
              <Download size={14} />
              Download
            </>
          ) : (
            <>
              Visit Resource
              <ExternalLink size={14} />
            </>
          )}
        </a>
      </div>
    </div>
  )
}
