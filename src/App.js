import React, { useRef, useState } from "react";

const App = () => {
  const inputRef = useRef(null);
  const [todos, setTodos] = useState([]);
  const [count, setCount] = useState(1);

  const add = () => {
    if (inputRef.current.value.trim() === "") return;
    setTodos([...todos, { text: inputRef.current.value, id: count }]);
    inputRef.current.value = "";
    setCount(count + 1);
  };

  const deleteTodos = (id) => {
    setTodos(todos.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex gap-2 mb-4">
        <input
          ref={inputRef}
          className="border border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a task..."
        />
        <button
          onClick={add}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          ADD
        </button>
      </div>
      <div className="w-full max-w-md">
        {todos.map((item, index) => (
          <ul key={item.id} className="bg-white shadow-md rounded-lg p-2 mb-2">
            <li className="flex justify-between items-center p-2 border-b last:border-none">
              <span className="text-gray-700">
                {index + 1}: {item.text}
              </span>
              <button
                onClick={() => deleteTodos(item.id)}
                className="text-red-500 hover:text-red-700 text-xl font-bold"
              >
                ╳
              </button>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default App;
