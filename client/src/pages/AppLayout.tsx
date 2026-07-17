import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <>
      <p>banner</p>
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