import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { Wrench, Plus, Trash2 } from "lucide-react";
import useProjectList from "../../hooks/useProjectList";
import useToolsList from "../../hooks/useToolsList";

const ToolRequisitionCreatePage = () => {
  const navigate = useNavigate();
  const { projects, isLoading: isLoadingProjects } = useProjectList();
  const { tools, isLoading: isLoadingTools } = useToolsList();

  const [formData, setFormData] = useState({
    project_id: "",
    request_date: new Date().toISOString().slice(0, 10),
    notes: "",
    items: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          tool_id: "",
          quantity_requested: 1,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await api.post("/v1/tool-requisitions", formData);
      navigate("/tool-requisitions", {
        state: { message: "Permintaan Alat baru berhasil dibuat!" },
      });
    } catch (error) {
      if (error.response?.status === 422) setErrors(error.response.data.errors);
      else setErrors({ general: "Gagal menyimpan data. " });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <Wrench className="w-6 h-6" />
        Buat Permintaan Alat Baru
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="">
              <label htmlFor="project_id">Proyek</label>
              <select
                name="project_id"
                id="project_id"
                onChange={handleChange}
                required
                disabled={isLoadingProjects}
                className="mt-1 w-full"
              >
                <option value="">Pilih Proyek</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="">
              <label htmlFor="request_date">Tanggal Permintaan</label>
              <input
                type="date"
                name="request_date"
                id="request_date"
                value={formData.request_date}
                onChange={handleChange}
                required
                className="mt-1 w-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Rincian Alat</h3>
          {formData.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-4 items-center mb-4"
            >
              <div className="col-span-8">
                <select
                  value={item.tool_id}
                  onChange={(e) =>
                    handleItemChange(index, "tool_id", e.target.value)
                  }
                  required
                  disabled={isLoadingTools}
                  className="w-full"
                >
                  <option value="">Pilih Alat</option>
                  {tools.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-3">
                <input
                  type="number"
                  placeholder="Kuantitas"
                  value={item.quantity_requested}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity_requested",
                      e.target.value
                    )
                  }
                  required
                  className="w-full"
                />
              </div>

              <div className="col-span-1">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="text-blue-600 flex items-center gap-2 mt-4"
          >
            <Plus size={16} />
            Tambah Baris
          </button>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button type="button" onClick={() => navigate("/tool-requisitions")}>
            Batal
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ToolRequisitionCreatePage;
