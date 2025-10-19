import React from 'react'
import Navbar from '../components/Navbar'
import DashboardCard from '../components/dashboardCard'

const dashboard = () => {
  return (
    <>
      <Navbar />
      <div className='flex flex-wrap p-2 min-h-[calc(100vh-80px)] bg-black'>
        <DashboardCard name="Startup Name"  tagline="tagline of startup" />
        <DashboardCard name="Startup Name"  tagline="tagline of startup" />
        <DashboardCard name="Startup Name"  tagline="tagline of startup" />
      </div>
    </>
  )
}

export default dashboard