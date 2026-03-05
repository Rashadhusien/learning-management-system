import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLevelConfig } from "@/constants/colors";
import { ROUTES } from "@/constants/routes";
import { Course } from "@/types/action";
import Image from "next/image";
import Link from "next/link";

export default function CourseCard({ course }: { course: Course }) {
  const {
    id,
    title,
    description,

    bannerUrl,
    duration,
    level,
    categoryId,
    isDeleted,
    createdAt,
    updatedAt,
    instructorId,
    category,
  } = course;
  return (
    <Card className="group relative mx-auto w-full max-w-sm pt-0  transition-transform duration-300 hover:shadow-lg">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <div className="relative overflow-hidden">
        <Image
          src={bannerUrl}
          alt={title}
          className="relative z-20 aspect-video w-full object-cover group-hover:scale-110 transition-transform duration-300"
          width={500}
          height={500}
        />
      </div>
      <CardHeader className="flex-1">
        <CardAction className="flex gap-2">
          <span
            className={`text-sm text-muted-foreground px-2 py-1 rounded-full ${getLevelConfig(level).color}`}
          >
            {getLevelConfig(level).name}
          </span>
        </CardAction>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" asChild size={"lg"}>
          <Link href={ROUTES.COURSE_DETAIL(id)}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
