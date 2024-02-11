import { useState } from "react";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="mx-auto max-w-2xl py-6 flex flex-col gap-4 items-center">
      <h1 className="text-3xl">Simple React + Vite SPA</h1>
      <p>Click the bellow button the increment the count</p>
      <button
        type="button"
        className="text-white font-medium px-4 py-2 bg-gray-800 border-none rounded-md flex-grow-0"
        onClick={() => setCount((count) => count + 1)}
      >
        count is {count}
      </button>
    </div>
  );
}
