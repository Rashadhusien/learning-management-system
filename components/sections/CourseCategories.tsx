"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  BookOpen,
  Code,
  Palette,
  Database,
  Globe,
  Smartphone,
  BarChart3,
  Lightbulb,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";
import SectionTitle from "../SectionTitle";
import SectionTitleMarker from "../SectionTitleMarker";
import { Category } from "@/types/action";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Icon mapping for different category types
type IconComponent = React.ComponentType<{
  className?: string;
  strokeWidth?: number;
}>;
const iconMap: Record<string, IconComponent> = {
  web: Code,
  wordpress: Code,
  development: Code,
  design: Palette,
  mobile: Smartphone,
  data: Database,
  science: Lightbulb,
  business: BarChart3,
  marketing: Target,
  programming: Code,
  ui: Palette,
  ux: Palette,
  frontend: Globe,
  backend: Database,
  fullstack: Zap,
  default: BookOpen,
};

// Color palette for categories
const categoryColors = [
  "bg-blue-500/10 border-blue-200/50 text-blue-600 hover:bg-blue-500/20",
  "bg-green-500/10 border-green-200/50 text-green-600 hover:bg-green-500/20",
  "bg-purple-500/10 border-purple-200/50 text-purple-600 hover:bg-purple-500/20",
  "bg-pink-500/10 border-pink-200/50 text-pink-600 hover:bg-pink-500/20",
  "bg-orange-500/10 border-orange-200/50 text-orange-600 hover:bg-orange-500/20",
  "bg-teal-500/10 border-teal-200/50 text-teal-600 hover:bg-teal-500/20",
];

const CourseCategories = ({ categories }: { categories: Category[] }) => {
  const sectionRef = useRef<HTMLElement>(null);

  const getCategoryIcon = (categoryName: string, iconString?: string) => {
    if (iconString) {
      // Try to use the icon from database if available
      const iconKey = iconString.toLowerCase();
      if (iconMap[iconKey]) return iconMap[iconKey];
    }

    // Fallback to name-based mapping
    const name = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (name.includes(key)) return icon;
    }

    return iconMap.default;
  };

  const getCategoryColor = (index: number) => {
    return categoryColors[index % categoryColors.length];
  };

  useGSAP(
    () => {
      // Category cards entrance animation
      gsap.utils.toArray<HTMLElement>(".category-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power2.out",
          delay: i * 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            once: true,
          },
        });
      });

      // Icon entrance animation
      gsap.utils.toArray<HTMLElement>(".category-icon").forEach((icon, i) => {
        gsap.from(icon, {
          scale: 0,
          rotation: -180,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 0.3 + i * 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "bottom 15%",
            once: true,
          },
        });
      });

      // Enhanced hover interactions
      gsap.utils.toArray<HTMLElement>(".category-card").forEach((card) => {
        const icon = card.querySelector<HTMLElement>(".category-icon");
        const arrow = card.querySelector<HTMLElement>(".category-arrow");
        const bg = card.querySelector<HTMLElement>(".category-bg");

        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -8,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(icon, {
            scale: 1.1,
            rotation: 5,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
          gsap.to(arrow, {
            x: 5,
            opacity: 1,
            duration: 0.2,
          });
          if (bg) {
            gsap.to(bg, {
              scale: 1.1,
              opacity: 0.8,
              duration: 0.3,
            });
          }
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.inOut",
          });
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.2,
          });
          gsap.to(arrow, {
            x: 0,
            opacity: 0,
            duration: 0.15,
          });
          if (bg) {
            gsap.to(bg, {
              scale: 1,
              opacity: 0.5,
              duration: 0.3,
            });
          }
        });
      });
    },
    { scope: sectionRef },
  );

  if (!categories || categories.length === 0) {
    return (
      <section ref={sectionRef} className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <SectionTitle
            badge="Categories"
            title="Course Categories"
            description="No categories available at the moment."
          />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle
          badge="Categories"
          title={
            <>
              Explore our <SectionTitleMarker marker="Course" /> Categories
            </>
          }
          description="Choose from a wide range of categories designed to help you achieve your learning goals."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {categories.map((category, index) => {
            const categoryName = category.name
              .toLowerCase()
              .replace(/\s+/g, "");
            const Icon = getCategoryIcon(categoryName, category.icon);
            const colorClass = getCategoryColor(index);

            return (
              <Link
                key={category.id}
                href={`/courses?category=${category.id}`}
                className="category-card group block"
              >
                <div
                  className={`
                  relative overflow-hidden rounded-2xl border p-6
                  transition-all duration-300 ease-out
                  ${colorClass}
                  h-48 flex flex-col justify-between
                `}
                >
                  {/* Background decoration */}
                  <div className="category-bg absolute inset-0 opacity-50">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-current opacity-10 -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-current opacity-5 translate-y-12 -translate-x-12" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="category-icon w-12 h-12 rounded-xl bg-current/20 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" strokeWidth={2} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm opacity-80 line-clamp-3">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <div className="category-arrow opacity-0 absolute bottom-4 right-4 transition-all duration-200">
                    <ArrowUpRight className="w-5 h-5" strokeWidth={2} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CourseCategories;
