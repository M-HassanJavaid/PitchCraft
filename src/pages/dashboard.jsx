import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import app from '../config/firebase';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const auth = getAuth(app);
  const db = getFirestore(app);

  // 1. AUTH CHECK - Redirect if not logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  // 2. FETCH USER'S IDEAS FROM FIRESTORE
  useEffect(() => {
    if (user) {
      fetchUserIdeas();
    }
  }, [user]);

  const fetchUserIdeas = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Query: Get ONLY ideas where email === current user email
      const q = query(
        collection(db, 'ideas'),
        where('email', '==', user.email),
        orderBy('createdAt', 'desc') // Newest first
      );
      
      const querySnapshot = await getDocs(q);
      const userIdeas = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setIdeas(userIdeas);
      console.log(`✅ Fetched ${userIdeas.length} ideas for ${user.email}`);
      
    } catch (err) {
      console.error('Error fetching ideas:', err);
      setError('Failed to load your ideas. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  // 3. HANDLE LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 4. REFRESH IDEAS (Manual refresh button)
  const handleRefresh = () => {
    fetchUserIdeas();
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Your Startup Ideas
            </h1>
            <p className="text-white/70">
              Welcome back, {user?.email} • {ideas.length} ideas generated
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30 hover:bg-amber-500/30 transition-all"
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600/20 text-red-300 rounded-lg border border-red-600/30 hover:bg-red-600/30 transition-all"
            >
              🚪 Logout
            </button>
          </div>
        </header>

        {/* ERROR */}
        {error && (
          <div className="p-4 mb-6 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {ideas.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-semibold mb-2">No Ideas Yet!</h2>
            <p className="text-white/70 mb-6">Generate your first startup pitch</p>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-all"
            >
              ✨ Generate Now
            </a>
          </div>
        ) : (
          /* IDEAS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 5. IDEA CARD COMPONENT
const IdeaCard = ({ idea }) => {
  return (
    <div className="glass rounded-2xl p-6 border-2 border-white/10 shadow-2xl shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-300 overflow-hidden">
      {/* NAME & TAGLINE */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-1">{idea.startup_name}</h2>
        <p className="text-amber-400 italic">"{idea.tagline}"</p>
      </div>

      {/* PITCH */}
      <p className="text-white/80 mb-4 text-sm leading-relaxed">{idea.pitch}</p>

      {/* META */}
      <div className="flex justify-between items-center text-xs text-white/50 mb-4">
        <span>{idea.industry}</span>
        <span>{idea.createdAt?.toDate().toLocaleDateString()}</span>
      </div>

      {/* LOGO IDEA */}
      <div className="mb-4 p-3 bg-black/20 rounded-lg">
        <h3 className="font-medium text-white mb-2 text-xs">🎨 Logo Concept</h3>
        <p className="text-white/70 text-xs">{idea.logo_idea}</p>
      </div>

      {/* WEBSITE PREVIEW */}
      <div className="h-48">
        <h3 className="font-medium text-white mb-2 text-xs">🌐 Live Preview</h3>
        <iframe
          srcDoc={idea.website}
          title={idea.startup_name}
          className="w-full h-full border border-white/20 rounded-lg"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

export default Dashboard;