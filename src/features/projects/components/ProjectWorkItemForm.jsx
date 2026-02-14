import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { fetchWorkTemplates, createWorkTemplate } from "../api/workItems";
import Swal from "sweetalert2";

const formatOptions = (items = []) => {
  return items.map((item) => ({
    value: item.id,
    label: item.name,
    children: item.recursive_children || [],
    // children: item.children || [],
  }));
};

const ProjectWorkItemForm = ({
  onSave,
  onCancel,
  isLoading,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    unit: initialData.unit || "",
    volume: initialData.volume || "",
    description: initialData.description || "",
  });

  const [templates, setTemplates] = useState([]);
  const [level1Options, setLevel1Options] = useState([]);
  const [level2Options, setLevel2Options] = useState([]);
  const [level3Options, setLevel3Options] = useState([]);

  const [selectedL1, setSelectedL1] = useState(null);
  const [selectedL2, setSelectedL2] = useState(null);
  const [selectedL3, setSelectedL3] = useState(null);

  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchAllTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const data = await fetchWorkTemplates();
        setTemplates(data);
        setLevel1Options(formatOptions(data));
      } catch (error) {
        console.error("Gagal mengambil data template pekerjaan: ", error);
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    if (!initialData.id) {
      fetchAllTemplates();
    }
  }, [initialData.id]);

  const handleL1Change = (selectedOption) => {
    setSelectedL1(selectedOption);
    setLevel2Options(
      selectedOption ? formatOptions(selectedOption.children) : []
    );

    setSelectedL2(null);
    setSelectedL3(null);
    setLevel3Options([]);
  };

  const handleL2Change = (selectedOption) => {
    setSelectedL2(selectedOption);
    setLevel3Options(
      selectedOption ? formatOptions(selectedOption.children) : []
    );

    setSelectedL3(null);
  };

  const handleL3Change = (selectedOption) => {
    setSelectedL3(selectedOption);
  };

  const handleGenericChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTemplate = async (
    inputValue,
    level,
    parentId,
    setOptionsFunc,
    setSelectionFunc
  ) => {
    setIsCreating(true);
    try {
      const response = await createWorkTemplate({
        name: inputValue,
        parent_id: parentId,
      });

      const newOption = {
        value: response.id,
        label: response.name,
        children: [],
      };

      setOptionsFunc((prev) => [...prev, newOption]);
      setSelectionFunc(newOption);

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      Toast.fire({
        icon: "success",
        title: `Kategori Level ${level} "${response.name}" berhasil dibuat!`,
      });
    } catch (error) {
      console.error(`Gagal membuat template Level ${level} baru: `, error);

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      Toast.fire({
        icon: "error",
        title: "Gagal membuat kategori baru.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTemplateId =
      selectedL3?.value || selectedL2?.value || selectedL1?.value;

    if (!finalTemplateId) {
      // alert("Silakan pilih uraian pekerjaan (minimal Level 1).");
      Swal.fire({
        icon: "warning",
        title: "Pilih Kategori",
        text: "Silakan pilih uraian pekerjaan (minimal Level 1).",
      });
      return;
    }

    onSave({
      ...formData,
      work_template_id: finalTemplateId,
    });
  };

  if (initialData.id) {
    return <p>Mode edit. Silakan edit dari halaman detail.</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-50 p-4 rounded-lg mb-4 border"
    >
      <h4 className="font-medium text-gray-800">Tambah Item Pekerjaan Baru</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pekerjaan (Level 1)*/}
        <div>
          <label
            htmlFor="work_template_l1"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nama Pekerjaan
          </label>
          <CreatableSelect
            id="work_template_l1"
            name="work_template_l1"
            isClearable
            options={level1Options}
            value={selectedL1}
            onChange={handleL1Change}
            onCreateOption={(name) =>
              handleCreateTemplate(
                name,
                1,
                null,
                setLevel1Options,
                setSelectedL1
              )
            }
            isLoading={isLoadingTemplates || isCreating}
            placeholder="Pilih atau ketik kategori nama pekerjaan..."
            className="text-gray-800"
            formatCreateLabel={(inputValue) =>
              `Tambah kategori "${inputValue}"`
            }
          />
        </div>

        {/* Sub Pekerjaan (Level 2)*/}
        <div>
          <label
            htmlFor="work_template_l2"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sub Pekerjaan (Opsional)
          </label>
          <CreatableSelect
            id="work_template_l2"
            name="work_template_l2"
            isClearable
            options={level2Options}
            value={selectedL2}
            onChange={handleL2Change}
            onCreateOption={(name) =>
              handleCreateTemplate(
                name,
                2,
                selectedL1?.value,
                setLevel2Options,
                setSelectedL2
              )
            }
            isLoading={isCreating}
            isDisabled={!selectedL1 || isLoadingTemplates}
            placeholder={
              !selectedL1
                ? "Pilih nama pekerjaan dulu"
                : "Pilih atau ketik sub pekerjaan..."
            }
            className="text-gray-800"
            formatCreateLabel={(inputValue) => `Tambah L2 "${inputValue}"`}
          />
        </div>

        {/* Sub Sub Pekerjaan (Level 3) */}
        <div>
          <label
            htmlFor="work_template_l3"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sub Sub Pekerjaan (Opsional)
          </label>
          <CreatableSelect
            id="work_template_l3"
            name="work_template_l3"
            isClearable
            options={level3Options}
            value={selectedL3}
            onChange={handleL3Change}
            onCreateOption={(name) =>
              handleCreateTemplate(
                name,
                3,
                selectedL2?.value,
                setLevel3Options,
                setSelectedL3
              )
            }
            isLoading={isCreating}
            isDisabled={!selectedL2 || isLoadingTemplates}
            placeholder={
              !selectedL2
                ? "Pilih sub pekerjaan dulu"
                : "Pilih atau ketik sub sub pekerjaan..."
            }
            className="text-gray-800"
            formatCreateLabel={(inputValue) => `Tambah L3 "${inputValue}"`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Volume */}
        <div>
          <label
            htmlFor="volume"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Volume
          </label>
          <input
            type="number"
            id="volume"
            name="volume"
            step="0.01"
            value={formData.volume}
            onChange={handleGenericChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Satuan */}
        <div>
          <label
            htmlFor="unit"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Satuan
          </label>
          <input
            type="text"
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleGenericChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Deskripsi */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          rows="2"
          value={formData.description}
          onChange={handleGenericChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      {/* Tombol Aksi */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
        >
          {isLoading || isCreating ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
};

export default ProjectWorkItemForm;
