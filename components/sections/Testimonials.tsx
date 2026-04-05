"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import SectionTitle from "../SectionTitle";
import SectionTitleMarker from "../SectionTitleMarker";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Frontend Developer",
    content:
      "This platform completely transformed my career. The structured learning paths and hands-on projects helped me land my dream job!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Full Stack Engineer",
    content:
      "The quality of courses and community support is outstanding. I went from zero to deploying production-ready applications in just 6 months.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "UI/UX Designer",
    content:
      "The portfolio projects I built here directly led to multiple job offers. The curriculum is practical and industry-relevant.",
    rating: 5,
  },
];

const Testimonials = () => {
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
        ".tm-card",
        {
          opacity: 0,
          y: 36,
          scale: 0.97,
          duration: 0.55,
          stagger: 0.12,
        },
        "-=0.2",
      );

      // Large quote marks drop in with elastic bounce
      gsap.utils.toArray<HTMLElement>(".tm-quote").forEach((q, i) => {
        gsap.from(q, {
          y: -20,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(1.5)",
          delay: 0.55 + i * 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        });
      });

      // Stars fill in one by one per card
      gsap.utils.toArray<HTMLElement>(".tm-card").forEach((card, ci) => {
        const stars = card.querySelectorAll<HTMLElement>(".tm-star");
        gsap.from(stars, {
          scale: 0,
          opacity: 0,
          duration: 0.25,
          stagger: 0.06,
          ease: "back.out(2)",
          delay: 0.65 + ci * 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        });
      });

      // Avatar pop
      gsap.utils.toArray<HTMLElement>(".tm-avatar").forEach((av, i) => {
        gsap.from(av, {
          scale: 0.3,
          opacity: 0,
          duration: 0.35,
          ease: "back.out(2)",
          delay: 0.8 + i * 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        });
      });

      // Hover: lift + shimmer sweep
      gsap.utils.toArray<HTMLElement>(".tm-card").forEach((card) => {
        const shimmer = card.querySelector<HTMLElement>(".tm-shimmer");

        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -5, duration: 0.25, ease: "power2.out" });
          if (shimmer)
            gsap.fromTo(
              shimmer,
              { x: "-100%" },
              { x: "200%", duration: 0.6, ease: "power1.inOut" },
            );
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, duration: 0.25, ease: "power2.inOut" });
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionTitle
          badgeIcon={<Star className="w-3 h-3 fill-current" />}
          badge="Success Stories"
          title={
            <>
              What our <SectionTitleMarker marker="Students " /> say
            </>
          }
          description="Join thousands of successful learners who transformed their careers with our platform."
        />

        <div className="grid md:grid-cols-3 gap-3">
          {testimonials.map(({ name, role, content, rating }) => {
            const initials = name
              .split(" ")
              .map((n) => n[0])
              .join("");
            return (
              <div
                key={name}
                className="tm-card relative overflow-hidden flex flex-col gap-4 p-5 bg-muted/40 border border-border/50 rounded-xl cursor-default"
              >
                {/* Shimmer overlay */}
                <div
                  className="tm-shimmer pointer-events-none absolute inset-0 -translate-x-full"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)",
                  }}
                />

                {/* Decorative quote mark */}
                <span className="tm-quote absolute top-3 right-4 font-serif text-[72px] leading-none text-border/60 select-none pointer-events-none">
                  &ldquo;
                </span>

                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: rating }).map((_, si) => (
                    <Star
                      key={si}
                      className="tm-star w-3.5 h-3.5 fill-yellow-500 stroke-yellow-500"
                      strokeWidth={1}
                    />
                  ))}
                </div>

                {/* Quote text */}
                <p className="font-serif italic text-sm text-foreground leading-relaxed flex-1">
                  {content}
                </p>

                {/* Author */}
                <div className="flex items-center gap-2.5 pt-3 border-t border-border/50">
                  <div className="tm-avatar w-9 h-9 rounded-full bg-background border border-border/60 flex items-center justify-center font-serif text-sm text-foreground shrink-0">
                    {initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {name}
                    </div>
                    <div className="text-xs text-muted-foreground">{role}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
