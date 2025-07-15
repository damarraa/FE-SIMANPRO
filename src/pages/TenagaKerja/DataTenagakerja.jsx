import React from "react";
import { PhoneCall, Mail, MoreVertical, Search } from "lucide-react";
import Header from "@/Components/Header/Header";
import { useNavigate } from 'react-router-dom';



const data = [
  { id: 1, name: "Dimitres Viga", role: "Admin" },
  { id: 2, name: "Tom Housenburg", role: "Finance" },
  { id: 3, name: "Dana Benevista", role: "Logistic" },
  { id: 4, name: "Salvadore Morbeau", role: "Project Manager" },
  { id: 5, name: "Maria Historia", role: "Project Manager" },
  { id: 6, name: "Jack Sally", role: "Project Manager" },
  { id: 7, name: "Lula Beatrice", role: "Supervisor" },
  { id: 8, name: "Nella Vita", role: "Supervisor" },
  { id: 9, name: "Nadia Laravela", role: "Pelaksana" },
  { id: 10, name: "Dakota Farral", role: "Pelaksana" },
  { id: 11, name: "Miranda Adila", role: "Pelaksana" },
  { id: 12, name: "Indiana Barker", role: "Pelaksana" },
];

const TenagaKerja = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-[#F8FBFF] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-wrap">
        <h2 className="text-2xl font-bold text-[#0D47A1]">Daftar Tenaga Kerja</h2>
        <div className="w-full md:w-auto">
          <Header />
        </div>

      </div>
      <div className="flex flex-col md:flex-row justify-end mb-6 ">
        <div className="flex flex-col sm:flex-row justify-start items-stretch">
          <button
            onClick={() => navigate('/tenaga-kerja/tambah')}
            className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow-md transition-colors duration-200 whitespace-nowrap"
          >
            + Tambah Tenaga Kerja
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-4 shadow-md flex flex-col items-center relative"
          >
            {/* Menu icon */}
            <button className="absolute top-4 right-4 text-gray-500">
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Foto placeholder */}
            <div className="w-20 h-20 rounded-full bg-blue-200 mb-4"></div>

            {/* Nama & Role */}
            <h3 className="font-semibold text-[#0D47A1]">{item.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{item.role}</p>

            {/* Kontak */}
            <div className="flex gap-3">
              <button className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200">
                <PhoneCall className="w-4 h-4" />
              </button>
              <button className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
        <span>Showing 1–5 from 100 data</span>
        <div className="flex gap-2">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${page === 1
                ? "bg-[#2196F3] text-white"
                : "bg-white border text-gray-700"
                }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TenagaKerja;
