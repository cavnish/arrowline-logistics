import { StatusBadge, PriorityBadge } from "./StatusBadge";
import { Link } from "react-router-dom";

export default function EnquiryTable({ enquiries }) {
  if (!enquiries.length) return null;

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Reference</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Company</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Service</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Route</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {enquiries.map((enq) => (
              <tr key={enq.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 text-sm font-mono text-[#1E3A8A]">{enq.reference_number}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-800">{enq.name}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{enq.company}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{enq.service}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{enq.origin || "—"} → {enq.destination || "—"}</td>
                <td className="px-4 py-3"><StatusBadge status={enq.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <PriorityBadge priority={enq.priority} />
                    <span className="text-xs capitalize">{enq.priority || "normal"}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">{new Date(enq.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Link
                    to={`/arrowline-admin/enquiries/${enq.id}`}
                    className="text-[#1E3A8A] hover:text-[#FF7A00] font-semibold text-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {enquiries.map((enq) => (
          <Link
            key={enq.id}
            to={`/arrowline-admin/enquiries/${enq.id}`}
            className="block bg-white p-4 rounded-lg border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <span className="font-mono text-xs text-[#1E3A8A]">{enq.reference_number}</span>
              <StatusBadge status={enq.status} />
            </div>
            <h3 className="mt-2 font-semibold text-slate-800">{enq.name}</h3>
            <p className="text-sm text-slate-600">{enq.company}</p>
            <p className="text-xs text-slate-500 mt-1">{enq.service} · {enq.origin} → {enq.destination}</p>
            <p className="text-xs text-slate-500 mt-1">{new Date(enq.created_at).toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
