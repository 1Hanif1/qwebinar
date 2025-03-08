export interface IHost {
  full_name: string;
  num_rooms: number;
  premium: boolean | null;
  id: number;
}

export interface IHostState {
  isLoading: boolean;
  host: IHost | null;
}

export interface IHostContextProps {
  host: IHost | null;
  getHostData: (email: string) => Promise<void>;
  isLoading: boolean;
}

export interface IActionCAPI {
  type: string;
  payload?: IHost;
}
