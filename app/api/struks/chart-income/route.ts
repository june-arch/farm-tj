import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const struks = await prisma.struk.findMany({
      select: { pemasukan: true, createdAt: true, pabrik: true },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(struks.map(item => ({...item, pemasukan: item.pemasukan.toString()})));
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Some error occured" },
      { status: 500 }
    );
  }
}
