import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import TambahTonaseForm from "@/components/TambahTonaseForm";

export default async function TambahTonase() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  return <TambahTonaseForm />;
}
