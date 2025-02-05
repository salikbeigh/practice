import React, { useRef, useState } from "react";

const App = () => {
  const [todos, setTodos] = useState([]);
  const inputRef = useRef(null);
  const [count, setCount] = useState(1);

  const add = () => {
    setTodos([...todos, { text: inputRef.current.value, id: count }]);
    inputRef.current.value = "";
    setCount(count + 1);
  };
  const deleteTodos = (id) => {
    setTodos(todos.filter((item) => item.id != id));
  };
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={add}>ADD</button>
      <div>
        {todos.map((item) => {
          return (
            <li className="list-none" key={item.id}>
              {item.id}:{item.text}{" "}
              <button onClick={() => deleteTodos(item.id)}>⤬</button>
            </li>
          );
        })}
      </div>
    </div>
  );
};

export default App;
