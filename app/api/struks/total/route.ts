import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const struks = await prisma.struk.aggregate({
      _sum: {
        brutto: true,
        netto: true,
        pemasukan: true
      }
    });

    return NextResponse.json({...struks._sum, pemasukan: struks._sum.pemasukan?.toString()});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Some error occured" },
      { status: 500 }
    );
  }
}
