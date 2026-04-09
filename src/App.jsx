import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";

const navItems = [
  "About",
  "Skills",
  "Projects",
  "Experience",
  "Achievements",
  "Contact"
];

const skillGroups = [
  {
    title: "CAD & 3D Modeling",
    icon: "◌",
    items: ["SolidWorks", "3D Experience (Catia)", "Fusion 360", "AutoCAD", "Blender"]
  },
  {
    title: "Product Design",
    icon: "△",
    items: ["Concept Development", "3D Modeling"]
  },
  {
    title: "Rendering & Visualization",
    icon: "◎",
    items: ["Blender"]
  },
  {
    title: "Engineering Tools",
    icon: "▣",
    items: ["MS Excel", "PowerPoint (technical presentations)"]
  }
];

const projects = [
  "Solar Electric Golf Cart",
  "Tool-Free Axial Link Mechanism (Patent)",
  "Post-Weld Heat Treatment of Cold Metal Welded Austenitic Stainless Steel",
  "Flame Shield",
  "Semi-Autonomous Underwater Vehicle",
  "SAE BAJA (Chassis Team)",
  "AR Museum Guide"
];

const achievements = [
  { title: "AAKRUTI Innovation Competition 2025", subtitle: "India Semi-Finalist", value: 1, suffix: "x" },
  { title: "TN-IMPACT 2026", subtitle: "Second Prize Winner", value: 2, suffix: "nd" },
  { title: "TNWISE 2025", subtitle: "Special Prize Winner", value: 1, suffix: "x" }
];

const sectionVariants = {
  hidden: { opacity: 0, y: 42 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

function useWordRotate(words, delay = 2300) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % words.length);
    }, delay);
    return () => clearInterval(id);
  }, [words, delay]);

  return words[index];
}

function MagneticButton({ href, children, className }) {
  const ref = useRef(null);

  const handleMove = event => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    ref.current.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  };

  const reset = () => {
    if (ref.current) {
      ref.current.style.transform = "translate(0px, 0px)";
    }
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold transition duration-300 will-change-transform ${className}`}
    >
      {children}
    </a>
  );
}

function CounterCard({ item }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1000;
    const start = performance.now();

    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.ceil(progress * item.value));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, item.value]);

  return (
    <motion.article
      ref={ref}
      variants={itemVariants}
      className="glass rounded-2xl border border-cyanx-500/35 p-6 shadow-soft"
      whileHover={{ y: -4, boxShadow: "0 0 0 1px rgba(20,184,166,0.45), 0 20px 35px rgba(14,165,233,0.2)" }}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-cyanx-400/60 text-lg text-cyanx-600 dark:text-cyanx-400">
        🏆
      </div>
      <p className="text-3xl font-semibold text-ink-900 dark:text-slate-100">
        {count}
        {item.suffix}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-ink-900 dark:text-slate-100">{item.title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">{item.subtitle}</p>
    </motion.article>
  );
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [loading, setLoading] = useState(true);
  const [navSolid, setNavSolid] = useState(false);

  const rotatorWord = useWordRotate(["innovative", "efficient", "future-ready", "precision-focused"]);

  const { scrollYProgress, scrollY } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 100, damping: 25, mass: 0.15 });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 140, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 140, damping: 18, mass: 0.4 });

  const blobX = useTransform(scrollY, [0, 1600], [0, -120]);
  const blobY = useTransform(scrollY, [0, 1600], [0, 130]);

  const cursorSize = useMotionValue(14);
  const cursorMix = useMotionTemplate`translate(${x}px, ${y}px)`;

  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 24);
    const onMove = event => {
      mx.set(event.clientX - 8);
      my.set(event.clientY - 8);
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, [mx, my]);

  return (
    <div className="noise-bg relative overflow-x-clip bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-800 dark:from-ink-900 dark:via-[#0f172a] dark:to-[#101d31] dark:text-slate-200">
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950 text-slate-100"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45 } }}
          >
            <motion.div
              className="h-12 w-12 rounded-full border-2 border-cyanx-400 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="pointer-events-none fixed left-0 top-0 z-[60] h-1 w-full origin-left bg-gradient-to-r from-cyanx-500 to-bluex-500" style={{ scaleX: progressScale }} />

      <motion.div
        className="pointer-events-none fixed z-[65] hidden h-4 w-4 rounded-full bg-cyanx-400/80 blur-[1px] md:block"
        style={{ transform: cursorMix, width: cursorSize, height: cursorSize }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        onMouseDown={() => cursorSize.set(20)}
        onMouseUp={() => cursorSize.set(14)}
      />

      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${navSolid ? "bg-white/70 shadow-soft backdrop-blur-xl dark:bg-ink-900/70" : "bg-transparent"}`}>
        <div className="mx-auto flex h-16 w-[min(1120px,calc(100%-1.25rem))] items-center justify-between">
          <a href="#top" className="rounded-full border border-slate-300/80 bg-white/80 px-3 py-1 text-sm font-semibold tracking-[0.16em] shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
            NVS
          </a>
          <nav className="hidden gap-6 text-sm text-slate-600 dark:text-slate-300 md:flex">
            {navItems.map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-slate-900 dark:hover:text-white">
                {item}
              </a>
            ))}
          </nav>
          <button
            onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
            className="rounded-full border border-slate-300 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] shadow-sm transition hover:scale-[1.03] dark:border-slate-700 dark:bg-slate-900/80"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <motion.div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyanx-500/30 blur-[80px]" animate={{ x: [0, 28, 0], y: [0, -24, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="pointer-events-none absolute right-[-90px] top-[36rem] h-80 w-80 rounded-full bg-bluex-500/30 blur-[88px]" style={{ x: blobX, y: blobY }} />

      <main id="top" className="relative z-10 pt-20">
        <section className="wave-divider mx-auto min-h-[88vh] w-[min(1120px,calc(100%-1.25rem))] pt-16">
          <motion.div
            className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]"
            variants={sectionVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVariants}>
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-cyanx-600 dark:text-cyanx-400">Mechanical Engineering Portfolio</p>
              <h1 className="mask-reveal text-4xl font-extrabold leading-tight text-ink-900 dark:text-slate-50 md:text-6xl">
                <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                  Nithila Varshni S
                </motion.span>
              </h1>
              <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">Mechanical Engineer | Product Design Enthusiast</p>
              <p className="mt-5 max-w-2xl text-slate-600 dark:text-slate-300">
                Passionate about designing <span className="font-semibold text-cyanx-600 dark:text-cyanx-400">{rotatorWord}</span> mechanical solutions with strong CAD expertise.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <MagneticButton href="#projects" className="bg-gradient-to-r from-cyanx-600 to-bluex-500 text-white shadow-soft">
                  View Projects
                </MagneticButton>
                <MagneticButton href="#contact" className="glass border border-slate-300/70 text-slate-800 shadow-sm dark:border-slate-700 dark:text-slate-100">
                  Contact Me
                </MagneticButton>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "Certified",
                  "India Semi-Finalist",
                  "Design Thinker"
                ].map(badge => (
                  <span key={badge} className="rounded-full border border-cyanx-500/45 bg-white/75 px-3 py-1 text-xs font-medium text-cyanx-700 dark:bg-slate-900/70 dark:text-cyanx-300">
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass relative rounded-3xl border border-white/40 p-6 shadow-soft dark:border-slate-700/60">
              <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-cyanx-400/70 animate-pulseRing" />
              <h2 className="text-lg font-semibold">Design Hooks</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li>Product Design</li>
                <li>CAD Expertise</li>
                <li>Innovation-centric execution</li>
              </ul>
              <motion.div
                className="absolute -bottom-5 left-10 h-24 w-24 rounded-2xl bg-gradient-to-r from-cyanx-500/35 to-bluex-500/35 blur-[1px]"
                animate={{ rotate: [0, 16, 0], y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </section>

        <Section id="about" title="About" subtitle="Designing practical mechanical systems with technical depth and user-centric thinking.">
          <div className="glass grid gap-7 rounded-3xl border border-white/60 p-6 shadow-soft md:grid-cols-[210px_1fr] dark:border-slate-700/70">
            <motion.div whileHover={{ scale: 1.04 }} className="mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-cyanx-200 to-bluex-200 text-2xl font-bold text-slate-700 dark:from-cyanx-900/70 dark:to-bluex-900/60 dark:text-slate-100">
              NVS
            </motion.div>
            <div>
              <p className="text-slate-700 dark:text-slate-300">
                Mechanical engineering student passionate about <span className="font-semibold text-cyanx-700 dark:text-cyanx-400">Product Design</span>, skilled in CAD software such as SolidWorks, and eager to learn and explore innovative design solutions.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Product Design", "CAD Expertise", "Innovation"].map(tag => (
                  <span key={tag} className="rounded-full border border-slate-300 bg-white/70 px-3 py-1 text-sm dark:border-slate-600 dark:bg-slate-900/70">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section id="skills" title="Skills" subtitle="Interactive capabilities overview with engineering-focused toolchain.">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {skillGroups.map(group => (
              <motion.article
                key={group.title}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group glass rounded-2xl border border-slate-200 p-5 shadow-soft transition dark:border-slate-700"
              >
                <motion.div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cyanx-500/45 text-cyanx-700 dark:text-cyanx-300" whileHover={{ rotate: 12, scale: 1.1 }}>
                  {group.icon}
                </motion.div>
                <h3 className="font-semibold">{group.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{group.items.join(" • ")}</p>
                <div className="mt-4 h-1 w-0 rounded-full bg-gradient-to-r from-cyanx-500 to-bluex-500 transition-all duration-300 group-hover:w-full" />
              </motion.article>
            ))}
          </motion.div>
        </Section>

        <Section id="projects" title="Projects" subtitle="Selected engineering and product-led builds.">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <TiltProjectCard key={project} title={project} />
            ))}
          </motion.div>
        </Section>

        <Section id="experience" title="Experience" subtitle="Industrial exposure in design and manufacturing.">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid gap-4 md:grid-cols-2">
            <ExposureCard initials="DS" title="Dassault Systèmes" details="Product Design & CAD Exposure" />
            <ExposureCard initials="TC" title="TANCAM" details="Manufacturing processes & industrial practices" />
          </motion.div>
        </Section>

        <Section id="achievements" title="Achievements" subtitle="Recognitions across innovation competitions.">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="grid gap-4 md:grid-cols-3">
            {achievements.map(item => (
              <CounterCard key={item.title} item={item} />
            ))}
          </motion.div>
        </Section>

        <Section id="contact" title="Contact" subtitle="Open to collaboration and engineering opportunities.">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.22 }} className="grid gap-4 md:grid-cols-2">
            <motion.div variants={itemVariants} className="glass rounded-2xl border border-slate-200 p-6 shadow-soft dark:border-slate-700">
              <p className="mb-2 text-sm text-slate-500">Email</p>
              <a className="font-medium hover:text-cyanx-600" href="mailto:nithilavarshni2@gmail.com">
                nithilavarshni2@gmail.com
              </a>
              <p className="mb-2 mt-5 text-sm text-slate-500">Phone</p>
              <a className="font-medium hover:text-cyanx-600" href="tel:+917305150133">
                7305150133
              </a>
              <p className="mb-2 mt-5 text-sm text-slate-500">LinkedIn</p>
              <a className="font-medium hover:text-cyanx-600" href="https://linkedin.com/in/nithila-varshni" target="_blank" rel="noreferrer">
                linkedin.com/in/nithila-varshni
              </a>
            </motion.div>

            <motion.form variants={itemVariants} className="glass rounded-2xl border border-slate-200 p-6 shadow-soft dark:border-slate-700" onSubmit={event => event.preventDefault()}>
              <label className="mb-1 block text-sm text-slate-500">Name</label>
              <input className="mb-3 w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2 outline-none transition focus:border-cyanx-500 focus:ring-2 focus:ring-cyanx-400/40 dark:border-slate-600 dark:bg-slate-950/70" type="text" placeholder="Your name" />
              <label className="mb-1 block text-sm text-slate-500">Email</label>
              <input className="mb-3 w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2 outline-none transition focus:border-cyanx-500 focus:ring-2 focus:ring-cyanx-400/40 dark:border-slate-600 dark:bg-slate-950/70" type="email" placeholder="Your email" />
              <label className="mb-1 block text-sm text-slate-500">Message</label>
              <textarea className="mb-4 w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2 outline-none transition focus:border-cyanx-500 focus:ring-2 focus:ring-cyanx-400/40 dark:border-slate-600 dark:bg-slate-950/70" rows="4" placeholder="Your message" />
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }} className="w-full rounded-xl bg-gradient-to-r from-cyanx-600 to-bluex-500 px-4 py-3 font-semibold text-white shadow-soft">
                Send Message
              </motion.button>
            </motion.form>
          </motion.div>
        </Section>
      </main>

      <footer className="mt-14 border-t border-slate-200/70 py-8 text-center text-sm text-slate-500 dark:border-slate-700">
        © {year} Nithila Varshni S. Engineered for clarity and innovation.
      </footer>
    </div>
  );
}

function Section({ id, title, subtitle, children }) {
  return (
    <motion.section
      id={id}
      className="mx-auto w-[min(1120px,calc(100%-1.25rem))] py-14"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-3xl font-bold text-ink-900 dark:text-white">{title}</h2>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">{subtitle}</p>
      </motion.div>
      {children}
    </motion.section>
  );
}

function ExposureCard({ initials, title, details }) {
  return (
    <motion.article variants={itemVariants} whileHover={{ y: -5 }} className="glass flex items-center gap-4 rounded-2xl border border-slate-200 p-5 shadow-soft dark:border-slate-700">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyanx-500/35 to-bluex-500/35 font-semibold text-cyanx-700 dark:text-cyanx-300">
        {initials}
      </div>
      <div>
        <h3 className="font-semibold text-ink-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">{details}</p>
      </div>
    </motion.article>
  );
}

function TiltProjectCard({ title }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const onMove = event => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    setRotation({ x: (py - 0.5) * -8, y: (px - 0.5) * 8 });
  };

  const onLeave = () => setRotation({ x: 0, y: 0 });

  return (
    <motion.article
      variants={itemVariants}
      className="group glass relative overflow-hidden rounded-2xl border border-slate-200 p-5 shadow-soft dark:border-slate-700"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{ rotateX: rotation.x, rotateY: rotation.y, scale: 1 }}
      whileHover={{ scale: 1.015 }}
      style={{ transformStyle: "preserve-3d" }}
      transition={{ type: "spring", stiffness: 120, damping: 14, mass: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-ink-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Concept and implementation details available. Built with strong engineering focus and practical design thinking.
      </p>
      <motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cyanx-600/20 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      <a href="#contact" className="mt-5 inline-flex rounded-lg border border-cyanx-500/40 px-3 py-2 text-sm font-medium text-cyanx-700 transition hover:bg-cyanx-500 hover:text-white dark:text-cyanx-300">
        View Project
      </a>
    </motion.article>
  );
}

export default App;
