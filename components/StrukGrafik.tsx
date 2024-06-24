"use client";

import { TChartIncome, TChartPrice, TChartWeight } from "@/app/types";
import { BarChart } from "@mantine/charts";
import { Card, Flex, Switch, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

function StrukGrafik({
  chartIncome,
  chartPrice,
  chartWeight,
}: {
  chartPrice: TChartPrice[] | null;
  chartWeight: TChartWeight[] | null;
  chartIncome: TChartIncome[] | null;
}) {
  const [filterRangeDate, setFilterRangeDate] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [checked, setChecked] = useState(false);

  const filterDataByDateRange = (
    data: TChartIncome[] | TChartPrice[] | TChartWeight[]
  ) => {
    const [startDate, endDate] = filterRangeDate;
    if (!startDate || !endDate) return data;
    return data.filter(
      (item) =>
        dayjs(item.createdAt).isAfter(dayjs(startDate).startOf("day")) &&
        dayjs(item.createdAt).isBefore(dayjs(endDate).endOf("day"))
    );
  };

  const aggregateDataByMonth = (
    data: TChartIncome[] | TChartPrice[] | TChartWeight[],
    type: string
  ) => {
    return data.reduce((acc: any, item) => {
      const month = dayjs(item.createdAt).format("YYYY-MM");
      if (!acc[month]) {
        acc[month] = {
          ...item,
          brutto: 0,
          tarra: 0,
          netto: 0,
          pemasukan: 0,
          harga: 0,
        };
      }
      if (type === "weight") {
        acc[month].brutto += (item as TChartWeight).brutto || 0;
        acc[month].tarra += (item as TChartWeight).tarra || 0;
        acc[month].netto += (item as TChartWeight).netto || 0;
      } else if (type === "income") {
        acc[month].pemasukan += Number((item as TChartIncome).pemasukan) || 0;
      } else if (type === "price") {
        acc[month].harga += (item as TChartPrice).harga || 0;
      }
      return acc;
    }, {});
  };

  const aggregateChartPrice: TChartPrice[] = chartPrice
    ? Object.values(aggregateDataByMonth(chartPrice, "price"))
    : [];
  const aggregateChartWeight: TChartWeight[] = chartWeight
    ? Object.values(aggregateDataByMonth(chartWeight, "weight"))
    : [];
  const aggregateChartIncome: TChartIncome[] = chartIncome
    ? Object.values(aggregateDataByMonth(chartIncome, "income"))
    : [];

  const filteredChartPrice = checked
    ? aggregateChartPrice
    : chartPrice
    ? filterDataByDateRange(chartPrice)
    : null;
  const filteredChartWeight = checked
    ? aggregateChartWeight
    : chartWeight
    ? filterDataByDateRange(chartWeight)
    : null;
  const filteredChartIncome = checked
    ? aggregateChartIncome
    : chartIncome
    ? filterDataByDateRange(chartIncome)
    : null;

  useEffect(() => {
    console.log(filteredChartPrice, filteredChartIncome, filteredChartWeight);
  }, [filteredChartPrice, filteredChartIncome, filteredChartWeight]);

  if (!chartPrice && !chartIncome && !chartWeight) {
    return <Text>Grafik Dalam Perbaikan</Text>;
  }
  
  return (
    <Flex direction={"column"} gap={"sm"}>
      <Flex direction={"row"} gap={"sm"} align={"center"}>
        <Switch
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          onLabel="Per Bulan"
          offLabel="Per Tanggal"
          size="xl"
          w={160}
        />
        <DatePickerInput
          type="range"
          label="Pilih Rentang Tanggal"
          placeholder="01/01/2021 - 01/02/2021"
          w={"100%"}
          value={filterRangeDate}
          onChange={setFilterRangeDate}
          disabled={checked}
        />
      </Flex>
      {filteredChartPrice && (
        <Card withBorder py="lg ">
          <Text mb={20} mx={"auto"}>
            Grafik Harga
          </Text>
          <BarChart
            h={300}
            data={filteredChartPrice.map((item) => ({
              ...item,
              tanggal: `${dayjs(item.createdAt).format(checked ? "YYYY-MM" : "YYYY-MM-DD")} ${
                item.pabrik
              }`,
            }))}
            dataKey="tanggal"
            valueFormatter={(value) =>
              `Rp.${new Intl.NumberFormat("en-US").format(value)}`
            }
            withXAxis
            withYAxis
            withBarValueLabel
            series={[{ name: "harga", color: "violet.6" }]}
            tickLine="y"
          />
        </Card>
      )}
      {filteredChartWeight && (
        <Card withBorder py="lg ">
          <Text mb={10} mx={"auto"}>
            Grafik Berat
          </Text>
          <BarChart
            h={300}
            data={filteredChartWeight.map((item) => ({
              ...item,
              tanggal: `${dayjs(item.createdAt).format(checked ? "YYYY-MM" : "YYYY-MM-DD")} ${
                item.pabrik
              }`,
            }))}
            dataKey="tanggal"
            valueFormatter={(value) =>
              `${new Intl.NumberFormat("en-US").format(value)}`
            }
            unit="kg"
            withXAxis
            withYAxis
            withBarValueLabel
            series={[
              { name: "brutto", color: "violet.6" },
              { name: "tarra", color: "blue.6" },
              { name: "netto", color: "teal.6" },
            ]}
            tickLine="y"
          />
        </Card>
      )}
      {filteredChartIncome && (
        <Card withBorder py="lg" px={40}>
          <Text mb={10} mx={"auto"}>
            Grafik Pemasukan
          </Text>
          <BarChart
            h={300}
            data={filteredChartIncome.map((item) => ({
              ...item,
              tanggal: `${dayjs(item.createdAt).format(checked ? "YYYY-MM" : "YYYY-MM-DD")} ${
                item.pabrik
              }`,
            }))}
            dataKey="tanggal"
            valueFormatter={(value) =>
              `Rp.${new Intl.NumberFormat("en-US").format(Number(value))}`
            }
            withXAxis
            withYAxis
            withBarValueLabel
            series={[{ name: "pemasukan", color: "violet.6" }]}
            tickLine="y"
          />
        </Card>
      )}
    </Flex>
  );
}

export default StrukGrafik;
