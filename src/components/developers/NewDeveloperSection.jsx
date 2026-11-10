"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  LayoutGrid,
  Layers,
  Mail,
} from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa";
import developers from "@/constants/developers";
import "@/styles/team-cards.css";

const pad = (n) => String(n).padStart(2, "0");

const DEVELOPER_WORK_TITLES = {
  "Shravanya Andhale": "Website Deployment & Domain Coordination",
  "Atharva Lotankar": "UI Redesign & Frontend Components",
  "Jay Kerkar": "Frontend Architecture & PWA",
  "Pranav Titambe": "Backend Optimization & Dynamic Workflows",
  "Shivam Mishra": "Genesis Microsite & Subpath Routing",
  "Karthik Kotian": "Gallery & Developer Section Redesign",
  "Avani Killekar": "Council 2026–27 Team Section Architecture",
  "Chaitali Rane": "Council 2026–27 Media Standardisation",
  "Manish Awari": "Event Campaign Integration & Metrics UI",
  "Sarra Khadse": "Data Analytics Visualization & Responsive Splits UI",
  "Sankalp Mane": "Cross-Device Layout Optimization & Event Modules",
};

const UNIFORM_STATS = {
  "Atharva Lotankar": [
    { label: "CODE", value: 94 },
    { label: "SYSTEMS", value: 91 },
    { label: "TEAMWORK", value: 92 },
  ],
  "Shravanya Andhale": [
    { label: "CODE", value: 89 },
    { label: "SYSTEMS", value: 95 },
    { label: "TEAMWORK", value: 93 },
  ],
  "Jay Kerkar": [
    { label: "CODE", value: 93 },
    { label: "SYSTEMS", value: 92 },
    { label: "TEAMWORK", value: 90 },
  ],
  "Pranav Titambe": [
    { label: "CODE", value: 95 },
    { label: "SYSTEMS", value: 94 },
    { label: "TEAMWORK", value: 91 },
  ],
  "Shivam Mishra": [
    { label: "CODE", value: 92 },
    { label: "SYSTEMS", value: 93 },
    { label: "TEAMWORK", value: 90 },
  ],
  "Karthik Kotian": [
    { label: "CODE", value: 95 },
    { label: "SYSTEMS", value: 93 },
    { label: "TEAMWORK", value: 94 },
  ],
  "Avani Killekar": [
    { label: "CODE", value: 90 },
    { label: "SYSTEMS", value: 89 },
    { label: "TEAMWORK", value: 93 },
  ],
  "Chaitali Rane": [
    { label: "CODE", value: 89 },
    { label: "SYSTEMS", value: 91 },
    { label: "TEAMWORK", value: 94 },
  ],
  "Manish Awari": [
    { label: "CODE", value: 90 },
    { label: "SYSTEMS", value: 90 },
    { label: "TEAMWORK", value: 91 },
  ],
  "Sarra Khadse": [
    { label: "CODE", value: 89 },
    { label: "SYSTEMS", value: 92 },
    { label: "TEAMWORK", value: 91 },
  ],
  "Sankalp Mane": [
    { label: "CODE", value: 91 },
    { label: "SYSTEMS", value: 90 },
    { label: "TEAMWORK", value: 92 },
  ],
};

function CollectibleTeamCard({
  member,
  number,
  total,
  year = "2026",
  isCenter = false,
}) {
  const cardRef = useRef(null);
  const frameId = useRef(0);
  const [imgFailed, setImgFailed] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const workTitle = DEVELOPER_WORK_TITLES[member.name] || member.role || "Developer";
  const stats = UNIFORM_STATS[member.name] || [
    { label: "CODE", value: 90 },
    { label: "SYSTEMS", value: 88 },
    { label: "TEAMWORK", value: 90 },
  ];

  const handlePointerMove = (e) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    cancelAnimationFrame(frameId.current);
    frameId.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      el.style.setProperty("--px", (x - 0.5).toFixed(3));
      el.style.setProperty("--py", (y - 0.5).toFixed(3));
      el.style.setProperty("--ry", `${((x - 0.5) * 22).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - y) * 22).toFixed(2)}deg`);
    });
  };

  const handlePointerEnter = () => {
    cardRef.current?.classList.add("is-active");
  };

  const handlePointerLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    cancelAnimationFrame(frameId.current);
    el.classList.remove("is-active");
    ["--mx", "--my", "--px", "--py", "--rx", "--ry"].forEach((p) =>
      el.style.removeProperty(p)
    );
  };

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      className={`team-card ${isCenter ? "is-center" : ""}`}
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`Developer card for ${member.name}. Click to view dossier.`}
    >
      <div className="card-3d">
        <div className={`card-flipper ${isFlipped ? "is-flipped" : ""}`}>
          {/* ══════════ FRONT FACE ══════════ */}
          <div className="card-face card-face-front">
            <div className="card-body">
              <div className="card-frame">
                {/* Header */}
                <div className="card-header">
                  <span>TEAM MEMBER</span>
                  <b className="gem" />
                  <span>{year}</span>
                </div>

                {/* Arched Portrait Window */}
                <div className="portrait-window">
                  <div className="rays" />
                  <div className="portrait">
                    {member.image && !imgFailed ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        onError={() => setImgFailed(true)}
                      />
                    ) : (
                      <svg viewBox="0 0 100 130" preserveAspectRatio="xMidYMax slice">
                        <circle cx="50" cy="44" r="22" />
                        <path d="M8 130 C8 92 30 78 50 78 C70 78 92 92 92 130Z" />
                      </svg>
                    )}
                  </div>
                  <span className="spark s1">✦</span>
                  <span className="spark s2">✦</span>
                  <span className="spark s3">✦</span>
                  <span className="spark s4">✦</span>
                </div>

                {/* Name Ribbon */}
                <div className="ribbon-wrap">
                  <h2 className="ribbon" title={member.name}>
                    {member.name}
                  </h2>
                </div>

                {/* Role */}
                <p className="role" title={member.role}>
                  {member.role}
                </p>

                {/* Stats */}
                <div className="stats">
                  {stats.map((s) => (
                    <div
                      className="stat"
                      key={s.label}
                      style={{ "--v": `${s.value}%` }}
                    >
                      <span className="stat-label">{s.label}</span>
                      <span className="stat-track">
                        <i />
                      </span>
                      <span className="stat-value">{s.value}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="card-footer">
                  <span>
                    No. {pad(number)} / {pad(total)}
                  </span>
                  <span className="card-footer-action">
                    ✦ TAP FOR DOSSIER
                  </span>
                  <span className="seal" />
                </div>

                {/* Holo & Glare overlays */}
                <div className="card-holo" />
                <div className="card-glare" />
              </div>
            </div>
          </div>

          {/* ══════════ BACK FACE (DOSSIER) ══════════ */}
          <div className="card-face card-face-back">
            <div className="card-body">
              <div className="dossier-frame">
                {/* Dossier Header */}
                <div className="card-header">
                  <span>DOSSIER</span>
                  <b className="gem" />
                  <span>NO. {pad(number)}</span>
                </div>

                {/* Avatar & Profile */}
                <div className="dossier-top">
                  <div className="dossier-avatar-wrap">
                    {member.image && !imgFailed ? (
                      <img src={member.image} alt={member.name} />
                    ) : (
                      <svg viewBox="0 0 100 130" className="w-full h-full fill-amber-300">
                        <circle cx="50" cy="44" r="22" />
                        <path d="M8 130 C8 92 30 78 50 78 C70 78 92 92 92 130Z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="dossier-name" title={member.name}>
                    {member.name}
                  </h3>
                  <span className="dossier-work-badge" title={workTitle}>
                    {workTitle}
                  </span>
                </div>

                {/* In-Card Description */}
                <div className="dossier-body">
                  <div
                    className="dossier-desc-container"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="dossier-desc-text">{member.description}</p>
                  </div>
                </div>

                {/* Contacts */}
                <div className="dossier-contacts">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dossier-contact-btn"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${member.name}'s GitHub`}
                      title="GitHub"
                    >
                      <Github size={14} />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dossier-contact-btn"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${member.name}'s LinkedIn`}
                      title="LinkedIn"
                    >
                      <Linkedin size={13} />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="dossier-contact-btn"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Email ${member.name}`}
                      title="Email"
                    >
                      <Mail size={13} />
                    </a>
                  )}
                </div>

                {/* Flip Return Action */}
                <div className="dossier-flip-action">
                  <span>AUTHENTICATED</span>
                  <div className="dossier-flip-btn">
                    <RotateCcw size={10} />
                    <span>FLIP BACK</span>
                  </div>
                </div>

                {/* Light overlays */}
                <div className="card-holo" />
                <div className="card-glare" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-shadow" />
    </div>
  );
}

export default function NewDeveloperSection() {
  const [viewMode, setViewMode] = useState("showcase"); // "showcase" | "grid"
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const headingRef = useRef(null);

  const totalMembers = developers.length;

  // Update scroll progress & active card
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const scrollLeft = container.scrollLeft;
    const maxScroll = track.scrollWidth - container.clientWidth;
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;

    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${progress})`;
    }

    if (headingRef.current) {
      headingRef.current.style.transform = `translate3d(${-scrollLeft * 0.15}px, 0, 0)`;
    }

    // Determine nearest item to center
    const containerCenter = scrollLeft + container.clientWidth / 2;
    const items = Array.from(track.children);
    let nearestIndex = 0;
    let minDistance = Infinity;

    items.forEach((item, index) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const dist = Math.abs(itemCenter - containerCenter);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = index;
      }
    });

    setActiveIndex(nearestIndex);
  }, []);

  const scrollToMember = (index) => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const items = Array.from(track.children);
    if (!items[index]) return;

    const item = items[index];
    const targetScroll =
      item.offsetLeft + item.offsetWidth / 2 - container.clientWidth / 2;

    container.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: "smooth",
    });
  };

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeIndex - 1);
    scrollToMember(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(totalMembers - 1, activeIndex + 1);
    scrollToMember(nextIdx);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, viewMode]);

  return (
    <section className="dev-showcase-section">
      {/* ───────── Top Hero Header ───────── */}
      <div className="dev-section-hero">
        <div className="dev-hero-badge">
          <Sparkles size={12} />
          <span>Collectible Corps ✦ 2026 Edition</span>
        </div>

        <h1 className="dev-hero-title">THE ARCHITECTS OF QUEST</h1>

        <p className="dev-hero-subtitle">
          The engineers, creators, and problem solvers shaping our platforms. Hover
          to engage 3D holographic tilt, or tap any card to reveal its full developer dossier.
        </p>

        {/* View Mode Switcher */}
        <div className="dev-view-switch" role="tablist" aria-label="View switch">
          <button
            className={`dev-view-btn ${viewMode === "showcase" ? "is-active" : ""}`}
            onClick={() => setViewMode("showcase")}
            role="tab"
            aria-selected={viewMode === "showcase"}
          >
            <span className="flex items-center gap-1.5">
              <Layers size={13} />
              <span>Showcase</span>
            </span>
          </button>
          <button
            className={`dev-view-btn ${viewMode === "grid" ? "is-active" : ""}`}
            onClick={() => setViewMode("grid")}
            role="tab"
            aria-selected={viewMode === "grid"}
          >
            <span className="flex items-center gap-1.5">
              <LayoutGrid size={13} />
              <span>Grid View</span>
            </span>
          </button>
        </div>
      </div>

      {/* ───────── Showcase Mode ───────── */}
      {viewMode === "showcase" ? (
        <div className="showcase-sticky">
          {/* Background Typography */}
          <div className="showcase-heading" ref={headingRef}>
            QUEST IT // ARCHITECTS
          </div>

          {/* Timeline points */}
          <div className="timeline">
            {[10, 20, 30, 40, 50].map((num) => (
              <div className="timeline-point" key={num}>
                <span>{num}</span>
                <div />
              </div>
            ))}
          </div>

          {/* Arrow Navigation */}
          <button
            className="showcase-nav-btn showcase-nav-prev"
            onClick={handlePrev}
            aria-label="Previous developer card"
            disabled={activeIndex === 0}
            style={{ opacity: activeIndex === 0 ? 0.35 : 1 }}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            className="showcase-nav-btn showcase-nav-next"
            onClick={handleNext}
            aria-label="Next developer card"
            disabled={activeIndex === totalMembers - 1}
            style={{ opacity: activeIndex === totalMembers - 1 ? 0.35 : 1 }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Horizontal Scroll Track */}
          <div className="showcase-track-container" ref={containerRef}>
            <div className="showcase-track" ref={trackRef}>
              {developers.map((member, index) => {
                const workTitle = DEVELOPER_WORK_TITLES[member.name] || member.role;
                const isCenter = index === activeIndex;

                return (
                  <article
                    className={`showcase-item ${isCenter ? "is-center" : ""}`}
                    key={member.name}
                  >
                    <CollectibleTeamCard
                      member={member}
                      number={index + 1}
                      total={totalMembers}
                      isCenter={isCenter}
                    />
                    <p className="member-caption">{workTitle}</p>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Showcase Footer Indicator */}
          <div className="showcase-footer">
            <span>SCROLL OR USE ARROWS</span>

            <div className="progress">
              <span>{pad(activeIndex + 1)}</span>
              <div className="progress-line">
                <i ref={barRef} />
              </div>
              <span>{pad(totalMembers)}</span>
            </div>

            <span>CLICK CARD FOR DOSSIER</span>
          </div>
        </div>
      ) : (
        /* ───────── Grid Mode ───────── */
        <div className="dev-grid-section">
          <div className="dev-grid-cards">
            {developers.map((member, index) => (
              <div key={member.name} className="flex flex-col items-center">
                <CollectibleTeamCard
                  member={member}
                  number={index + 1}
                  total={totalMembers}
                />
                <p className="member-caption mt-4">
                  {DEVELOPER_WORK_TITLES[member.name] || member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
