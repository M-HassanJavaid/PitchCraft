import { useEffect, useState , useContext } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleArrowDown } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../Context/authContext';
import { getAuth, signOut } from 'firebase/auth';
import app from '../config/firebase';

const auth = getAuth(app);


const Navbar = () => {

  const [NavOpen, setNavOpen] = useState(false)

  const { setIsLogin , setUser } = useContext(AuthContext)

  async function logout() {
    try {
      await signOut(auth);
      setIsLogin(false);
      setUser({ name: '', email: '', uid: '' });
      alert('Logout successful!');
    } catch (error) {
      alert('Error during logout: ' + error.message);
    }
  }


  return (
    <nav className='bg-black shadow-2xl shadow-amber-300'>
      <div className='flex relative gap-2.5 justify-between px-5 py-3 h-[80px] items-center text-white max-w-[1700px] mx-auto'>
        <h1 className='italic text-3xl max-lg:order-2'>Pitch Craft</h1>
        <p className={`hidden max-lg:block max-lg:order-1 transition-all ${NavOpen ? 'rotate-180' : 'rotate-0'}`} onClick={() => setNavOpen(!NavOpen)} ><FontAwesomeIcon icon={faCircleArrowDown} className='text-4xl' /></p>
        <ul className={`flex text-nowrap gap-4 overflow-hidden transition-all max-lg:absolute max-lg:top-full max-lg:left-0 max-lg:w-full max-lg:bg-black max-lg:px-5 
                       max-lg:justify-center max-lg:flex-wrap max-lg:${NavOpen ? 'h-auto' : 'h-0'}`}>
          <li className='block my-1.5'><Link to='/'>Generate new</Link></li>
          <li className='block my-1.5'><Link to='/signup'>Signup</Link></li>
          <li className='block my-1.5'><Link to='/login'>Login</Link></li>
          <li className='block my-1.5 cursor-pointer' onClick={logout}>Logout</li>
          <li className='block my-1.5'><Link to='/dashboard'>Dashboard</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
