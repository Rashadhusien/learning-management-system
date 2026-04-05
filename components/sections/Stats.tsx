"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, BookOpen, TrendingUp, Clock } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stats = [
  {
    icon: Users,
    value: 1000,
    suffix: "+",
    label: "Active Students",
    format: "localeString",
  },
  {
    icon: BookOpen,
    value: 50,
    suffix: "+",
    label: "Expert Courses",
    format: "number",
  },
  {
    icon: TrendingUp,
    value: 95,
    suffix: "%",
    label: "Success Rate",
    format: "number",
  },
  { icon: Clock, value: null, display: "24/7", label: "Support Available" },
];

const Stats = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Items slide up staggered
      gsap.from(".stat-item", {
        opacity: 0,
        y: 24,
        duration: 0.55,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      // Icons pop in
      gsap.utils.toArray<HTMLElement>(".stat-icon").forEach((icon, i) => {
        gsap.from(icon, {
          scale: 0.3,
          opacity: 0,
          duration: 0.4,
          ease: "back.out(2)",
          delay: 0.15 + i * 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      // Counter animation for numeric stats
      document.querySelectorAll<HTMLElement>(".stat-counter").forEach((el) => {
        const target = parseInt(el.dataset.target ?? "0");
        const isLocale = el.dataset.format === "localeString";
        const obj = { v: 0 };

        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
          onUpdate() {
            const val = Math.round(obj.v);
            el.textContent = isLocale ? val.toLocaleString() : String(val);
          },
        });
      });

      // Hover: number pulse
      gsap.utils.toArray<HTMLElement>(".stat-item").forEach((item) => {
        const val = item.querySelector<HTMLElement>(".stat-value");
        if (!val) return;
        item.addEventListener("mouseenter", () =>
          gsap.to(val, { scale: 1.06, duration: 0.2, ease: "power2.out" }),
        );
        item.addEventListener("mouseleave", () =>
          gsap.to(val, { scale: 1, duration: 0.2, ease: "power2.inOut" }),
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-background border-y border-border/50"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 max-w-6xl mx-auto">
          {stats.map(
            ({ icon: Icon, value, suffix, label, display, format }, i) => (
              <div
                key={label}
                className={`stat-item flex flex-col items-center py-8 px-4 relative
                ${i < stats.length - 1 ? "md:border-r border-border/40" : ""}
                ${i < 2 ? "border-b md:border-b-0 border-border/40" : ""}
              `}
              >
                {/* Icon */}
                <div className="stat-icon mb-3 opacity-35">
                  <Icon className="w-7 h-7 text-foreground" strokeWidth={1.5} />
                </div>

                {/* Value */}
                <div className="stat-value flex items-baseline gap-0.5 mb-1">
                  {display ? (
                    <span className="font-space-grotesk text-4xl text-foreground tracking-tight">
                      {display}
                    </span>
                  ) : (
                    <>
                      <span
                        className="stat-counter font-space-grotesk text-4xl text-foreground tracking-tight"
                        data-target={value}
                        data-format={format}
                      >
                        0
                      </span>
                      <span className="font-space-grotesk text-2xl text-muted-foreground">
                        {suffix}
                      </span>
                    </>
                  )}
                </div>

                {/* Label */}
                <div className="text-xs text-muted-foreground tracking-widest uppercase">
                  {label}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default Stats;
