const priorityConfig = {
  high:   { label: '🔴 High',   classes: 'bg-[#f38ba8]/10 text-[#f38ba8]' },
  medium: { label: '🟡 Medium', classes: 'bg-[#f9e2af]/10 text-[#f9e2af]' },
  low:    { label: '🟢 Low',    classes: 'bg-[#a6e3a1]/10 text-[#a6e3a1]' },
}

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const priority = priorityConfig[task.priority] || priorityConfig.medium
  const done = task.status === 'completed'

  return (
    <div className={`bg-[#181825] border rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#45475a] group animate-slide-up ${done ? 'opacity-60 border-[#313244]' : 'border-[#313244]'}`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task._id)}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            done
              ? 'bg-[#a6e3a1] border-[#a6e3a1] text-[#11111b]'
              : 'border-[#45475a] hover:border-[#a6e3a1]'
          }`}
        >
          {done && <span className="text-xs font-bold">✓</span>}
        </button>

        {/* Title */}
        <p className={`flex-1 text-sm font-semibold leading-snug ${done ? 'line-through text-[#585b70]' : 'text-[#cdd6f4]'}`}>
          {task.title}
        </p>

        {/* Action buttons (visible on hover) */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="w-7 h-7 rounded-lg bg-[#313244] text-[#a6adc8] hover:bg-[#89b4fa] hover:text-[#11111b] transition-all flex items-center justify-center text-xs"
            title="Edit"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="w-7 h-7 rounded-lg bg-[#313244] text-[#a6adc8] hover:bg-[#f38ba8] hover:text-[#11111b] transition-all flex items-center justify-center text-xs"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-[#585b70] mb-4 leading-relaxed line-clamp-2 ml-8">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between ml-8">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${priority.classes}`}>
          {priority.label}
        </span>
        <span className="text-[10px] text-[#6c7086] font-mono">
          {formatDate(task.createdAt)}
        </span>
      </div>
    </div>
  )
}
