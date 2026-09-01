import { Search } from "lucide-react";

export default function EnquiryFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  serviceFilter,
  setServiceFilter,
  dateFilter,
  setDateFilter,
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search enquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="quotation_sent">Quotation Sent</option>
          <option value="follow_up">Follow Up</option>
          <option value="in_progress">In Progress</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-3">
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none"
        >
          <option value="">All Services</option>
          <option value="Road Transportation">Road Transportation</option>
          <option value="ODC Transportation">ODC Transportation</option>
          <option value="Ocean Freight">Ocean Freight</option>
          <option value="Coastal Shipping">Coastal Shipping</option>
          <option value="Project Logistics">Project Logistics</option>
          <option value="Warehousing">Warehousing</option>
        </select>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none"
        >
          <option value="">All Dates</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="last7">Last 7 days</option>
          <option value="last30">Last 30 days</option>
        </select>
      </div>
    </div>
  );
}