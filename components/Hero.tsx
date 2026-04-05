"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Trophy,
  Code,
  Sparkles,
  Users,
  Target,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitText } from "@/hooks/use-split-text";
gsap.registerPlugin(useGSAP, ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Single timeline — clean, sequenced, readable
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", clearProps: "all" },
      });

      tl.from(".hero-badge", { opacity: 0, y: -20, duration: 0.6 });

      const descEl =
        heroRef.current?.querySelector<HTMLElement>(".hero-description");

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
    { scope: heroRef },
  ); // ← scoped, no global selector leaks

  return (
    <section
      ref={heroRef}
      className=" text-center h-[calc(100vh-80px)] flex justify-center items-center bg-background pt-10 px-4 sm:px-6 lg:px-8"
    >
      {/* Left Content */}
      <div className="space-y-8 text-center flex justify-center items-center ">
        <div className="space-y-6">
          <Badge
            variant="outline"
            className="hero-badge w-fit mb-4 bg-primary/10 text-primary border-primary/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            New Learning Experience
          </Badge>

          <h1 className=" text-4xl sm:text-7xl lg:text-8xl xl:text-9xl  font-black tracking-tight text-foreground leading-tight mb-4">
            Learn, Build,{" "}
            <span className="relative">
              <span className="text-primary relative z-10">Achieve</span>
              <span className="absolute inset-0 bg-primary/20 blur-md -z-10"></span>
            </span>
          </h1>

          <p className="hero-description text-sm sm:text-lg text-muted-foreground max-w-[600px] text-center mx-auto leading-relaxed mb-8">
            Welcome to Cody platform built exclusively for enrolled students to
            access their courses, track progress easily, and showcase practical
            work through real portfolio projects.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {[
              { icon: Target, text: "Skill-Based Learning" },
              { icon: Users, text: "Community Driven" },
              { icon: Trophy, text: "Achievement System" },
              { icon: Code, text: "Real Projects" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border/50"
              >
                <feature.icon className="size-3 sm:size-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button
                size="lg"
                className="hero-primary-btn w-48 sm:w-auto group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Explore Courses
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-primary/20 blur-md -z-10"></div>
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="hero-secondary-btn w-48 sm:w-auto group hover:border-primary hover:text-primary transition-all duration-300"
              >
                Get Started
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
