"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function NewAccountPage() {
  const t = useTranslations("growth.accounts");
  const router = useRouter();
  const createAccount = useMutation(api.accounts.createAccount);

  const [form, setForm] = useState({
    name: "",
    domain: "",
    stage: "Lead" as const,
    pipeline: "",
    ltv: "",
    spend: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await createAccount({
        name: form.name,
        domain: form.domain || undefined,
        stage: form.stage,
        pipeline: parseFloat(form.pipeline) || 0,
        ltv: parseFloat(form.ltv) || 0,
        spend: parseFloat(form.spend) || 0,
      });
      router.push("/growth/accounts"); // or /home
    } catch (error) {
      console.error("Failed to create account", error);
      alert("Failed to create account");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900">New Account</h1>
      <p className="text-sm text-slate-500 mt-1">
        Add a company account to track intent, engagement, and revenue.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-white rounded-2xl p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700">Account name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Domain (optional)</label>
          <input
            type="text"
            name="domain"
            value={form.domain}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Stage</label>
          <select
            name="stage"
            value={form.stage}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Visitor">Visitor</option>
            <option value="Lead">Lead</option>
            <option value="MQL">MQL</option>
            <option value="Customer">Customer</option>
            <option value="Churned">Churned</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Pipeline ($)</label>
            <input
              type="number"
              name="pipeline"
              value={form.pipeline}
              onChange={handleChange}
              min="0"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">LTV ($)</label>
            <input
              type="number"
              name="ltv"
              value={form.ltv}
              onChange={handleChange}
              min="0"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Spend ($)</label>
            <input
              type="number"
              name="spend"
              value={form.spend}
              onChange={handleChange}
              min="0"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Create account"}
        </button>
      </form>
    </div>
  );
}