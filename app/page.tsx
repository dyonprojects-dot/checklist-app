"use client";

import React, { useMemo, useState } from "react";

const STAGES = [
  "Lead Opportunity",
  "Client Intake",
  "Design Proposal",
  "Approved Job",
  "Design Stage",
  "Fitout Estimate",
  "Construction",
  "Completed",
  "Lost / No Quote",
];

const CHECKLISTS = {
  "Lead Opportunity": [
    "Contact name added",
    "Phone number added",
    "Email added",
    "Site address confirmed",
    "Company / organisation name",
    "Project type",
    "Lead source",
    "Estimated revenue",
    "Budget confirmed",
    "Confidence level",
  ],
  "Client Intake": [
    "Architect drawing received",
    "Concept drawing received",
    "DA / CC / CDC confirmed",
    "Length of lease",
    "Budget",
    "Type of menu",
    "New equipment required",
    "Equipment price range",
    "Type of shop",
    "Onsite car park",
    "Loading bay",
    "Traffic management plan required",
    "Lift access",
    "Ramp access",
    "Installation time",
    "Shopfront",
    "Wall type",
    "Ceiling type",
    "Floor finish",
    "Run drainage",
    "Run gas",
    "Run water system",
    "Grease trap",
    "Run power points",
    "Range hood",
    "Air conditioning",
    "Demolition scope",
  ],
  "Design Proposal": [
    "Proposal type selected",
    "Design proposal imported",
    "Proposal released to client",
    "Client signed proposal",
    "Proposal approved",
  ],
  "Approved Job": [
    "Converted to job",
    "Job type selected",
    "Xero contact created or selected",
    "Job group selected",
    "Template selected",
    "Job prefix added",
    "Projected start date",
    "Projected finish date",
    "Internal users assigned",
  ],
  "Design Stage": [
    "Designer clocked in",
    "Design files uploaded",
    "Brief template completed",
    "Weekly milestone reviewed",
    "Client review completed",
    "Design handover completed",
  ],
  "Fitout Estimate": [
    "Estimate imported",
    "Line items checked",
    "Bid package created",
    "Sub/vendor added",
    "Deadline confirmed",
    "Drawing attached",
    "Bid package released",
    "Sub quote approved",
  ],
  Construction: [
    "Daily log created",
    "Site manager confirmed",
    "Schedule confirmed",
    "Trade team confirmed",
    "PO number confirmed",
    "PO released",
    "Latest drawings uploaded",
    "Related documents uploaded",
    "Daily log confirmed",
  ],
  Completed: [
    "Final defects checked",
    "Client handover completed",
    "Final invoice confirmed",
    "Project archived",
  ],
  "Lost / No Quote": ["Reason recorded", "Client notified", "Follow-up date"],
};

const TEXT_ITEMS = new Set([
  "Contact name added",
  "Phone number added",
  "Email added",
  "Site address confirmed",
  "Company / organisation name",
  "Estimated revenue",
  "Budget confirmed",
  "Length of lease",
  "Budget",
  "Type of menu",
  "Demolition scope",
  "Job prefix added",
  "Reason recorded",
]);

const DATE_ITEMS = new Set([
  "Projected start date",
  "Projected finish date",
  "Deadline confirmed",
  "Follow-up date",
]);

const OPTIONS = {
  "Project type": ["Design", "Design & Fitout", "Fitout Only"],
  "Lead source": ["Website", "Google", "Referral", "Leaflets", "Existing Client", "Other"],
  "Confidence level": ["Low", "Medium", "High"],
  "Equipment price range": ["Top", "Medium", "Low"],
  "Type of shop": ["Fine Dining", "Casual Dining", "Cafe", "Bake Shop", "Take Away", "Others"],
  "Installation time": ["Normal Hours", "After Hours", "Weekend", "Others"],
  Shopfront: ["Aluminium", "Timber"],
  "Wall type": ["Hebel", "Stud Wall", "Column Boxing", "Bar", "Wall Paper"],
  "Ceiling type": ["Plaster", "Bulkhead", "Fire Rated"],
  "Floor finish": ["Tiling", "Laminate", "Carpet", "Vinyl", "Epoxy", "Timber"],
  "Range hood": ["Stainless Steel", "Galvanised", "With Lights"],
  "Air conditioning": ["New", "Repair", "Relocate"],
  "Proposal type selected": ["Design Only", "Design & Construct", "High Level Template"],
  "Job type selected": ["Interior Design", "Fitout", "Equipment"],
  "Job group selected": ["Design", "Equipment", "Fitout"],
  "Template selected": ["CDC - Design Project", "DA - Design Project", "Fitout Project"],
};

function typeFor(title) {
  if (DATE_ITEMS.has(title)) return "date";
  if (TEXT_ITEMS.has(title)) return "text";
  if (OPTIONS[title]) return "choice";
  return "yesno";
}

function makeItems(stage, oldItems = []) {
  return (CHECKLISTS[stage] || CHECKLISTS["Client Intake"]).map((title, index) => {
    const previous = oldItems.find((item) => item.title === title);
    return previous || {
      id: `${stage}-${index}-${Date.now()}`,
      title,
      type: typeFor(title),
      answer: "",
      note: "",
    };
  });
}

function completionPercent(items) {
  if (!items.length) return 0;
  const complete = items.filter((item) => String(item.answer || "").trim()).length;
  return Math.round((complete / items.length) * 100);
}

function createProject(form) {
  const name = form.name.trim();
  if (!name) return null;
  const stage = STAGES.includes(form.stage) ? form.stage : "Client Intake";
  const id = `p-${Date.now()}`;
  return {
    id,
    name,
    client: form.client.trim() || "New Client",
    address: form.address.trim() || "Address TBC",
    stage,
    due: form.due || "TBC",
    token: `client-${id}`,
    items: makeItems(stage),
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function runSelfTests() {
  console.assert(completionPercent([{ answer: "Yes" }, { answer: "" }]) === 50, "percent works");
  console.assert(makeItems("Construction").length > 0, "stage checklist works");
  console.assert(typeFor("Email added") === "text", "text type works");
  console.assert(typeFor("Follow-up date") === "date", "date type works");
  console.assert(typeFor("Grease trap") === "yesno", "yesno type works");
  console.assert(typeFor("Project type") === "choice", "choice type works");
  console.assert(createProject({ name: "", client: "", address: "", stage: "Client Intake", due: "" }) === null, "empty project rejected");
  console.assert(createProject({ name: " Test ", client: "", address: "", stage: "Client Intake", due: "" }).name === "Test", "name trims");
}

runSelfTests();

const initialProjects = [
  {
    id: "p1",
    name: "Cafe Fitout - Parramatta",
    client: "ABC Cafe",
    address: "Parramatta NSW",
    stage: "Client Intake",
    due: "2026-05-08",
    token: "client-p1",
    items: makeItems("Client Intake"),
  },
  {
    id: "p2",
    name: "Restaurant Upgrade - Lidcombe",
    client: "K BBQ House",
    address: "Lidcombe NSW",
    stage: "Lead Opportunity",
    due: "2026-05-15",
    token: "client-p2",
    items: makeItems("Lead Opportunity"),
  },
];

function Button({ children, onClick, variant = "solid", className = "", type = "button" }) {
  const base = "rounded-xl px-3 py-2 text-sm font-medium transition hover:opacity-80";
  const style = variant === "danger"
    ? "bg-red-500 text-white"
    : variant === "outline"
      ? "border bg-white text-slate-900"
      : "bg-slate-900 text-white";
  return <button type={type} onClick={onClick} className={`${base} ${style} ${className}`}>{children}</button>;
}

function Field({ item, onChange }) {
  if (item.type === "yesno") {
    return (
      <div className="flex flex-wrap gap-2">
        {["Yes", "No", "N/A"].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`rounded-lg border px-3 py-1 text-sm ${item.answer === value ? "bg-slate-900 text-white" : "bg-white"}`}
          >
            {value}
          </button>
        ))}
      </div>
    );
  }

  if (item.type === "choice") {
    return (
      <select value={item.answer} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border px-3 py-2">
        <option value="">Select</option>
        {(OPTIONS[item.title] || []).map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    );
  }

  return (
    <input
      type={item.type === "date" ? "date" : "text"}
      value={item.answer}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border px-3 py-2"
    />
  );
}

export default function SiteChecklistApp() {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedId, setSelectedId] = useState("p1");
  const [stageTab, setStageTab] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", client: "", address: "", stage: "Client Intake", due: "" });
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [openNotes, setOpenNotes] = useState({});

  const clientToken = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("clientView") : null;
  const clientProject = projects.find((project) => project.token === clientToken);
  const selectedProject = projects.find((project) => project.id === selectedId) || projects[0];
  const project = clientProject || selectedProject;
  const isClientView = Boolean(clientProject);

  const visibleProjects = useMemo(() => {
    return stageTab === "All" ? projects : projects.filter((item) => item.stage === stageTab);
  }, [projects, stageTab]);

  const counts = useMemo(() => {
    return projects.reduce((acc, item) => {
      acc.All = (acc.All || 0) + 1;
      acc[item.stage] = (acc[item.stage] || 0) + 1;
      return acc;
    }, {});
  }, [projects]);

  const filteredItems = useMemo(() => {
    const value = query.toLowerCase();
    return project.items.filter((item) => `${item.title} ${item.answer} ${item.note}`.toLowerCase().includes(value));
  }, [project, query]);

  function updateCurrentProject(updater) {
    setProjects((prev) => prev.map((item) => item.id === project.id ? updater(item) : item));
  }

  function updateItem(itemId, patch) {
    updateCurrentProject((current) => ({
      ...current,
      items: current.items.map((item) => item.id === itemId ? { ...item, ...patch } : item),
    }));
  }

  function changeStage(stage) {
    updateCurrentProject((current) => ({
      ...current,
      stage,
      items: makeItems(stage, current.items),
    }));
    setStageTab(stage);
    setQuery("");
    setMessage(`Stage changed to ${stage}`);
  }

  function handleAddProject() {
    const newProject = createProject(form);
    if (!newProject) {
      setMessage("Project name is required");
      return;
    }
    setProjects((prev) => [...prev, newProject]);
    setSelectedId(newProject.id);
    setStageTab(newProject.stage);
    setForm({ name: "", client: "", address: "", stage: "Client Intake", due: "" });
    setFormOpen(false);
    setMessage(`New project added: ${newProject.name}`);
  }

  function handleDeleteProject() {
    if (projects.length === 1) {
      setMessage("At least one project must remain");
      return;
    }
    if (!window.confirm("Delete this project?")) return;
    const next = projects.filter((item) => item.id !== project.id);
    setProjects(next);
    setSelectedId(next[0].id);
    setStageTab("All");
    setMessage("Project deleted");
  }

  function openAddForm() {
    setForm((prev) => ({ ...prev, stage: stageTab === "All" ? prev.stage : stageTab }));
    setFormOpen((value) => !value);
  }

  function createShareLink() {
    const link = `${window.location.origin}${window.location.pathname}?clientView=${project.token}`;
    navigator.clipboard?.writeText(link);
    setMessage(`Client link copied: ${link}`);
  }

  function generatePdf() {
    const rows = project.items.map((item) => (
      `<tr><td>${escapeHtml(item.title)}</td><td>${escapeHtml(item.answer || "-")}</td><td>${escapeHtml(item.note || "-")}</td></tr>`
    )).join("");
    const win = window.open("", "_blank");
    if (!win) {
      setMessage("Pop-up blocked");
      return;
    }
    win.document.write(`
      <html>
        <body style="font-family:Arial;padding:30px">
          <h1>${escapeHtml(project.name)}</h1>
          <p>${escapeHtml(project.client)} | ${escapeHtml(project.address)} | ${escapeHtml(project.stage)}</p>
          <h3>Progress: ${completionPercent(project.items)}%</h3>
          <table border="1" cellspacing="0" cellpadding="8">
            <tr><th>Item</th><th>Answer</th><th>Note</th></tr>${rows}
          </table>
          <script>window.print()</script>
        </body>
      </html>
    `);
    win.document.close();
  }

  const checklist = (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search checklist..."
        className="mb-4 w-full rounded-xl border px-3 py-2"
      />

      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div key={item.id} className="rounded-xl border p-4">
            <div className="grid gap-3 md:grid-cols-3 md:items-center">
              <div className="font-medium">{item.title}</div>
              <Field item={item} onChange={(answer) => updateItem(item.id, { answer })} />
              <div className="flex gap-2 md:justify-end">
                <Button variant="outline" onClick={() => setOpenNotes((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}>📝 Note</Button>
              </div>
            </div>

            {openNotes[item.id] && (
              <textarea
                value={item.note}
                onChange={(event) => updateItem(item.id, { note: event.target.value })}
                className="mt-3 min-h-20 w-full rounded-lg border px-3 py-2"
                placeholder="Write notes..."
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (isClientView) {
    return (
      <main className="min-h-screen bg-slate-50 p-5 text-slate-900">
        <div className="mx-auto max-w-5xl space-y-5">
          <div>
            <h1 className="text-3xl font-bold">Client Intake: {project.name}</h1>
            <p className="text-slate-500">Please complete this checklist before the site visit.</p>
          </div>
          {checklist}
          <Button onClick={() => setMessage("Submitted. Thank you.")}>Submit Intake</Button>
          {message && <div className="rounded-xl border bg-white p-3 text-sm">{message}</div>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-5 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Site Checklist</h1>
            <p className="text-slate-500">Project flow, client intake and stage checklist.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={createShareLink}>🔗 Client Link</Button>
            <Button onClick={generatePdf}>PDF Report</Button>
          </div>
        </header>

        {message && <div className="rounded-xl border bg-white p-3 text-sm">{message}</div>}

        <div className="grid gap-5 lg:grid-cols-4">
          <aside className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm">
            <section>
              <h2 className="mb-2 font-semibold">Stages</h2>
              <select
                value={stageTab}
                onChange={(event) => setStageTab(event.target.value)}
                className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
              >
                {["All", ...STAGES].map((stage) => (
                  <option key={stage} value={stage}>
                    {stage} ({counts[stage] || 0})
                  </option>
                ))}
              </select>
            </section>

            <section className="border-t pt-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-semibold">Projects</h2>
                <Button variant="outline" onClick={openAddForm}>+ Add</Button>
              </div>

              {formOpen && (
                <div className="mb-3 space-y-2 rounded-xl bg-slate-50 p-3">
                  <input placeholder="Project name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-lg border px-3 py-2" />
                  <input placeholder="Client" value={form.client} onChange={(event) => setForm({ ...form, client: event.target.value })} className="w-full rounded-lg border px-3 py-2" />
                  <input placeholder="Address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} className="w-full rounded-lg border px-3 py-2" />
                  <select
                    value={form.stage}
                    onChange={(event) => setForm({ ...form, stage: event.target.value })}
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                  >
                    {STAGES.map((stage) => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                  <input type="date" value={form.due} onChange={(event) => setForm({ ...form, due: event.target.value })} className="w-full rounded-lg border px-3 py-2" />
                  <Button className="w-full" onClick={handleAddProject}>Create</Button>
                </div>
              )}

              <div className="space-y-2">
                {visibleProjects.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full rounded-xl border p-3 text-left ${item.id === project.id ? "bg-slate-900 text-white" : "bg-white"}`}
                  >
                    <b>{item.name}</b>
                    <div className="text-xs opacity-70">{item.stage} · {completionPercent(item.items)}%</div>
                  </button>
                ))}
                {visibleProjects.length === 0 && <div className="rounded-xl border p-3 text-sm text-slate-500">No projects in this stage.</div>}
              </div>
            </section>
          </aside>

          <section className="space-y-5 lg:col-span-3">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{project.name}</h2>
                  <p className="text-slate-500">{project.client} · {project.address} · Due {project.due}</p>
                  <select value={project.stage} onChange={(event) => changeStage(event.target.value)} className="mt-3 rounded-xl border px-3 py-2">
                    {STAGES.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <div className="text-4xl font-bold">{completionPercent(project.items)}%</div>
                  <Button variant="danger" onClick={handleDeleteProject}>🗑 Delete Project</Button>
                </div>
              </div>
            </div>

            {checklist}
          </section>
        </div>
      </div>
    </main>
  );
}
