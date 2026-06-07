import { useState, useEffect } from 'react'

export default function TaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const isEdit = !!task

  useEffect(() => {
    if (task) setForm({ title: task.title, description: task.description || '', priority: task.priority || 'medium' })
  }, [task])

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (form.title.length > 100) e.title = 'Title too long (max 100 chars)'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)
    setLoading(true)
    await onSave(form)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-[#11111b]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#181825] border border-[#313244] rounded-2xl p-8 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-[#cdd6f4] tracking-tight">
            {isEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#313244] text-[#a6adc8] hover:bg-[#45475a] hover:text-[#cdd6f4] transition-all flex items-center justify-center text-lg font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#a6adc8] uppercase tracking-wider mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: '' }) }}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 bg-[#313244] border border-[#45475a] rounded-xl text-[#cdd6f4] placeholder-[#6c7086] text-sm outline-none focus:border-[#89b4fa] focus:ring-2 focus:ring-[#89b4fa]/10 transition-all"
            />
            {errors.title && <p className="text-xs text-[#f38ba8] mt-1.5">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#a6adc8] uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add details (optional)..."
              rows={3}
              className="w-full px-4 py-3 bg-[#313244] border border-[#45475a] rounded-xl text-[#cdd6f4] placeholder-[#6c7086] text-sm outline-none focus:border-[#89b4fa] focus:ring-2 focus:ring-[#89b4fa]/10 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#a6adc8] uppercase tracking-wider mb-2">
              Priority
            </label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full px-4 py-3 bg-[#313244] border border-[#45475a] rounded-xl text-[#cdd6f4] text-sm outline-none focus:border-[#89b4fa] transition-all cursor-pointer"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-[#313244] border border-[#45475a] rounded-xl text-[#a6adc8] text-sm font-semibold hover:bg-[#45475a] hover:text-[#cdd6f4] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-[#89b4fa] to-[#cba6f7] text-[#11111b] font-bold rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
