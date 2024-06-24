"use client";

import { TStruk } from "@/app/types";
import { Drawer, Modal, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/id"; // Import Indonesian locale

dayjs.extend(localizedFormat);

// Set locale to Indonesian
dayjs.locale("id");

function RenderStruk({ struk }: { struk: TStruk }) {
  return (
    <>
      <section className="flex flex-col space-y-2 py-4">
        <table>
          <tbody>
            <tr>
              <th className="text-left w-20">Pabrik</th>
              <th className="text-left">
                <Text>: {struk.pabrik ?? "-"}</Text>
              </th>
            </tr>
            <tr>
              <th className="text-left w-20">Brutto</th>
              <th className="text-left">
                <Text>: {struk.brutto ?? "-"} kg</Text>
              </th>
            </tr>
            <tr>
              <th className="text-left w-20">Tarra</th>
              <th className="text-left">
                <Text>: {struk.tarra ?? "-"} kg</Text>
              </th>
            </tr>
            <tr>
              <th className="text-left w-20">Netto</th>
              <th className="text-left">
                <Text>: {struk.netto ?? "-"} kg</Text>
              </th>
            </tr>
            <tr>
              <th className="text-left w-20">Harga</th>
              <th className="text-left">
                <Text>: {struk.harga ?? "-"}</Text>
              </th>
            </tr>
            <tr>
              <th className="text-left w-20">Total</th>
              <th className="text-left">
                <Text>: {struk.pemasukan ?? "-"}</Text>
              </th>
            </tr>
            <tr>
              <th className="text-left w-20">By</th>
              <th className="text-left">
                <Text>: {struk.createdBy.name ?? "-"}</Text>
              </th>
            </tr>
          </tbody>
        </table>
        <Text>
          {dayjs(struk.createdAt).format("dddd, MMMM D, YYYY h:mm A") ?? "-"}
        </Text>
        <div className="w-full h-72 relative">
          {struk.imageUrl ? (
            <Image
              src={struk.imageUrl}
              alt={struk.publicId}
              fill
              className="object-contain rounded-md object-center"
            />
          ) : (
            <Image
              src={"/thumbnail-placeholder.png"}
              alt={struk.publicId}
              fill
              className="object-contain rounded-md object-center"
            />
          )}
        </div>
      </section>
    </>
  );
}

function DetailStruk({
  close,
  opened,
  struk,
}: {
  struk: TStruk | undefined;
  opened: boolean;
  close: () => void;
}) {
  const isMobile = useMediaQuery("(max-width: 48em)");
  if (isMobile) {
    return (
      <>
        <Drawer opened={opened} onClose={close} withCloseButton={false} position="bottom" size={"xl"}>
          {struk ? (
            <RenderStruk struk={struk} />
          ) : (
            "Something Went Wrong Please Refresh the page"
          )}
        </Drawer>
      </>
    );
  }

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        {struk ? (
          <RenderStruk struk={struk} />
        ) : (
          "Something Went Wrong Please Refresh the page"
        )}
      </Modal>
    </>
  );
}

export default DetailStruk;
