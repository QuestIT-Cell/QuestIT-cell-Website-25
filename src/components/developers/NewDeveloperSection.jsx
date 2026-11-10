"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
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

const getCardDesignation = (name) => {
  if (name === "Atharva Lotankar" || name === "Shravanya Andhale") {
    return "TECH HEAD";
  }
  if (name === "Jay Kerkar" || name === "Pranav Titambe") {
    return "EX TECH MEMBER";
  }
  return "TECH MEMBER";
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
  const designation = getCardDesignation(member.name);
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
      el.style.setProperty("--ry", `${((x - 0.5) * 20).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - y) * 20).toFixed(2)}deg`);
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

  const handleCardClick = (e) => {
    // Prevent flipping if clicking contact link
    if (e.target.closest("a") || e.target.closest("button.dossier-contact-btn")) {
      return;
    }
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
          handleCardClick(e);
        }
      }}
      aria-label={`Developer card for ${member.name}. Click to flip in 3D.`}
    >
      <div className="card-3d">
        <div className={`card-flipper ${isFlipped ? "is-flipped" : ""}`}>
          {/* ══════════ FRONT FACE ══════════ */}
          <div className="card-face card-face-front">
            <div className="card-body">
              <div className="card-frame">
                {/* White shine sweep contained strictly in card frame */}
                <div className="card-flip-shine" />

                {/* Header */}
                <div className="card-header">
                  <span title={designation}>{designation}</span>
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
                    ✦ CLICK TO FLIP
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
                {/* White shine sweep contained strictly in dossier frame */}
                <div className="card-flip-shine" />

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
                  <div className="dossier-desc-container">
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
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const headingRef = useRef(null);
  const barRef = useRef(null);
  const counterRef = useRef(null);

  const totalMembers = developers.length;

  // Ensure body and html never have overflow-x: hidden which disables position: sticky
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("overflow-x", "clip", "important");
      document.body.style.setProperty("overflow-x", "clip", "important");
    }

    return () => {
      if (typeof document !== "undefined") {
        document.documentElement.style.removeProperty("overflow-x");
        document.body.style.removeProperty("overflow-x");
      }
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const heading = headingRef.current;
    const bar = barRef.current;
    const counter = counterRef.current;
    if (!section || !track) return;

    const items = Array.from(track.children);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const EASE = 0.085; // smooth inertial follow for natural scroll

    let maxTravel = 0;
    let centers = [];
    let target = 0;
    let current = 0;
    let activeIndex = -1;
    let raf = 0;
    let running = false;

    const readTarget = () => {
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - window.innerHeight;
      target = distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : 0;
    };

    const render = () => {
      if (reduced) {
        current = target;
      } else {
        current += (target - current) * EASE;
        if (Math.abs(target - current) < 0.0003) current = target;
      }

      const x = -current * maxTravel;
      const vw = window.innerWidth;

      track.style.transform = `translate3d(${x}px, 0, 0)`;

      if (heading) {
        heading.style.transform = `translate3d(${x * 0.16}px, 0, 0)`;
      }

      let nearest = 0;
      let nearestDist = Infinity;

      items.forEach((item, i) => {
        // d is normalized distance from center of viewport (-1 ... 0 ... +1)
        const d = (centers[i] + x - vw / 2) / (vw * 0.45);
        const clampedD = Math.max(-1.8, Math.min(1.8, d));
        const a = Math.min(1, Math.abs(clampedD));

        item.style.setProperty("--d", clampedD.toFixed(4));
        item.style.setProperty("--a", a.toFixed(4));

        if (Math.abs(d) < nearestDist) {
          nearestDist = Math.abs(d);
          nearest = i;
        }
      });

      if (nearest !== activeIndex) {
        items.forEach((item, i) =>
          item.classList.toggle("is-center", i === nearest)
        );
        activeIndex = nearest;
        if (counter) counter.textContent = pad(nearest + 1);
      }

      if (bar) bar.style.transform = `scaleX(${current.toFixed(4)})`;
    };

    const tick = () => {
      render();
      if (Math.abs(current - target) > 0.0001) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      readTarget();
      kick();
    };

    const measure = () => {
      // Calculate travel distance needed to translate all 11 cards cleanly
      maxTravel = Math.max(0, track.scrollWidth - window.innerWidth + 140);
      section.style.height = `${window.innerHeight + maxTravel}px`;
      centers = items.map((el) => el.offsetLeft + el.offsetWidth / 2);
      readTarget();
      current = target;
      render();
    };

    measure();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [viewMode]);

  return (
    <section className="dev-showcase-section" ref={sectionRef}>
      <div className="showcase-sticky">
        {/* Background Typography Parallax */}
        <div className="showcase-heading" ref={headingRef}>
          QUEST IT // DEVELOPERS
        </div>

        {/* Timeline Points in Background */}
        <div className="timeline">
          {[10, 20, 30, 40, 50].map((num) => (
            <div className="timeline-point" key={num}>
              <span>{num}</span>
              <div />
            </div>
          ))}
        </div>

        {/* Horizontal Scroll Track (Scroll-Driven on Web) */}
        <div className="showcase-track" ref={trackRef}>
          {developers.map((member, index) => {
            const workTitle = DEVELOPER_WORK_TITLES[member.name] || member.role;

            return (
              <article
                className="showcase-item"
                key={member.name}
                style={{ "--i": index }}
              >
                <CollectibleTeamCard
                  member={member}
                  number={index + 1}
                  total={totalMembers}
                />
                <p className="member-caption">{workTitle}</p>
              </article>
            );
          })}
        </div>

        {/* Bottom Scroll Progress Bar */}
        <div className="showcase-footer">
          <span>SCROLL DOWN TO EXPLORE</span>

          <div className="progress">
            <span ref={counterRef}>01</span>
            <div className="progress-line">
              <i ref={barRef} />
            </div>
            <span>{pad(totalMembers)}</span>
          </div>

          <span>CLICK CARD TO FLIP IN 3D</span>
        </div>
      </div>
    </section>
  );
}
