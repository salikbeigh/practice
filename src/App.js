import React, { useRef, useState } from "react";

const App = () => {
  const inputRef = useRef(null);
  const [todos, setTodos] = useState([]);
  const [count, setCount] = useState(1);

  const add = () => {
    setTodos([...todos, { text: inputRef.current.value, id: count }]);
    inputRef.current.value = "";
    setCount(count + 1);
  };
  const deleteTodo = (id) => {
    setTodos(todos.filter((item) => item.id != id));
  };

  return (
    <div>
      <input
        ref={inputRef}
        placeholder="enter your todos"
        className="border border-black"
      />
      <button onClick={add}>ADD</button>
      <div>
        {todos.map((item, index) => {
          return (
            <li className="list-none" key={index + 1}>
              {index + 1} {item.text}
              <button onClick={() => deleteTodo(item.id)}>╳</button>
            </li>
          );
        })}
      </div>
    </div>
  );
};

export default App;
