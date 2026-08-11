import { SignUp } from "@clerk/nextjs";
import AuthShell from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/components/auth/clerkAppearance";

export default function SignUpPage() {
  return (
    <AuthShell eyebrow="Get started" title="Create your workspace account" description="Set up your account, then connect the social profiles you manage.">
      <SignUp
        appearance={clerkAppearance}
        signInUrl="/sign-in"
        forceRedirectUrl="/home"
        fallbackRedirectUrl="/home"
      />
    </AuthShell>
  );
}
