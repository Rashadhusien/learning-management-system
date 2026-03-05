"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { ArrowRight, Trophy, Code, BookOpen } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative text-center overflow-hidden bg-background py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="">
          {/* Left Content */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Learn, Build, Achieve your potential
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
                Welcome to Elzero platform built exclusively for enrolled
                students to access their courses, track progress easily, and
                showcase practical work through real portfolio projects.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 ">
              <Link href="/courses">
                <Button size="lg" className="group">
                  Explore Courses
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center space-y-2">
                    <Trophy className="h-8 w-8 text-primary" />
                    <div className="text-2xl font-bold">10070</div>
                    <div className="text-sm text-muted-foreground">
                      Points Earned
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center space-y-2">
                    <Code className="h-8 w-8 text-primary" />
                    <div className="text-2xl font-bold">26</div>
                    <div className="text-sm text-muted-foreground">
                      Projects Completed
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center space-y-2">
                    <Trophy className="h-8 w-8 text-primary" />
                    <div className="text-2xl font-bold">14</div>
                    <div className="text-sm text-muted-foreground">
                      Students
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center space-y-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-sm text-muted-foreground">Courses</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
