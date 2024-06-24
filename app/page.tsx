export default async function Home() {
  return (
    <>
      <div className="bg-blue-900 py-20 flex flex-col items-center justify-center space-y-4">
        <div className="bg-orange-600 text-white py-2 px-4 text-center">
          ABSEN KEBUN TJ
        </div>
        <div className="flex space-x-4">
          <div className="bg-blue-400 text-white py-2 px-4 text-center">
            DATA KARYAWAN
          </div>
          <div className="bg-yellow-500 text-white py-2 px-4 text-center">
            REKAP
          </div>
        </div>
        <div className="bg-purple-700 text-white py-2 px-4 text-center">
          GRAFIK ABSENSI KARYAWAN
        </div>
        <div className="flex space-x-4">
          <div className="bg-green-500 text-black py-2 px-4 text-center">
            PEMASUKAN
          </div>
          <div className="bg-red-600 text-black py-2 px-4 text-center">
            PENGELUARAN
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="bg-green-500 text-black py-2 px-4 text-center">
            REKAP PEMASUKAN
          </div>
          <div className="bg-red-600 text-black py-2 px-4 text-center">
            REKAP PENGELUARAN
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="bg-green-500 text-black py-2 px-4 text-center">
            GRAFIK PEMASUKAN
          </div>
          <div className="bg-red-600 text-black py-2 px-4 text-center">
            GRAFIK PENGELUARAN
          </div>
        </div>
        <div className="bg-gray-400 text-black py-2 px-4 text-center">
          TONASE
        </div>
        <div className="bg-gray-600 text-white py-2 px-4 text-center">
          TAHUN 2024
        </div>
      </div>
    </>
  );
}
