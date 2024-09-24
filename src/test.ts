export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export type Paginate<T> = {
  data: T[];
  first: number;
  item: number;
  last: number;
  next: number | null;
  pages: number;
  prev: number | null;
};

export async function getTodos() {
  // data를 불러올때 어떤 타입이 올지 모르니깐 명시적으로 지정해줘야한다.
  const res = await fetch(`http://localhost:4000/todos?_page=1&_per_page=25`);
  const data: Paginate<Todo> = await res.json();
  return data;
}
