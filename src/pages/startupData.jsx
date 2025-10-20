import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from '../config/firebase.js'
import Navbar from "../components/Navbar.jsx";
import FieldCard from "../components/FieldCard.jsx";

// initialize firebase app and firestore

const db = getFirestore(app);



export default function StartupPage() {
    const { id } = useParams();
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
                const ref = doc(db, "ideas", id);
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
            <Navbar />
            <div className="min-h-screen p-6 bg-black text-white flex items-start justify-center">
                <div className="w-full max-w-6xl">
                    <header className="mb-8">
                        <div className="flex items-center justify-between gap-4">
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Startup Preview</h1>
                        </div>
                    </header>

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
                                            <p className="mt-2 text-xs text-amber-200">Preview below — the HTML will be copied to clipboard when you press Copy. NOTE: Navigation is blocked in preview. you can download code click download html.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigator.clipboard.writeText(data.website ?? "")
                                                    .then(() => alert("Website HTML copied to clipboard!"))
                                                    .catch(() => alert("Failed to copy website HTML."))}
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
                                            srcDoc={`${data.website}
                                                       <script>
                                                         window.addEventListener('DOMContentLoaded', () => {
                                                           document.addEventListener('click', function(e) {
                                                             if (e.target.tagName === 'A') {
                                                               e.preventDefault();
                                                             }
                                                           }, true);
                                                         });
                                                       </script>`}
                                            sandbox="allow-same-origin allow-scripts"
                                            className="w-full h-64 md:h-96 bg-white/5 "
                                        />
                                    </div>
                                </div>

                                <FieldCard label="Logo Idea" value={data.logo_idea}>
                                    <div className="text-sm">{data.logo_idea}</div>
                                </FieldCard>
                            </>
                        )}
                    </section>

                    <footer className="mt-8 text-center text-xs text-amber-300/70">Made with ❤️ — Preview UI • Black background, white text, amber shadows</footer>
                </div>
            </div>
        </>
    );
}
