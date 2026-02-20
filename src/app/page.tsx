import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function HomePage() {
  const { userId } = await auth();

  // http://localhost:3000/sign-in/sso
  // http://localhost:3000/sign-in/password-reset

  if (userId) {
    redirect("/projects");
  } else {
    redirect("/sign-in");
  }
}

export default HomePage;
