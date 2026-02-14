import { useState, useEffect, useCallback } from "react";
import { getProject, getProjects } from "../api";
import { useAuthStore } from "../../../store/authStore";

const useProjects = () => {
  const user = useAuthStore((state) => state.user);

  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProjects = useCallback(
    async (currPage, currSearch) => {
      if (!user) return;
      setIsLoading(true);

      try {
        const params = {
          page: currPage,
          search: currSearch,
        };

        if (
          user.roles?.includes("Project Manager") ||
          user.roles?.includes("Supervisor")
        ) {
          params.assigned_to_me = true;
        }

        const response = await getProjects(params);
        const responseBody = response.data || response;

        if (responseBody.data && Array.isArray(responseBody.data)) {
          setProjects(responseBody.data);

          if (responseBody.meta) {
            setPagination(responseBody.meta);
          } else if (responseBody.current_page) {
            const { data, ...paginationMeta } = responseBody;
            setPagination(paginationMeta);
          } else {
            setPagination({});
          }
        } else if (Array.isArray(responseBody)) {
          setProjects(responseBody);
          setPagination({});
        } else {
          setProjects([]);
        }
      } catch (error) {
        setError(error);
        console.error("Gagal mengambil data proyek", error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    fetchProjects(page, searchTerm);
  }, [page, fetchProjects]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchProjects(1, searchTerm);
    }
  }, [searchTerm]);

  const refresh = () => {
    fetchProjects(page, searchTerm);
  };
  
  return {
    projects,
    pagination,
    isLoading,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    refresh,
  };

  // useEffect(() => {
  //   if (!user) return;

  //   const fetchProjects = async () => {
  //     setIsLoading(true);
  //     try {
  //       const params = { page, search: searchTerm };

  //       if (
  //         user.roles?.includes("Project Manager") ||
  //         user.roles?.includes("Supervisor")
  //       ) {
  //         params.assigned_to_me = true;
  //       }

  //       const projectData = await getProjects(params);
  //       setData(projectData);
  //     } catch (error) {
  //       console.error("Gagal mengambil data proyek", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchProjects();
  // }, [page, searchTerm, user]);

  // return { data, isLoading, page, setPage, searchTerm, setSearchTerm };
};

export default useProjects;
