"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation';
function Hero() {

  const { user } = useUser();
  const route = useRouter();
  const logInUser = () => {
    console.log("function is run");
    if(user)
    { 
       route.replace('/dashboard')
    }
    else
    {
        route.replace('/sign-in')
    }
  }
  return (
    <section className="bg-gray-100 mt-1 place-content-center flex flex-col items-center justify-center h-screen overflow-hidden overflow-y-hidden overflow-x-hidden">
  <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
    <div className="mx-auto max-w-prose text-center">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
        Manage your expenses,
        <strong className="text-indigo-800"> control </strong>
        Your Money.
      </h1>

      <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, nisi. Natus, provident
        accusamus impedit minima harum corporis iusto.
      </p>

      <div className="mt-4 flex justify-center gap-4 sm:mt-6">
        <Button onClick={()=>{logInUser()}} className="inline-block rounded border border-indigo-900 bg-indigo-900  font-medium text-white shadow-sm text-center transition-colors hover:bg-indigo-700">
          Get Started
        </Button>

        <Button className="inline-block rounded border border-indigo-900 bg-indigo-900  font-medium text-white shadow-sm transition-colors text-center hover:bg-indigo-700">
          Learn More
        </Button>
      </div>
    </div>
  </div>
  <div className='flex justify-center items-center overflow-x-hidden h-100 bg-gray-100'>
    
  </div>
</section>
  )
}

export default Hero
