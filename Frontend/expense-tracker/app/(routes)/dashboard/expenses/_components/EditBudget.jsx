"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { toast } from 'sonner'
import { eq, getTableColumns, sql } from 'drizzle-orm'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { useUser } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
function EditBudget({budgetInfo, refreshData}) {
    console.log(budgetInfo);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
    const [emojiIcon, setEmojiIcon] = useState('😀')

    const [budgetName, setBudgetName] = useState(budgetInfo.name)
    const [budgetAmount, setBudgetAmount] = useState(budgetInfo.amount)
    
    const onUpdateBudget = async () => {
             const result = await db.update(Budgets).set({
                name: budgetName,
                amount: budgetAmount,
                icon: emojiIcon
             })
             .where(eq(Budgets.id, budgetInfo.id))
             .returning()

             if(result)
             {  
                refreshData()
                setBudgetName(budgetInfo.name)
                setBudgetAmount(budgetInfo.amount)
                toast("Budget updated successfully!")
             }
    }

    useEffect(() => {
        if (budgetInfo) {
          setBudgetName(budgetInfo.name);
          setBudgetAmount(budgetInfo.amount);
        }
      }, [budgetInfo]);
      
  return (
    <div>
      
      <Dialog>
                      <DialogTrigger asChild>
                      <Button className='flex gap-2'><Edit />Edit</Button>
                          </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle>Fill in the details</DialogTitle>
                              <DialogDescription>
                                  <div className='mt-5 z-20'>
                                      <Button variant="outline" size="lg" onClick={() => (setOpenEmojiPicker(!openEmojiPicker))}>{emojiIcon}</Button>
                                      <div className='absolute'>
                                          <EmojiPicker open={openEmojiPicker} onEmojiClick={(e) => { setEmojiIcon(e.emoji); setOpenEmojiPicker(!openEmojiPicker) }} />
                                      </div>
                                      <div className='mt-1'>
                                          <h2 className='text-lg font-bold mb-1'>Budget Name</h2>
                                          <Input placeholder={budgetName} value={budgetName} onChange={(e) => setBudgetName(e.target.value)} />
                                      </div>
                                      <div className='mt-1'>
                                          <h2 className='text-lg font-bold mb-1'>Budget Amount</h2>
                                          <Input placeholder={budgetAmount} value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} />
                                      </div>
      
      
                                  </div>
                              </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="sm:justify-start">
                              <DialogClose asChild>
                                  <div className='flex justify-center w-full'>
                                      <Button disabled={!(budgetName && budgetAmount)} className='px-4 w-full bg-gray-600 mt-3'
                                          onClick={() => { onUpdateBudget() }} >Update</Button>
                                  </div>
                              </DialogClose>
                          </DialogFooter>
                      </DialogContent>
                  </Dialog>
    </div>
  )
}

export default EditBudget
