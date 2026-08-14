import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { submitDemoRequest } from "@/services/demoRequests";
import { toast } from "sonner";
import { z } from "zod";
import { Heart, Lock, Mail, User } from "lucide-react";


const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
});

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawNext = searchParams.get("next");
  const nextPath = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : null;
  const postAuthTarget = nextPath ?? "/dashboard";
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "login"
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    requestedRole: "",
    organization: "",
    purpose: ""
  });
  const [demoRequested, setDemoRequested] = useState(false);
  const [signupSubmitted, setSignupSubmitted] = useState(false);


  useEffect(() => {
    if (authMode === "signup") return;
    // Check if user is already logged in

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (nextPath) window.location.href = nextPath;
        else navigate(postAuthTarget);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        if (nextPath) window.location.href = nextPath;
        else navigate(postAuthTarget);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, nextPath, postAuthTarget, authMode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    try {
      setIsLoading(true);

      // Validate form data
      const validData = authSchema.parse({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      const redirectUrl = `${window.location.origin}/auth`;

      const { error } = await supabase.auth.signUp({
        email: validData.email,
        password: validData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: validData.firstName,
            last_name: validData.lastName,
            // Descriptive only — never grants permissions.
            requested_role: formData.requestedRole || null,
            organization: formData.organization || null,
            purpose: formData.purpose || null,
            demo_requested: demoRequested,
          }
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast.error("An account with this email already exists. Please sign in instead.");
          setAuthMode("login");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (demoRequested) {
        try {
          await submitDemoRequest({
            name: `${formData.firstName} ${formData.lastName}`.trim() || validData.email,
            email: validData.email,
            organization: formData.organization || null,
            requestedRole: formData.requestedRole || null,
            message: formData.purpose || null,
            source: "signup",
          });
        } catch {
          // A failed demo lead must not block the access request.
        }
      }

      // Access requires admin approval — never leave a live session behind.
      await supabase.auth.signOut();
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        requestedRole: "",
        organization: "",
        purpose: "",
      });
      setDemoRequested(false);
      setSignupSubmitted(true);

      toast.success("Your request was sent for approval.");

    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);

      // Validate form data
      const validData = authSchema.pick({ email: true, password: true }).parse({
        email: formData.email,
        password: formData.password,
      });

      const { error } = await supabase.auth.signInWithPassword({
        email: validData.email,
        password: validData.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password. Please check your credentials.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Welcome back!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">HealthCare Portal</h1>
          </div>
          <p className="text-gray-600">Sign in to access your patient dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "signup")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                {signupSubmitted ? (
                  <div className="space-y-4 py-4 text-center">
                    <h2 className="text-lg font-semibold text-gray-900">Request submitted</h2>
                    <p className="text-sm text-gray-600">
                      Your request was sent for approval. You will be able to sign in once an
                      administrator approves your account.
                    </p>
                    <div className="flex flex-col gap-2 pt-2">
                      <Button onClick={() => navigate("/")}>Back to home</Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSignupSubmitted(false);
                          setAuthMode("login");
                        }}
                      >
                        Go to sign in
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>


                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupPassword">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder="Create a password (min 6 characters)"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestedRole">Role</Label>
                  <Select
                    value={formData.requestedRole}
                    onValueChange={(v) => handleInputChange("requestedRole", v)}
                  >
                    <SelectTrigger id="requestedRole">
                      <SelectValue placeholder="Select your professional role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physician">Physician</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="care-coordinator">Care coordinator</SelectItem>
                      <SelectItem value="researcher">Researcher</SelectItem>
                      <SelectItem value="administrator">Administrator</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Used for review only. It does not grant any permissions in the application.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    placeholder="Practice, clinic or institution"
                    value={formData.organization}
                    onChange={(e) => handleInputChange("organization", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose of use</Label>
                  <Textarea
                    id="purpose"
                    rows={3}
                    placeholder="How do you plan to use Predict Disease?"
                    value={formData.purpose}
                    onChange={(e) => handleInputChange("purpose", e.target.value)}
                  />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="demoRequested"
                    checked={demoRequested}
                    onCheckedChange={(v) => setDemoRequested(v === true)}
                  />
                  <Label htmlFor="demoRequested" className="text-sm font-normal leading-snug">
                    Would you like a demo? We will contact you to schedule one.
                  </Label>
                </div>

                <Button
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Sending request..." : "Create Account"}
                </Button>

                <Alert>
                  <AlertDescription className="text-sm">
                    New accounts require administrator approval before sign-in is possible.
                  </AlertDescription>
                </Alert>
                  </>
                )}
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Healthcare Portal - Secure Patient Management System</p>
        </div>
      </div>
    </div>
  );
}