"use client";

import { TCategory, TStruk } from "@/app/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadButton, CldUploadWidgetResults } from "next-cloudinary";
import Image from "next/image";
import toast from "react-hot-toast";
import dayjs from "dayjs";

export default function EditStrukForm({ struk }: { struk: TStruk }) {
  const [tanggal, setTanggal] = useState("");
  const [pabrik, setPabrik] = useState("");
  const [brutto, setBrutto] = useState(0);
  const [tarra, setTarra] = useState(0);
  const [netto, setNetto] = useState(0);
  const [hargaJual, setHargaJual] = useState(0);
  const [pemasukan, setPemasukan] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [publicId, setPublicId] = useState("");

  const router = useRouter();

  useEffect(() => {
    const initValues = () => {
      setTanggal(dayjs(struk.createdAt).format('YYYY-MM-DD'));
      setPabrik(struk.pabrik);
      setBrutto(struk.brutto);
      setTarra(struk.tarra);
      setNetto(struk.netto);
      setHargaJual(struk.harga);
      setPemasukan(Number(struk.pemasukan));
      setImageUrl(struk.imageUrl || "");
      setPublicId(struk.publicId || "");
    };

    initValues();
  }, [
    struk.createdAt,
    struk.pabrik,
    struk.brutto,
    struk.tarra,
    struk.netto,
    struk.harga,
    struk.pemasukan,
    struk.imageUrl,
    struk.publicId,
  ]);

  const handleImageUpload = (result: CldUploadWidgetResults) => {
    const info = result.info as object;

    if ("secure_url" in info && "public_id" in info) {
      const url = info.secure_url as string;
      const public_id = info.public_id as string;
      setImageUrl(url);
      setPublicId(public_id);
      console.log("url: ", url);
      console.log("public_id: ", public_id);
    }
  };

  const removeImage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/removeImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });

      if (res.ok) {
        setImageUrl("");
        setPublicId("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !tanggal ||
      !pabrik ||
      !brutto ||
      !tarra ||
      !netto ||
      !hargaJual ||
      !pemasukan
    ) {
      const errorMessage =
        "Tanggal, Pabrik, Brutto, Tarra, Netto, HargaJual, Pemasukan Wajib Diisi";
      toast.error(errorMessage);
      return;
    }

    try {
      const res = await fetch(`/api/struks/${struk.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          createdAt: tanggal,
          pabrik,
          brutto,
          tarra,
          netto,
          harga: hargaJual,
          pemasukan,
          imageUrl,
          publicId,
        }),
      });

      if (res.ok) {
        toast.success("Struk edited successfully");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Edit Struk</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label>Tanggal :</label>
        <input
          onChange={(e) => setTanggal(e.target.value)}
          type="date"
          value={tanggal}
          placeholder="Tanggal"
        />
        <label>Pabrik :</label>
        <input
          onChange={(e) => setPabrik(e.target.value)}
          type="text"
          value={pabrik}
          placeholder="Pabrik"
        />
        <label>Brutto :</label>
        <div style={{ position: "relative" }}>
          <input
            onChange={(e) => setBrutto(Number(e.target.value))}
            type="number"
            value={brutto}
            placeholder="brutto"
            className="w-full pr-10"
          />
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            kg
          </span>
        </div>

        <label>Tarra :</label>
        <div style={{ position: "relative" }}>
          <input
            onChange={(e) => setTarra(Number(e.target.value))}
            type="number"
            value={tarra}
            placeholder="tarra"
            className="w-full pr-10"
          />
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            kg
          </span>
        </div>

        <label>Netto :</label>
        <div style={{ position: "relative" }}>
          <input
            onChange={(e) => setNetto(Number(e.target.value))}
            type="number"
            value={netto}
            placeholder="netto"
            className="w-full pr-10"
          />
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            kg
          </span>
        </div>

        <label>Harga Jual :</label>
        <div style={{ position: "relative" }}>
          <input
            onChange={(e) => {
              if (!netto) {
                return toast.error("Tolong Masukkan Netto Terlebih Dahulu");
              }
              const value = Number(e.target.value);
              setHargaJual(value);
              setPemasukan(value * netto);
            }}
            type="number"
            value={hargaJual}
            placeholder="harga jual"
            disabled={!netto}
            className="w-full"
            style={{ paddingRight: "40px" }} // Ensure space for " kg" text
          />
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            kg
          </span>
        </div>
        <label>Total Uang Yang Diterima :</label>
        <input
          type="text"
          value={new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(pemasukan)}
          placeholder="pemasukan"
          readOnly
        />
        <label className="mt-4">Foto Bukti Nota :</label>
        <CldUploadButton
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          className={`h-48 border-2 border-dotted grid place-items-center bg-slate-100 rounded-md relative ${
            imageUrl && "pointer-events-none"
          }`}
          onUpload={handleImageUpload}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>

          {imageUrl && (
            <Image
              src={imageUrl}
              fill
              className="absolute object-cover inset-0"
              alt={pabrik + netto + hargaJual + pemasukan}
            />
          )}
        </CldUploadButton>

        {publicId && (
          <button
            onClick={removeImage}
            className="py-2 px-4 rounded-md font-bold w-fit bg-red-600 text-white mb-4"
          >
            Remove Image
          </button>
        )}

        <button className="primary-btn" type="submit">
          Update Struk
        </button>
      </form>
    </div>
  );
}
