import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminApi from "../services/adminApi";
import { StatusBadge, PriorityBadge } from "../components/admin/StatusBadge";
import { Phone, Mail, Trash2, Loader2, Save, Plus } from "lucide-react";

export default function AdminEnquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminApi.get(`/enquiries/${id}`);
        setEnquiry(res.data.data);
        setNotes(res.data.data.notes || []);
      } catch (err) {
        setError("Unable to load enquiry.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (updates) => {
    setSaving(true);
    try {
      const res = await adminApi.patch(`/enquiries/${id}`, updates);
      setEnquiry(res.data.data);
    } catch (err) {
      alert("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await adminApi.post(`/enquiries/${id}/notes`, { note: newNote });
      setNotes([...notes, res.data.data]);
      setNewNote("");
    } catch (err) {
      alert("Failed to add note.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this enquiry permanently? This cannot be undone.")) {
      try {
        await adminApi.delete(`/enquiries/${id}`);
        navigate("/arrowline-admin/enquiries");
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" size={32} /></div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!enquiry) return <div className="p-8">Enquiry not found.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{enquiry.reference_number}</h1>
          <div className="flex items-center space-x-3 mt-1">
            <StatusBadge status={enquiry.status} />
            <span className="flex items-center text-sm">
              <PriorityBadge priority={enquiry.priority} />
              {enquiry.priority}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Customer</h2>
          <p className="font-bold">{enquiry.name}</p>
          <p>{enquiry.company}</p>
          <p className="mt-2 flex items-center space-x-2 text-sm">
            <Phone size={16} /> <a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a>
          </p>
          <p className="flex items-center space-x-2 text-sm">
            <Mail size={16} /> <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Service Details</h2>
          <p><strong>Service:</strong> {enquiry.service}</p>
          <p><strong>Route:</strong> {enquiry.origin || "—"} → {enquiry.destination || "—"}</p>
          <p><strong>Message:</strong> {enquiry.message || "—"}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <select
            value={enquiry.status}
            onChange={(e) => handleUpdate({ status: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded-lg"
          >
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
            value={enquiry.priority}
            onChange={(e) => handleUpdate({ priority: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded-lg"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <select
            value={enquiry.assigned_to || ""}
            onChange={(e) => handleUpdate({ assigned_to: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded-lg"
          >
            <option value="">Unassigned</option>
            <option value="Mundra Team">Mundra Team</option>
            <option value="Sales Team">Sales Team</option>
            <option value="Operations">Operations</option>
            <option value="Admin">Admin</option>
          </select>
          <button
            onClick={() => handleUpdate({})}
            disabled={saving}
            className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Internal Notes</h2>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {notes.length === 0 && <p className="text-slate-400 text-sm">No notes yet.</p>}
          {notes.map((note) => (
            <div key={note.id} className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-700">{note.note}</p>
              <p className="text-xs text-slate-400 mt-1">{note.admin_name} · {new Date(note.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add internal note..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none"
          />
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg flex items-center space-x-1 disabled:opacity-50"
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}