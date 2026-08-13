import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { submitDemoRequest } from "@/services/demoRequests";

interface DemoRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DemoRequestDialog = ({ open, onOpenChange }: DemoRequestDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyPractice: "",
    primaryCare: "",
    insuranceType: "",
    details: ""
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.companyPractice) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      await submitDemoRequest({
        name: formData.name,
        email: formData.email,
        organization: formData.companyPractice,
        requestedRole: formData.primaryCare || null,
        phone: formData.phone || null,
        message: [formData.insuranceType ? `Insurance: ${formData.insuranceType}` : null, formData.details]
          .filter(Boolean)
          .join("\n") || null,
        source: "website",
      });
    } catch (error) {
      toast({
        title: "Could not submit request",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      return;
    } finally {
      setSubmitting(false);
    }

    toast({
      title: "Demo Request Submitted!",
      description: "We'll contact you shortly to schedule your personalized demo.",
    });
    
    // Reset form and close dialog
    setFormData({
      name: "",
      email: "",
      phone: "",
      companyPractice: "",
      primaryCare: "",
      insuranceType: "",
      details: ""
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Request a Demo</DialogTitle>
          <DialogDescription>
            Tell us about your practice and we'll schedule a personalized demo tailored to your needs
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              required
              placeholder="Dr. John Smith"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="john.smith@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Company/Practice */}
          <div className="space-y-2">
            <Label htmlFor="companyPractice">Company/Practice Name *</Label>
            <Input
              id="companyPractice"
              required
              placeholder="ABC Medical Group"
              value={formData.companyPractice}
              onChange={(e) => setFormData({ ...formData, companyPractice: e.target.value })}
            />
          </div>

          {/* Primary Care Type */}
          <div className="space-y-2">
            <Label htmlFor="primaryCare">Primary Care Type</Label>
            <Select
              value={formData.primaryCare}
              onValueChange={(value) => setFormData({ ...formData, primaryCare: value })}
            >
              <SelectTrigger id="primaryCare">
                <SelectValue placeholder="Select primary care type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="family-medicine">Family Medicine</SelectItem>
                <SelectItem value="internal-medicine">Internal Medicine</SelectItem>
                <SelectItem value="pediatrics">Pediatrics</SelectItem>
                <SelectItem value="endocrinology">Endocrinology</SelectItem>
                <SelectItem value="general-practice">General Practice</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Insurance Type */}
          <div className="space-y-2">
            <Label htmlFor="insuranceType">Insurance Type</Label>
            <Select
              value={formData.insuranceType}
              onValueChange={(value) => setFormData({ ...formData, insuranceType: value })}
            >
              <SelectTrigger id="insuranceType">
                <SelectValue placeholder="Select insurance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private Insurance</SelectItem>
                <SelectItem value="medicare">Medicare</SelectItem>
                <SelectItem value="medicaid">Medicaid</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
                <SelectItem value="self-pay">Self-Pay</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <Label htmlFor="details">How can we make this demo better for you?</Label>
            <Textarea
              id="details"
              placeholder="Tell us about your specific needs, challenges, or questions you'd like addressed during the demo..."
              rows={4}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Demo Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
