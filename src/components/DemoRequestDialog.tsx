import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { submitDemoRequest } from "@/services/demoRequests";

interface DemoRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPTY = {
  name: "",
  email: "",
  role: "",
  organization: "",
  orgType: "",
  phone: "",
  details: "",
};

export const DemoRequestDialog = ({ open, onOpenChange }: DemoRequestDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const close = () => {
    onOpenChange(false);
    // Reset after the dialog animation so the confirmation stays visible while open.
    setTimeout(() => {
      setSubmitted(false);
      setFormData(EMPTY);
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.organization) {
      toast({
        title: "Missing information",
        description: "Please provide your name, work email, and organization.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await submitDemoRequest({
        name: formData.name,
        email: formData.email,
        organization: formData.organization,
        requestedRole: formData.role || null,
        phone: formData.phone || null,
        message:
          [formData.orgType ? `Organization type / specialty: ${formData.orgType}` : null, formData.details]
            .filter(Boolean)
            .join("\n") || null,
        source: "website",
      });
      setSubmitted(true);
    } catch {
      toast({
        title: "Could not submit request",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        {submitted ? (
          <div className="space-y-6 py-4 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold">Demo request received</h2>
              <p className="mt-3 text-muted-foreground">
                Thank you. Your request has been recorded and we will follow up with you.
              </p>
            </div>
            <Button onClick={close}>Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Try the Clinical Demo</DialogTitle>
              <DialogDescription>
                Tell us about your practice and we will follow up with access to a walkthrough of the
                clinical demo.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-2 rounded-lg border bg-accent/40 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Before you begin the demo</p>
              <p>
                This is a demonstration environment. It uses fictional patients only, and the details
                you submit here are saved so our team can contact you.
              </p>
              <p>
                Please do not enter real patient-identifying information anywhere in the demo. You can
                exit or reset the demo at any time from the workspace.
              </p>
              <p>
                <a href="/privacy" className="text-primary underline underline-offset-4">
                  Privacy Policy
                </a>{" "}
                ·{" "}
                <a href="/terms" className="text-primary underline underline-offset-4">
                  Terms of Use
                </a>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="physician">Physician</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="care-coordinator">Care Coordinator</SelectItem>
                      <SelectItem value="researcher">Researcher</SelectItem>
                      <SelectItem value="administrator">Practice / Organization Administrator</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization / Practice *</Label>
                  <Input
                    id="organization"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="orgType">Organization type or specialty</Label>
                  <Input
                    id="orgType"
                    placeholder="e.g. Family medicine practice"
                    value={formData.orgType}
                    onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">What would you like to see or solve?</Label>
                <Textarea
                  id="details"
                  rows={4}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={close}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting…" : "Request a Demo"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
