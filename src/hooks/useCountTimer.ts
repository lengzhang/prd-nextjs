import { useEffect, useReducer, useRef } from "react";

interface State {
  count: number;
  from: number;
  to: number;
  diff: number;
  delay: number;
}

type Action = { type: "update-count" } | { type: "set-count"; value: number };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set-count":
      return { ...state, count: action.value };
    default:
      if (state.count === state.to) return state;
      return { ...state, count: state.count + state.diff };
  }
};

const useCountTimer = (initialState: Omit<State, "count">) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    count: initialState.to,
  });
  const timerId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timerId.current) clearInterval(timerId.current);
    };
  }, []);

  useEffect(() => {
    if (timerId.current && state.count === state.to) {
      clearInterval(timerId.current);
    }
  }, [state.count, state.to]);

  const triggerTimer = () => {
    if (state.count === state.to) {
      dispatch({ type: "set-count", value: state.from });
      timerId.current = setInterval(() => {
        dispatch({ type: "update-count" });
      }, state.delay);
    }
  };

  return { count: state.count, triggerTimer };
};

export default useCountTimer;
