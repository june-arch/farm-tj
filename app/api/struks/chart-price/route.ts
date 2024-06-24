import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const struks = await prisma.struk.findMany({
      select: { harga: true, createdAt: true, pabrik: true },

      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(struks);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Some error occured" },
      { status: 500 }
    );
  }
}
