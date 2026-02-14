import React from "react";
import { WrenchScrewdriverIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { getImageUrl } from "../../../utils/image";
import Swal from "sweetalert2";

const InventoryToolsTable = ({ tools, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-8 p-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-6 rounded bg-gray-200 mb-2"></div>
          <p className="text-gray-500 font-medium">
            Memuat data inventaris alat...
          </p>
        </div>
      </div>
    );
  }

  if (!tools || tools.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <WrenchScrewdriverIcon className="w-5 h-5 text-orange-600" />
          Inventaris Alat
        </h3>
        <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-gray-100 border-dashed">
          <WrenchScrewdriverIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            Tidak ada alat tercatat di gudang ini.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Alat yang dipindahkan ke sini akan muncul otomatis.
          </p>
        </div>
      </div>
    );
  }

  const getConditionBadge = (condition) => {
    const status = condition?.toLowerCase() || "unknown";

    const styles = {
      good: "bg-green-100 text-green-700 border-green-200",
      baik: "bg-green-100 text-green-700 border-green-200",

      damaged: "bg-red-50 text-red-700 border-red-200",
      rusak: "bg-red-50 text-red-700 border-red-200",

      maintenance: "bg-yellow-50 text-yellow-700 border-yellow-200",
      perbaikan: "bg-yellow-50 text-yellow-700 border-yellow-200",

      lost: "bg-gray-100 text-gray-600 border-gray-200",
      hilang: "bg-gray-100 text-gray-600 border-gray-200",
    };

    return (
      <span
        className={`px-2.5 py-0.5 text-[11px] rounded-full font-bold uppercase tracking-wide border ${
          styles[status] || "bg-gray-50 text-gray-600 border-gray-200"
        }`}
      >
        {condition || "N/A"}
      </span>
    );
  };

  const handleImagePreview = (imageUrl, toolName) => {
    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: toolName,
      title: toolName,
      showConfirmButton: false,
      showCloseButton: true,
      width: "auto",
      padding: "1rem",
      backdrop: `
        rgba(0,0,0,0.8)
      `,
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <WrenchScrewdriverIcon className="w-5 h-5 text-orange-600" /> Inventaris
        Alat
      </h3>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#FFF3E0]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-orange-800 uppercase tracking-wider w-20">
                  Gambar
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-orange-800 uppercase tracking-wider">
                  Info Alat
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-orange-800 uppercase tracking-wider">
                  Identitas (SN/Code)
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-orange-800 uppercase tracking-wider">
                  Merk / Kategori
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-orange-800 uppercase tracking-wider">
                  Kondisi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {tools.map((item) => {
                // Asumsi: Data tools dibungkus dalam 'item.tool' (seperti stock.material)
                // Jika data langsung flat, ubah menjadi 'const tool = item;'
                const tool = item.tool || item;
                const displayPicture =
                  tool.pictures && tool.pictures.length > 0
                    ? tool.pictures[0]
                    : tool.picture_path;

                const finalImageUrl = displayPicture
                  ? getImageUrl(displayPicture)
                  : null;

                // console.log("Debug: ", tool);

                return (
                  <tr
                    key={item.id || tool.id}
                    className="hover:bg-orange-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                        {finalImageUrl ? (
                          <img
                            src={finalImageUrl}
                            alt={tool.name}
                            onClick={() => handleImagePreview(finalImageUrl, tool.name)}
                            className="h-full w-full object-cover cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out"
                          />
                        ) : (
                          <PhotoIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">
                          {tool.name}
                        </span>
                        {item.quantity && (
                          <span className="text-xs text-gray-500 mt-1">
                            Qty:{" "}
                            <span className="font-semibold text-gray-700">
                              {item.quantity} Unit
                            </span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 uppercase w-8">
                            Code
                          </span>
                          <span className="text-xs font-mono font-medium text-gray-700 bg-gray-50 px-1.5 rounded border">
                            {tool.tool_code || "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 uppercase w-8">
                            S/N
                          </span>
                          <span className="text-xs font-mono font-medium text-gray-700">
                            {tool.serial_number || "-"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900 font-medium">
                          {tool.brand || "-"}
                        </span>
                        <span className="text-xs text-gray-500 italic">
                          {tool.category || "Tanpa Kategori"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getConditionBadge(tool.condition)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryToolsTable;
