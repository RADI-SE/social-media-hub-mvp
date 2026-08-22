import { SignUp } from "@clerk/nextjs";
import AuthShell from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/components/auth/clerkAppearance";
import { getTranslations } from "next-intl/server";

export default async function SignUpPage() {
  const t = await getTranslations("auth");
  return (
    <AuthShell
      eyebrow={t("eyebrow")}
      title={t("signUpTitle")}
      description={t("signUpDescription")}
    >
      <SignUp
        appearance={clerkAppearance}
        signInUrl="/sign-in"
        forceRedirectUrl="/home"
        fallbackRedirectUrl="/home"
      />
    </AuthShell>
  );
}
