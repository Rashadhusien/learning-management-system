"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { Session } from "next-auth";
import { splitText } from "@/hooks/use-split-text";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const perks = [
  "No credit card required",
  "Free trial available",
  "Cancel anytime",
];

const CTA = ({ session }: { session: Session | null }) => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      // Card rises
      tl.from(".cta-card", {
        opacity: 0,
        scale: 0.96,
        y: 24,
        duration: 0.65,
      }).from(".cta-badge", { opacity: 0, y: -12, duration: 0.4 }, "-=0.3");

      // ── Split text reveal ──────────────────────────────────────────────
      const titleEl =
        sectionRef.current?.querySelector<HTMLElement>(".cta-title");
      const descEl =
        sectionRef.current?.querySelector<HTMLElement>(".cta-desc");

      if (titleEl) {
        const { inners } = splitText(titleEl, "lines");
        tl.from(
          inners,
          {
            yPercent: 110,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.1",
        );
      }

      if (descEl) {
        const { inners } = splitText(descEl, "words");
        tl.from(
          inners,
          {
            yPercent: 100,
            opacity: 0,
            duration: 0.5,
            stagger: 0.03,
            ease: "power2.out",
          },
          "-=0.5",
        );
      }
      // Card scales up first — feels like it rises from the page
      tl.from(".cta-btns", { opacity: 0, y: 14, duration: 0.4 }, "-=0.25")
        // Divider draws from left
        .from(
          ".cta-divider",
          { scaleX: 0, duration: 0.5, transformOrigin: "left center" },
          "-=0.1",
        )
        .from(".cta-perks", { opacity: 0, y: 10, duration: 0.4 }, "-=0.3");

      // Green perk dots pop in individually
      gsap.utils.toArray<HTMLElement>(".cta-dot").forEach((dot, i) => {
        gsap.from(dot, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: "back.out(3)",
          delay: 0.9 + i * 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        });
      });

      // Primary button breathes to draw attention
      gsap.to(".cta-primary-btn", {
        scale: 1.02,
        duration: 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.5,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="cta-card relative max-w-4xl mx-auto bg-background border border-border/60 rounded-2xl overflow-hidden">
          {/* Subtle dot-grid background */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center gap-6 px-10 py-14">
            {/* Badge */}
            <Badge variant="outline" className="cta-badge gap-1.5">
              <Zap className="w-3 h-3" />
              Get started today
            </Badge>

            {/* Title */}
            <h2 className="cta-title text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl">
              Ready to start your{" "}
              <span className=" font-space-grotesk text-muted-foreground ">
                learning journey?
              </span>
            </h2>

            {/* Description */}
            <p className="cta-desc text-lg text-muted-foreground leading-relaxed max-w-sm">
              Join thousands of students who are already building their future
              with our platform.
            </p>

            {/* Buttons */}
            <div className="cta-btns flex flex-col sm:flex-row gap-3">
              {session ? (
                <>
                  <Button
                    size="lg"
                    className="cta-primary-btn px-8 group"
                    asChild
                  >
                    <Link href={ROUTES.COURSES}>
                      Browse Courses
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="px-8" asChild>
                    <Link href={ROUTES.PROFILE}>Go to Profile</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="cta-primary-btn px-8 group"
                    asChild
                  >
                    <Link href={ROUTES.REGISTER}>
                      Sign up free
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="px-8" asChild>
                    <Link href={ROUTES.COURSES}>View Courses</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="cta-divider w-full h-px bg-border/50" />

            {/* Perks */}
            <div className="cta-perks flex flex-wrap justify-center gap-5">
              {perks.map((perk) => (
                <div key={perk} className="flex items-center gap-2">
                  <div className="cta-dot w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  <span className="text-xs text-muted-foreground">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
