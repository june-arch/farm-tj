import {
  TChartIncome,
  TChartPrice,
  TChartWeight,
  TStruk,
  TTotal,
} from "../types";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import StrukTable from "@/components/StrukTable";
import { Card, Flex, Text, Title } from "@mantine/core";
import StrukGrafik from "@/components/StrukGrafik";
import { DatePickerInput } from "@mantine/dates";

const getStruks = async (): Promise<TStruk[] | null> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/struks`, {
      cache: "no-store",
    });

    if (res.ok) {
      const struks = await res.json();
      return struks;
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};
const getChartPrice = async (): Promise<TChartPrice[] | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/struks/chart-price`,
      {
        cache: "no-store",
      }
    );

    if (res.ok) {
      const response = await res.json();
      return response;
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};
const getChartWeight = async (): Promise<TChartWeight[] | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/struks/chart-weight`,
      {
        cache: "no-store",
      }
    );

    if (res.ok) {
      const response = await res.json();
      return response;
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};
const getChartIncome = async (): Promise<TChartIncome[] | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/struks/chart-income`,
      {
        cache: "no-store",
      }
    );

    if (res.ok) {
      const response = await res.json();
      return response;
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};
const getTotal = async (): Promise<TTotal | null> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/struks/total`, {
      cache: "no-store",
    });

    if (res.ok) {
      const response = await res.json();
      return response;
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  const struks = await getStruks();
  const chartPrice = await getChartPrice();
  const chartWeight = await getChartWeight();
  const chartIncome = await getChartIncome();
  const total = await getTotal();
  return (
    <>
      <Flex direction={{ base: "column", md: "row" }} gap="sm">
        <Card className="w-full md:w-1/3" withBorder>
          <Title order={4}>Total Pemasukan</Title>
          <Text ta={"center"}>
            {total?.pemasukan
              ? new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(Number(total.pemasukan))
              : "NaN"}
          </Text>
        </Card>
        <Card className="w-full md:w-1/3" withBorder>
          <Title order={4}>Total Netto</Title>
          <Text ta={"center"}>
            {total?.netto
              ? `${new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(Number(total.netto))} kg`
              : "-"}
          </Text>
        </Card>
        <Card className="w-full md:w-1/3" withBorder>
          <Title order={4}>Total Brutto</Title>
          <Text ta={"center"}>
            {total?.brutto
              ? `${new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(Number(total.brutto))} kg`
              : "-"}
          </Text>
        </Card>
      </Flex>
      <Title order={1} className="py-6">
        Tonase Grafik
      </Title>
      <StrukGrafik
        chartPrice={chartPrice}
        chartWeight={chartWeight}
        chartIncome={chartIncome}
      />
      <Title order={1} className="py-6">
        Tonase Tabel
      </Title>
      <StrukTable struks={struks ?? []} />
    </>
  );
}
