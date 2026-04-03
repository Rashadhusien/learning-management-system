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

const Hero = () => {
  return (
    <section className="relative text-center overflow-hidden bg-background pt-10 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-20 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl translate-x-1/3"></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-2xl translate-y-1/3"></div>
      </div>

      <div className="relative mx-auto max-w-7xl z-10">
        <div className="flex justify-center items-center text-center">
          {/* Left Content */}
          <div className="space-y-8 text-center ">
            <div className="space-y-6">
              <Badge
                variant="outline"
                className="w-fit mb-4 bg-primary/10 text-primary border-primary/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                New Learning Experience
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-foreground leading-tight mb-4">
                Learn, Build,{" "}
                <span className="relative">
                  <span className="text-primary font-bold relative z-10">
                    Achieve
                  </span>
                  <span className="absolute inset-0 bg-primary/20 blur-md -z-10"></span>
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-[600px] text-center mx-auto leading-relaxed mb-8">
                Welcome to Cody platform built exclusively for enrolled students
                to access their courses, track progress easily, and showcase
                practical work through real portfolio projects.
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
                    <feature.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/courses">
                  <Button size="lg" className="group relative overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      Explore Courses
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-primary/20 blur-md -z-10"></div>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="outline"
                    size="lg"
                    className="group hover:border-primary hover:text-primary transition-all duration-300"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
