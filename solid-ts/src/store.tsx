import { createContext, createEffect, JSX, useContext } from 'solid-js';
import { createStore, produce, unwrap } from 'solid-js/store';
import { z } from 'zod';

const LOCAL_STORAGE_KEY = 't-solid-ts--app-state';
const storageSchema = z
  .object({
    clickCount: z.number().default(0),
  })
  .default({});

type StoreData = z.infer<typeof storageSchema>;

type StoreAPI = ReturnType<typeof createAppStore>;

function createDefaultValue(): StoreAPI {
  return [
    { clickCount: 0 },
    {
      handleClick: async () => {
        return undefined;
      },
    },
  ];
}

function loadFromStorage(): StoreData {
  return storageSchema.parse(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? '{}')
  );
}

function persistToStorage(data: StoreData): void {
  return localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

type UpdateFunction = (state: StoreData) => void;
type ActionContext = { state: StoreData; update: (fn: UpdateFunction) => void };

function handleClick(store: ActionContext) {
  store.update((s) => {
    console.log('handled click');
    s.clickCount += 1;
  });
}

function createAppActions(store: ActionContext) {
  return {
    handleClick: handleClick.bind(null, store),
  };
}

function createAppStore() {
  const [state, setState] = createStore<StoreData>({
    ...loadFromStorage(),
  });

  // persist on change
  createEffect(() => {
    persistToStorage(unwrap(state));
  });

  // context passed to all actions
  const actionContext: ActionContext = {
    state,
    update(fn) {
      setState(produce((s) => fn(s)));
    },
  };

  return [state, createAppActions(actionContext)] as const;
}

const AppStoreContext = createContext(createDefaultValue());

type AppStoreProviderProps = {
  children?: JSX.Element;
};

export function AppStoreProvider(props: AppStoreProviderProps) {
  const value = createAppStore();
  return <AppStoreContext.Provider value={value} children={props.children} />;
}

export function useAppStore() {
  const value = useContext(AppStoreContext);
  return value;
}
