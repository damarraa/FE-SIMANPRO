import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import usePdo from "./hooks/usePdo";
import PdoTable from "./components/PdoTable";

const PdoListPage = () => {
  const { pdosData, isLoading, fetchPdos, removePdo } = usePdo();

  useEffect(() => {
    fetchPdos();
  }, [fetchPdos]);

  const handleDelete = async (id) => {
    const success = await removePdo(id);
    if (success) {
      fetchPdos({ page: pdosData.current_page });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pdosData.last_page) {
      fetchPdos({ page: newPage });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Reimburse</h1>
          <p className="text-sm text-gray-700">
            Kelola Permintaan Biaya Operasional Proyek.
          </p>
        </div>
        <Link
          to="/pdos/create"
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors flex items-center"
        >
          <span>+ Buat Pengajuan Baru</span>
        </Link>
      </div>

      <PdoTable
        data={pdosData.data}
        isLoading={isLoading}
        onDelete={handleDelete}
      />

      {!isLoading && pdosData.total > 0 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Menampilkan <span className="font-medium">{pdosData.from}</span> s/d{" "}
            <span className="font-medium">{pdosData.to}</span> dari{" "}
            <span className="font-medium">{pdosData.total}</span> data
          </p>

          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pdosData.current_page - 1)}
              disabled={pdosData.current_page === 1}
              className={`px-3 py-1 rounded border ${
                pdosData.current_page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Sebelumnya
            </button>
            <button
              onClick={() => handlePageChange(pdosData.current_page + 1)}
              disabled={pdosData.current_page === pdosData.last_page}
              className={`px-3 py-1 rounded border ${
                pdosData.current_page === pdosData.last_page
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdoListPage;
