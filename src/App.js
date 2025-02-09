import React, { useRef, useState } from "react";

const App = () => {
  const input = useRef(null);
  const [todos, setTodos] = useState([]);
  const [count, setCount] = useState(1);
  const add = () => {
    setTodos([...todos, { text: input.current.value, id: count }]);
    input.current.value = "";
    setCount(count + 1);
  };
  const deleteTodos = (id) => {
    setTodos(todos.filter((item) => item.id != id));
  };
  return (
    <div>
      <input ref={input} className="border border-black" />
      <button onClick={add}>ADD</button>
      <div>
        {todos.map((item, index) => {
          return (
            <li className="list-none" key={index}>
              {index + 1}:{item.text}{" "}
              <button onClick={() => deleteTodos(item.id)}>❌</button>{" "}
            </li>
          );
        })}
      </div>
    </div>
  );
};

export default App;
