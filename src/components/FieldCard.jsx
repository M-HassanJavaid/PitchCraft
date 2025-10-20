import React from 'react'

// Small reusable Card component
function FieldCard({ label, value, children }) {
    return (
        <div className="bg-black/60 border border-amber-600/30 rounded-2xl p-5 shadow-2xl shadow-amber-500/30">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-sm text-amber-300/90 font-medium">{label}</h3>
                    <div className="mt-2 text-white text-sm break-words">{children ?? value}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <button
                        onClick={() => navigator.clipboard.writeText(value ?? "")
                                    .then(() => alert("Copied to clipboard!"))
                                    .catch(() => alert("Failed to copy.")) }
                        className="px-3 py-2 rounded-md text-sm font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/20 shadow-md shadow-amber-500/20"
                        title="Copy"
                    >
                        Copy
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FieldCard
