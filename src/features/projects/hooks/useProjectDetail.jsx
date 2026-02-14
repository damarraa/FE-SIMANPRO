// Original
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProject, updateProject } from "../api";

const useProjectDetail = (projectId) => {
  // Changes 09/09/2025
  // const { id } = useParams();

  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Changes 09/09/2025
  const fetchProject = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getProject(projectId);
      const projectData = response.data.data || response.data;
      setProject(projectData);
    } catch (e) {
      console.error("Gagal mengambil detail proyek", e);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const update = async (formData) => {
    try {
      await updateProject(projectId, formData);
      await fetchProject();
    } catch (err) {
      console.error("Error updating project: ", err);
      throw err;
    }
  };

  // Original
  // const update = async (formData) => {
  //   if (!projectId) {
  //     throw new Error("Project ID tidak ada untuk melakukan update.");
  //   }

  //   await updateProject(projectId, formData);
  // };

  return { project, isLoading, update, refresh: fetchProject };

  // Original
  // useEffect(() => {
  //   if (!id) return;
  //   const fetchProject = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await getProject(id);
  //       setProject(response.data);
  //     } catch (e) {
  //       console.error("Gagal mengambil detail proyek", e);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchProject();
  // }, [id]);

  // const update = async (formData) => {
  //   await updateProject(id, formData);
  //   navigate("/projects", {
  //     state: { message: "Data proyek berhasil diperbarui!" },
  //   });
  // };

  // return { project, isLoading, update };
};

export default useProjectDetail;
