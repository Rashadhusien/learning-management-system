"use client";

import { splitText } from "@/hooks/use-split-text";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PageTitle = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const ref = useRef<HTMLDivElement>(null); // ✅ div, not HTMLElement

  useGSAP(
    () => {
      // ✅ timeline created inside useGSAP — DOM is ready, ref is attached
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current, // ✅ not null anymore
          start: "top 80%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      const titleEl = ref.current?.querySelector<HTMLElement>(".pt-title");
      const descEl = ref.current?.querySelector<HTMLElement>(".pt-desc");

      if (titleEl) {
        const { inners } = splitText(titleEl, "lines");
        tl.from(inners, {
          yPercent: 110,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
        });
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
    },
    { scope: ref },
  ); // ✅ scope attached

  return (
    <div ref={ref} className="text-center space-y-4 my-12">
      {" "}
      {/* ✅ ref attached */}
      <h1 className="pt-title text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="pt-desc text-xl text-muted-foreground max-w-[800px] mx-auto">
        {description}
      </p>
    </div>
  );
};

export default PageTitle;
