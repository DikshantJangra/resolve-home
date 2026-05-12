'use client'

import React, { useState } from 'react'
import { useCategories, useCreateCategory, useDeleteCategory } from '@/hooks/api-hooks'
import { Button, Input, Label } from "@resolve/ui"
import { HiOutlinePlus, HiOutlineTrash, HiOutlineX } from 'react-icons/hi'
import { toast } from 'sonner'
import { createPortal } from 'react-dom'

interface CategoryManagerProps {
  isOpen: boolean
  onClose: () => void
}

export const CategoryManager = ({ isOpen, onClose }: CategoryManagerProps) => {
  const { data: categories, isLoading } = useCategories()
  const createCategory = useCreateCategory()
  const deleteCategory = useDeleteCategory()
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.name) return

    try {
      await createCategory.mutateAsync(newCategory)
      toast.success('Category created successfully')
      setNewCategory({ name: '', description: '' })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create category')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      await deleteCategory.mutateAsync(id)
      toast.success('Category deleted')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete category')
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <div>
            <h2 className="text-xl font-bold text-zinc-800">Manage Categories</h2>
            <p className="text-sm text-zinc-500">Add or remove service categories</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200/50 rounded-full transition-colors text-zinc-400 hover:text-zinc-600">
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        {/* Create Form */}
        <div className="p-6 border-b border-zinc-100 bg-white">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Category Name</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g. Plumbing, Electrical..." 
                  value={newCategory.name}
                  onChange={e => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  isLoading={createCategory.isPending}
                  className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl"
                >
                  <HiOutlinePlus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-14 bg-zinc-100 animate-pulse rounded-xl" />)}
            </div>
          ) : categories?.length > 0 ? (
            categories.map((cat: any) => (
              <div key={cat.id} className="group flex items-center justify-between p-4 rounded-xl border border-zinc-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                <span className="font-medium text-zinc-700">{cat.name}</span>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-zinc-400">No categories found</div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
