import React, { useState, useEffect } from "react";
import { Calendar, FileText, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useLeaveRequests from "../leaves/hooks/useLeaveRequest";

const LeaveRequestPage = () => {
  const navigate = useNavigate();
  const { leavesData, isLoading, submitLeave, fetchLeaves } =
    useLeaveRequests();

  const [formData, setFormData] = useState({
    type: "annual",
    start_date: "",
    end_date: "",
    reason: "",
    attachment: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const leavesList = leavesData?.data || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    const success = await submitLeave(data);
    if (success) {
      setFormData({
        type: "annual",
        start_date: "",
        end_date: "",
        reason: "",
        attachment: null,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-full space-y-8 p-4">
      <h1 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
        <Calendar className="w-6 h-6" /> Pengajuan Cuti / Izin
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          Form Pengajuan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Izin
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
            >
              <option value="annual">Cuti Tahunan</option>
              <option value="sick">Sakit</option>
              <option value="permit">Izin</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lampiran (Surat Dokter/dll)
            </label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2 text-sm text-gray-600 transition">
                <Upload size={16} />
                {formData.attachment
                  ? formData.attachment.name
                  : "Pilih File..."}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Selesai
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alasan
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              required
              placeholder="Jelaskan alasan pengajuan..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <button
            onClick={() => navigate("/leaves")}
            className="bg-white text-gray-700 border border-gray-400 px-6 py-2 rounded-lg disabled:bg-gray-400 hover:bg-[#2196F3] hover:text-white transition"
          >
            Kembali
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#2196F3] text-white border px-6 py-2 rounded-lg disabled:bg-gray-400 hover:bg-blue-600 transition"
          >
            {isSubmitting ? "Mengirim..." : "Ajukan Permohonan"}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5" /> Riwayat Pengajuan
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-800 font-medium">
              <tr>
                <th className="px-6 py-4">Tipe</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Durasi</th>
                <th className="px-6 py-4">Alasan</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : leavesList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Belum ada pengajuan.
                  </td>
                </tr>
              ) : (
                leavesList.map((leave) => (
                  <tr
                    key={leave.id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 capitalize font-medium">
                      {leave.type}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(leave.start_date).toLocaleDateString()} s/d{" "}
                      {new Date(leave.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{leave.days_count} Hari</td>
                    <td className="px-6 py-4 max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${
                          leave.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : leave.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestPage;
