export interface IUserProfiless {
  id: number;
  role: string;
}

export interface IControlArray<T> {
  state: T[];
  get(index: number): T | undefined;
  getId(id: number): T | undefined;
  getType(type: number): T | undefined;
}

export interface IGeneric {
  id?: number;
  type?: number;
}

export const useArrayControl = <T extends IGeneric>(
  initialState: T[] = [],
): IControlArray<T> => {
  const state: T[] = initialState;

  const get = (index: number): T | undefined => {
    if (index >= 0 && index < state.length) {
      return state[index];
    }
    return undefined;
  };

  const getId = (id: number): T | undefined => {
    if (id >= 0 && state.length > 0) {
      return state.find(item => item.id === id);
    }
  };

  const getType = (type: number): T | undefined => {
    if (type >= 0 && state.length > 0) {
      return state.find(item => item.type === type);
    }
  };

  return { state, get, getId, getType };
};
