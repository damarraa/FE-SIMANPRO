import api from "../../../api";

export const getVehicleRequisitionsByProject = async (projectId) => {
  const response = await api.get(
    `/v1/projects/${projectId}/vehicle-requisitions`
  );
  return response.data;
};
