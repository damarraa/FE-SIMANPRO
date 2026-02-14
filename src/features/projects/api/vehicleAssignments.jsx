import api from "../../../api";

export const getProjectVehicleAssignments = async (projectId) => {
  const response = await api.get(
    `/v1/projects/${projectId}/vehicle-assignments`
  );
  return response.data;
};
