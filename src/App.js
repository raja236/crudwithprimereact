import React from 'react'
import Product from './Components/Product'
import Customer from './Components/Customer'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Components/Layout';
import RowEditingProduct from './Components/RowEditProduct';
const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />} >
        <Route path='/' element={<div>
          No Component to show
        </div>} />
          <Route path="/Product" element={<Product />} />
          <Route path="/Customer" element={<Customer />} />
          <Route path='/RowEditingProduct' element = {<RowEditingProduct/>}/>
        </Route>
      </Routes>
    </>
  )


}

export default App