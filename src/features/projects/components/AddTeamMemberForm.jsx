import React, { useState, useMemo } from "react";
import useContactsList from "../../../hooks/useContactsList";
import useUsersList from "../../../hooks/useUsersList";
import CreatableSelect from "react-select/creatable";
import api from "../../../api";
import Swal from "sweetalert2";

const DEFAULT_ROLE_OPTIONS = [
  { value: "Supervisor", label: "Supervisor" },
  { value: "Kepala Tukang / Mandor", label: "Kepala Tukang / Mandor" },
  { value: "Kepala Tukang Batu", label: "Kepala Tukang Batu" },
  { value: "Kepala Tukang Kayu", label: "Kepala Tukang Kayu" },
  {
    value: "Kepala Tukang Listrik / Mandor",
    label: "Kepala Tukang Listrik / Mandor",
  },
  { value: "Pekerja", label: "Pekerja" },
  { value: "Tukang", label: "Tukang" },
  { value: "Tukang Batu", label: "Tukang Batu" },
  { value: "Tukang Besi", label: "Tukang Besi" },
  { value: "Tukang Cat", label: "Tukang Cat" },
  { value: "Tukang Kayu", label: "Tukang Kayu" },
  { value: "Tukang Las", label: "Tukang Las" },
  { value: "Tukang Listrik", label: "Tukang Listrik" },
];

const AddTeamMemberForm = ({ onSave, onCancel, isLoading }) => {
  const { users, isLoading: isLoadingUsers } = useUsersList();
  const { contacts, isLoading: isLoadingContacts } = useContactsList();
  const [selectedMember, setSelectedMember] = useState(null);
  const [roleInProject, setRoleInProject] = useState(null);
  const [roleOptions, setRoleOptions] = useState(DEFAULT_ROLE_OPTIONS);
  const [isCreating, setIsCreating] = useState(false);

  const toTitleCase = (str) => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const combinedOptions = useMemo(() => {
    const userOptions = users.map((user) => ({
      value: `user-${user.id}`,
      label: `${user.name} (Internal)`,
    }));

    const contactOptions = contacts.map((contact) => ({
      value: `contact-${contact.id}`,
      label: `${contact.name} (Eksternal)`,
    }));

    return [...userOptions, ...contactOptions];
  }, [users, contacts]);

  const handleCreateOption = async (inputValue) => {
    setIsCreating(true);
    try {
      const response = await api.post("/v1/contacts", { name: inputValue });
      const newContact = response.data.data;

      const newOption = {
        value: `contact-${newContact.id}`,
        label: `${newContact.name} (Eksternal)`,
        __isNew__: true,
      };

      setSelectedMember(newOption);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      Toast.fire({
        icon: "success",
        title: "Kontak eksternal baru berhasil dibuat!",
      });
    } catch (error) {
      // console.error("Gagal membuat kontak baru", error);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      Toast.fire({
        icon: "error",
        title: "Gagal membuat kontak baru.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateRoleOption = (inputValue) => {
    const formattedLabel = toTitleCase(inputValue);
    const newOption = { value: formattedLabel, label: formattedLabel };
    setRoleOptions((prev) => [...prev, newOption]);
    setRoleInProject(newOption);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(selectedMember, roleInProject ? roleInProject.value : "");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-50 p-4 rounded-lg mb-4 border"
    >
      <h4 className="font-medium text-gray-800">Tambah Anggota Tim</h4>

      <div className="">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pilih Anggota Tim atau Ketik Nama Baru
        </label>
        <CreatableSelect
          isClearable
          isLoading={isLoadingUsers || isLoadingContacts || isCreating}
          options={combinedOptions}
          value={selectedMember}
          onChange={(newValue) => setSelectedMember(newValue)}
          onCreateOption={handleCreateOption}
          placeholder="Pilih atau ketik nama..."
          className="text-gray-800"
          formatCreateLabel={(inputValue) =>
            `Tambah "${inputValue}" sebagai anggota eksternal`
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Peran dalam Proyek
        </label>
        <CreatableSelect
          isClearable
          options={roleOptions}
          value={roleInProject}
          onChange={(newValue) => setRoleInProject(newValue)}
          onCreateOption={handleCreateRoleOption}
          placeholder="Pilih atau ketik peran baru..."
          className="text-gray-800"
          formatCreateLabel={(inputValue) =>
            `Buat peran baru: "${toTitleCase(inputValue)}"`
          }
        />
        <p className="text-xs text-gray-500 mt-1">
          *Ketik untuk menambahkan peran baru jika tidak ada dalam daftar.
        </p>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={
            isLoading ||
            isLoadingContacts ||
            isCreating ||
            !selectedMember ||
            !roleInProject
          }
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg disabled:bg-gray-400"
        >
          {isLoading || isLoadingContacts || isCreating
            ? "Memproses..."
            : "Tambah"}
        </button>
      </div>
    </form>
  );
};

export default AddTeamMemberForm;
