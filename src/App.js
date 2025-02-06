import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Trash2,
  Edit2,
  Save,
  Square,
  CheckSquare,
  Clock as ClockIcon,
  Flag,
  Timer,
  Flame,
  BarChart2,
  Calendar,
  Tag,
  AlarmClock,
  Bell,
  ShoppingCart,
  Briefcase,
  Heart,
  User,
  Settings,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Layers,
} from "lucide-react";

// Utility functions
const loadFromStorage = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const formatTimeLeft = (date) => {
  const diff = new Date(date).getTime() - new Date().getTime();
  if (diff <= 0) return "Overdue";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Custom hooks
const useClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return time;
};

const useTodos = () => {
  const [todos, setTodos] = useState(() => loadFromStorage("todos", []));
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef();

  useEffect(() => {
    saveToStorage("todos", todos);
  }, [todos]);

  const addTodo = (title, category, priority, dueDate, timerDuration) => {
    const newTodo = {
      id: Date.now(),
      title,
      isEdit: false,
      editedTitle: title,
      completed: false,
      priority,
      category,
      dueDate,
      timerDuration,
      streak: 0,
      pomodoroCount: 0,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const editTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, isEdit: true } : todo))
    );
  };

  const updateTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, title: todo.editedTitle, isEdit: false }
          : todo
      )
    );
  };

  const changeEditedTitle = (id, newTitle) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, editedTitle: newTitle } : todo
      )
    );
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const newCompleted = !todo.completed;
          if (newCompleted) {
            const audio = new Audio(
              "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
            );
            audio.play();
          }
          return {
            ...todo,
            completed: newCompleted,
            streak: newCompleted ? todo.streak + 1 : todo.streak,
          };
        }
        return todo;
      })
    );
  };

  const startTimer = (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo || !todo.timerDuration) return;

    if (activeTimer === id) {
      clearInterval(timerRef.current);
      setActiveTimer(null);
      return;
    }

    setActiveTimer(id);
    const duration = parseInt(todo.timerDuration, 10) * 60;
    setTimeLeft(duration);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerRef.current);
          setActiveTimer(null);
          const audio = new Audio(
            "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
          );
          audio.play();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getStatistics = () => {
    return {
      completed: todos.filter((t) => t.completed).length,
      pending: todos.filter((t) => !t.completed).length,
      streaks: Math.max(...todos.map((t) => t.streak), 0),
      pomodoros: todos.reduce((acc, t) => acc + t.pomodoroCount, 0),
    };
  };

  return {
    todos,
    addTodo,
    deleteTodo,
    editTodo,
    updateTodo,
    toggleTodo,
    changeEditedTitle,
    startTimer,
    activeTimer,
    timeLeft,
    getStatistics,
  };
};

const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);
  return { isOpen, toggleSidebar };
};

// Components
const Clock = () => {
  const time = useClock();

  return (
    <motion.div
      className="flex items-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AlarmClock className="mr-2" size={18} />
      <span className="font-mono">
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })}
      </span>
    </motion.div>
  );
};

const Header = ({ toggleSidebar, stats }) => (
  <motion.header
    className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg"
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ type: "spring", stiffness: 100 }}
  >
    <div className="flex items-center justify-between max-w-6xl mx-auto">
      <div className="flex items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="mr-4 hover:bg-blue-700 p-2 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </motion.button>
        <h1 className="text-2xl font-bold flex items-center">
          <Layers className="mr-2" /> Productive Todo
        </h1>
      </div>
      <Clock />
      <div className="flex gap-4 text-sm">
        <motion.div whileHover={{ scale: 1.1 }} className="flex items-center">
          <CheckSquare className="mr-1" size={16} />
          <span>{stats.completed}</span>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} className="flex items-center">
          <Flame className="mr-1" size={16} />
          <span>{stats.streaks}</span>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} className="flex items-center">
          <Timer className="mr-1" size={16} />
          <span>{stats.pomodoros}</span>
        </motion.div>
      </div>
    </div>
  </motion.header>
);

const Sidebar = ({ isOpen, toggleSidebar, todos }) => (
  <motion.div
    className="fixed top-0 left-0 h-full w-80 bg-gray-800 text-white p-6 z-50"
    initial={{ x: "-100%" }}
    animate={{ x: isOpen ? 0 : "-100%" }}
    transition={{ type: "spring", stiffness: 100 }}
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold">Task Overview</h2>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
        className="hover:bg-gray-700 p-2 rounded-lg transition-colors"
      >
        <X size={24} />
      </motion.button>
    </div>
    <div className="space-y-6">
      <div>
        <h3 className="text-gray-400 text-sm font-medium mb-2">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-purple-500" size={16} />
            <span>Shopping</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="text-blue-500" size={16} />
            <span>Work</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="text-red-500" size={16} />
            <span>Health</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="text-green-500" size={16} />
            <span>Personal</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-gray-400 text-sm font-medium mb-2">
          Priority Levels
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ArrowDown className="text-green-500" size={16} />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="text-yellow-500" size={16} />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUp className="text-red-500" size={16} />
            <span>Hard</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const TodoList = ({
  todos,
  addTodo,
  deleteTodo,
  editTodo,
  updateTodo,
  toggleTodo,
  changeEditedTitle,
  startTimer,
  activeTimer,
  timeLeft,
}) => {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("personal");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [timerDuration, setTimerDuration] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      const fullDueDate =
        dueDate && dueTime
          ? new Date(`${dueDate}T${dueTime}`).toISOString()
          : "";
      addTodo(input.trim(), category, priority, fullDueDate, timerDuration);
      setInput("");
      setDueDate("");
      setDueTime("");
      setTimerDuration("");
    }
  };

  const priorityIcons = {
    low: <ArrowDown className="text-green-500" size={16} />,
    medium: <ArrowRight className="text-yellow-500" size={16} />,
    high: <ArrowUp className="text-red-500" size={16} />,
  };

  const categoryIcons = {
    shopping: <ShoppingCart className="text-purple-500" size={16} />,
    work: <Briefcase className="text-blue-500" size={16} />,
    health: <Heart className="text-red-500" size={16} />,
    personal: <User className="text-green-500" size={16} />,
  };

  const priorityColors = {
    low: "bg-gray-100",
    medium: "bg-yellow-100",
    high: "bg-red-100",
  };

  const sortedTodos = [...todos].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <motion.div
        className="bg-white p-4 rounded-lg shadow-md mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring" }}
      >
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border rounded"
            placeholder="Add a new todo"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="personal">👤 Personal</option>
            <option value="work">💼 Work</option>
            <option value="shopping">🛒 Shopping</option>
            <option value="health">❤️ Health</option>
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="low">🔵 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
        <div className="flex gap-4 mb-4">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            value={timerDuration}
            onChange={(e) => setTimerDuration(e.target.value)}
            placeholder="Timer (minutes)"
            className="p-2 border rounded w-40"
            min="1"
            max="180"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors w-full"
        >
          Add Task
        </motion.button>
      </motion.div>
      <AnimatePresence>
        {sortedTodos.map((todo) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex items-center gap-3 p-4 rounded-lg shadow-sm transition-all ${
              priorityColors[todo.priority]
            } ${todo.completed ? "opacity-75" : ""} mb-2`}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleTodo(todo.id)}
              className="shrink-0"
            >
              {todo.completed ? (
                <CheckSquare className="text-green-500" size={20} />
              ) : (
                <Square className="text-gray-400" size={20} />
              )}
            </motion.button>
            <div className="flex-grow">
              {todo.isEdit ? (
                <input
                  type="text"
                  value={todo.editedTitle}
                  onChange={(e) => changeEditedTitle(todo.id, e.target.value)}
                  className="w-full p-1 rounded border"
                />
              ) : (
                <div className="space-y-1">
                  <div
                    className={
                      todo.completed ? "line-through text-gray-500" : ""
                    }
                  >
                    {todo.title}
                  </div>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      {categoryIcons[todo.category]}
                      {todo.category}
                    </span>
                    <span className="flex items-center gap-1">
                      {priorityIcons[todo.priority]}
                      {todo.priority}
                    </span>
                    {todo.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          Due: {new Date(todo.dueDate).toLocaleDateString()}{" "}
                          {formatTime(todo.dueDate)}
                        </span>
                        <span>({formatTimeLeft(todo.dueDate)})</span>
                      </span>
                    )}
                    {todo.streak > 0 && (
                      <span className="flex items-center gap-1">
                        <Flame size={14} className="text-orange-500" />
                        {todo.streak}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {todo.timerDuration && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => startTimer(todo.id)}
                  className={`p-2 rounded transition-colors flex items-center gap-1 ${
                    activeTimer === todo.id
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-500 hover:text-blue-500"
                  }`}
                >
                  <Timer size={18} />
                  {activeTimer === todo.id
                    ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
                        .toString()
                        .padStart(2, "0")}`
                    : `${todo.timerDuration}m`}
                </motion.button>
              )}
              {todo.isEdit ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateTodo(todo.id)}
                  className="text-blue-500 hover:text-blue-600 p-2 rounded transition-colors"
                >
                  <Save size={18} />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => editTodo(todo.id)}
                  className="text-yellow-500 hover:text-yellow-600 p-2 rounded transition-colors"
                >
                  <Edit2 size={18} />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-600 p-2 rounded transition-colors"
              >
                <Trash2 size={18} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

function App() {
  const {
    todos,
    addTodo,
    deleteTodo,
    editTodo,
    updateTodo,
    toggleTodo,
    changeEditedTitle,
    startTimer,
    activeTimer,
    timeLeft,
    getStatistics,
  } = useTodos();
  const { isOpen, toggleSidebar } = useSidebar();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        document.querySelector("input")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} stats={getStatistics()} />
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} todos={todos} />
      <main className="p-4 pt-8">
        <TodoList
          todos={todos}
          addTodo={addTodo}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
          updateTodo={updateTodo}
          toggleTodo={toggleTodo}
          changeEditedTitle={changeEditedTitle}
          startTimer={startTimer}
          activeTimer={activeTimer}
          timeLeft={timeLeft}
        />
      </main>
    </div>
  );
}

export default App;
