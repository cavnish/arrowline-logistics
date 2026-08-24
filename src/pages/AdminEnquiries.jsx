import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import EnquiryFilters from "../components/admin/EnquiryFilters";
import EnquiryTable from "../components/admin/EnquiryTable";
import Pagination from "../components/admin/Pagination";
import { Loader2 } from "lucide-react";

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 25 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEnquiries = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search,
        status: statusFilter,
        priority: priorityFilter,
        service: serviceFilter,
        sort,
      };
      if (dateFilter === "today") {
        const today = new Date();
        today.setHours(0,0,0,0);
        params.dateFrom = today.toISOString();
      } else if (dateFilter === "yesterday") {
        const yest = new Date();
        yest.setDate(yest.getDate()-1);
        yest.setHours(0,0,0,0);
        const yestEnd = new Date(yest);
        yestEnd.setHours(23,59,59,999);
        params.dateFrom = yest.toISOString();
        params.dateTo = yestEnd.toISOString();
      } else if (dateFilter === "last7") {
        const d = new Date();
        d.setDate(d.getDate()-7);
        params.dateFrom = d.toISOString();
      } else if (dateFilter === "last30") {
        const d = new Date();
        d.setDate(d.getDate()-30);
        params.dateFrom = d.toISOString();
      }
      const res = await adminApi.get("/enquiries", { params });
      setEnquiries(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError("Unable to load enquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [pagination.page, search, statusFilter, priorityFilter, serviceFilter, dateFilter, sort]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Enquiries</h1>
          <p className="text-sm text-slate-500">Manage all customer inquiries</p>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="customer_name">Customer Name</option>
          <option value="status">Status</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      <EnquiryFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        serviceFilter={serviceFilter}
        setServiceFilter={setServiceFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-[#1E3A8A]" size={32} />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-xl border border-slate-200 text-slate-500">
          No enquiries found.
        </div>
      ) : (
        <EnquiryTable enquiries={enquiries} />
      )}

      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
}
