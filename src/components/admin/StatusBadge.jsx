const statusStyles = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  quotation_sent: "bg-purple-100 text-purple-800",
  follow_up: "bg-indigo-100 text-indigo-800",
  in_progress: "bg-orange-100 text-orange-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
  closed: "bg-slate-200 text-slate-700",
};

const priorityStyles = {
  low: "bg-gray-200 text-gray-700",
  normal: "bg-blue-50 text-blue-700",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${statusStyles[status] || "bg-gray-100 text-gray-600"}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${priorityStyles[priority] || ""}`} />
  );
}
