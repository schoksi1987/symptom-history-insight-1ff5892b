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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { submitDemoRequest } from "@/services/demoRequests";
import { toast } from "sonner";
import { z } from "zod";
import { Activity, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Seo } from "@/components/Seo";

const MIN_PASSWORD_LENGTH = 12;

const passwordField = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
  .max(128, "Password must be under 128 characters")
  .refine((v) => /[a-z]/.test(v) && /[A-Z]/.test(v), {
    message: "Password must include both uppercase and lowercase letters",
  })
  .refine((v) => /[0-9]/.test(v), { message: "Password must include at least one number" });

function scorePassword(v: string) {
  let score = 0;
  if (v.length >= MIN_PASSWORD_LENGTH) score++;
  if (v.length >= 16) score++;
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  return Math.min(score, 4);
}

const STRENGTH_LABELS = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];

function PasswordStrength({ value }: { value: string }) {
  if (!value) return null;
  const score = scorePassword(value);
  return (
    <div aria-live="polite">
      <div className="mt-1 flex gap-1" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < score ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Password strength: {STRENGTH_LABELS[score]} — minimum {MIN_PASSWORD_LENGTH} characters with
        upper and lower case letters and a number.
      </p>
    </div>
  );
}


const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: passwordField,
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
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(
    typeof window !== "undefined" && window.location.hash.includes("type=recovery")
  );
  const [newPassword, setNewPassword] = useState("");


  useEffect(() => {
    if (authMode === "signup" || recoveryMode) return;
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
  }, [navigate, nextPath, postAuthTarget, authMode, recoveryMode]);

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
        // Never reveal whether an address is already registered.
        if (error.message.includes("User already registered")) {
          setSignupSubmitted(true);
          return;
        }
        toast.error("We could not process your request. Please check your details and try again.");
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
        if (error.message.toLowerCase().includes("email not confirmed")) {
          toast.error("Please verify your email address using the link we sent before signing in.");
        } else {
          toast.error("Email or password is incorrect.");
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

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error("Enter your email address first, then select Forgot password.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    if (error && !error.message.toLowerCase().includes("user")) {
      toast.error("We could not send a reset link right now. Please try again shortly.");
      return;
    }
    toast.success("If an account exists for that email, a reset link is on its way.");
  };

  const handleUpdatePassword = async () => {
    const parsed = passwordField.safeParse(newPassword);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data });
    setIsLoading(false);
    if (error) {
      toast.error("We could not update your password. Request a new reset link and try again.");
      return;
    }
    toast.success("Your password has been updated. Please sign in.");
    setNewPassword("");
    setRecoveryMode(false);
    window.location.hash = "";
    await supabase.auth.signOut();
    setAuthMode("login");
  };



  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-accent via-secondary to-background p-4">
      <Seo
        title="Sign In or Request Access"
        description="Sign in to the Predict Disease by symptom.ai clinical workspace, or request access for your care team."
        path="/auth"
        noIndex
      />
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="sr-only">Sign in to Predict Disease by symptom.ai or request access</h1>
          <div className="mb-4 flex items-center justify-center gap-2">
            <Activity className="h-7 w-7 text-primary" aria-hidden="true" />
            <Link to="/" className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-foreground">Predict Disease</span>
              <span className="text-sm text-muted-foreground">by symptom.ai</span>
            </Link>
          </div>
          <p className="text-muted-foreground">
            Type 2 diabetes screening decision support for primary-care teams.
          </p>
        </div>

        {recoveryMode ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Choose a new password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-3 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <PasswordStrength value={newPassword} />
              </div>
              <Button onClick={handleUpdatePassword} disabled={isLoading} className="w-full">
                {isLoading ? "Updating..." : "Update password"}
              </Button>
            </CardContent>
          </Card>
        ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "signup")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Request Access</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-3 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="w-full text-sm text-primary underline underline-offset-4"
                >
                  Forgot password?
                </button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                {signupSubmitted ? (
                  <div className="space-y-4 py-4 text-center">
                    <h2 className="text-lg font-semibold text-foreground">Request submitted</h2>
                    <p className="text-sm text-muted-foreground">
                      If the details you entered can be used to create an account, we have emailed a
                      verification link. Verify your email address, then wait for an administrator to
                      approve access before signing in.
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
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signupPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password (at least 12 characters)"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-3 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <PasswordStrength value={formData.password} />
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
                  <p className="text-xs text-muted-foreground">
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
                  {isLoading ? "Sending request..." : "Request Access"}
                </Button>

                <Alert>
                  <AlertDescription className="text-sm">
                    Email verification is required, and new accounts also require administrator
                    approval before sign-in is possible.
                  </AlertDescription>
                </Alert>
                  </>
                )}
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
        )}

        <div className="text-center mt-6 space-y-2 text-sm text-muted-foreground">
          <p>Predict Disease by symptom.ai — clinical decision support, not a diagnosis.</p>
          <p className="space-x-3">
            <Link to="/privacy" className="underline underline-offset-4">Privacy Policy</Link>
            <Link to="/terms" className="underline underline-offset-4">Terms of Use</Link>
            <Link to="/" className="underline underline-offset-4">Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}