import { useEffect, useState } from "react";
import { getTodos, type Todo } from "./test";
import "./App.css";

type ToggleTodo = Omit<Todo, "title">;

const App = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  useEffect(() => {
    getTodos().then((data) => setTodoList(data.data));
  }, []);

  const [title, setTitle] = useState("");
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleAddTodo = async () => {
    if (title === "") {
      return;
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };

    await fetch(`http://localhost:4000/todos`, {
      method: "POST",
      body: JSON.stringify(newTodo), //newTodo를 JSON화
    });

    setTodoList((prev) => [...prev, newTodo]);
    setTitle("");
  };

  // 인자로 특정타입에대한 계산이 필요할때 id:String 보다는 id:Todo["id"]으로 접근하기
  // Todo[]안에 속성타입이 변경되어도 일일이 인자 타입을 변경 안해줘도 됨
  const handleDeleteTodo = (id: Todo["id"]) => {
    fetch(`http://localhost:4000/todos/${id}`, {
      method: "DELETE",
    });
    //지운 데이터로 업데이트 화면에 보이는 Todo 목록이 변경
    //prev는 현재 Todo 리스트의 이전 상태
    setTodoList((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleToggleTodo = ({ id, completed }: ToggleTodo) => {
    fetch(`http://localhost:4000/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        completed: !completed,
      }),
    });

    setTodoList((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !completed,
          };
        }
        return todo;
      })
    );
  };

  return (
    <>
      <h1>Todo List</h1>
      <div>
        <input type="text" value={title} onChange={handleTitleChange} />
        <button onClick={handleAddTodo}>등록</button>
      </div>
      <TodoList
        todoList={todoList}
        onDeleteClick={handleDeleteTodo}
        onToggleClick={handleToggleTodo}
      />
    </>
  );
};

type TodoListPros = {
  todoList: Todo[];
  onDeleteClick: (id: Todo["id"]) => void;
  onToggleClick: (ToggleTodo: ToggleTodo) => void;
};
function TodoList({ todoList, onDeleteClick, onToggleClick }: TodoListPros) {
  return (
    <>
      {todoList.map((todo) => (
        <TodoItem
          key={todo.id}
          {...todo}
          onDeleteClick={onDeleteClick}
          onToggleClick={onToggleClick}
        />
      ))}
    </>
  );
}

type TodoItemProps = Todo & {
  onDeleteClick: (id: Todo["id"]) => void;
  onToggleClick: (ToggleTodo: ToggleTodo) => void;
};
function TodoItem({
  id,
  title,
  completed,
  onDeleteClick,
  onToggleClick,
}: TodoItemProps) {
  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ textDecoration: completed ? "line-through" : "none" }}>
          {title}
        </div>
        <button
          onClick={() =>
            onToggleClick({
              id,
              completed,
            })
          }
        >
          {completed ? "완료취소" : "완료하기"}
        </button>
        <button onClick={() => onDeleteClick(id)}>삭제</button>
      </div>
    </>
  );
}
export default App;
