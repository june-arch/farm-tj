import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const struk = await prisma.struk.findUnique({ where: { id } });
    return NextResponse.json({...struk, pemasukan: struk?.pemasukan.toString()});
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Could not fetch struk" });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const {
    createdAt,
    pabrik,
    brutto,
    tarra,
    netto,
    harga,
    pemasukan,
    imageUrl,
    publicId,
  } = await req.json();
  const id = params.id;
  const createdByEmail = session?.user?.email as string;

  try {
    const struk = await prisma.struk.update({
      where: { id },
      data: {
        createdAt: new Date(createdAt),
        pabrik,
        brutto,
        tarra,
        netto,
        harga,
        pemasukan,
        imageUrl,
        publicId,
        createdByEmail,
      },
    });

    return NextResponse.json(struk);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error editing struk" });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const id = params.id;
  try {
    const struk = await prisma.struk.delete({ where: { id } });
    return NextResponse.json(struk);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error deleting the struk" });
  }
}
