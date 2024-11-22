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
import Individualproduct from './Components/Individualproduct';
import Books from './Components/BookStore/Books';
import Author from './Components/BookStore/Author';
import ReUsableGrid from './Components/ReUsableGrid';
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
                <Route path='RowEditingProduct' element={<RowEditingProduct />} />
                <Route path='fetchProducts' element={<IntegrateAPI />}/>
                <Route path="fetchProducts/:id" element={<Individualproduct />} />
                <Route path='Books' element={<Books/>}/>
                <Route path='Author' element={<Author/>}/>
                <Route path='ReUsableComp' element={<ReUsableGrid/>}/>
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )


}

export default App