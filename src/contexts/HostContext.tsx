import {
  IActionCAPI,
  IHostContextProps,
  IHostState,
} from "@/interfaces/Interface";
import { getHost, getRooms } from "@/lib/data-service";
import { ReactNode, useContext, useReducer } from "react";
import { createContext } from "react";

const INIT_DATA: IHostState = {
  host: {
    full_name: "%NAME%",
    num_rooms: -1,
    premium: null,
    id: NaN,
    rooms: [],
    email: "",
  },
  isLoading: true,
};

const HostContext = createContext<IHostContextProps | undefined>(undefined);

function REDUCER(state: IHostState, action: IActionCAPI) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "host/data":
      const host = action.payload.host;
      const rooms = action.payload.rooms;
      host.num_rooms = rooms.length;
      host.rooms = rooms;
      return { ...state, host, isLoading: false };
    default:
      return state;
  }
}

function HostProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(REDUCER, INIT_DATA);

  async function getHostData(email: string) {
    dispatch({ type: "loading" });
    const host = await getHost({ email });
    const rooms = await getRooms({ id: host.id });
    host.email = email;
    dispatch({ type: "host/data", payload: { host, rooms } });
    return { host, rooms };
  }

  async function revalidate() {
    if (!state.host.email) return;
    await getHostData(state.host.email);
  }

  return (
    <HostContext.Provider
      value={{
        host: state.host,
        rooms: state.rooms,
        getHostData,
        revalidate,
        isLoading: state.isLoading,
      }}
    >
      {children}
    </HostContext.Provider>
  );
}

function useHostContext() {
  const context = useContext(HostContext);
  if (context === undefined)
    throw new Error("Context was used outside provider");
  return context;
}

export { HostProvider, useHostContext };
