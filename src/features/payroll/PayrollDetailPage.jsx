import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import usePayroll from "./hooks/usePayrolls";
import {
  ArrowLeftIcon,
  PrinterIcon,
  BanknotesIcon,
  CalendarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function PayrollDetailPage() {
  const { id } = useParams();
  const { fetchDetail, payrollDetail, isLoading } = usePayroll();

  useEffect(() => {
    fetchDetail(id);
  }, [id, fetchDetail]);

  const formatIDR = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Processed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <div className="animate-spin mr-2 h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        Loading payroll details...
      </div>
    );
  }

  if (!payrollDetail) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500">Data not found.</p>
        <Link to="/payrolls" className="text-blue-600 hover:underline">
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/payrolls"
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Payroll Detail</h1>
            <p className="text-sm text-gray-500">ID: #{payrollDetail.id}</p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <PrinterIcon className="w-5 h-5" />
          <span>Print Slip</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                payrollDetail.status
              )}`}
            >
              {payrollDetail.status}
            </span>
            {payrollDetail.payment_date && (
              <span className="text-xs text-gray-500">
                Paid on: {formatDate(payrollDetail.payment_date)}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Created at: {formatDate(payrollDetail.created_at)}
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Employee</p>
                <p className="font-semibold text-lg text-gray-800">
                  {payrollDetail.user?.name || "Unknown User"}
                </p>
                <p className="text-sm text-gray-500">
                  {payrollDetail.user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Payroll Period</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(payrollDetail.period_start)} -{" "}
                  {formatDate(payrollDetail.period_end)}
                </p>
              </div>
            </div>
          </div>

          <hr className="border-dashed border-gray-200 my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                Earnings
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base Salary</span>
                  <span className="font-medium text-gray-900">
                    {formatIDR(payrollDetail.base_salary)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Allowance</span>
                  <span className="font-medium text-green-600">
                    + {formatIDR(payrollDetail.total_allowance)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                Deductions
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Deduction</span>
                  <span className="font-medium text-red-600">
                    - {formatIDR(payrollDetail.total_deduction)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center border border-blue-100">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <div className="bg-blue-600 p-2 rounded-full text-white">
                <BanknotesIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Net Salary (Take Home Pay)
                </p>
                <p className="text-xs text-blue-500">
                  Final amount to be transferred
                </p>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-800">
              {formatIDR(payrollDetail.net_salary)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
