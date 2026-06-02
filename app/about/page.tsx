// app/about/page.tsx
// About page - bio, skills, experience timeline, and education

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  Mail,
  ArrowRight,
  BookOpen,
  Briefcase,
  Code2,
  Video,
  Download,
} from "lucide-react"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Emmanuel Abolade, a software developer based in Ireland focused on full-stack web development.",
}

// Skills grouped by category
const SKILL_GROUPS = [
  {
    category: "Languages",
    skills: ["JavaScript", "TypeScript", "Python", "Java", "C++", "PHP", "SQL"],
  },
  {
    category: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS", "HTML", "CSS"],
  },
  {
    category: "Backend & Database",
    skills: ["Node.js", "Supabase", "PostgreSQL", "MySQL", "Firebase", "Firestore", "REST APIs"],
  },
  {
    category: "Machine Learning",
    skills: ["scikit-learn", "NumPy", "pandas", "NLP", "TF-IDF", "SVM", "KNN"],
  },
  {
    category: "Tools & Platforms",
    skills: ["Git", "GitHub", "Vercel", "Streamlit", "VS Code", "Figma"],
  },
]

// Experience entries
const EXPERIENCE = [
  {
    role: "Multimedia Specialist (Voluntary)",
    org: "RCCG Trinity Hall, Portlaoise",
    period: "Aug 2022 – Present",
    icon: Video,
    points: [
      "Conceptualise, film, and edit multimedia content for web and social media platforms end-to-end.",
      "Collaborate with stakeholders to align content with branding and community engagement goals.",
    ],
  },
  {
    role: "Software Development Intern",
    org: "Fastrack Into Information Technology (FIT), Dublin",
    period: "Jan 2022",
    icon: Code2,
    points: [
      "Developed frontend components for an online craft store, collaborating on marketing and product presentation.",
      "Delivered solutions within deadlines while maintaining professional standards in a team environment.",
    ],
  },
  {
    role: "Healthcare Assistant",
    org: "Dunboyne Nursing Home, Dunboyne",
    period: "Aug 2019 – Jul 2021",
    icon: Briefcase,
    points: [
      "Provided high-quality resident care in a fast-paced environment with accurate documentation.",
      "Developed strong attention to detail, empathy, and teamwork — all transferable to software development.",
    ],
  },
]

// Education entries
const EDUCATION = [
  {
    degree: "BSc (Hons) in Software Development",
    institution: "South East Technological University, Carlow",
    period: "Sep 2022 – May 2026",
    note: "Final year — awaiting graduation",
    icon: BookOpen,
  },
  {
    degree: "QQI Level 5 — Computer Science in Software Development (Distinction)",
    institution: "Portlaoise Institute, Portlaoise",
    period: "Sep 2021 – May 2022",
    note: "Modules: Web Authoring, Software Architecture, Java, Database Management, Mathematics for IT",
    icon: BookOpen,
  },
]

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg)" }}>

      {/* Hero section */}
      <section
        style={{
          padding: "5rem 0 4rem",
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            {/* Text side */}
            <div>
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
                About Me
              </p>

              <h1
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
                  lineHeight: 1.15,
                  color: "var(--text-primary)",
                  marginBottom: "1.5rem",
                }}
              >
                Developer, creator,
                <br />
                and problem solver.
              </h1>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  marginBottom: "2rem",
                }}
              >
                <MapPin size={15} />
                Ireland
              </div>

              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.85,
                  marginBottom: "1.25rem",
                  fontSize: "1rem",
                }}
              >
                I am a final-year Software Development student at South East
                Technological University, Carlow, focused on building clean,
                purposeful, and user-driven digital systems.
              </p>

              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.85,
                  marginBottom: "1.25rem",
                  fontSize: "1rem",
                }}
              >
                I approach development as both a technical and creative discipline —
                structuring ideas, refining complexity, and delivering solutions
                that are intuitive, reliable, and scalable. My work is grounded in
                clarity, system thinking, and real-world application.
              </p>

              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.85,
                  marginBottom: "2rem",
                  fontSize: "1rem",
                }}
              >
                Beyond software, I create digital content and work in event
                videography — capturing and presenting stories that engage
                audiences. This creative work strengthens my attention to detail,
                visual thinking, and ability to communicate ideas clearly across
                different mediums.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                <Link href="/contact" className="btn-primary">
                  Get in Touch
                  <ArrowRight size={16} />
                </Link>
                <a href="/cv.pdf" className="btn-outline" download={true}>
                  <Download size={16} />
                  Download CV
                </a>
              </div>
            </div>

            {/* Image side */}
            <div style={{ position: "relative" }}>
              {/* Background decoration */}
              <div
                style={{
                  position: "absolute",
                  inset: "-1.5rem",
                  background: "var(--accent-subtle)",
                  borderRadius: "1rem",
                  zIndex: 0,
                }}
              />

              {/* Main image */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  aspectRatio: "4/5",
                  border: "3px solid var(--surface)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                }}
              >
                <Image
                  src="/images/profile.jpg"
                  alt="Emmanuel Abolade"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                  priority
                />
              </div>

              {/* Floating badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-1.5rem",
                  left: "-1.5rem",
                  zIndex: 2,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  padding: "1rem 1.25rem",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginBottom: "0.25rem",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Currently at
                </p>
                <p
                  style={{
                    fontFamily: "DM Serif Display, serif",
                    fontSize: "0.95rem",
                    color: "var(--text-primary)",
                  }}
                >
                  SETU Carlow
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive styles */}
        <style>{`
          @media (max-width: 768px) {
            .about-grid { grid-template-columns: 1fr !important; }
            .about-image-col { display: none; }
          }
        `}</style>
      </section>

      {/* Skills section */}
      <section className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <h2 className="section-title">Skills</h2>
          <div className="divider" />
          <p className="section-subtitle" style={{ marginBottom: "3rem" }}>
            Technologies and tools I work with regularly.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {SKILL_GROUPS.map((group) => (
              <div key={group.category} className="card">
                <h3
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    marginBottom: "1rem",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  {group.category}
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        background: "var(--bg)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        padding: "0.25rem 0.65rem",
                        borderRadius: "0.25rem",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience section */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container">
          <h2 className="section-title">Experience</h2>
          <div className="divider" />
          <p className="section-subtitle" style={{ marginBottom: "3rem" }}>
            Where I have applied my skills in the real world.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              maxWidth: "800px",
            }}
          >
            {EXPERIENCE.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.role}
                  className="card"
                  style={{ display: "flex", gap: "1.25rem" }}
                >
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      minWidth: "2.5rem",
                      background: "var(--accent-subtle)",
                      borderRadius: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={16} color="var(--accent)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "DM Serif Display, serif",
                          fontSize: "1.1rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        {item.role}
                      </h3>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          fontWeight: 500,
                        }}
                      >
                        {item.period}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--accent)",
                        fontWeight: 600,
                        marginBottom: "0.75rem",
                      }}
                    >
                      {item.org}
                    </p>
                    <ul
                      style={{
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.4rem",
                      }}
                    >
                      {item.points.map((point, i) => (
                        <li
                          key={i}
                          style={{
                            fontSize: "0.9rem",
                            color: "var(--text-secondary)",
                            lineHeight: 1.65,
                            paddingLeft: "1rem",
                            position: "relative",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              top: "0.55rem",
                              width: "4px",
                              height: "4px",
                              borderRadius: "50%",
                              background: "var(--accent)",
                            }}
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Education section */}
      <section className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <h2 className="section-title">Education</h2>
          <div className="divider" />
          <p className="section-subtitle" style={{ marginBottom: "3rem" }}>
            My academic background and qualifications.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              maxWidth: "800px",
            }}
          >
            {EDUCATION.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.degree}
                  className="card"
                  style={{ display: "flex", gap: "1.25rem" }}
                >
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      minWidth: "2.5rem",
                      background: "var(--accent-subtle)",
                      borderRadius: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={16} color="var(--accent)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "DM Serif Display, serif",
                          fontSize: "1.1rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        {item.degree}
                      </h3>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          fontWeight: 500,
                        }}
                      >
                        {item.period}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--accent)",
                        fontWeight: 600,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {item.institution}
                    </p>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-muted)",
                        fontStyle: "italic",
                      }}
                    >
                      {item.note}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Beyond code section */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container">
          <h2 className="section-title">Beyond Code</h2>
          <div className="divider" />
          <p className="section-subtitle" style={{ marginBottom: "3rem" }}>
            Other things that shape how I think and create.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
              maxWidth: "900px",
            }}
          >
            {[
              {
                title: "Content Creation",
                description:
                  "Creator of StayEnriched and TreasuredStoriesForKids — YouTube channels built around storytelling, education, and community engagement.",
                icon: Video,
              },
              {
                title: "Event Videography",
                description:
                  "Capturing, editing, and presenting stories at events in a way that resonates with audiences — sharpening visual thinking and detail orientation.",
                icon: Video,
              },
              {
                title: "Charity Work",
                description:
                  "Actively involved in volunteering and community service, believing that giving back is part of what it means to build something meaningful.",
                icon: Briefcase,
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="card">
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      background: "var(--accent-subtle)",
                      borderRadius: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <Icon size={16} color="var(--accent)" />
                  </div>
                  <h3
                    style={{
                      fontFamily: "DM Serif Display, serif",
                      fontSize: "1.1rem",
                      color: "var(--text-primary)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section
        style={{
          padding: "5rem 0",
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: "560px", margin: "0 auto" }}>
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>
            Want to work together?
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "2rem",
              lineHeight: 1.7,
            }}
          >
            I am open to full-time roles, freelance projects, and
            collaborations. Let us build something great.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/contact" className="btn-primary">
              <Mail size={16} />
              Get in Touch
            </Link>
            <Link href="/projects" className="btn-outline">
              View My Work
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
