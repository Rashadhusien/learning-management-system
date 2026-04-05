"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, TrendingUp, Shield, ArrowRight, Route } from "lucide-react";
import { Button } from "../ui/button";
import SectionTitle from "../SectionTitle";
import SectionTitleMarker from "../SectionTitleMarker";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const paths = [
  {
    level: "Beginner",
    levelClass: "text-green-600 border-green-600 bg-green-500/8",
    icon: Zap,
    iconClass: "text-green-600",
    name: "Quick Start Path",
    desc: "Perfect for beginners looking to get started with web development fundamentals.",
    progress: 30,
    progressClass: "bg-green-500",
    steps: [
      "HTML & CSS Basics",
      "JavaScript Fundamentals",
      "React Introduction",
    ],
    cta: "Start learning",
  },
  {
    level: "Intermediate",
    levelClass: "text-blue-600 border-blue-600 bg-blue-500/8",
    icon: TrendingUp,
    iconClass: "text-blue-600",
    name: "Professional Path",
    desc: "Advance your skills with comprehensive full-stack development training.",
    progress: 55,
    progressClass: "bg-blue-500",
    steps: [
      "Advanced React",
      "Node.js & Express",
      "Database Design",
      "Deployment",
    ],
    cta: "Continue learning",
  },
  {
    level: "Advanced",
    levelClass: "text-purple-600 border-purple-600 bg-purple-500/8",
    icon: Shield,
    iconClass: "text-purple-600",
    name: "Expert Path",
    desc: "Master advanced concepts and become an expert in your field.",
    progress: 85,
    progressClass: "bg-purple-500",
    steps: [
      "System Architecture",
      "Performance Optimization",
      "Security Best Practices",
      "Team Leadership",
    ],
    cta: "Expert level",
  },
];

const LearningPath = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
        defaults: { ease: "power3.out", clearProps: "all" },
      });

      tl.from(
        ".lp-card",
        {
          opacity: 0,
          y: 40,
          scale: 0.97,
          duration: 0.55,
          stagger: 0.12,
        },
        "-=0.2",
      );

      // Icon pop
      gsap.utils.toArray<HTMLElement>(".lp-icon").forEach((icon, i) => {
        gsap.from(icon, {
          scale: 0.3,
          opacity: 0,
          duration: 0.38,
          ease: "back.out(2.2)",
          delay: 0.5 + i * 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      // Progress bars fill in
      gsap.utils.toArray<HTMLElement>(".lp-progress-fill").forEach((bar, i) => {
        gsap.to(bar, {
          width: bar.dataset.width + "%",
          duration: 1.2,
          ease: "power2.out",
          delay: 0.6 + i * 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      // Steps stagger per card
      gsap.utils.toArray<HTMLElement>(".lp-card").forEach((card, ci) => {
        gsap.from(card.querySelectorAll(".lp-step"), {
          opacity: 0,
          x: -10,
          duration: 0.3,
          stagger: 0.07,
          ease: "power2.out",
          clearProps: "all",
          delay: 0.55 + ci * 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      // Hover: lift + icon scale + check reveal
      gsap.utils.toArray<HTMLElement>(".lp-card").forEach((card) => {
        const checks = card.querySelectorAll<HTMLElement>(".lp-check");
        const icon = card.querySelector<HTMLElement>(".lp-icon");

        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -6, duration: 0.25, ease: "power2.out" });
          gsap.to(icon, { scale: 1.1, duration: 0.22, ease: "back.out(1.7)" });
          gsap.to(checks, { opacity: 1, duration: 0.2, stagger: 0.05 });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, duration: 0.25, ease: "power2.inOut" });
          gsap.to(icon, { scale: 1, duration: 0.2 });
          gsap.to(checks, { opacity: 0, duration: 0.15 });
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionTitle
          badgeIcon={<Route className="w-3 h-3" />}
          badge="Learning Paths"
          title={
            <>
              Your
              <SectionTitleMarker marker="structured" />
              learning journey
            </>
          }
          description="Follow our carefully crafted learning paths to master new skills step by step."
        />

        <div className="grid md:grid-cols-3 gap-3">
          {paths.map(
            ({
              level,
              levelClass,
              icon: Icon,
              iconClass,
              name,
              desc,
              progress,
              progressClass,
              steps,
              cta,
            }) => (
              <div
                key={level}
                className="lp-card flex flex-col bg-background border border-border/50 rounded-xl overflow-hidden"
              >
                {/* Card top */}
                <div className="p-5 border-b border-border/50 flex flex-col gap-3">
                  <span
                    className={`self-start text-[10px] uppercase tracking-widest font-medium px-2.5 py-1 rounded-full border ${levelClass}`}
                  >
                    {level}
                  </span>

                  <div className="flex items-center gap-2.5">
                    <div className="lp-icon w-9 h-9 rounded-lg border border-border/50 bg-muted/40 flex items-center justify-center">
                      <Icon
                        className={`w-4 h-4 ${iconClass}`}
                        strokeWidth={1.8}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {name}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>

                  {/* Progress bar */}
                  <div className="h-[2px] bg-border/50 rounded-full overflow-hidden">
                    <div
                      className={`lp-progress-fill h-full rounded-full ${progressClass}`}
                      style={{ width: 0 }}
                      data-width={progress}
                    />
                  </div>
                </div>

                {/* Steps */}
                <div className="flex flex-col flex-1 divide-y divide-border/40">
                  {steps.map((step, i) => (
                    <div
                      key={step}
                      className="lp-step flex items-center gap-3 px-5 py-3"
                    >
                      <span className="font-serif text-base text-muted-foreground/40 min-w-[18px]">
                        {i + 1}
                      </span>
                      <span className="text-sm text-foreground flex-1">
                        {step}
                      </span>
                      {/* Check — hidden, reveals on hover */}
                      <div className={`lp-check opacity-0 ${iconClass}`}>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer button */}
                <div className="p-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    className="w-full group text-sm"
                    size="sm"
                  >
                    {cta}
                    <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default LearningPath;
