import { SignIn } from "@clerk/nextjs";
import AuthShell from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/components/auth/clerkAppearance";

export default function SignInPage() {
  return (
    <AuthShell eyebrow="Welcome back" title="Sign in to your workspace" description="Continue managing content, conversations, and follow-up work.">
      <SignIn
        appearance={clerkAppearance}
        signUpUrl="/sign-up"
        forceRedirectUrl="/home"
        fallbackRedirectUrl="/home"
      />
    </AuthShell>
  );
}
