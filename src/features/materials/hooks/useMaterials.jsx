import { useState, useEffect, useCallback } from "react";
import { getMaterials } from "../api";

const useMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMaterials = useCallback(async (currPage, currSearch) => {
    try {
      const response = await getMaterials({
        page: currPage,
        search: currSearch,
      });

      // --- PERBAIKAN EXTRACTION LOGIC ---

      // 1. Tentukan Root Object
      // Cek apakah ini Axios Object (punya status & headers)? Jika ya, ambil .data
      // Jika tidak, berarti ini sudah JSON body langsung.
      let rootData = response;
      if (response.status && response.headers) {
        rootData = response.data;
      }

      // console.log("🔍 [DEBUG] Root Data:", rootData);

      // 2. Mapping Sesuai Struktur JSON Kamu
      // JSON: { data: [...], meta: {...}, links: {...} }

      if (rootData.data && Array.isArray(rootData.data)) {
        // KASUS SUKSES: Ada array di dalam 'data'
        // console.log("✅ Data ditemukan di rootData.data");
        setMaterials(rootData.data);

        // Ambil pagination
        if (rootData.meta) {
          setPagination(rootData.meta);
        } else if (rootData.current_page) {
          // Fallback jika meta tercampur di root
          const { data, ...metaData } = rootData;
          setPagination(metaData);
        }
      } else if (Array.isArray(rootData)) {
        // KASUS ARRAY LANGSUNG
        // console.log("⚠️ Data adalah array langsung");
        setMaterials(rootData);
        setPagination({});
      } else {
        // KASUS LAIN (Mungkin terbungkus double data)
        console.error("❌ Struktur tidak dikenali", rootData);
        setMaterials([]);
      }
    } catch (e) {
      setError(e);
      console.error("Gagal mengambil data material", e);
      setMaterials([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaterials(page, searchTerm);
  }, [page, fetchMaterials]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchMaterials(1, searchTerm);
    }
  }, [searchTerm]);

  const refresh = () => {
    fetchMaterials(page, searchTerm);
  };

  return {
    materials,
    pagination,
    isLoading,
    error,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    refresh,
  };
};

export default useMaterials;
