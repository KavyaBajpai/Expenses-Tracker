import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
function Hero() {
  return (
    <section className="bg-gray-100 mt-1 lg:grid lg:h-screen lg:place-content-center flex flex-col items-center justify-center">
  <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
    <div className="mx-auto max-w-prose text-center">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
        Manage your expenses,
        <strong className="text-indigo-600"> control </strong>
        Your Money.
      </h1>

      <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, nisi. Natus, provident
        accusamus impedit minima harum corporis iusto.
      </p>

      <div className="mt-4 flex justify-center gap-4 sm:mt-6">
        <a
          className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          href="#"
        >
          Get Started
        </a>

        <a
          className="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
          href="#"
        >
          Learn More
        </a>
      </div>
    </div>
  </div>
  <div className='flex justify-center items-center overflow-x-hidden h-100 bg-gray-100'>
    <div className='text-indigo-600 text-xl overflow-x-hidden'>
        <p>Dashboard Here</p>
    </div>
  </div>
</section>
  )
}

export default Hero
