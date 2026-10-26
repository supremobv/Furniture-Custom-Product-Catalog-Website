"use client";
import { useEffect, useState } from "react";
import {
  products,
  materials,
  finishes,
  money,
  statuses,
} from "../catalog-data";
type Inquiry = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  productId: string;
  material: string;
  finish: string;
  quantity: number;
  dimensions: string;
  budget: string;
  timeline: string;
  message: string;
  estimate: number | null;
  status: string;
  createdAt: string;
};
export default function Inbox() {
  const [items, setItems] = useState<Inquiry[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(true),
    [filter, setFilter] = useState("All");
  async function refresh() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/inquiries");
      const j = (await r.json()) as { error?: string; inquiries: Inquiry[] };
      if (!r.ok) throw new Error(j.error || "Unable to load inquiries");
      setItems(j.inquiries);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load");
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);
  async function update(id: string, status: string) {
    setError("");
    try {
      const r = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!r.ok)
        throw new Error(
          "Unable to update the inquiry. Please refresh and try again.",
        );
      setItems((s) => s.map((i) => (i.id === id ? { ...i, status } : i)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update");
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(items, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "sora-studio-inquiries.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <main className="studio-page">
      <a className="wordmark" href="/">
        sora<span>STUDIO INBOX</span>
      </a>
      <div className="studio-heading">
        <div>
          <p className="eyebrow">CUSTOM ORDER CONVERSATIONS</p>
          <h1>
            Ideas, <em>in the making.</em>
          </h1>
        </div>
        <div>
          <button className="button outline" onClick={refresh} disabled={busy}>
            {busy ? "Loading…" : "Refresh"}
          </button>
          <button
            className="button dark"
            onClick={download}
            disabled={!items.length}
          >
            Export JSON
          </button>
        </div>
      </div>
      <p>
        Private studio workspace. Inquiries are briefs for review, not confirmed
        orders. Email delivery is not configured.
      </p>
      <div className="catalog-tabs">
        {["All", ...statuses].map((s) => (
          <button
            key={s}
            className={filter === s ? "selected" : ""}
            onClick={() => setFilter(s)}
          >
            {s} ({items.filter((i) => s === "All" || i.status === s).length})
          </button>
        ))}
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {!busy &&
        !items.filter((i) => filter === "All" || i.status === filter)
          .length && (
          <div className="empty">No inquiries in this view yet.</div>
        )}
      <div className="inbox-list">
        {items
          .filter((i) => filter === "All" || i.status === filter)
          .map((i) => (
            <article key={i.id}>
              <div className="inbox-top">
                <span>
                  {i.reference} · {new Date(i.createdAt).toLocaleString()}
                </span>
                <select
                  aria-label={`Status for ${i.reference}`}
                  value={i.status}
                  onChange={(e) => update(i.id, e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <h2>
                {products.find((p) => p.id === i.productId)?.name ||
                  "Custom piece / cabinetry"}
              </h2>
              <div className="inbox-columns">
                <div>
                  <h3>{i.name}</h3>
                  <p>
                    <a href={`mailto:${i.email}`}>{i.email}</a>
                    <br />
                    {i.phone || "Phone not provided"}
                    <br />
                    {i.location}
                  </p>
                </div>
                <div>
                  <p>
                    {i.quantity} piece(s) ·{" "}
                    {materials.find((m) => m.id === i.material)?.name}
                    <br />
                    {finishes.find((f) => f.id === i.finish)?.name} finish
                    <br />
                    Dimensions: {i.dimensions || "To be discussed"}
                  </p>
                </div>
                <div>
                  <p>
                    Budget: {i.budget}
                    <br />
                    Timeline: {i.timeline}
                    <br />
                    Sample estimate:{" "}
                    {i.estimate === null ? "Custom quote" : money(i.estimate)}
                  </p>
                </div>
              </div>
              <p className="inbox-message">{i.message}</p>
            </article>
          ))}
      </div>
      <a className="underlink" href="/">
        ← Return to the collection
      </a>
    </main>
  );
}
