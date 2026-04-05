"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../ui/button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { ArrowRight, Users } from "lucide-react";
import StudentCard from "../cards/StudentCard";
import { User } from "@/types/action";
import SectionTitle from "../SectionTitle";
import SectionTitleMarker from "../SectionTitleMarker";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const RecentStudent = ({ students }: { students: User[] }) => {
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

      // Header cascade
      tl.from(
        ".rs-card",
        {
          opacity: 0,
          y: 32,
          scale: 0.97,
          duration: 0.5,
          stagger: { amount: 0.45, from: "start" },
        },
        "-=0.2",
      ).from(".rs-btn", { opacity: 0, y: 12, duration: 0.4 }, "-=0.15");

      // Avatar pop — runs in parallel after cards land
      gsap.utils.toArray<HTMLElement>(".rs-avatar").forEach((av, i) => {
        gsap.from(av, {
          scale: 0.4,
          opacity: 0,
          duration: 0.35,
          ease: "back.out(2)",
          delay: 0.55 + i * 0.07,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      // Hover: lift + shimmer sweep
      gsap.utils.toArray<HTMLElement>(".rs-card").forEach((card) => {
        const shimmer = card.querySelector<HTMLElement>(".rs-shimmer");

        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -5, duration: 0.25, ease: "power2.out" });
          if (shimmer) {
            gsap.fromTo(
              shimmer,
              { x: "-100%" },
              { x: "200%", duration: 0.55, ease: "power1.inOut" },
            );
          }
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, duration: 0.25, ease: "power2.inOut" });
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionTitle
          badge="Community"
          title={
            <>
              Join our <SectionTitleMarker marker="learning" /> community
            </>
          }
          description="Meet some of our recent students who are on their learning journey."
          badgeIcon={<Users className="w-3 h-3" />}
        />

        {/* Student grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {students?.map((student) => (
            <div key={student.id} className="rs-card">
              <StudentCard student={student} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          variant="outline"
          className="rs-btn w-full max-w-sm mx-auto flex items-center group"
          asChild
        >
          <Link href={ROUTES.STUDENTS}>
            View all students
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default RecentStudent;
