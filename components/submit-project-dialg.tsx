import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitProjectForm from "./forms/submit-project-form";

export default function SubmitProjectDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="w-full " size={"lg"}>
            Submit Project
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Project</DialogTitle>
            <DialogDescription>
              Submit your project here. Click submit when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <SubmitProjectForm />

          {/* <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter> */}
        </DialogContent>
      </form>
    </Dialog>
  );
}
