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
import { User } from "@/types/action";
import Link from "next/link";
import { Badge } from "../ui/badge";
import UserAvatar from "../UserAvatar";

export default function StudentCard({ student }: { student: User }) {
  const { id, name, imageCldPubId, email, totalPoints, level } = student;
  return (
    <Card className="group relative mx-auto w-full max-w-sm transition-transform duration-300 hover:shadow-lg hover:scale-105">
      <CardHeader className="text-center pb-3">
        <div className="flex justify-center mb-4">
          <UserAvatar
            imageUrl={imageCldPubId}
            name={name}
            className="h-20 w-20 rounded-full border-4 border-background shadow-lg scale-110"
          />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl font-semibold">{name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {email}
          </CardDescription>
        </div>
        <div className="flex justify-center gap-2 pt-2">
          <Badge variant="secondary">{level}</Badge>
          <Badge variant="outline">{totalPoints} pts</Badge>
        </div>
      </CardHeader>

      <CardFooter className="pt-0">
        <Button className="w-full" asChild size={"lg"}>
          <Link href={ROUTES.STUDENT_DETAILS(id)}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
