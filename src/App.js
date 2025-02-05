import React, { useRef, useState } from "react";

const App = () => {
  const inputRef = useRef(null);
  const [todos, setTodos] = useState([]);
  const [count, setCount] = useState(1);

  const add = () => {
    setTodos([
      ...todos,
      { id: count, text: inputRef.current.value, display: "" },
    ]);
    setCount(count + 1);
    inputRef.current.value = "";
  };
  const deleteTodo = (id) => {
    setTodos(todos.filter((item) => item.id != id));
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={add}>ADD</button>
      <div>
        {todos.map((item, index) => {
          return (
            <li key={index} className="list-none">
              {item.id} {item.text}{" "}
              <button onClick={() => deleteTodo(item.id)}>⛌</button>
            </li>
          );
        })}
      </div>
    </div>
  );
};

export default App;
