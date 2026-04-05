"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BookOpen,
  Users,
  Trophy,
  Target,
  Award,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import SectionTitle from "../SectionTitle";
import SectionTitleMarker from "../SectionTitleMarker";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".feat-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 40,
          duration: 0.4,
          ease: "back.out(1.7)",
          delay: i * 0.08,

          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 10%",
            once: true,
          },
        });
      });

      // Icon pop per card
      gsap.utils.toArray<HTMLElement>(".feat-icon").forEach((icon, i) => {
        gsap.from(icon, {
          scale: 0.5,
          opacity: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
          delay: i * 0.08,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 10%",
            once: true,
          },
        });
      });

      // Hover lift per card
      gsap.utils.toArray<HTMLElement>(".feat-card").forEach((card) => {
        card.addEventListener("mouseenter", () =>
          gsap.to(card, { y: -6, duration: 0.3, ease: "power2.out" }),
        );
        card.addEventListener("mouseleave", () =>
          gsap.to(card, { y: 0, duration: 0.3, ease: "power2.inOut" }),
        );
      });
    },
    { scope: sectionRef },
  );

  const features = [
    {
      icon: BookOpen,
      title: "Rich Course Content",
      desc: "Access comprehensive courses with video lessons, interactive quizzes, and hands-on projects.",
    },
    {
      icon: Users,
      title: "Community Learning",
      desc: "Connect with fellow learners, share insights, and collaborate on projects in our vibrant community.",
    },
    {
      icon: Trophy,
      title: "Achievements & Rewards",
      desc: "Earn badges, certificates, and recognition as you complete courses and reach milestones.",
    },
    {
      icon: Target,
      title: "Progress Tracking",
      desc: "Monitor your learning journey with detailed analytics and personalized recommendations.",
    },
    {
      icon: Award,
      title: "Portfolio Projects",
      desc: "Build real-world projects that showcase your skills to potential employers.",
    },
    {
      icon: TrendingUp,
      title: "Skill Development",
      desc: "Progress through skill levels from beginner to expert with structured learning paths.",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle
          badge="Features"
          title={
            <>
              Everything You Need to <SectionTitleMarker marker="Succeed" />
            </>
          }
          description="  Our comprehensive learning platform provides all the tools and
            resources you need to master new skills and advance your career."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card
              key={title}
              className="feat-card border-2 hover:border-primary transition-colors duration-300"
            >
              <CardHeader>
                <div className="feat-icon w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
