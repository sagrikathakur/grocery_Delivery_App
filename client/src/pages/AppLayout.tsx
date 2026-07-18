import { Outlet } from 'react-router-dom'
import Banner from '../components/Banner'

const AppLayout = () => {
  return (
    <>

      <Banner />
      navbar
      <main>
        <Outlet />
      </main>
      <footer>footer</footer>
      cart sidebar




    </>


  )
}

export default AppLayout