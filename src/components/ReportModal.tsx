import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, RefreshCw, FileSpreadsheet } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FilterDef =
  | {
      key: string;
      label: string;
      type: "select";
      options: { label: string; value: string }[];
    }
  | {
      key: string;
      label: string;
      type: "multiselect";
      options: { label: string; value: string }[];
    }
  | {
      key: string;
      label: string;
      type: "date-range";
      fromKey: string;
      toKey: string;
    };

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  filters: FilterDef[];
  /** Called with a key→value map of all filter values when user clicks Download */
  onDownload: (values: Record<string, string | string[]>) => void | Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReportModal({
  isOpen,
  onClose,
  title,
  subtitle,
  filters,
  onDownload,
}: ReportModalProps) {
  // Default date helpers
  const DEFAULT_FROM = "2026-01-01";
  const DEFAULT_TO   = new Date().toISOString().split("T")[0]; // today as YYYY-MM-DD

  // Build initial state from filter defs
  const initState = (): Record<string, string | string[]> => {
    const s: Record<string, string | string[]> = {};
    for (const f of filters) {
      if (f.type === "multiselect") {
        s[f.key] = [];
      } else if (f.type === "date-range") {
        s[f.fromKey] = DEFAULT_FROM;
        s[f.toKey]   = DEFAULT_TO;
      } else {
        s[f.key] = f.options[0]?.value ?? "";
      }
    }
    return s;
  };

  const [values, setValues] = useState<Record<string, string | string[]>>(initState);
  const [loading, setLoading] = useState(false);

  // Reset on open
  React.useEffect(() => {
    if (isOpen) setValues(initState());
  }, [isOpen]);

  function set(key: string, value: string | string[]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleMulti(key: string, val: string) {
    const cur = (values[key] as string[]) ?? [];
    set(key, cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val]);
  }

  async function handleDownload() {
    setLoading(true);
    try {
      await onDownload(values);
    } finally {
      setLoading(false);
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="report-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="report-modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileSpreadsheet size={18} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">{title}</h2>
                    {subtitle && (
                      <p className="text-xs text-muted-foreground">{subtitle}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Filters */}
              <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
                {filters.map((f) => {
                  if (f.type === "select") {
                    return (
                      <div key={f.key} className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {f.label}
                        </label>
                        <select
                          value={values[f.key] as string}
                          onChange={(e) => set(f.key, e.target.value)}
                          className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          {f.options.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  if (f.type === "multiselect") {
                    const selected = (values[f.key] as string[]) ?? [];
                    return (
                      <div key={f.key} className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {f.label}
                          <span className="ml-1 text-[10px] normal-case font-normal">(select all that apply)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {f.options.map((o) => {
                            const active = selected.includes(o.value);
                            return (
                              <button
                                key={o.value}
                                type="button"
                                onClick={() => toggleMulti(f.key, o.value)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                  active
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-muted text-muted-foreground border-border hover:border-primary/40"
                                }`}
                              >
                                {o.label}
                              </button>
                            );
                          })}
                        </div>
                        {selected.length === 0 && (
                          <p className="text-[11px] text-muted-foreground">None selected = include all</p>
                        )}
                      </div>
                    );
                  }

                  if (f.type === "date-range") {
                    return (
                      <div key={f.key} className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {f.label}
                        </label>
                        <div className="flex gap-3">
                          <div className="flex-1 space-y-1">
                            <span className="text-[11px] text-muted-foreground">From</span>
                            <input
                              type="date"
                              value={values[f.fromKey] as string}
                              onChange={(e) => set(f.fromKey, e.target.value)}
                              className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <span className="text-[11px] text-muted-foreground">To</span>
                            <input
                              type="date"
                              value={values[f.toKey] as string}
                              onChange={(e) => set(f.toKey, e.target.value)}
                              className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDownload}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:shadow-md active:scale-95 transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      Download Excel
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
