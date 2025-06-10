import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import Footer from '../components/Footer'
import EmailSection from '../components/EmailSection'

const Home = () => {
  return (
   <>
   <Navbar/>
   <Header/>
   <BlogList/>
   <EmailSection/>
   <Footer/>
   </>
  )
}

export default Home
