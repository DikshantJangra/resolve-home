"use client"

import * as React from "react"
import { 
  useCategories, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory, 
  useServices, 
  useCreateService, 
  useDeleteService,
  useAdminEngineers
} from "@/hooks/api-hooks"
import { 
  HiOutlinePlus, 
  HiOutlineTrash, 
  HiOutlinePencilAlt, 
  HiOutlineChevronRight,
  HiOutlineUserGroup,
  HiOutlineSearch,
  HiOutlineDotsVertical,
  HiOutlineX
} from "react-icons/hi"
import { Button, Input, Label, cn, Skeleton } from "@resolve/ui"
import { toast } from "sonner"

export default function CategoriesPage() {
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: engineers, isLoading: engineersLoading } = useAdminEngineers()
  
  const [activeCategoryId, setActiveCategoryId] = React.useState<string | null>(null)
  const { data: subServices, isLoading: servicesLoading } = useServices(activeCategoryId || undefined)

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()
  const createService = useCreateService()
  const deleteService = useDeleteService()

  const [isCatModalOpen, setIsCatModalOpen] = React.useState(false)
  const [editingCategory, setEditingCategory] = React.useState<any>(null)
  const [formData, setFormData] = React.useState({ name: '', description: '' })
  const [newService, setNewService] = React.useState({ name: '', price: '' })
  const [searchQuery, setSearchQuery] = React.useState('')

  // Set first category as active by default
  React.useEffect(() => {
    if (categories?.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id)
    }
  }, [categories])

  const activeCategory = categories?.find((c: any) => c.id === activeCategoryId)

  // Calculate pro counts
  const categoryStats = React.useMemo(() => {
    const stats: Record<string, number> = {}
    const categoryList = Array.isArray(categories) ? categories : []
    const engineerList = Array.isArray(engineers) ? engineers : []
    categoryList.forEach((cat: any) => stats[cat.id] = 0)
    engineerList.forEach((eng: any) => {
      if (eng?.categoryId) stats[eng.categoryId] = (stats[eng.categoryId] || 0) + 1
    })
    return stats
  }, [categories, engineers])

  const handleOpenCatModal = (category?: any) => {
    if (category) {
      setEditingCategory(category)
      setFormData({ name: category.name, description: category.description || '' })
    } else {
      setEditingCategory(null)
      setFormData({ name: '', description: '' })
    }
    setIsCatModalOpen(true)
  }

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, data: formData })
        toast.success('Category updated')
      } else {
        await createCategory.mutateAsync(formData)
        toast.success('Category created')
      }
      setIsCatModalOpen(false)
    } catch (err) {
      toast.error('Failed to save category')
    }
  }

  const handleDeleteService = async (id: string) => {
    if (!activeCategoryId) return
    if (!confirm('Remove this specific service?')) return
    try {
      await deleteService.mutateAsync({ id, categoryId: activeCategoryId })
      toast.success('Service removed')
    } catch (err) {
      toast.error('Failed to remove service')
    }
  }

  if (categoriesLoading || engineersLoading) {
    return <div className="p-4 sm:p-8 flex flex-col gap-8 animate-pulse">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-3 gap-8 h-[600px]">
        <Skeleton className="col-span-1 rounded-2xl" />
        <Skeleton className="col-span-2 rounded-2xl" />
      </div>
    </div>
  }

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newService.name || !newService.price || !activeCategoryId) {
      toast.error('Name and Price are required')
      return
    }
    try {
      await createService.mutateAsync({ 
        name: newService.name, 
        price: Number(newService.price),
        categoryId: activeCategoryId 
      })
      setNewService({ name: '', price: '' })
      toast.success('Service added')
    } catch (err) {
      toast.error('Failed to add service')
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Bar */}
      <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center shrink-0">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold text-zinc-900">Service Domains</h1>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-tight">Configure the platform service hierarchy</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="Search..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 w-48 bg-zinc-50/50 border-zinc-200 h-9 rounded-lg text-sm focus:bg-white transition-all"
            />
          </div>
          <Button 
            onClick={() => handleOpenCatModal()}
            className="bg-zinc-900 hover:bg-black text-white rounded-lg h-9 px-4 flex items-center gap-2 text-sm font-semibold"
          >
            <HiOutlinePlus size={16} />
            New Category
          </Button>
        </div>
      </div>

      {/* Main Content: Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Categories List */}
        <div className="w-72 border-r border-zinc-100 bg-zinc-50/30 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar">
            {categoriesLoading ? (
              Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg mb-2" />)
            ) : categories?.filter((c: any) => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all group relative",
                  activeCategoryId === cat.id 
                    ? "bg-white shadow-sm border border-zinc-200" 
                    : "hover:bg-white/60 border border-transparent"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0",
                  activeCategoryId === cat.id ? "bg-blue-600 text-white shadow-sm" : "bg-zinc-100 text-zinc-400"
                )}>
                  <HiOutlineUserGroup size={16} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className={cn("text-sm font-bold truncate", activeCategoryId === cat.id ? "text-zinc-900" : "text-zinc-500 group-hover:text-zinc-900")}>
                    {cat.name}
                  </p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                    {categoryStats[cat.id] || 0} Pros
                  </p>
                </div>
                {activeCategoryId === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane: Sub-services Hub */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden">
          {activeCategory ? (
            <>
              {/* Category Sub-header */}
              <div className="px-8 py-10 border-b border-zinc-50 flex justify-between items-start shrink-0">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-zinc-900 tracking-tight">{activeCategory.name}</h2>
                    <div className="h-4 w-[1px] bg-zinc-200" />
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                      Category Domain
                    </span>
                  </div>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                    {activeCategory.description || 'Define specific services that homeowners can select when booking for this category.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenCatModal(activeCategory)}
                    className="p-2.5 bg-white hover:bg-zinc-50 text-zinc-500 rounded-lg transition-all border border-zinc-200 shadow-sm"
                  >
                    <HiOutlinePencilAlt size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm('Delete this entire category?')) deleteCategory.mutate(activeCategory.id)
                    }}
                    className="p-2.5 bg-white hover:bg-red-50 text-zinc-400 hover:text-red-600 rounded-lg transition-all border border-zinc-200 shadow-sm"
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                </div>
              </div>

              {/* Sub-services Content */}
              <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
                <div className="max-w-3xl space-y-8">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Specific Services</h3>
                    <p className="text-xs text-zinc-400 font-medium">Add services that populate Step 3 of the booking wizard.</p>
                  </div>

                  {/* Add Service Minimal Form */}
                  <div className="p-1 bg-zinc-100/50 rounded-xl flex items-center gap-1 border border-zinc-100">
                    <input 
                      placeholder="Service name (e.g. Toilet Leak)" 
                      value={newService.name}
                      onChange={e => setNewService(p => ({...p, name: e.target.value}))}
                      className="flex-1 h-10 bg-transparent px-4 text-sm outline-none font-medium placeholder:text-zinc-400"
                    />
                    <div className="w-[1px] h-6 bg-zinc-200" />
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-zinc-400 text-sm font-bold">₦</span>
                      <input 
                        type="number"
                        placeholder="Price" 
                        value={newService.price}
                        onChange={e => setNewService(p => ({...p, price: e.target.value}))}
                        className="w-24 h-10 bg-transparent pl-7 pr-3 text-sm outline-none font-bold placeholder:text-zinc-400"
                      />
                    </div>
                    <Button 
                      onClick={handleAddService}
                      isLoading={createService.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6 rounded-lg text-xs font-bold"
                    >
                      Add
                    </Button>
                  </div>

                  {/* Services List */}
                  <div className="grid grid-cols-1 gap-2">
                    {servicesLoading ? (
                      Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)
                    ) : subServices?.length > 0 ? (
                      subServices.map((service: any) => (
                        <div key={service.id} className="p-4 bg-white border border-zinc-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600/30 group-hover:bg-blue-600 transition-colors" />
                            <span className="text-sm font-bold text-zinc-700">{service.name}</span>
                          </div>
                          <div className="flex items-center gap-6">
                            <span className="text-sm font-black text-zinc-900">₦{Number(service.price || 0).toLocaleString()}</span>
                            <button 
                              onClick={() => handleDeleteService(service.id)}
                              className="p-1.5 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <HiOutlineTrash size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/10">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No Services Added</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50/30 p-8 text-center">
               <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center text-blue-700 mb-6">
                  <HiOutlineUserGroup size={40} />
               </div>
               <h2 className="text-2xl font-bold text-zinc-800">Select a Category</h2>
               <p className="text-zinc-500 max-w-sm mt-2">
                 Choose a category from the left to manage its specific services and descriptions.
               </p>
            </div>
          )}
        </div>
      </div>

      {/* Category Edit Modal (Simple version) */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-zinc-800">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setIsCatModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <HiOutlineX size={24} />
              </button>
            </div>
            <form onSubmit={handleCatSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-zinc-700 font-semibold">Category Name</Label>
                <Input 
                  placeholder="e.g. Electrical"
                  value={formData.name} 
                  onChange={e => setFormData(p => ({...p, name: e.target.value}))} 
                  required 
                  className="h-12 border-zinc-200 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-700 font-semibold">Description</Label>
                <textarea 
                  placeholder="Describe this category..."
                  className="w-full h-32 p-4 rounded-xl border border-zinc-200 text-sm outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-all resize-none"
                  value={formData.description}
                  onChange={e => setFormData(p => ({...p, description: e.target.value}))}
                />
              </div>
              <Button 
                type="submit" 
                isLoading={createCategory.isPending || updateCategory.isPending} 
                className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold"
              >
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
