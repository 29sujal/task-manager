import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getTasks, createTask, updateTask, toggleTask, deleteTask } from '../utils/api'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getTasks({
        search: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
        page,
        limit: 6,
      })
      setTasks(data.tasks)
      setTotalPages(data.totalPages)

      // Fetch stats (all tasks, no filter)
      const all = await getTasks({ limit: 1000 })
      const allTasks = all.data.tasks
      setStats({
        total: all.data.totalTasks,
        completed: allTasks.filter(t => t.status === 'completed').length,
        pending: allTasks.filter(t => t.status === 'pending').length,
      })
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, statusFilter, priorityFilter, page])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  // Reset page on filter change
  useEffect(() => { setPage(1) }, [debouncedSearch, statusFilter, priorityFilter])

  const handleLogout = () => { logout(); navigate('/login') }

  const handleSave = async (formData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData)
        toast.success('Task updated!')
      } else {
        await createTask(formData)
        toast.success('Task created!')
      }
      setShowModal(false)
      setEditingTask(null)
      fetchTasks()
    } catch {
      toast.error('Failed to save task')
    }
  }

  const handleToggle = async (id) => {
    try {
      await toggleTask(id)
      fetchTasks()
    } catch {
      toast.error('Failed to update task')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await deleteTask(id)
      toast.success('Task deleted')
      fetchTasks()
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const handleEdit = (task) => { setEditingTask(task); setShowModal(true) }
  const handleAdd  = ()     => { setEditingTask(null);  setShowModal(true) }
  const handleClose = ()    => { setShowModal(false); setEditingTask(null) }

  return (
    <div className="min-h-screen bg-[#1e1e2e]">
      {/* Navbar */}
      <nav className="bg-[#181825] border-b border-[#313244] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#89b4fa] to-[#cba6f7] flex items-center justify-center text-[#11111b] font-bold text-sm">
              ✓
            </div>
            <span className="text-lg font-extrabold text-[#cdd6f4] tracking-tight">TaskFlow</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-[#a6adc8] hidden sm:block">
              Hey, <span className="text-[#89b4fa] font-semibold">{user?.name}</span> 👋
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#313244] border border-[#45475a] rounded-lg text-[#a6adc8] text-xs font-semibold hover:bg-[#f38ba8] hover:border-[#f38ba8] hover:text-[#11111b] transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Tasks',    value: stats.total,     icon: '📋', color: 'from-[#89b4fa]/10 to-[#89b4fa]/5',  border: 'border-[#89b4fa]/20' },
            { label: 'Pending',        value: stats.pending,   icon: '⏳', color: 'from-[#f9e2af]/10 to-[#f9e2af]/5',  border: 'border-[#f9e2af]/20' },
            { label: 'Completed',      value: stats.completed, icon: '✅', color: 'from-[#a6e3a1]/10 to-[#a6e3a1]/5',  border: 'border-[#a6e3a1]/20' },
          ].map((s) => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} border ${s.border} rounded-2xl p-5 flex items-center gap-4 animate-slide-up`}>
              <span className="text-3xl">{s.icon}</span>
              <div>
                <p className="text-xs font-semibold text-[#a6adc8] uppercase tracking-wider">{s.label}</p>
                <p className="text-3xl font-extrabold text-[#cdd6f4] leading-none mt-1">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6c7086] text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#181825] border border-[#313244] rounded-xl text-[#cdd6f4] placeholder-[#6c7086] text-sm outline-none focus:border-[#89b4fa] transition-all"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-[#181825] border border-[#313244] rounded-xl text-[#cdd6f4] text-sm outline-none focus:border-[#89b4fa] transition-all cursor-pointer min-w-[130px]"
          >
            <option value="all">All Status</option>
            <option value="pending">⏳ Pending</option>
            <option value="completed">✅ Completed</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2.5 bg-[#181825] border border-[#313244] rounded-xl text-[#cdd6f4] text-sm outline-none focus:border-[#89b4fa] transition-all cursor-pointer min-w-[130px]"
          >
            <option value="all">All Priority</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>

          {/* Add button */}
          <button
            onClick={handleAdd}
            className="px-5 py-2.5 bg-gradient-to-r from-[#89b4fa] to-[#cba6f7] text-[#11111b] font-bold rounded-xl text-sm hover:opacity-90 active:scale-[0.97] transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-base leading-none">+</span> Add Task
          </button>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-[#a6adc8]">
            <div className="w-5 h-5 border-2 border-[#45475a] border-t-[#89b4fa] rounded-full animate-spin-fast" />
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-lg font-bold text-[#cdd6f4] mb-2">No tasks found</p>
            <p className="text-sm text-[#a6adc8]">
              {search || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Click "+ Add Task" to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="w-9 h-9 rounded-lg border border-[#313244] bg-[#181825] text-[#a6adc8] text-sm font-semibold hover:border-[#89b4fa] hover:text-[#89b4fa] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg border text-sm font-semibold transition-all flex items-center justify-center ${
                  page === p
                    ? 'bg-[#89b4fa] border-[#89b4fa] text-[#11111b]'
                    : 'border-[#313244] bg-[#181825] text-[#a6adc8] hover:border-[#89b4fa] hover:text-[#89b4fa]'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-lg border border-[#313244] bg-[#181825] text-[#a6adc8] text-sm font-semibold hover:border-[#89b4fa] hover:text-[#89b4fa] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <TaskModal task={editingTask} onClose={handleClose} onSave={handleSave} />
      )}
    </div>
  )
}
