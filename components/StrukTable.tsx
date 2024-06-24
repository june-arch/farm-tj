"use client";

import { TStruk } from "@/app/types";
import React, { useEffect, useState } from "react";
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import {
  ActionIcon,
  Button,
  Flex,
  Pagination,
  rem,
  Select,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconEdit, IconEye, IconSearch, IconTrash } from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import DetailStruk from "./DetailStruk";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function StrukTable({ struks }: { struks: TStruk[] }) {
  const [filterDate, setFilterDate] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [opened, { open, close }] = useDisclosure(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchBy, setSearchBy] = useState("pabrik");
  const [struk, setStruk] = useState<TStruk>();

  const router = useRouter();
  const deleteImage = async (publicId: string) => {
    const res = await fetch("/api/removeImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (confirmed) {
      try {
        const res = await fetch(`/api/struks/${id}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
        });

        if (res.ok) {
          console.log("Post deleted");
          const post = await res.json();
          const { publicId } = post;
          await deleteImage(publicId);

          toast.success("Post deleted successfully");
          router.refresh();
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.log(error);
      }
    }
  };

  const columnHelper = createColumnHelper<TStruk>();

  const columns = [
    columnHelper.accessor("createdAt", {
      id: "tanggal",
      header: "Tanggal",
      cell: (value) => {
        return new Date(value.getValue()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
      filterFn: (rows, id, filterValue) => {
        const [start, end] = filterValue;
        const rowDate = new Date(rows.getValue(id));
        if (start && end) {
          return rowDate >= start && rowDate <= end;
        } else if (start) {
          return rowDate >= start;
        } else if (end) {
          return rowDate <= end;
        }
        return true;
      },
    }),
    columnHelper.accessor("pabrik", {
      id: "pabrik",
      header: "Pabrik",
      filterFn: "includesString",
    }),
    columnHelper.accessor("brutto", {
      id: "brutto",
      header: "Brutto",
      filterFn: "includesString",
      cell: (value) =>
        new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(Number(value.getValue())),
    }),
    columnHelper.accessor("tarra", {
      id: "tarra",
      header: "Tarra",
      filterFn: "includesString",
      cell: (value) =>
        new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(Number(value.getValue())),
    }),
    columnHelper.accessor("netto", {
      id: "netto",
      header: "Netto",
      filterFn: "includesString",
      cell: (value) =>
        new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(Number(value.getValue())),
    }),
    columnHelper.accessor("harga", {
      id: "harga",
      header: "Harga",
      filterFn: "includesString",
      cell: (value) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(Number(value.getValue())),
    }),
    columnHelper.accessor("pemasukan", {
      id: "pemasukan",
      header: "Pemasukan",
      filterFn: "includesString",
      cell: (value) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(Number(value.getValue())),
    }),
    columnHelper.display({
      id: "action",
      header: "Aksi",
      cell: (value) => (
        <Flex direction="row" gap={1}>
          <ActionIcon
            size="md"
            variant="subtle"
            onClick={() => {
              setStruk(value.row.original);
              open();
            }}
          >
            <IconEye width={24} height={24} />
          </ActionIcon>
          <ActionIcon
            size="md"
            variant="subtle"
            color="green"
            component={Link}
            href={`/edit-tonase/${value.row.original.id}`}
          >
            <IconEdit width={24} height={22} />
          </ActionIcon>
          <ActionIcon
            size="md"
            variant="subtle"
            color="red"
            onClick={() => handleDelete(value.row.original.id)}
          >
            <IconTrash width={21} height={24} />
          </ActionIcon>
        </Flex>
      ),
    }),
  ];

  const options: TableOptions<TStruk> = {
    columns,
    data: struks ?? [],
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  };

  const table = useReactTable(options);

  useEffect(() => {
    table.getColumn("tanggal")?.setFilterValue(filterDate);
  }, [filterDate, table]);

  return (
    <>
      <section className="container mx-auto">
        <div className="flex justify-between flex-col sm:flex-row sm:items-center space-y-1 sm:space-x-1 sm:space-y-0">
          <Select
            className="sm:w-20 w-full"
            size="md"
            radius="md"
            value={table.getState().pagination.pageSize.toString()}
            onChange={(value) => {
              table.setPageSize(Number(value));
            }}
            data={["10", "20", "30", "40", "50"]}
            styles={{
              option: {
                fontSize: 10,
              },
            }}
          />
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-x-1 sm:space-y-0">
            <DatePickerInput
              type="range"
              size="md"
              radius="md"
              placeholder="Date Range 01/01/2021 - 02/02/2021"
              value={filterDate}
              onChange={setFilterDate}
            />
            <TextInput
              radius="md"
              size="md"
              placeholder="Input Your Search"
              value={
                (table.getColumn(searchBy)?.getFilterValue() ?? "") as string
              }
              onChange={(e) =>
                table.getColumn(searchBy)?.setFilterValue(e.target.value)
              }
              leftSection={
                <IconSearch
                  style={{ width: rem(18), height: rem(18) }}
                  stroke={1.5}
                />
              }
            />
            <Select
              value={searchBy}
              className="sm:w-28 w-full"
              size="md"
              radius="md"
              onChange={(value) => {
                setSearchBy(value ?? "");
              }}
              data={
                struks.length > 0
                  ? Object.keys(struks[0]).filter(
                      (element) =>
                        ![
                          "id",
                          "updatedAt",
                          "createdBy",
                          "createdAt",
                          "publicId",
                          "createdByEmail",
                          "imageUrl",
                        ].includes(element)
                    )
                  : []
              }
              styles={{
                option: {
                  fontSize: 10,
                },
              }}
            />
          </div>
        </div>
        <Table.ScrollContainer minWidth={500}>
          <Table className="mt-2">
            <Table.Thead>
              {table.getHeaderGroups().map((headerGroup, index) => {
                return (
                  <Table.Tr key={index}>
                    {headerGroup.headers.map((header, keyIndex) => {
                      return (
                        <Table.Th id={header.id} key={keyIndex} scope="col">
                          {" "}
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </Table.Th>
                      );
                    })}
                  </Table.Tr>
                );
              })}
            </Table.Thead>
            <Table.Tbody>
              {table.getRowModel().rows.map((row, index) => {
                return (
                  <Table.Tr key={index}>
                    {row.getVisibleCells().map((cell, keyIndex) => {
                      return (
                        <Table.Td key={keyIndex}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Table.Td>
                      );
                    })}
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        <div className="flex items-center justify-between mt-6">
          <Text fz={14}>
            Showing 1 to {table.getState().pagination.pageSize} of{" "}
            {struks.length} entries
          </Text>
          <Pagination
            value={table.getState().pagination.pageIndex + 1}
            onChange={(val) => table.setPageIndex(val - 1)}
            total={table.getPageCount()}
          />
        </div>
      </section>
      <DetailStruk struk={struk} close={close} opened={opened} />
    </>
  );
}

export default StrukTable;
