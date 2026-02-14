import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUsersByRole from "../../hooks/useUsersByRole";
import useWarehouseDetail from "./hooks/useWarehouseDetail";
import useInventoryStocks from "./hooks/useInventoryStocks";
import useInventoryTools from "./hooks/useInventoryTools";
import InventoryStocksTable from "./components/InventoryStocksTable";
import InventoryToolsTable from "./components/InventoryToolsTable";
import { WrenchScrewdriverIcon, CubeIcon } from "@heroicons/react/24/outline";
import { Warehouse } from "lucide-react";
import Swal from "sweetalert2";

const WarehouseDetailPage = () => {
  const navigate = useNavigate();
  const { id: warehouseId } = useParams();

  const { warehouse, isLoading, updateWarehouse } = useWarehouseDetail();
  const { users: logisticUsers } = useUsersByRole("Logistic");

  const { stocks, isLoading: isLoadingStocks } =
    useInventoryStocks(warehouseId);
  const { tools, isLoading: isLoadingTools } = useInventoryTools(warehouseId);

  const [formData, setFormData] = useState({
    warehouse_name: "",
    address: "",
    phone: "",
    pic_user_id: "",
  });

  const [activeTab, setActiveTab] = useState("materials");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (warehouse) {
      setFormData({
        warehouse_name: warehouse.warehouse_name || "",
        address: warehouse.address || "",
        phone: warehouse.phone || "",
        pic_user_id: warehouse.pic?.id || "",
      });
    }
  }, [warehouse]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await updateWarehouse(formData);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data gudang berhasil diperbarui.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/warehouses");
      });
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        Toast.fire({
          icon: "warning",
          title: "Mohon periksa kembali inputan Anda.",
        });
      } else {
        setErrors({ general: "Gagal memperbarui data. Silakan coba lagi." });
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text:
            err.response?.data?.message ||
            "Gagal memperbarui data. Silakan coba lagi.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading detail gudang...
      </div>
    );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pb-20">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <Warehouse className="w-6 h-6" />
        Detail Gudang: {warehouse?.warehouse_name}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
              Informasi Gudang
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Gudang
                  </label>
                  <input
                    type="text"
                    name="warehouse_name"
                    value={formData.warehouse_name}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  {errors.warehouse_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.warehouse_name[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIC Gudang
                  </label>
                  <select
                    name="pic_user_id"
                    value={formData.pic_user_id}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Pilih PIC</option>
                    {logisticUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <textarea
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="pt-4 flex gap-3 border-t mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    {loading ? "Menyimpan..." : "Simpan Info"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/warehouses")}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Kembali
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Navigasi versi tab */}
        <div className="lg:col-span-2">
          {/* Tab Header */}
          <div className="bg-white rounded-t-xl border-b border-gray-200 px-2 flex">
            <button
              onClick={() => setActiveTab("materials")}
              className={`flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === "materials"
                  ? "border-blue-500 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <CubeIcon className="w-4 h-4" />
              Stok Material
              <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {stocks ? stocks.length : 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("tools")}
              className={`flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === "tools"
                  ? "border-orange-500 text-orange-600 bg-orange-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <WrenchScrewdriverIcon className="w-4 h-4" />
              Inventaris Alat
              <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tools ? tools.length : 0}
              </span>
            </button>
          </div>

          {/* Tab Content Area */}
          <div className="bg-transparent pt-2 min-h-[400px]">
            {activeTab === "materials" && (
              <div className="animate-fadeIn">
                <InventoryStocksTable
                  stocks={stocks}
                  isLoading={isLoadingStocks}
                />
              </div>
            )}

            {activeTab === "tools" && (
              <div className="animate-fadeIn">
                <InventoryToolsTable tools={tools} isLoading={isLoadingTools} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDetailPage;
