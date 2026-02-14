import api from "../../../api";

/**
 * Mengambil seluruh data laporan harian.
 * @param {string|number} projectId
 */
export const getDailyReports = async (projectId) => {
  const response = await api.get(`/v1/projects/${projectId}/daily-reports`);
  return response.data;
};

/**
 * Mengambil detail satu laporan harian, termasuk log aktivitasnya.
 * @param {string|number} reportId
 */
export const getDailyReportsDetail = async (reportId) => {
  const response = await api.get(`/v1/daily-reports/${reportId}`);
  return response.data;
};

/**
 * Update laporan harian. Menggunakan POST dengan method spoofing (_method: 'PUT')
 * karena FormData tidak support PUT.
 * @param {string|number} reportId - ID dari laporan yang akan diupdate.
 * @param {FormData} data - Data form, termasuk gambar baru dan daftar gambar yang dihapus.
 */
export const updateDailyReport = async (reportId, data) => {
  data.append("_method", "PUT");

  const response = await api.post(`/v1/daily-reports/${reportId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Delete laporan harian.
 * @param {string|number} reportId - ID dari laporan yang akan di delete.
 */
export const deleteDailyReport = async (reportId) => {
  await api.delete(`/v1/daily-reports/${reportId}`);
};

/**
 * Membuat log aktivitas baru di dalam laporan harian
 * @param {string|number} reportId
 * @param {object} data
 */
export const createWorkActivityLog = async (reportId, formData) => {
  const response = await api.post(
    `/v1/daily-reports/${reportId}/activity-logs`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Menghapus log aktivitas.
 * @param {string|number} activityLogId
 */
export const deleteWorkActivityLog = async (activityLogId) => {
  await api.delete(`/v1/activity-logs/${activityLogId}`);
};
