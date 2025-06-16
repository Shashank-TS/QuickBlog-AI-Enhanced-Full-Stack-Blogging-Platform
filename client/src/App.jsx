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
import Profile from './pages/admin/Profile'

const App = () => {

  return (
    <div>
      <Toaster
        position="top-center" 
        reverseOrder={false} 
        gutter={8} 
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          
          className: '',
          duration: 3000, 
          style: {
            background: '#363636',
            color: '#fff',
          },
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
          <Route path='profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        </Route>:

      </Routes>    
    </div>
  )
}

export default App
