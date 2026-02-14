import React, { useState, useMemo } from "react";
import api from "../../../api";
import { Plus, Trash2 } from "lucide-react";
import useToolsList from "../../../hooks/useToolsList";
import CreatableSelect from "react-select/creatable";
import Swal from "sweetalert2";

const AddToolRequestForm = ({ projectId, onSuccess, onCancel }) => {
  const { tools, isLoading: isLoadingTools } = useToolsList();
  const [formData, setFormData] = useState({
    project_id: projectId,
    request_date: new Date().toISOString().slice(0, 10),
    notes: "",
    items: [
      {
        tool: null,
        quantity_requested: 1,
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const toolOptions = useMemo(() => {
    return tools.map((t) => ({
      value: t.id,
      label: `${t.name} (${t.tool_code || "N/A"})`,
      __isNew__: false,
    }));
  }, [tools]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleToolChange = (index, selectedOption) => {
    const newItems = [...formData.items];
    newItems[index].tool = selectedOption;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          tool: null,
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

    const payload = {
      project_id: formData.project_id,
      request_date: formData.request_date,
      notes: formData.notes,
      items: formData.items
        .filter((item) => item.tool)
        .map((item) => {
          if (item.tool.__isNew__) {
            return {
              quantity_requested: item.quantity_requested,
              new_tool_data: {
                name: item.tool.value,
              },
            };
          }

          return {
            tool_id: item.tool.value,
            quantity_requested: item.quantity_requested,
          };
        }),
    };

    if (payload.items.length === 0) {
      setErrors({ items: "Harap tambahkan setidaknya satu alat." });
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(
        `/v1/projects/${projectId}/tool-requisitions`,
        payload
      );
      const { tr_number, pdf_url } = response.data.data;

      Swal.fire({
        title: "Berhasil!",
        text: `Permintaan ${tr_number} berhasil dibuat.`,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Download PDF",
        cancelButtonText: "Tutup",
        confirmButtonColor: "#2563EB",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const downloadResponse = await api.get(
              `/v1/projects/${projectId}/tool-requisitions/${response.data.data.id}/export`,
              {
                responseType: "blob",
              }
            );

            const url = window.URL.createObjectURL(
              new Blob([downloadResponse.data])
            );
            const link = document.createElement("a");
            link.href = url;

            const contentDisposition =
              downloadResponse.headers["content-disposition"];
            let fileName = `Permintaan_Alat_${tr_number}.pdf`;

            if (contentDisposition) {
              const fileNameMatch =
                contentDisposition.match(/filename="?(.+)"?/);
              if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
            }

            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error("Gagal download via API:", error);
            Swal.fire("Gagal", "Gagal mengunduh file.", "error");
          }
        }
        onSuccess();
      });
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Gagal membuat permintaan alat: ", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat menyimpan data.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 my-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="">
            <label
              htmlFor="request_date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tanggal Permintaan
            </label>
            <input
              type="date"
              name="request_date"
              id="request_date"
              value={formData.request_date}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900"
            />
            {errors.request_date && (
              <p className="text-sm text-red-600 mt-1">
                {errors.request_date[0]}
              </p>
            )}
          </div>
          <div className="">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Catatan (Opsional)
            </label>
            <input
              type="text"
              name="notes"
              id="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Contoh: Tolong segera dikirim"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900"
            />
          </div>
        </div>

        <div className="">
          <h3 className="text-lg font-semibold text-gray-800">Rincian Alat</h3>
          {errors.items && (
            <p className="text-sm text-red-600 mt-1">{errors.items[0]}</p>
          )}

          {formData.items.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap gap-4 items-start pt-4 mt-4 border-t"
            >
              <div className="flex-1" style={{ minWidth: "300px" }}>
                <CreatableSelect
                  isClearable
                  isDisabled={isLoadingTools}
                  isLoading={isLoadingTools}
                  options={toolOptions}
                  value={item.tool}
                  onChange={(option) => handleToolChange(index, option)}
                  placeholder="Pilih atau ketik alat baru..."
                  formatCreateLabel={(inputValue) =>
                    `Buat alat baru: "${inputValue}"`
                  }
                  classNamePrefix="react-select"
                  className="text-gray-800"
                />
                {errors[`items.${index}.tool_id`] && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors[`items.${index}.tool_id`][0]}
                  </p>
                )}
                {errors[`items.${index}.new_tool_data.name`] && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors[`items.${index}.new_tool_data.name`][0]}
                  </p>
                )}
              </div>

              <div className="flex-none" style={{ width: "100px" }}>
                <input
                  type="number"
                  placeholder="Jumlah"
                  min="1"
                  value={item.quantity_requested}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity_requested",
                      e.target.value
                    )
                  }
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900"
                />
                {errors[`items.${index}.quantity_requested`] && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors[`items.${index}.quantity_requested`][0]}
                  </p>
                )}
              </div>

              <div className="flex-none self-center pt-5">
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="text-blue-600 flex items-center gap-2 mt-4 text-sm font-medium"
          >
            <Plus size={16} />
            Tambah Alat
          </button>
        </div>

        {errors.general && (
          <p className="text-sm text-red-600">{errors.general}</p>
        )}

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
          >
            {loading ? "Menyimpan..." : "Kirim Permintaan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddToolRequestForm;
