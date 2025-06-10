import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Login from './pages/admin/Login'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddBlog from './pages/admin/AddBlog'
import ListBlog from './pages/admin/ListBlog'
import Comments from './pages/admin/Comments'
import 'quill/dist/quill.snow.css'
import ProtectedRoute from './context/ProtectedRoute'
import { Toaster } from 'react-hot-toast'


const App = () => {

  return (
    <div>
      <Toaster
        position="top-center" // You can change this (top-left, bottom-center, etc.)
        reverseOrder={false} // New toasts appear on top of old ones
        gutter={8} // Spacing between toasts
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Default options for all toasts
          className: '',
          duration: 3000, // How long the toast is visible (in ms)
          style: {
            background: '#363636',
            color: '#fff',
          },
          // Customization for different types of toasts
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 5000,
            theme: {
              primary: 'red',
              secondary: 'white',
            },
          },
        }}
      />
      
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/blog/:id' element={<Blog/>}/>
        <Route path='/login' element={<Login/>}/>

        <Route path='/admin' element={<ProtectedRoute><Layout/></ProtectedRoute>}>
          <Route index element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path='addBlog' element={<ProtectedRoute><AddBlog/></ProtectedRoute>}/>
          <Route path='listBlog' element={<ProtectedRoute><ListBlog/></ProtectedRoute>}/>
          <Route path='comments' element={<ProtectedRoute><Comments/></ProtectedRoute>}/>
        </Route>:

      </Routes>    
    </div>
  )
}

export default App
