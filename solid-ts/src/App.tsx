import { useAppStore } from './store';

export const App = () => {
  const [state, actions] = useAppStore();
  return (
    <>
      {/* grid */}
      <div class="flex justify-center text-center flex-col flex-1 h-screen">
        <button type="button" onClick={actions.handleClick}>
          <div class="text-2xl">Click Me: {state.clickCount}</div>
        </button>
      </div>
    </>
  );
};
