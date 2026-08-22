import { auth } from "@clerk/nextjs/server";
import LandingExperience from "@/components/landing/LandingExperience";

export default async function LandingPage() {
  const { userId } = await auth();
  return <LandingExperience signedIn={Boolean(userId)} />;
}
