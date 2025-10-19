import { useState } from "react";
import app from '../config/firebase.js'
import { Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(app)
import Loader from './Loader.jsx'

import { getFirestore, collection, addDoc } from "firebase/firestore";
const db = getFirestore(app);

const Signup = () => {

  function handleChange(e) {
    let newInput = JSON.parse(JSON.stringify(formData));
    setFormData({ ...newInput, [e.target.name]: e.target.value })

  }
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: "", password: '' })

  async function getSignup() {
    try {
      setIsLoading(true)
      let userCredentials = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      let user = userCredentials.user;

      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: formData.name,
        email: formData.email
      });

      alert("Signup Successful")
      setFormData({ name: '', email: '', password: '' })
    } catch (error) {
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md glass rounded-2xl p-8 border-4 border-white shadow-2xl shadow-amber-400">
        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          Create Account
        </h1>

        <form className="space-y-5">
          <div>
            <label className="block text-sm text-white mb-2">Full Name</label>
            <input
              name="name"
              onChange={handleChange}
              value={formData.name}
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>

          <div>
            <label className="block text-sm text-white mb-2">Email</label>
            <input
              name="email"
              onChange={handleChange}
              value={formData.email}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>

          <div>
            <label className="block text-sm text-white mb-2">Password</label>
            <input
              name="password"
              onChange={handleChange}
              value={formData.password}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>

          <button
            onClick={getSignup}
            type="button"
            className="w-full py-2 mt-4 bg-white/20 text-white rounded-lg font-medium tracking-wide border border-white/30 hover:bg-white/30 transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-white/70 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
