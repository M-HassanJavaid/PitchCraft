import { useState, useEffect, useContext, use } from 'react'
import Navbar from '../components/Navbar'
import DashboardCard from '../components/dashboardCard'
import Loader from '../components/Loader'
import app from '../config/firebase.js'
import { getFirestore, collection, getDocs, where } from "firebase/firestore";
const db = getFirestore(app);
import { AuthContext } from '../Context/authContext'



const dashboard = () => {

  const { user } = useContext(AuthContext);


  async function getData() {
    try {
      let querySnapshot = await getDocs(collection(db, "ideas"), where("user", "==", user.email));
      let ideas = [];
      querySnapshot.forEach((doc) => {
        ideas.push({ id: doc.id, ...doc.data() });
      });
      setData(ideas);
    } catch (error) {
      alert("Error fetching data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, [])





  return (
    <>
      <Navbar />
      {!isLoading && data.length === 0 && <h2 className='text-3xl font-semibold text-white text-center mt-10'>No Ideas Submitted Yet</h2>}
      {isLoading && <Loader />}
      {!isLoading && data.map(idea => <DashboardCard key={idea.id} name={idea.name} tagline={idea.tagline} id={idea.id} />)}
    </>
  )
}

export default dashboard