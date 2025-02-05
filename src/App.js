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
  const deleteTodos = (id) => {
    setTodos(todos.filter((item) => item.id != id));
  };

  return (
    <div className="">
      <input className="border border-black" ref={inputRef} type="type" />
      <button onClick={add}>ADD</button>
      <div>
        {todos.map((item, index) => {
          return (
            <ul key={index + 1}>
              {" "}
              <li className="list-none">
                {index + 1} :{item.text}{" "}
                <button onClick={() => deleteTodos(item.id)}>╳</button>
              </li>
            </ul>
          );
        })}
      </div>
    </div>
  );
};

export default App;
