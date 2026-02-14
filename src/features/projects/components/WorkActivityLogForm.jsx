import React, { useState, useEffect } from "react";
import useProjectWorkItemsList from "../hooks/useProjectWorkItemsList";
import { PhotoIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { createProjectWorkItem } from "../api/projectWorkItems";
import CreatableSelect from "react-select/creatable";
import Swal from "sweetalert2";

const WorkActivityLogForm = ({ onSave, onCancel, isLoading, projectId }) => {
  const { workItems: initialWorkItems, isLoading: isLoadingWorkItems } =
    useProjectWorkItemsList(projectId);

  // console.log("Data dari hook: ", initialWorkItems);

  const [localWorkItems, setLocalWorkItems] = useState([]);
  const [selectedWorkItemOption, setSelectedWorkItemOption] = useState(null);
  const [isCreatingWorkItem, setIsCreatingWorkItem] = useState(false);

  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("");

  useEffect(() => {
    if (initialWorkItems) {
      setLocalWorkItems(initialWorkItems);
    }
  }, [initialWorkItems]);

  const [formData, setFormData] = useState({
    work_item_id: "",
    realized_volume: "",
    realization_date: new Date().toISOString().slice(0, 10),
    notes: "",
    realization_docs: [],
    control_docs: [],
  });

  const [realizationPreviews, setRealizationPreviews] = useState([]);
  const [controlPreviews, setControlPreviews] = useState([]);

  const remainingVolume = selectedWorkItemOption
    ? selectedWorkItemOption.data.remaining_volume
    : 0;

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);

    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], ...files],
    }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    if (type === "realization_docs") {
      setRealizationPreviews((prev) => [...prev, ...newPreviews]);
    } else if (type === "control_docs") {
      setControlPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));

    if (type === "realization_docs") {
      setRealizationPreviews((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "control_docs") {
      setControlPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleWorkItemChange = (selectedOption) => {
    setSelectedWorkItemOption(selectedOption);

    setFormData((prev) => ({
      ...prev,
      work_item_id: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleCreateWorkItem = (inputValue) => {
    setNewItemName(inputValue);
    setNewItemUnit("");
    setIsUnitModalOpen(true);
  };

  const confirmCreateWorkItem = async () => {
    if (!newItemUnit) {
      // alert("Mohon isi satuan unit terlebih dahulu.");
      Swal.fire({
        icon: "warning",
        title: "Satuan Kosong",
        text: "Mohon isi satuan unit terlebih dahulu (contoh: m3, set).",
      });
      return;
    }

    setIsCreatingWorkItem(true);
    try {
      const newWorkItem = await createProjectWorkItem({
        name: newItemName,
        unit: newItemUnit,
        project_id: projectId,
      });

      const actualWorkItem = newWorkItem.data;

      let labelName =
        actualWorkItem.sub_work_name ||
        actualWorkItem.work_name ||
        actualWorkItem.template?.name ||
        actualWorkItem.name ||
        newItemName;

      const newOption = {
        value: actualWorkItem.id,
        label: `${labelName} (${actualWorkItem.total_realized || 0}/${
          actualWorkItem.planned_volume || 0
        })`,
        data: actualWorkItem,
      };

      setLocalWorkItems((prev) => [...prev, actualWorkItem]);
      handleWorkItemChange(newOption);

      setIsUnitModalOpen(false);
      setNewItemName("");
      setNewItemUnit("");

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      Toast.fire({
        icon: "success",
        title: "Item pekerjaan baru berhasil dibuat.",
      });
    } catch (error) {
      // console.error("Gagal membuat item pekerjaan baru: ", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal membuat item pekerjaan baru.",
      });
    } finally {
      setIsCreatingWorkItem(false);
    }
  };

  // const handleCreateWorkItem = async (inputValue) => {
  //   setIsCreatingWorkItem(true);
  //   try {
  //     const newWorkItem = await createProjectWorkItem({
  //       name: inputValue,
  //       project_id: projectId,
  //     });

  //     const actualWorkItem = newWorkItem.data;

  //     let labelName =
  //       actualWorkItem.sub_work_name ||
  //       actualWorkItem.work_name ||
  //       actualWorkItem.template?.name ||
  //       actualWorkItem.name ||
  //       inputValue;

  //     const newOption = {
  //       value: actualWorkItem.id,
  //       label: `${labelName} (${actualWorkItem.total_realized || 0}/${
  //         actualWorkItem.planned_volume || 0
  //       })`,
  //       data: actualWorkItem,
  //     };

  //     setLocalWorkItems((prev) => [...prev, actualWorkItem]);
  //     handleWorkItemChange(newOption);
  //   } catch (error) {
  //     console.error("Gagal membuat item pekerjaan baru: ", error);
  //   } finally {
  //     setIsCreatingWorkItem(false);
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.work_item_id) {
      Swal.fire({
        icon: "warning",
        title: "Pilih Pekerjaan",
        text: "Silakan pilih atau buat item pekerjaan terlebih dahulu.",
      });
      return;
    }

    const data = new FormData();
    data.append("work_item_id", formData.work_item_id);
    data.append("realized_volume", formData.realized_volume);
    data.append("realization_date", formData.realization_date);

    if (formData.notes) {
      data.append("notes", formData.notes);
    }

    formData.realization_docs.forEach((file) =>
      data.append("realization_docs[]", file)
    );

    formData.control_docs.forEach((file) =>
      data.append("control_docs[]", file)
    );

    onSave(data);
  };

  const workItemOptions = localWorkItems.map((item) => {
    let label = item.sub_work_name ? item.sub_work_name : item.work_name;

    if (!label) label = "Item Pekerjaan Tanpa Nama";

    if (item.template && item.template.parent) {
      if (item.template.parent.parent) {
        label = `${item.template.parent.parent.name} > ${item.template.parent.name} > ${item.template.name}`;
      } else {
        label = `${item.template.parent.name} > ${item.template.name}`;
      }
    }

    return {
      value: item.id,
      label: `${label} (${item.total_realized}/${item.planned_volume})`,
      data: item,
    };
  });

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-50 p-4 rounded-lg mb-4 border"
      >
        <h4 className="font-medium text-gray-800">Tambah Kegiatan Kerja</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label
              htmlFor="work_item_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Item Pekerjaan
            </label>
            <CreatableSelect
              id="work_item_id"
              name="work_item_id"
              isClearable
              options={workItemOptions}
              value={selectedWorkItemOption}
              onChange={handleWorkItemChange}
              onCreateOption={handleCreateWorkItem}
              isLoading={isLoadingWorkItems || isCreatingWorkItem}
              isDisabled={isLoadingWorkItems || isCreatingWorkItem}
              placeholder="Pilih atau ketik item pekerjaan..."
              className="text-gray-800"
              formatCreateLabel={(inputValue) =>
                `Buat item baru: "${inputValue}"`
              }
            />
          </div>

          <div className="">
            <label
              htmlFor="realized_volume"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Volume Realisasi
            </label>
            <input
              type="number"
              name="realized_volume"
              id="realized_volume"
              value={formData.realized_volume}
              onChange={handleChange}
              min="0"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 text-gray-900 focus:border-blue-500 mt-1"
            />
            {selectedWorkItemOption &&
              (Number(formData.realized_volume) > remainingVolume ? (
                <p className="text-xs text-yellow-600 font-medium mt-1">
                  Perhatian: Volume realisasi ({formData.realized_volume})
                  melebihi sisa kontrak ({remainingVolume}).
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  Sisa volume: {remainingVolume}
                </p>
              ))}
          </div>

          <div>
            <label
              htmlFor="realization_date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tanggal Realisasi
            </label>
            <input
              type="date"
              name="realization_date"
              id="realization_date"
              value={formData.realization_date}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Catatan
            </label>
            <textarea
              name="notes"
              id="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Tambahkan catatan..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="realization_docs"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Foto Realisasi (Maks. 2MB/Foto)
            </label>
            <div className="mt-2 flex items-center justify-center px-6 pt-5pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="realization_docs"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Unggah File</span>
                    <input
                      type="file"
                      name="realization_docs"
                      id="realization_docs"
                      className="sr-only"
                      multiple
                      onChange={(e) => handleFileChange(e, "realization_docs")}
                      accept="image/jpeg,image/png,image/webp"
                    />
                  </label>
                  <p className="pl-1">atau tarik dan lepas</p>
                </div>
              </div>
            </div>

            {realizationPreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {realizationPreviews.map((previewUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={previewUrl}
                      alt={`Realization ${index + 1}`}
                      className="h-28 w-full object-cover rounded-md"
                    />
                    <div className="absolute top-0 right-0">
                      <button
                        type="button"
                        onClick={() => removeFile(index, "realization_docs")}
                        className="p-1 bg-red-500 text-white rounded-full opacity-75 group-hover:opacity-100 transition-opacity"
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* <div className="md:col-span-3">
            <label
              htmlFor="control_docs"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Foto Kontrol (Maks. 2MB/Foto)
            </label>
            <div className="mt-2 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="control_docs"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Unggah File</span>
                    <input
                      type="file"
                      name="control_docs"
                      id="control_docs"
                      className="sr-only"
                      multiple
                      onChange={(e) => handleFileChange(e, "control_docs")}
                      accept="image/jpeg,image/png,image/webp"
                    />
                  </label>
                  <p className="pl-1">atau tarik dan lepas</p>
                </div>
              </div>
            </div>

            {controlPreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {controlPreviews.map((previewUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={previewUrl}
                      alt={`Control ${index + 1}`}
                      className="h-28 w-full object-cover rounded-md"
                    />
                    <div className="absolute top-0 right-0">
                      <button
                        type="button"
                        onClick={() => removeFile(index, "control_docs")}
                        className="p-1 bg-red-500 text-white rounded-full opacity-75 group-hover:opacity-100 transition-opacity"
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div> */}
        </div>

        <div className="flex justify-end gap-4 mt-4 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading || isCreatingWorkItem}
            className="bg-[#2196F3] text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
          >
            {isLoading
              ? "Menyimpan..."
              : isCreatingWorkItem
              ? "Membuat item..."
              : "Simpan"}
          </button>
        </div>
      </form>

      {isUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Lengkapi Data Item Pekerjaan Baru
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                Nama Item Pekerjaan Baru:
              </p>
              <p className="font-semibold text-gray-800 bg-gray-100 p-2 rounded">
                {newItemName}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Satuan Unit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="unit"
                id="unit"
                placeholder="Contoh: keg, m3, ls, set, btg"
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsUnitModalOpen(false);
                  setNewItemName("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmCreateWorkItem}
                disabled={isCreatingWorkItem}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isCreatingWorkItem ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkActivityLogForm;
