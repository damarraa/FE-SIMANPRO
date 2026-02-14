import React from "react";
import { useParams, Link } from "react-router-dom";
import useProjectVehicleRequisitions from "./hooks/useProjectVehicleRequisitions";
import VehicleRequisitionsTable from "../vehicle-requisitions/components/VehicleRequisitionsTable";

const ProjectVehicleRequisitionsPage = () => {
  const { id: projectId } = useParams();
  const { requisitions, isLoading, error } =
    useProjectVehicleRequisitions(projectId);

  if (error)
    return <div className="text-red-500">Gagal memuat data permintaan.</div>;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Daftar Permintaan Kendaraan
        </h1>
        <p className="text-gray-500">
          Kembali ke{" "}
          <Link
            to={`/projects/${projectId}`}
            className="text-blue-600 hover:underline"
          >
            Detail Proyek
          </Link>
        </p>
      </div>

      <VehicleRequisitionsTable
        requisitions={requisitions}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProjectVehicleRequisitionsPage;
