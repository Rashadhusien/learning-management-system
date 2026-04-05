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
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 70%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      // ✅ Badge animates first
      // tl.from(".st-badge", { opacity: 0, y: -14, duration: 0.45 });

      // ✅ Title split reveal
      const titleEl = ref.current?.querySelector<HTMLElement>(".st-title");
      if (titleEl) {
        const { inners } = splitText(titleEl, "lines");
        tl.from(
          inners,
          {
            yPercent: 110,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
            delay: 0.1,
          },
          "-=0.1",
        );
      }
      const descEl = ref.current?.querySelector<HTMLElement>(".st-desc");
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
            delay: 0.2,
          },
          "-=0.5",
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
      <h2 className="st-title text-4xl font-bold mb-3 tracking-tight">
        {title}
      </h2>
      <p className="st-desc text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default SectionTitle;
