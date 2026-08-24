const SORTS = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
  reference_number: { column: "reference_number", ascending: true },
  customer_name: { column: "name", ascending: true },
  status: { column: "status", ascending: true },
  priority: { column: "priority", ascending: true },
};

const EDITABLE_FIELDS = new Set(["status", "priority", "assigned_to", "notes", "archived"]);

function cleanText(value, maxLength = 200) {
  if (typeof value !== "string") return null;
  return value.trim().slice(0, maxLength);
}

function sanitizeSearch(value) {
  return cleanText(value, 100)?.replace(/[(),]/g, " ") || "";
}

export async function getStats(supabase) {
  const count = async (apply = (query) => query) => {
    const { count: value, error } = await apply(
      supabase.from("leads").select("id", { count: "exact", head: true })
    );
    if (error) throw error;
    return value || 0;
  };

  const [total, fresh, contacted, inProgress, completed, archived, emailSent, emailPending, highPriority] =
    await Promise.all([
      count((q) => q.eq("archived", false)),
      count((q) => q.eq("archived", false).eq("status", "new")),
      count((q) => q.eq("archived", false).eq("status", "contacted")),
      count((q) => q.eq("archived", false).eq("status", "in_progress")),
      count((q) => q.eq("archived", false).eq("status", "completed")),
      count((q) => q.eq("archived", true)),
      count((q) => q.eq("archived", false).eq("email_sent", true)),
      count((q) => q.eq("archived", false).eq("email_sent", false)),
      count((q) => q.eq("archived", false).in("priority", ["high", "urgent"])),
    ]);

  return { total, new: fresh, contacted, inProgress, completed, archived, emailSent, emailPending, highPriority };
}

export async function getEnquiries(supabase, params) {
  const page = Math.max(Number.parseInt(params.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(params.limit, 10) || 25, 1), 50);
  const sort = SORTS[params.sort] || SORTS.newest;
  let query = supabase.from("leads").select("*", { count: "exact" });

  if (params.archived === "only") query = query.eq("archived", true);
  else if (params.archived !== "all") query = query.eq("archived", false);
  if (params.status) query = query.eq("status", cleanText(params.status, 40));
  if (params.priority) query = query.eq("priority", cleanText(params.priority, 40));
  if (params.service) query = query.eq("service", cleanText(params.service, 200));
  if (params.emailStatus === "sent") query = query.eq("email_sent", true);
  if (params.emailStatus === "pending" || params.emailStatus === "failed") query = query.eq("email_sent", false);
  if (params.dateFrom) query = query.gte("created_at", params.dateFrom);
  if (params.dateTo) query = query.lte("created_at", params.dateTo);

  const search = sanitizeSearch(params.search);
  if (search) {
    const pattern = `*${search}*`;
    query = query.or(
      `reference_number.ilike.${pattern},name.ilike.${pattern},company.ilike.${pattern},email.ilike.${pattern},phone.ilike.${pattern},service.ilike.${pattern}`
    );
  }

  const from = (page - 1) * limit;
  const { data, count, error } = await query
    .order(sort.column, { ascending: sort.ascending })
    .range(from, from + limit - 1);
  if (error) throw error;

  return {
    data: data || [],
    pagination: { page, limit, total: count || 0, totalPages: Math.max(Math.ceil((count || 0) / limit), 1) },
  };
}

export async function getEnquiry(supabase, id) {
  const { data, error } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateEnquiry(supabase, id, input) {
  const updates = {};
  for (const [field, value] of Object.entries(input || {})) {
    if (!EDITABLE_FIELDS.has(field)) continue;
    if (field === "archived") {
      if (typeof value === "boolean") updates.archived = value;
      continue;
    }
    const maxLength = field === "notes" ? 4000 : field === "assigned_to" ? 120 : 40;
    const text = cleanText(value, maxLength);
    if (text !== null) updates[field] = text;
  }

  if (!Object.keys(updates).length) {
    const error = new Error("No valid fields supplied");
    error.status = 400;
    throw error;
  }

  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getContent(supabase) {
  const { data, error } = await supabase
    .from("site_content")
    .select("id, content_key, content_value, content_type, section, is_published, updated_at, updated_by")
    .order("section", { ascending: true })
    .order("content_key", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function updateContent(supabase, key, input, adminId) {
  const contentKey = cleanText(key, 100);
  const contentValue = cleanText(input?.content_value, 5000);
  if (!contentKey || contentValue === null || !/^[a-z0-9_]+$/.test(contentKey)) {
    const error = new Error("Invalid content value");
    error.status = 400;
    throw error;
  }

  const payload = {
    content_key: contentKey,
    content_value: contentValue,
    content_type: cleanText(input.content_type, 30) || "text",
    section: cleanText(input.section, 80) || null,
    is_published: input.is_published !== false,
    updated_at: new Date().toISOString(),
    updated_by: adminId,
  };
  const { data, error } = await supabase
    .from("site_content")
    .upsert(payload, { onConflict: "content_key" })
    .select()
    .single();
  if (error) throw error;
  return data;
}
