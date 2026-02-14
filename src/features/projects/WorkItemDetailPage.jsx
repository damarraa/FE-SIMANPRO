import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import useWorkItemDetail from "./hooks/useWorkItemDetail";
import WorkItemMaterialsTable from "./components/WorkItemMaterialsTable";
import WorkItemLaborsTable from "./components/WorkItemLaborsTable";
import CurrencyInput from "react-currency-input-field";
import { ClipboardList } from "lucide-react";

const WorkItemDetailPage = () => {
  const navigate = useNavigate();
  const { id: workItemId } = useParams();
  const { workItem, isLoading, update, refresh } = useWorkItemDetail();

  const user = useAuthStore((state) => state.user);
  const firstRole = user?.roles?.[0];
  const userRole =
    (typeof firstRole === "object" ? firstRole.name : firstRole) || "Guest";
  // const user = useAuthStore((state) => state.user);
  // const userRole = user?.roles?.[0]?.name || "Guest";

  // Debugging
  // console.log("userRole saat ini adalah ", userRole);
  const hasFullAccess = ["Admin", "Super Admin"].includes(userRole);

  const [formData, setFormData] = useState({
    work_id: "",
    sub_work_id: "",
    volume: "",
    unit: "",
    description: "",
    materials: [],
    labors: [],
    contract_value: 0,
    realized_volume: 0,
  });

  useEffect(() => {
    if (workItem) {
      setFormData({
        work_id: workItem.work_id || "",
        sub_work_id: workItem.sub_work_id || null,
        volume: workItem.planned_volume || "",
        unit: workItem.unit || "",
        description: workItem.description || "",
        materials: workItem.materials || [],
        labors: workItem.labors || [],
        contract_value: parseFloat(workItem.contract_value) || 0,
        realized_volume: parseFloat(workItem.realized_volume) || 0,
      });
    }
  }, [workItem]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCurrencyChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      contract_value: value === undefined ? 0 : value,
    }));
  };

  const handleDetailChange = (details) => {
    setFormData((prev) => ({ ...prev, ...details }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await update(formData);
  };

  if (isLoading || !workItem) return <div>Loading...</div>;

  const displayName = workItem?.sub_work_name ?? workItem?.work_name;
  const totalPlannedAmount = workItem.total_planned_amount || 0;
  const realizedAmount = workItem.realized_amount || 0;
  const varianceVolume = workItem.variance_volume || 0;
  const varianceAmount = workItem.variance_amount || 0;
  const plannedMargin = workItem.margin || 0;
  const plannedMarginPercentage = workItem.margin_percentage || 0;
  const realizedMargin = workItem.realized_margin || 0;
  const realizedMarginPercentage = workItem.realized_margin_percentage || 0;

  const currentContractValue = parseFloat(formData.contract_value) || 0;
  const currentMargin = currentContractValue - totalPlannedAmount;
  const currentMarginPercentage =
    currentContractValue > 0 ? (currentMargin / currentContractValue) * 100 : 0;

  const marginColor = currentMargin >= 0 ? "text-green-600" : "text-red-600";
  const realizedMarginColor =
    realizedMargin >= 0 ? "text-green-600" : "text-red-600";
  const varianceVolumeColor =
    varianceVolume >= 0 ? "text-green-600" : "text-red-600";
  const varianceAmountColor =
    varianceAmount >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div className="w-full space-y-8">
      <h1 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
        <ClipboardList className="w-6 h-6" />
        Detail Item Pekerjaan: {displayName}
      </h1>

      {/* Form Edit Data Dasar */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Pekerjaan
              </label>
              <div className="mt-1 block w-full h-full text-gray-600 bg-gray-100 border border-gray-300 rounded p-2">
                <p className="font-semibold">{displayName}</p>
                {workItem?.sub_work_name && (
                  <p className="text-xs text-gray-500">
                    Kategori: {workItem.work_name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="volume"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Volume (Kontrak)
              </label>
              <input
                id="volume"
                name="volume"
                type="number"
                value={formData.volume}
                onChange={handleChange}
                readOnly={!hasFullAccess}
                className="mt-1 block w-full text-gray-800 border border-gray-500 rounded p-1"
              />
            </div>
            <div>
              <label
                htmlFor="realized_volume"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Volume (Realisasi)
              </label>
              <input
                id="realized_volume"
                name="realized_volume"
                type="number"
                value={formData.realized_volume}
                onChange={handleChange}
                className="mt-1 block w-full text-gray-800 border border-gray-500 rounded p-1"
              />
            </div>
            <div>
              <label
                htmlFor="unit"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Satuan
              </label>
              <input
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                readOnly={!hasFullAccess}
                className="mt-1 block w-full text-gray-800 border border-gray-500 rounded p-1"
              />
            </div>
          </div>
          <div className="mt-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="mt-1 block w-full text-gray-800 border border-gray-500 rounded p-1"
            ></textarea>
          </div>
        </div>

        {hasFullAccess && (
          <>
            {/* Ringkasan Biaya Otomatis */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mt-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Ringkasan Biaya & Kontrak
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="">
                  <label htmlFor="" className="text-sm text-gray-500">
                    Harga Satuan (Material + Jasa)
                  </label>
                  <p className="text-2xl font-bold text-gray-800">
                    Rp {workItem?.unit_price.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="">
                  <label htmlFor="" className="text-sm text-gray-500">
                    Total Kontrak/Rencana Anggaran (Modal)
                  </label>
                  <p className="text-2xl font-bold text-gray-800">
                    Rp {workItem?.total_planned_amount.toLocaleString("id-ID")}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="contract_value"
                    className="text-sm font-medium text-gray-500"
                  >
                    Nilai Kontrak
                  </label>
                  <CurrencyInput
                    id="contract_value"
                    name="contract_value"
                    className="mt-1 block w-full text-2xl font-bold text-gray-800 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-1"
                    value={formData.contract_value}
                    onValueChange={handleCurrencyChange}
                    prefix="Rp "
                    groupSeparator="."
                    decimalSeparator=","
                    decimalsLimit={2}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Margin / Keuntungan (Kontrak vs Modal Awal)
                  </label>
                  <p
                    className={`text-2xl font-bold text-gray-700 ${marginColor}`}
                  >
                    Rp {plannedMargin.toLocaleString("id-ID")}
                    {/* Rp {currentMargin.toLocaleString("id-ID")} */}
                  </p>
                  <p
                    className={`text-xs font-semibold text-gray-700 ${marginColor}`}
                  >
                    ({plannedMarginPercentage.toFixed(2)}%)
                    {/* ({currentMarginPercentage.toFixed(2)}%) */}
                  </p>
                </div>
              </div>
            </div>

            {/* Ringkasan Realisasi & Variansi */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mt-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Ringkasan Realisasi & Variansi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="">
                  <label htmlFor="" className="text-sm text-gray-500">
                    Total Biaya Realisasi (Modal Aktual)
                  </label>
                  <p className="text-xl font-bold text-gray-800">
                    Rp {realizedAmount.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="">
                  <label htmlFor="" className="text-sm text-gray-500">
                    Variansi Volume (Realisasi - Rencana)
                  </label>
                  <p className={`text-xl font-bold ${varianceVolumeColor}`}>
                    {varianceVolume.toLocaleString("id-ID", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    {workItem.unit}
                  </p>
                </div>
                <div className="">
                  <label htmlFor="" className="text-sm text-gray-500">
                    Variansi Biaya (Realisasi - Rencana)
                  </label>
                  <p className={`text-xl font-bold ${varianceAmountColor}`}>
                    Rp {varianceAmount.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="">
                  <label
                    htmlFor=""
                    className="text-sm font-medium text-gray-700"
                  >
                    Margin Realisasi (Kontrak vs Modal Aktual)
                  </label>
                  <p className={`text-xl font-bold ${realizedMarginColor}`}>
                    Rp {realizedMargin.toLocaleString("id-ID")}
                  </p>
                  <p className={`text-xs font-semibold ${realizedMarginColor}`}>
                    ({realizedMarginPercentage.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end gap-4 mt-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => {
              if (workItem?.project_id) {
                navigate(`/projects/${workItem.project_id}`);
              } else {
                navigate("/projects");
              }
            }}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg"
          >
            Kembali
          </button>
          
          {hasFullAccess && (
            <button
              type="submit"
              className="bg-[#2196F3] text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
            >
              Simpan Perubahan
            </button>
          )}
        </div>
      </form>

      {/* Rincian Biaya Material */}
      <WorkItemMaterialsTable
        materials={formData.materials}
        onParentUpdate={handleDetailChange}
        userRole={userRole}
      />

      {/* Rincian Biaya Jasa */}
      <WorkItemLaborsTable
        labors={formData.labors}
        onParentUpdate={handleDetailChange}
        userRole={userRole}
      />
    </div>
  );
};

export default WorkItemDetailPage;
