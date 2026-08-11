import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/home");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div>
        <h1>Social Media Marketing Hub</h1>

        <a href="/sign-in">Sign In</a>
      </div>
    </main>
  );
}