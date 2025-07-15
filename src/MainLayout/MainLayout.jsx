import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "../Components";
import AuthLayout from "./AuthLayout";  // layout untuk auth tanpa sidebar
import {
  Home, Login, Register,
  ErrorPage,
  FormTambahProyek, TabelProyek, DetailProyek,
  TabelGudang, FormTambahGudang,
  TabelMaterial, TambahMaterial, DetailMaterial,
  TabelInventory, TambahInventory, DetailInventory,
  TabelKendaraan, TambahKendaraan, DetailKendaraan, PinjamKendaraan,
  DetailGudang,
  TenagaKerja,
  TambahPerbaikan,
  TambahTenagaKerja,
  DetailTenagaKerja,
  Akuntansi, HutangKeVendor, TagihanKeKlien, FormKwitansi,
  Laporan,
  LaporanHarian,
  PurchaseOrder
} from "../pages";
import { AuthCheck } from "../AuthCheck";

const AppLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 bg-white shadow-md">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-y-auto bg-[#E3F2FD] p-6">
        <Outlet />
      </div>
    </div>
  );
};

const MainLayout = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes untuk auth (login/register) pakai AuthLayout */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Routes lainnya pakai AppLayout dengan sidebar */}
        <Route path="/*" element={<AppLayout />}>
          <Route index element={<AuthCheck><Home /></AuthCheck>} />

          {/* Proyek Routes */}
          <Route path="proyek">
            <Route index element={<TabelProyek />} />
            <Route path="tambah" element={<FormTambahProyek />} />
            <Route path="detail" element={<DetailProyek />} />
          </Route>

          {/* Gudang Routes */}
          <Route path="gudang">
            <Route index element={<TabelGudang />} />
            <Route path="tambah" element={<FormTambahGudang />} />
            <Route path="detail" element={<DetailGudang />} />
          </Route>

          {/* Material Routes */}
          <Route path="material">
            <Route index element={<TabelMaterial />} />
            <Route path="tambah" element={<TambahMaterial />} />
            <Route path="detail" element={<DetailMaterial />} />
          </Route>

          {/* Inventory Routes */}
          <Route path="inventory">
            <Route index element={<TabelInventory />} />
            <Route path="tambah" element={<TambahInventory />} />
            <Route path="detail" element={<DetailInventory />} />
          </Route>

          {/* Kendaraan Routes */}
          <Route path="kendaraan">
            <Route index element={<TabelKendaraan />} />
            <Route path="tambah" element={<TambahKendaraan />} />
            <Route path="detail" element={<DetailKendaraan />} />
            <Route path="pinjam" element={<PinjamKendaraan />} />
            <Route path="perbaikan" element={<TambahPerbaikan />} />
          </Route>

          {/* Tenaga Kerja Routes */}
          <Route path="tenaga-kerja">
            <Route index element={<TenagaKerja />} />
            <Route path="tambah" element={<TambahTenagaKerja />} />
            <Route path="detail" element={<DetailTenagaKerja />} />
          </Route>

          {/* Akuntansi Routes */}
          <Route path="akuntansi">
            <Route index element={<Akuntansi />} />
            <Route path="hutang-ke-vendor" element={<HutangKeVendor />} />
            <Route path="tagihan-ke-klien" element={<TagihanKeKlien />} />
            <Route path="kwitansi" element={<FormKwitansi />} />
            <Route path="purchase-order" element={<PurchaseOrder />} />
          </Route>

          {/* Laporan */}
          <Route path="qc&k3" element={<Laporan />} />
          <Route path="laporan" element={<LaporanHarian />} />

          {/* Fallback */}
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MainLayout;
