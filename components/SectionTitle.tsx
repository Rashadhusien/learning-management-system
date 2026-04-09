"use client";

import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitText } from "@/hooks/use-split-text";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SectionTitle = ({
  badge,
  title,
  description,
  badgeIcon,
}: {
  badge: string;
  title: React.ReactNode;
  description: string;
  badgeIcon?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      // ── 1. Split DOM first, before any GSAP timeline is created ──
      //    This way the layout mutation happens before ScrollTrigger
      //    measures anything, and tweens get correct start times.
      const titleEl = ref.current.querySelector<HTMLElement>(".st-title");
      const descEl = ref.current.querySelector<HTMLElement>(".st-desc");

      const titleInners = titleEl ? splitText(titleEl, "lines").inners : [];
      const descInners = descEl ? splitText(descEl, "words").inners : [];

      // ── 2. Set initial states immediately after split ──
      //    Prevents flash of unstyled content on fast scrolls
      gsap.set(".st-badge", { opacity: 0, y: -14 });
      if (titleInners.length) gsap.set(titleInners, { yPercent: 110 });
      if (descInners.length)
        gsap.set(descInners, { yPercent: 100, opacity: 0 });

      // ── 3. Now build the timeline — DOM is stable, no more mutations ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 70%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      tl.to(".st-badge", { opacity: 1, y: 0, duration: 0.45 });

      if (titleInners.length) {
        tl.to(
          titleInners,
          {
            yPercent: 0,
            duration: 0.85,
            stagger: 0.12,
          },
          "-=0.2",
        );
      }

      if (descInners.length) {
        tl.to(
          descInners,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.03,
          },
          "-=0.4",
        );
      }
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="text-center mb-14">
      <Badge variant="outline" className="st-badge mb-4 gap-1.5">
        {badgeIcon ? badgeIcon : <LayoutGrid />}
        {badge}
      </Badge>
      <h2 className="st-title text-3xl sm:text-4xl   font-bold mb-3 tracking-wide">
        {title}
      </h2>
      <p className="st-desc text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default SectionTitle;
