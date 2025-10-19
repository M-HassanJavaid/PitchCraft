import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/*
  Instructions:
  - Replace the firebaseConfig object below with your project's values (or import your existing firebase app/db).
  - This file is a single-file React page. Add it to your routes (example: <Route path="/startup/:id" element={<StartupPage/>} />).
  - Tailwind should be configured in your project.
*/

// Firebase (modular v9+) - replace with your own config or import your already-initialized app/db
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from '../config/firebase.js'
import Navbar from "../components/Navbar.jsx";

// initialize firebase app and firestore

const db = getFirestore(app);

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
                        onClick={() => navigator.clipboard.writeText(value ?? "")}
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

export default function StartupPage() {
    const { id } = useParams(); // expects route /startup/:id
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setError("No document id provided in route.");
            setLoading(false);
            return;
        }

        async function fetchDoc() {
            try {
                setLoading(true);
                const ref = doc(db, "ideas", id); // collection name 'startups' - change if your collection is different
                const snap = await getDoc(ref);
                if (!snap.exists()) {
                    setError("Document not found.");
                    setData(null);
                } else {
                    setData(snap.data());
                }
            } catch (e) {
                console.error(e);
                setError("Failed to fetch document: " + e.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDoc();
    }, [id]);

    return (
        <>
        <Navbar/>
        <div className="min-h-screen p-6 bg-black text-white flex items-start justify-center">
            <div className="w-full max-w-6xl">
                <header className="mb-8">
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Startup Preview</h1>
                    </div>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left column: fields */}
                    <section className="md:col-span-2 space-y-4">
                        {loading && (
                            <div className="flex items-center justify-center p-6 bg-black/50 rounded-xl border border-amber-600/20">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-amber-500/70"></div>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-900/30 rounded-lg border border-red-600/30 text-sm">{error}</div>
                        )}

                        {!loading && !error && !data && (
                            <div className="p-4 bg-black/40 rounded-lg border border-amber-600/20">No data to display.</div>
                        )}

                        {data && (
                            <>
                                <FieldCard label="Startup Name" value={data.startup_name}>
                                    <div className="text-xl font-semibold">{data.startup_name}</div>
                                </FieldCard>

                                <FieldCard label="Tagline" value={data.tagline}>
                                    <div className="italic text-amber-200">{data.tagline}</div>
                                </FieldCard>

                                <FieldCard label="Pitch" value={data.pitch}>
                                    <p className="text-sm">{data.pitch}</p>
                                </FieldCard>

                                <div className="bg-black/50 border border-amber-600/20 rounded-2xl p-5 shadow-2xl shadow-amber-500/20">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm text-amber-300/90 font-medium">Website (full HTML)</h3>
                                            <p className="mt-2 text-xs text-amber-200">Preview below — the HTML will be copied to clipboard when you press Copy.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigator.clipboard.writeText(data.website ?? "")}
                                                className="px-3 py-2 rounded-md text-sm font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/20 shadow-md shadow-amber-500/20"
                                            >
                                                Copy HTML
                                            </button>
                                            <a
                                                href={"data:text/html;charset=utf-8," + encodeURIComponent(data.website ?? "")}
                                                download={`${(data?.startup_name ?? 'startup').replace(/\s+/g, '_')}_site.html`}
                                                className="px-3 py-2 rounded-md text-sm font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/20 shadow-md shadow-amber-500/20"
                                            >
                                                Download
                                            </a>
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-lg overflow-hidden border border-amber-600/10">
                                        {/* iframe preview */}
                                        <iframe
                                            title="website-preview"
                                            srcDoc={data.website}
                                            sandbox="allow-same-origin allow-scripts"
                                            className="w-full h-64 md:h-96 bg-white/5"
                                        />
                                    </div>
                                </div>

                                <FieldCard label="Logo Idea" value={data.logo_idea}>
                                    <div className="text-sm">{data.logo_idea}</div>
                                </FieldCard>
                            </>
                        )}
                    </section>

                    {/* Right column: live hero mock + actions */}
                    <aside className="md:col-span-1 space-y-4">
                        <div className="p-4 bg-gradient-to-br from-black/40 to-black/60 rounded-xl border border-amber-600/10 shadow-lg shadow-amber-500/15">
                            <h2 className="text-lg font-semibold">Live Mock / Hero</h2>
                            <p className="text-xs text-amber-300/80 mt-1">A small, live hero preview generated from the data</p>

                            {!data && !loading && (
                                <div className="mt-4 text-sm text-amber-200">No preview available.</div>
                            )}

                            {data && (
                                <div className="mt-4 rounded-xl p-4 bg-gradient-to-r from-amber-900/10 to-amber-800/5 border border-amber-700/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-14 h-14 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-md shadow-amber-500/20">
                                            <div className="text-amber-200 font-bold">{(data.startup_name || "S").slice(0, 2)}</div>
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-lg">{data.startup_name}</div>
                                            <div className="text-amber-200 text-sm">{data.tagline}</div>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm text-white/90">{data.pitch}</p>

                                    <div className="mt-4 flex gap-2">
                                        

                                        <button
                                            onClick={() => {
                                                const text = `Startup: ${data.startup_name}\nTagline: ${data.tagline}\nPitch: ${data.pitch}`;
                                                navigator.clipboard.writeText(text);
                                            }}
                                            className="px-3 py-2 rounded-full text-sm font-medium bg-black/60 border border-amber-500/20 text-amber-200 shadow-sm shadow-amber-500/20"
                                        >
                                            Copy Hero
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        

                    </aside>
                </main>

                <footer className="mt-8 text-center text-xs text-amber-300/70">Made with ❤️ — Preview UI • Black background, white text, amber shadows</footer>
            </div>
        </div>
        </>
    );
}
