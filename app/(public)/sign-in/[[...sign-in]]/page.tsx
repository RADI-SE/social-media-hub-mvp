import { SignIn } from "@clerk/nextjs";
import AuthShell from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/components/auth/clerkAppearance";
import { getTranslations } from "next-intl/server";

export default async function SignInPage() {
  const t = await getTranslations("auth");
  return (
    <AuthShell
      eyebrow={t("eyebrow")}
      title={t("signInTitle")}
      description={t("signInDescription")}
    >
      <SignIn
        appearance={clerkAppearance}
        signUpUrl="/sign-up"
        forceRedirectUrl="/home"
        fallbackRedirectUrl="/home"
      />
    </AuthShell>
  );
}
