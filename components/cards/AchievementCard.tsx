import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Achievement } from "@/types/action";

import { Badge } from "../ui/badge";

import { Separator } from "../ui/separator";

import { Field, FieldLabel } from "@/components/ui/field";

import { Progress } from "@/components/ui/progress";
import CloudinaryImage from "../Image";

export default function AchievementCard({
  achievement,
}: {
  achievement: Achievement;
}) {
  const {
    title,

    description,
    progressPercent,
    totalStudents,
    earnedCount,

    imageCldPubId,

    requiredPoints,
  } = achievement;

  return (
    <Card className="group relative mx-auto w-full max-w-sm transition-transform duration-300 hover:shadow-lg hover:scale-105">
      <CardHeader className="text-center pb-3">
        <div className="flex justify-center mb-4">
          {imageCldPubId ? (
            <CloudinaryImage
              src={imageCldPubId}
              alt={title}
              className="h-20 w-20 rounded-lg border-4 border-background shadow-lg object-cover"
              width={80}
              height={80}
            />
          ) : (
            <div className="h-20 w-20 rounded-lg border-4 border-background shadow-lg bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <span className="text-3xl">🏆</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>

          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
            {description || "Complete this achievement to earn points!"}
          </CardDescription>
        </div>

        <div className="flex justify-center pt-2">
          <Badge variant="secondary" className="text-md w-full h-9">
            Earn {requiredPoints} points
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardFooter className="pt-0">
        <Field className="w-full max-w-sm">
          <FieldLabel htmlFor="progress-upload">
            <span>
              Student Earned {totalStudents || 0} / {earnedCount || 0}
            </span>

            <span className="ml-auto">{progressPercent}%</span>
          </FieldLabel>

          <Progress value={progressPercent || 0} id="progress-upload" />
        </Field>
      </CardFooter>
    </Card>
  );
}
