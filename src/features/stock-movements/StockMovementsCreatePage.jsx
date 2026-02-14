import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Swal from "sweetalert2";
import CreatableSelect from "react-select/creatable";
import useMaterialsList from "../../hooks/useMaterialsList";
import useWarehousesList from "../../hooks/useWarehousesList";
import useProjectList from "../../hooks/useProjectList";
import { ArrowPathIcon, CalculatorIcon } from "@heroicons/react/24/outline";

const StockMovementCreatePage = () => {
  const navigate = useNavigate();
  const { materials, isLoading: isLoadingMaterials } = useMaterialsList();
  const { warehouses, isLoading: isLoadingWarehouses } = useWarehousesList();
  const { projects, isLoading: isLoadingProjects } = useProjectList();

  const [formData, setFormData] = useState({
    material_id: "",
    warehouse_id: "",
    project_id: "",
    supplier_id: "",
    type: "in",
    quantity: "",
    remarks: "",
  });

  const [currentStock, setCurrentStock] = useState(0);
  const [stockUnit, setStockUnit] = useState("Unit");
  const [isCheckingStock, setIsCheckingStock] = useState(false);

  const [suppliers, setSuppliers] = useState([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await api.get("/v1/suppliers");
        // console.log("Isi response fetchSuppliers: ", res.data);

        const rawData = res.data.data;

        if (Array.isArray(rawData)) {
          const options = rawData.map((s) => ({ value: s.id, label: s.name }));
          setSuppliers(options);
        } else {
          // console.warn(
          //   "Struktur data tidak sesuai, mencoba fallback...",
          //   res.data
          // );

          const fallbackData = Array.isArray(res.data) ? res.data : [];
          const options = fallbackData.map((s) => ({
            value: s.id,
            label: s.name,
          }));
          setSuppliers(options);
        }
      } catch (error) {
        console.error("Gagal memuat data supplier", error);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchCurrentStock = async () => {
      if (formData.material_id && formData.warehouse_id) {
        setIsCheckingStock(true);
        try {
          const response = await api.get(`/v1/inventory-check`, {
            params: {
              warehouse_id: formData.warehouse_id,
              material_id: formData.material_id,
            },
          });
          setCurrentStock(response.data.current_stock);
          setStockUnit(response.data.unit || "Unit");
        } catch (error) {
          console.error("Gagal mengambil info stok", error);
          setCurrentStock(0);
        } finally {
          setIsCheckingStock(false);
        }
      } else {
        setCurrentStock(0);
        setStockUnit("Unit");
      }
    };

    fetchCurrentStock();
  }, [formData.material_id, formData.warehouse_id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateSupplier = async (inputValue) => {
    const { value: formValues } = await Swal.fire({
      title: `Tambah Supplier Baru: ${inputValue}`,
      html: `
        <div class="flex flex-col gap-3 text-left">
          <p class="text-sm text-gray-500 mb-2">Mohon lengkapi data wajib berikut:</p>
          <div>
            <label class="text-sm font-medium text-gray-700">Alamat Lengkap <span class="text-red-500">*</span></label>
            <input id="swal-address" class="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500" placeholder="Contoh: Jl. Sudirman No. 10">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">No. Telepon <span class="text-red-500">*</span></label>
            <input id="swal-phone" type="number" class="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500" placeholder="0812xxxxxxxx">
          </div>
           <div>
            <label class="text-sm font-medium text-gray-700">PIC (Opsional)</label>
            <input id="swal-pic" class="w-full border border-gray-300 rounded px-3 py-2 mt-1" placeholder="Nama Penanggung Jawab">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan Supplier",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2196F3",

      preConfirm: () => {
        const address = document.getElementById("swal-address").value;
        const phone = document.getElementById("swal-phone").value;
        const pic = document.getElementById("swal-pic").value;

        if (!address || !phone) {
          Swal.showValidationMessage("Alamat dan No. Telepon wajib diisi!");
          return false;
        }
        return { address, phone, pic };
      },
    });

    if (!formValues) return;

    setIsLoadingSuppliers(true);
    try {
      const payload = {
        name: inputValue,
        address: formValues.address,
        phone: formValues.phone,
        pic: formValues.pic,
      };

      const res = await api.post("/v1/suppliers", payload);
      const createdData = res.data.data || res.data;

      const newSupplier = { value: createdData.id, label: createdData.name };
      // const newSupplier = { value: res.data.id, label: res.data.name };
      setSuppliers((prev) => [...prev, newSupplier]);

      setFormData((prev) => ({ ...prev, supplier_id: newSupplier.value }));

      Swal.fire({
        icon: "success",
        title: "Tersimpan!",
        text: "Supplier berhasil ditambahkan.",
        timer: 1500,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
    } catch (error) {
      console.error(error);
      let errorMsg = "Gagal membuat supplier.";
      if (error.response?.data?.errors) {
        errorMsg = Object.values(error.response.data.errors).flat().join("\n");
      }
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: errorMsg,
      });
    } finally {
      setIsLoadingSuppliers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await api.post("/v1/stock-movements", formData);

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Pergerakan stok telah tercatat.",
        confirmButtonText: "OK",
        confirmButtonColor: "#2196F3",
      });

      navigate("/stock-movements");
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
        Swal.fire({
          icon: "warning",
          title: "Periksa Inputan",
          text: "Terdapat kesalahan pada data form.",
        });
      } else {
        setErrors({ general: "Gagal menyimpan data. Silakan coba lagi." });
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan sistem.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimatedStock = () => {
    const qty = parseFloat(formData.quantity) || 0;
    const current = parseFloat(currentStock) || 0;

    switch (formData.type) {
      case "in":
      case "return":
        return current + qty;
      case "out":
        return current - qty;
      case "adjustment":
        return qty;
      default:
        return current;
    }
  };

  const isStockInsufficient =
    formData.type === "out" &&
    (parseFloat(formData.quantity) || 0) > currentStock;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <ArrowPathIcon className="w-6 h-6" />
        Catat Pergerakan Stok Baru
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Material */}
            <div>
              <label
                htmlFor="material_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Material
              </label>
              <select
                id="material_id"
                name="material_id"
                onChange={handleChange}
                required
                disabled={isLoadingMaterials}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Material</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.sku})
                  </option>
                ))}
              </select>
              {errors.material_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.material_id[0]}
                </p>
              )}
            </div>

            {/* Gudang */}
            <div>
              <label
                htmlFor="warehouse_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gudang
              </label>
              <select
                id="warehouse_id"
                name="warehouse_id"
                onChange={handleChange}
                required
                disabled={isLoadingWarehouses}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Gudang</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
              {errors.warehouse_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.warehouse_id[0]}
                </p>
              )}
            </div>

            {/* Tipe Transaksi */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tipe Transaksi
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="in">Stok Masuk (Pembelian/Produksi)</option>
                <option value="out">Stok Keluar (Pemakaian/Penjualan)</option>
                <option value="return">Stok Kembali (Retur)</option>
                <option value="adjustment">Penyesuaian (Stock Opname)</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">{errors.type[0]}</p>
              )}
            </div>

            {formData.type === "in" && (
              <div className="z-20 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier / Vendor
                </label>
                <CreatableSelect
                  isClearable
                  isDisabled={isLoadingSuppliers}
                  isLoading={isLoadingSuppliers}
                  value={
                    suppliers.find(
                      (opt) => opt.value === formData.supplier_id
                    ) || null
                  }
                  onChange={(newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      supplier_id: newValue ? newValue.value : "",
                    }))
                  }
                  onCreateOption={handleCreateSupplier}
                  options={suppliers}
                  placeholder="Pilih atau Ketik Baru..."
                  noOptionsMessage={() => "Ketik untuk buat baru..."}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#d1d5db",
                      borderRadius: "0.375rem",
                      minHeight: "42px",
                    }), 
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  *Ketik nama baru & Enter untuk menambah. Data alamat wajib
                  diisi.
                </p>
              </div>
            )}

            {formData.type === "out" && (
              <div>
                <label
                  htmlFor="project_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Untuk Proyek (Opsional)
                </label>
                <select
                  name="project_id"
                  id="project_id"
                  onChange={handleChange}
                  disabled={isLoadingProjects}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Pilih Proyek...</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.type !== "in" && formData.type !== "out" && (
              <div className="hidden md:block"></div>
            )}

            <div className="md:col-span-2">
              {formData.material_id && formData.warehouse_id && (
                <div
                  className={`p-4 rounded-lg border flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors duration-300 ${
                    isStockInsufficient
                      ? "bg-red-50 border-red-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  {/* Info Stok Saat Ini */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        isStockInsufficient
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <CalculatorIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-bold tracking-wider text-gray-500">
                        Stok Tersedia
                      </p>
                      {isCheckingStock ? (
                        <p className="text-sm font-medium text-gray-400">
                          Memuat...
                        </p>
                      ) : (
                        <p className="text-2xl font-bold text-gray-800">
                          {parseFloat(currentStock).toLocaleString("id-ID")}{" "}
                          <span className="text-sm font-normal text-gray-600">
                            {stockUnit}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Estimasi Setelah Transaksi */}
                  {!isCheckingStock && formData.quantity && (
                    <div className="text-right border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                      <p className="text-xs uppercase font-bold tracking-wider text-gray-500">
                        Estimasi Akhir
                      </p>
                      <p
                        className={`text-xl font-bold ${
                          calculateEstimatedStock() < 0
                            ? "text-red-600"
                            : "text-gray-700"
                        }`}
                      >
                        {calculateEstimatedStock().toLocaleString("id-ID")}{" "}
                        <span className="text-sm font-normal">{stockUnit}</span>
                      </p>
                      {isStockInsufficient && (
                        <p className="text-xs text-red-600 font-medium mt-1">
                          ⚠️ Stok tidak mencukupi!
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Kuantitas */}
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {formData.type === "adjustment"
                  ? "Jumlah Fisik Akhir"
                  : "Kuantitas"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                step="0.01"
                onChange={handleChange}
                required
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  isStockInsufficient
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.quantity[0]}
                </p>
              )}
            </div>

            {/* Keterangan */}
            <div className="md:col-span-2">
              <label
                htmlFor="remarks"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Keterangan
              </label>
              <textarea
                id="remarks"
                name="remarks"
                onChange={handleChange}
                rows="3"
                className="block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: Pengambilan barang untuk Project A..."
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/stock-movements")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || isStockInsufficient}
              className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg disabled:bg-gray-400"
            >
              {loading ? "Menyimpan..." : "Simpan Transaksi"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StockMovementCreatePage;
