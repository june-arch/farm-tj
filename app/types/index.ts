export type TCategory = {
  id: string;
  catName: string;
};

export type TPost = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  publicId?: string;
  catName?: string;
  links: null | string[];
  createdAt: string;
  authorEmail: string;
  author: {
    name: string;
  };
};

export type TStruk = {
  id: string;
  pabrik: string;
  netto: number;
  brutto: number;
  tarra: number;
  harga: number;
  pemasukan: string;
  imageUrl: string;
  publicId: string;
  createdByEmail: string;
  createdAt: string;
  updatedAt: string;
  createdBy: { name: string };
};

export type TChartIncome = {
  pemasukan: string;
  createdAt: string;
  pabrik: string;
};
export type TChartPrice = { harga: number; createdAt: string; pabrik: string };
export type TChartWeight = {
  brutto: number;
  tarra: number;
  netto: number;
  createdAt: string;
  pabrik: string;
};
export type TTotal = {
  brutto: number;
  netto: number;
  pemasukan: string;
};
