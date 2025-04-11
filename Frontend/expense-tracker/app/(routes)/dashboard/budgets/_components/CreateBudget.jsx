"use client"
import React from 'react'
import { Input } from '@/components/ui/input'
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
import { Button } from '@/components/ui/button'
import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'
import { db } from '@/utils/dbConfig'
import { useUser } from '@clerk/nextjs'
import { Budgets } from '@/utils/schema'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

function CreateBudget({refreshData}) {
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
    const [emojiIcon, setEmojiIcon] = useState('😀')
    const [budgetName, setBudgetName] = useState('')
    const [budgetAmount, setBudgetAmount] = useState('')
    const { user } = useUser();
    const user_id = user?.id;

    const onCreateBudget = async () => {
        if(!user) return
        const result = await db.insert(Budgets)
            .values({
                name: budgetName,
                amount: budgetAmount,
                emoji: emojiIcon,
                createdBy: user.id

            }).returning({ insertedId: Budgets.id })

        if (result) {
            refreshData()
            toast('New Budget Created Successfully!')
            setBudgetName('')
            setBudgetAmount('')
        }
    }
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col justify-center border-2 border-dashed cursor-pointer hover:shadow-md mt-7'>
                        <h2 className='font-bold'>+</h2>
                        <h2>Create New Budget</h2>
                    </div></DialogTrigger>
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
                                    <Input placeholder="e.g. Stationery" onChange={(e) => setBudgetName(e.target.value)} />
                                </div>
                                <div className='mt-1'>
                                    <h2 className='text-lg font-bold mb-1'>Budget Amount</h2>
                                    <Input placeholder="e.g $5000" onChange={(e) => setBudgetAmount(e.target.value)} />
                                </div>


                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <div className='flex justify-center w-full'>
                                <Button disabled={!(budgetName && budgetAmount)} className='px-4 w-full bg-gray-600 mt-3'
                                    onClick={() => { onCreateBudget() }} >Add</Button>
                            </div>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default CreateBudget
