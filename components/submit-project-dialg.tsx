import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import SubmitProjectForm from "./forms/submit-project-form";

export default function SubmitProjectDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full gap-2 rounded-xl font-semibold text-base
                     bg-primary hover:bg-primary/90 text-primary-foreground
                     shadow-sm transition-all active:scale-[0.98]"
        >
          <Upload className="w-4 h-4" />
          Submit Project
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl rounded-2xl border-border bg-card p-0 overflow-hidden gap-0">
        {/* Dialog header with accent bar */}
        <div className="primary-gradient px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary-foreground">
              Submit Your Project
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/70 text-sm mt-1">
              Fill in the details below and submit when you&apos;re ready.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form body */}
        <div className="px-6 py-6">
          <SubmitProjectForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
