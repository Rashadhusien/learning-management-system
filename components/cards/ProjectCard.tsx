import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { Project } from "@/types/action";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";

export default function ProjectCard({ project }: { project: Project }) {
  const {
    id,
    title,
    description,

    imageCldPubId,
    points,
  } = project;
  return (
    <Card className="group relative mx-auto w-full max-w-sm pt-0  transition-transform duration-300 hover:shadow-lg hover:scale-105">
      <div className="relative overflow-hidden">
        <Image
          src={imageCldPubId}
          alt={title}
          className="relative z-20  aspect-video w-full h-36 object-contain "
          width={300}
          height={300}
        />
      </div>
      <CardHeader className="flex-1">
        <CardAction className="flex gap-2">
          <Badge variant="secondary">{points} Points</Badge>
        </CardAction>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" asChild size={"lg"}>
          <Link href={ROUTES.PROJECT_DETAILS(id)}>View Project</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
