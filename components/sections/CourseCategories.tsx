"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Globe,
  Smartphone,
  BarChart2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import SectionTitle from "../SectionTitle";
import SectionTitleMarker from "../SectionTitleMarker";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const categories = [
  {
    name: "Web Development",
    icon: Globe,
    courses: 12,
    color: "blue" as const,
  },
  {
    name: "Mobile Development",
    icon: Smartphone,
    courses: 8,
    color: "green" as const,
  },
  {
    name: "Data Science",
    icon: BarChart2,
    courses: 10,
    color: "purple" as const,
  },
  {
    name: "UI/UX Design",
    icon: Sparkles,
    courses: 6,
    color: "pink" as const,
  },
];

// Subtle bg tint per category shown on hover
const colorTints: Record<string, string> = {
  blue: "group-hover:bg-blue-500/5",
  green: "group-hover:bg-green-500/5",
  purple: "group-hover:bg-purple-500/5",
  pink: "group-hover:bg-pink-500/5",
};

const CourseCategories = () => {
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

      // SectionTitle handles its own animations, so we only need to animate the content
      tl.from(".cc-card", {
        opacity: 0,
        y: 36,
        scale: 0.96,
        duration: 0.5,
        stagger: 0.09,
      });

      // Icon rings pop after cards land
      gsap.utils.toArray<HTMLElement>(".cc-icon").forEach((icon, i) => {
        gsap.from(icon, {
          scale: 0.3,
          opacity: 0,
          duration: 0.38,
          ease: "back.out(2.2)",
          delay: 0.5 + i * 0.09,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      // Hover: lift + icon scale + arrow fade
      gsap.utils.toArray<HTMLElement>(".cc-card").forEach((card) => {
        const icon = card.querySelector<HTMLElement>(".cc-icon");
        const arrow = card.querySelector<HTMLElement>(".cc-arrow");

        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -6, duration: 0.25, ease: "power2.out" });
          gsap.to(icon, { scale: 1.12, duration: 0.25, ease: "back.out(1.7)" });
          gsap.to(arrow, { opacity: 1, duration: 0.2 });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, duration: 0.25, ease: "power2.inOut" });
          gsap.to(icon, { scale: 1, duration: 0.2 });
          gsap.to(arrow, { opacity: 0, duration: 0.15 });
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle
          badge="Categories"
          title={
            <>
              Explore our <SectionTitleMarker marker="Course" /> categories
            </>
          }
          description="Choose from a wide range of categories designed to help you achieve your learning goals."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map(({ name, icon: Icon, courses, color }) => (
            <div
              key={name}
              className={`
                cc-card group relative overflow-hidden
                flex flex-col items-center gap-4 py-8 px-5
                bg-background border border-border/50 rounded-xl
                cursor-pointer transition-colors duration-300
                ${colorTints[color]}
              `}
            >
              {/* Icon ring */}
              <div className="cc-icon w-14 h-14 rounded-full border border-border/50 bg-muted/40 flex items-center justify-center">
                <Icon className="w-5 h-5 text-foreground" strokeWidth={1.6} />
              </div>

              {/* Text */}
              <div className="text-center">
                <div className="text-sm font-medium text-foreground mb-1">
                  {name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {courses} courses
                </div>
              </div>

              {/* Arrow — hidden, fades in on hover via GSAP */}
              <div className="cc-arrow opacity-0 absolute bottom-3 right-3">
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseCategories;
