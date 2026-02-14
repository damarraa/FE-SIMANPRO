import React, { useState } from "react";
import useProjectList from "../../../hooks/useProjectList";

const AssignmentForm = ({ onSave, onCancel, isLoading: isSubmitting }) => {
  const { projects, isLoading: isLoadingProjects } = useProjectList();
  const [projectId, setProjectId] = useState("");
  const [assignedDate, setAssignedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ project_id: projectId, assigned_date: assignedDate });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-50 p-4 rounded-lg mb-4"
    >
      <div>
        <label
          htmlFor="projectId"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Pilih Proyek
        </label>
        <select
          id="projectId"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
          disabled={isLoadingProjects}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Pilih...</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="assignedDate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tanggal Penugasan
        </label>
        <input
          id="assignedDate"
          type="date"
          value={assignedDate}
          onChange={(e) => setAssignedDate(e.target.value)}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
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
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
};

export default AssignmentForm;
