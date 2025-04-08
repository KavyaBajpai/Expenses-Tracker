"use client"
import React, { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function Input({month, setMonth}) {
  useEffect(()=>{
      console.log("month:", month)
    },[setMonth])
  return (

    <Select value={month} onValueChange={setMonth}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Month" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">January'25</SelectItem>
        <SelectItem value="2">February'25</SelectItem>
        <SelectItem value="3">March'25</SelectItem>
        <SelectItem value="4">April'25</SelectItem>
      </SelectContent>
    </Select>


  )
}

export default Input
