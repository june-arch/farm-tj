import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
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

  const createdByEmail = session?.user?.email as string;

  if (
    !createdAt ||
    !pabrik ||
    !brutto ||
    !tarra ||
    !netto ||
    !harga ||
    !pemasukan
  ) {
    return NextResponse.json(
      {
        error:
          "Tanggal, Pabrik, Brutto, Tarra, Netto, HargaJual, Pemasukan Wajib Diisi.",
      },
      { status: 500 }
    );
  }

  try {
    const newTonase = await prisma.struk.create({
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

    console.log("Tonase created");
    return NextResponse.json(newTonase);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Could not create tonase." });
  }
}

export async function GET() {
  try {
    const struks = await prisma.struk.findMany({
      include: { createdBy: { select: { name: true } } },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(struks?.map(item => ({ ...item, pemasukan: item.pemasukan.toString() })));
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Some error occured" },
      { status: 500 }
    );
  }
}
