import { useState, useEffect } from 'react'
import type { Task } from './types/task'
import { taskService } from './services/taskService'
import './App.css'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [platform, setPlatform] = useState('')

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const loadedTasks = taskService.getAllTasks()
    setTasks(loadedTasks)
  }, [])

  // Handle form submission to add a new task
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !subject || !dueDate || !platform) {
      alert('Please fill in all fields')
      return
    }

    const newTask = taskService.addTask({
      title,
      subject,
      dueDate,
      platform,
    })

    setTasks([...tasks, newTask])
    setTitle('')
    setSubject('')
    setDueDate('')
    setPlatform('')
  }

  // Toggle task status between pending and completed
  const toggleTaskStatus = (id: string) => {
    const updatedTask = taskService.updateTaskStatus(
      id,
      tasks.find((t) => t.id === id)?.status === 'pending' ? 'completed' : 'pending'
    )

    if (updatedTask) {
      setTasks(tasks.map(task => task.id === id ? updatedTask : task))
    }
  }

  // Delete a task
  const handleDeleteTask = (id: string) => {
    if (taskService.deleteTask(id)) {
      setTasks(tasks.filter(task => task.id !== id))
    }
  }

  // Sort tasks by due date (closest first)
  const sortedTasks = [...tasks].sort((a, b) =>
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )

  // Calculate stats
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const pendingTasks = totalTasks - completedTasks

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            TasKemal
          </h1>
          <p className="text-gray-600">Task Manager</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{totalTasks}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{pendingTasks}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Task subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
                Platform/Source
              </label>
              <input
                type="text"
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="Platform or source"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tasks ({sortedTasks.length})
          </h2>
          {sortedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No tasks yet. Add a task above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-lg transition-all ${
                    task.status === 'completed'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{task.subject}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        <span>📍 {task.platform}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`px-3 py-1 text-sm font-medium rounded-lg transition ${
                          task.status === 'completed'
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {task.status === 'pending' ? '✓ Complete' : '↺ Reopen'}
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="px-3 py-1 text-sm font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Built with React + Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}

export default App
