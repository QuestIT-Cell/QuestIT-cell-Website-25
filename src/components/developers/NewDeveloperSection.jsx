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
  isFlipped = false,
  onToggleFlip,
}) {
  const cardRef = useRef(null);
  const frameId = useRef(0);
  const [imgFailed, setImgFailed] = useState(false);

  const workTitle = DEVELOPER_WORK_TITLES[member.name] || member.role || "Developer";
  const designation = getCardDesignation(member.name);
  const stats = UNIFORM_STATS[member.name] || [
    { label: "CODE", value: 90 },
    { label: "SYSTEMS", value: 88 },
    { label: "TEAMWORK", value: 90 },
  ];

  // When card is flipped, reset pointer tilt so the back face text is rock-steady and crisp
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (isFlipped) {
      el.classList.remove("is-active");
      ["--mx", "--my", "--px", "--py", "--rx", "--ry"].forEach((p) =>
        el.style.removeProperty(p)
      );
    }
  }, [isFlipped]);

  const handlePointerMove = (e) => {
    if (isFlipped) return; // Keep back face steady for reading and clicking links
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
    if (isFlipped) return;
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

  const descRef = useRef(null);

  // Isolate touch scrolling inside description on mobile so card track does not move
  useEffect(() => {
    const el = descRef.current;
    if (!el) return;

    let startY = 0;

    const onTouchStart = (e) => {
      startY = e.touches[0].clientY;
      e.stopPropagation();
    };

    const onTouchMove = (e) => {
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      const maxScroll = el.scrollHeight - el.clientHeight;

      if (maxScroll > 0) {
        if (
          (deltaY > 0 && el.scrollTop < maxScroll) ||
          (deltaY < 0 && el.scrollTop > 0)
        ) {
          e.stopPropagation();
        }
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  const handleCardClick = (e) => {
    // Prevent flipping if clicking contact link or interacting with description container
    if (
      e.target.closest("a") ||
      e.target.closest("button.dossier-contact-btn") ||
      e.target.closest(".dossier-desc-container")
    ) {
      return;
    }
    e.stopPropagation();
    onToggleFlip?.();
  };

  return (
    <div
      className={`team-card ${isCenter ? "is-center" : ""} ${isFlipped ? "is-card-flipped" : ""}`}
      style={{
        zIndex: isFlipped ? 50 : undefined,
      }}
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
                  <div
                    ref={descRef}
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
                <div
                  className="dossier-flip-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFlip?.();
                  }}
                  role="button"
                  tabIndex={0}
                  title="Flip back to front"
                >
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

  // Per-card flipped state so each and every card in viewport can flip independently
  const [flippedCards, setFlippedCards] = useState({});

  const toggleCardFlip = (index, e) => {
    // Prevent flipping if clicking contact link
    if (e && (e.target.closest("a") || e.target.closest("button.dossier-contact-btn"))) {
      return;
    }
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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

    let maxTravel = 0;
    let centers = [];
    let target = 0;
    let current = 0;
    let activeIndex = -1;
    let raf = 0;
    let running = false;
    let lastTime = 0;

    // Cached layout metrics to eliminate forced synchronous reflows on scroll
    let cachedSectionTop = 0;
    let cachedDistance = 0;
    let cachedVw = typeof window !== "undefined" ? window.innerWidth : 1200;
    let cachedIsMobile = cachedVw < 768;
    let focusWidth = cachedIsMobile ? cachedVw * 0.6 : cachedVw * 0.45;

    const readTarget = () => {
      // Using window.scrollY with cached offsets avoids synchronous getBoundingClientRect layout flushes
      const scrolled = window.scrollY - cachedSectionTop;
      target = cachedDistance > 0 ? Math.min(1, Math.max(0, scrolled / cachedDistance)) : 0;
    };

    const render = (now = performance.now()) => {
      if (reduced) {
        current = target;
      } else {
        // Frame-rate independent exponential smoothing (dt-based)
        // Works with identical physical smoothness on 60Hz, 120Hz, and 144Hz displays
        const dt = lastTime > 0 ? Math.min(0.05, (now - lastTime) / 1000) : 0.016;
        lastTime = now;

        // Responsive critical damping: 16 on mobile, 14 on desktop for effortless gliding with zero drag
        const decay = cachedIsMobile ? 16 : 14;
        const factor = 1 - Math.exp(-decay * dt);
        current += (target - current) * factor;

        if (Math.abs(target - current) < 0.00005) current = target;
      }

      const x = -current * maxTravel;

      track.style.transform = `translate3d(${x.toFixed(3)}px, 0, 0)`;

      if (heading) {
        heading.style.transform = `translate3d(${(x * 0.16).toFixed(3)}px, 0, 0)`;
      }

      let nearest = 0;
      let nearestDist = Infinity;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        // d is normalized distance from center of viewport (-1 ... 0 ... +1)
        const d = (centers[i] + x - cachedVw / 2) / focusWidth;
        const clampedD = Math.max(-1.8, Math.min(1.8, d));
        const a = Math.min(1, Math.abs(clampedD));

        const isFlipped = item.classList.contains("has-flipped-card") || item.querySelector(".is-card-flipped");
        if (!isFlipped) {
          if (cachedIsMobile) {
            const ty = (clampedD * 30).toFixed(1);
            const ry = (clampedD * -4).toFixed(1);
            const sc = (1.03 - a * 0.08).toFixed(3);
            item.style.transform = `perspective(1300px) translate3d(0, ${ty}px, 0) rotateY(${ry}deg) scale(${sc})`;
          } else {
            const ty = (clampedD * 85).toFixed(1);
            const ry = (clampedD * -20).toFixed(1);
            const rz = (clampedD * -2.5).toFixed(1);
            const sc = (1.06 - a * 0.16).toFixed(3);
            item.style.transform = `perspective(1300px) translate3d(0, ${ty}px, 0) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`;
          }
        } else {
          item.style.transform = "";
        }

        const absDist = Math.abs(d);
        if (absDist < nearestDist) {
          nearestDist = absDist;
          nearest = i;
        }
      }

      if (nearest !== activeIndex) {
        for (let i = 0; i < items.length; i++) {
          items[i].classList.toggle("is-center", i === nearest);
        }
        activeIndex = nearest;
        if (counter) counter.textContent = pad(nearest + 1);
      }

      if (bar) bar.style.transform = `scaleX(${current.toFixed(4)})`;
    };

    const tick = (now) => {
      render(now);
      if (Math.abs(current - target) > 0.00005) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
        lastTime = 0;
        section.classList.remove("is-scrolling");
      }
    };

    const kick = () => {
      readTarget();
      if (!running) {
        running = true;
        lastTime = 0;
        section.classList.add("is-scrolling");
        raf = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      readTarget();
      kick();
    };

    const measure = () => {
      cachedVw = window.innerWidth;
      cachedIsMobile = cachedVw < 768;
      focusWidth = cachedIsMobile ? cachedVw * 0.6 : cachedVw * 0.45;

      // Cache document-relative section position once during resize/measure
      const rect = section.getBoundingClientRect();
      cachedSectionTop = rect.top + window.scrollY;

      maxTravel = Math.max(0, track.scrollWidth - cachedVw);

      // Balanced scroll ratio: on mobile, 1 natural thumb flick moves exactly 1 card
      const scrollMultiplier = cachedIsMobile ? 1.55 : 1.35;
      const scrollTrackDistance = maxTravel * scrollMultiplier;
      section.style.height = `${window.innerHeight + scrollTrackDistance}px`;
      cachedDistance = section.offsetHeight - window.innerHeight;

      centers = items.map((el) => el.offsetLeft + el.offsetWidth / 2);
      readTarget();
      current = target;
      render(performance.now());
    };

    measure();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => {
      cancelAnimationFrame(raf);
      section.classList.remove("is-scrolling");
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, []);

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
            const isFlipped = !!flippedCards[index];

            return (
              <article
                className={`showcase-item ${isFlipped ? "has-flipped-card" : ""}`}
                key={member.name}
                style={{ "--i": index }}
                onClick={(e) => toggleCardFlip(index, e)}
              >
                <CollectibleTeamCard
                  member={member}
                  number={index + 1}
                  total={totalMembers}
                  isFlipped={isFlipped}
                  onToggleFlip={() => toggleCardFlip(index)}
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
