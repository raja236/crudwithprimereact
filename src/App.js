import React from 'react'
import Product from './Components/Product'
import Customer from './Components/Customer'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from './Components/Layout';
import RowEditingProduct from './Components/RowEditProduct';
import IntegrateAPI from './Components/IntegrateAPI';
import Login from './Components/Login';
import AuthProvider from './Components/AuthProvider';
import PrivateRoute from './Components/PrivateRoute';
const App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="deshboard" element={<Layout />}>
                <Route path="Product" element={<Product />} />
                <Route path="Customer" element={<Customer />} />
                <Route path="Customer:id" element={<Customer />} />
                <Route path='RowEditingProduct' element={<RowEditingProduct />} />
                <Route path='fetchProducts' element={<IntegrateAPI />}></Route>
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )


}

export default App