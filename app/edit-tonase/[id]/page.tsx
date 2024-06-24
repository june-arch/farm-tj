import { TStruk } from "@/app/types";
import EditStrukForm from "@/components/EditStrukForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const getStruk = async (id: string): Promise<TStruk | null> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/struks/${id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const struk = await res.json();
      return struk;
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

export default async function EditStruk({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  const id = params.id;
  const struk = await getStruk(id);

  return <>{struk ? <EditStrukForm struk={struk} /> : <div>Invalid Struk</div>}</>;
}
