"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe, Users, BookOpen, Award } from "lucide-react";
import SectionTitle from "../SectionTitle";
import SectionTitleMarker from "../SectionTitleMarker";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stats = [
  { icon: Globe, value: 50, suffix: "+", label: "Countries", locale: false },
  {
    icon: Users,
    value: 1000,
    suffix: "+",
    label: "Active Students",
    locale: true,
  },
  {
    icon: BookOpen,
    value: 50,
    suffix: "+",
    label: "Expert Courses",
    locale: false,
  },
  {
    icon: Award,
    value: 500,
    suffix: "+",
    label: "Certificates Issued",
    locale: false,
  },
];

// Approximate lat/lng → percentage positions on a flat map
const pings = [
  { left: "22%", top: "48%" }, // Americas
  { left: "48%", top: "38%" }, // Europe
  { left: "62%", top: "42%" }, // Middle East
  { left: "75%", top: "52%" }, // East Asia
  { left: "35%", top: "55%" }, // Africa
  { left: "55%", top: "60%" }, // South Asia
];

const GlobalReach = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const st = {
        trigger: sectionRef.current,
        start: "top 85%",
        once: true,
      };

      const tl = gsap.timeline({
        scrollTrigger: st,
        defaults: { ease: "power3.out", clearProps: "all" },
      });

      // SectionTitle handles its own animations, so we only need to animate the content
      tl.from(".gr-stat", { opacity: 0, y: 20, duration: 0.45, stagger: 0.1 });

      // Icon pops
      gsap.utils.toArray<HTMLElement>(".gr-icon").forEach((icon, i) => {
        gsap.from(icon, {
          scale: 0.3,
          opacity: 0,
          duration: 0.35,
          ease: "back.out(2.2)",
          delay: 0.65 + i * 0.1,
          scrollTrigger: st,
        });
      });

      // Counters
      sectionRef.current
        ?.querySelectorAll<HTMLElement>(".gr-counter")
        .forEach((el) => {
          const target = parseInt(el.dataset.target ?? "0");
          const locale = el.dataset.locale === "true";
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.8,
            ease: "power2.out",
            delay: 0.5,
            scrollTrigger: st,
            onUpdate() {
              const v = Math.round(obj.v);
              el.textContent = locale ? v.toLocaleString() : String(v);
            },
          });
        });

      // Ping dots pop + rings expand infinitely
      sectionRef.current
        ?.querySelectorAll<HTMLElement>(".gr-ping")
        .forEach((wrap, i) => {
          const dot = wrap.querySelector<HTMLElement>(".gr-dot");
          const ring = wrap.querySelector<HTMLElement>(".gr-ring");

          if (dot)
            gsap.from(dot, {
              scale: 0,
              opacity: 0,
              duration: 0.3,
              ease: "back.out(3)",
              delay: 0.8 + i * 0.15,
              scrollTrigger: st,
            });

          if (ring)
            gsap.fromTo(
              ring,
              { scale: 1, opacity: 0.7 },
              {
                scale: 3.5,
                opacity: 0,
                duration: 1.8,
                ease: "power1.out",
                repeat: -1,
                delay: 1 + i * 0.3,
              },
            );
        });

      // Hover: value pulse
      gsap.utils.toArray<HTMLElement>(".gr-stat").forEach((stat) => {
        const val = stat.querySelector<HTMLElement>(".gr-val");
        if (!val) return;
        stat.addEventListener("mouseenter", () =>
          gsap.to(val, { scale: 1.06, duration: 0.2, ease: "power2.out" }),
        );
        stat.addEventListener("mouseleave", () =>
          gsap.to(val, { scale: 1, duration: 0.2, ease: "power2.inOut" }),
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle
          badge="Global Impact"
          title={
            <>
              Learning without <SectionTitleMarker marker="boundaries" />
            </>
          }
          description="Join a global community of learners from around the world."
          badgeIcon={<Globe className="w-3 h-3" />}
        />

        {/* Map */}
        {/* <div className="gr-map relative max-w-2xl mx-auto mb-6 border border-border/50 rounded-xl bg-muted/30 overflow-hidden">
          <div className="p-8 relative">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, currentColor 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <svg
              viewBox="0 0 1000 500"
              className="w-full opacity-15"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M150,200 Q180,170 220,175 Q260,160 300,165 Q340,150 380,158 Q400,155 440,175 Q480,168 510,180 L520,210 Q540,205 570,218 L575,240 Q585,255 578,272 L565,288 Q558,305 545,318 L530,332 Q520,348 505,358 L488,370 Q474,385 458,392 L440,400 Q424,415 406,420 L388,425 Q370,438 350,440 L330,442 Q310,452 288,450 L265,448 Q242,458 218,453 L192,448 Q168,456 143,450 L118,444 Q94,452 70,445 L48,438 Q26,445 10,436 L5,420 Q-2,405 5,390 L12,375 Q5,358 18,344 L30,332 Q25,315 40,303 L55,293 Q52,276 68,266 L85,258 Q84,240 102,232 L122,225 Q123,208 142,202 Z" />
              <path d="M480,155 Q520,145 558,152 Q598,142 635,150 Q672,140 705,148 L710,165 Q728,162 745,172 L748,190 Q762,188 775,200 L776,218 Q784,216 792,228 L790,248 Q796,248 800,260 L796,278 Q800,282 796,295 L788,307 Q790,318 780,328 L768,336 Q765,350 752,357 L737,362 Q730,376 716,380 L700,382 Q690,396 675,398 L658,398 Q645,410 630,410 L615,408 Q600,420 583,418 L568,413 Q552,423 535,420 L520,413 Q504,422 488,418 L473,410 Q456,418 442,412 L428,402 Q413,408 400,400 L388,390 Q374,393 362,384 L350,373 Q336,374 325,364 L316,352 Q302,352 292,341 L285,328 Q273,326 265,314 L260,300 Q248,297 242,284 L238,270 Q228,266 223,252 L220,238 Q212,232 210,218 L211,204 Q203,198 205,184 L213,172 Q207,164 216,156 L228,150 Q226,142 238,138 L252,135 Q253,127 267,126 L282,127 Q285,119 300,120 L316,124 Q320,116 336,118 L352,124 Q358,116 373,120 L388,127 Q395,120 410,126 L423,135 Q431,130 445,137 L458,147 Q466,142 480,150 Z" />
              <path d="M720,130 Q760,120 800,127 Q840,118 876,125 Q910,118 940,125 L944,140 Q958,138 968,148 L966,165 Q975,166 980,178 L975,195 Q980,200 974,213 L963,222 Q964,236 952,243 L937,248 Q930,262 916,266 L900,268 Q890,282 875,285 L858,286 Q847,300 831,302 L814,302 Q802,315 785,317 L767,317 Q753,330 736,330 L718,328 Q702,340 685,340 L668,337 Q651,348 634,347 L617,343 Q600,353 583,352 L566,347 Q549,357 532,354 L518,349 Q502,358 487,354 L474,348 Q458,357 443,352 L430,345 Q416,353 401,347 L390,340 Q376,347 362,340 L352,332 Q340,338 327,330 L319,321 Q308,326 296,317 L290,307 Q280,311 270,301 L266,290 Q257,293 248,282 L245,271 Q237,273 230,262 L228,250 Q221,251 215,239 L215,227 Q209,228 205,215 L208,203 Q202,202 200,188 L205,177 Q200,173 207,162 L218,155 Q218,144 231,141 L246,140 Q250,129 265,129 L280,130 Q287,120 303,121 L320,124 Q328,115 345,117 L362,122 Q370,114 388,117 L405,124 Q414,117 430,121 L445,130 Q455,124 470,130 L482,142 Q492,137 508,144 L520,156 Q532,152 548,160 L558,172 Q572,170 585,180 L592,194 Q605,193 616,204 L620,220 Q632,220 641,232 L642,248 Q654,250 661,263 L659,278 Q668,282 673,295 L668,310 Q675,316 668,330 L655,340 Q657,353 642,360 L626,365 Q622,378 607,382 L590,385 Q583,398 568,400 L551,400 Q541,412 525,413 L509,411 Q497,422 480,422 L464,418 Q450,428 433,427 L417,422 Q402,430 386,428 L370,422 Q355,429 339,426 L324,420 Q310,426 295,422 L282,414 Q268,420 255,414 L244,405 Q232,410 221,402 L214,392 Q204,396 196,386 L192,374 Q184,377 178,366 L176,354 Q169,355 164,344 L164,332 Q158,332 155,320 L157,308 Q152,306 151,294 L155,282 Q151,278 153,266 L159,256 Q156,250 164,242 L173,235 Q173,226 183,221 L195,218 Q197,208 209,206 L224,206 Q228,196 241,196 L256,198 Q262,189 276,190 L291,194 Q299,185 313,188 L326,194 Q336,186 350,190 L362,198 Q373,191 387,196 L398,206 Q410,200 423,206 L432,218 Q445,214 456,222 L462,236 Q474,234 483,244 L486,258 Q498,258 504,270 L504,285 Q516,287 519,300 L516,314 Q526,319 526,333 L520,345 Q528,353 524,367 L515,378 Q521,388 514,400 L504,410 Q508,421 498,430 L487,438 Q489,449 477,456 L465,462 Q465,472 452,477 L440,480 Q438,490 424,493 L411,494 Q407,497 394,498 L381,498" />
            </svg>

            {pings.map(({ left, top }, i) => (
              <div
                key={i}
                className="gr-ping absolute"
                style={{ left, top, transform: "translate(-50%,-50%)" }}
              >
                <div className="gr-dot w-2 h-2 rounded-full bg-foreground relative z-10" />
                <div className="gr-ring absolute inset-0 rounded-full border border-foreground" />
              </div>
            ))}
          </div>
        </div> */}

        {/* Stats row */}
        <div className="max-w-5xl mx-auto border border-border/50 rounded-xl overflow-hidden bg-background">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map(({ icon: Icon, value, suffix, label, locale }, i) => (
              <div
                key={label}
                className={`gr-stat flex flex-col items-center py-6 px-4 cursor-default
                  ${i < stats.length - 1 ? "md:border-r border-border/40" : ""}
                  ${i < 2 ? "border-b md:border-b-0 border-border/40" : ""}
                `}
              >
                <div className="gr-icon w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-foreground" strokeWidth={1.6} />
                </div>
                <div className="gr-val flex items-baseline gap-0.5 mb-1">
                  <span
                    className="gr-counter font-space-grotesk text-3xl text-foreground"
                    data-target={value}
                    data-locale={locale}
                  >
                    0
                  </span>
                  <span className="font-space-grotesk text-lg text-muted-foreground">
                    {suffix}
                  </span>
                </div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalReach;
