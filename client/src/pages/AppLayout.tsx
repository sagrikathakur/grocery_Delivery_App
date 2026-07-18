import { Outlet } from 'react-router-dom'
import Banner from '../components/Banner'
import Navbar from '../components/Navbar'

const AppLayout = () => {
  return (
    <>

      <Banner />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer>footer</footer>
      cart sidebar




    </>


  )
}

export default AppLayout