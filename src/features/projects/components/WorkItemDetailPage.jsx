import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useWorkItemDetail from "../hooks/useWorkItemDetail";
import { ClipboardList } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
// import WorkItemMaterialsTable from './components/WorkItemMaterialsTable;
// import WorkItemLaborsTable from './components/WorkItemLaborsTable;

const WorkItemDetailPage = () => {
  const navigate = useNavigate();
  const { workItem, isLoading, update, refresh } = useWorkItemDetail();

  const [formData, setFormData] = useState({
    name: "",
    volume: "",
    unit: "",
    description: "",
  });

  useEffect(() => {
    if (workItem) {
      setFormData({
        name: workItem.name || "",
        volume: workItem.volume || "",
        unit: workItem.unit || "",
        description: workItem.description || "",
      });
    }
  }, [workItem]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Fungsi update di sini hanya untuk data dasar (name, volume, dll)
    // Detail material/jasa akan di-handle di komponennya masing-masing
    await update({
      name: formData.name,
      volume: formData.volume,
      unit: formData.unit,
      description: formData.description,
    });
  };

  const user = useAuthStore((state) => state.user);
  const firstRole = user?.roles?.[0];
  const userRole =
    (typeof firstRole === "object" ? firstRole.name : firstRole) || "Guest";

  const hasFullAccess = ["Admin", "Super Admin"].includes(userRole);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full space-y-8">
      <h1 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
        <ClipboardList className="w-6 h-6" />
        Detail Item Pekerjaan: {workItem?.name}
      </h1>

      <form onSubmit={handleSubmit}></form>

      {/* Ringkasan Biaya Otomatis */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Ringkasan Biaya</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="">
            <label className="text-sm text-gray-500">
              Harga Satuan (Material + Jasa)
            </label>
            <p className="text-xl font-bold text-gray-800">
              Rp {workItem?.unit_price.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="">
            <label className="text-sm text-gray-500">
              Total Rencana Anggaran
            </label>
            <p className="text-xl font-bold text-gray-800">
              Rp {workItem?.total_planned_amount.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Di sini kita akan menaruh komponen untuk Material & Jasa */}
      {/* <WorkItemMaterialsTable materials={workItem?.materials} onDataUpdate={refresh} /> */}
      {/* <WorkItemLaborsTable labors={workItem?.labors} onDataUpdate={refresh} /> */}
    </div>
  );
};
