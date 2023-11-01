import { ChangeEventHandler, useReducer } from "react";
import { getFileKey } from "./utils";

interface State {
  files: Record<string, File>;
}

type Action =
  | { type: "add-files"; files: FileList }
  | { type: "remove-file"; key: string };

const initialState: State = {
  files: {},
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "add-files":
      for (let i = 0; i < action.files.length; i++) {
        const file = action.files.item(i);
        if (!file) continue;
        const key = getFileKey(file);
        if (!!state.files[key]) continue;
        state.files[key] = file;
      }
      return { ...state, files: { ...state.files } };
    case "remove-file":
      if (!state.files[action.key]) return state;
      delete state.files[action.key];
      return { ...state, files: { ...state.files } };
    default:
      return state;
  }
};

const useUploadReports = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onSelectReports: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files;
    if (!files || files.length <= 0) return;
    dispatch({ type: "add-files", files });
  };

  const onRemoveFile = (key: string) => () => {
    if (!state.files[key]) return;
    dispatch({ type: "remove-file", key });
  };

  return { state, onSelectReports, onRemoveFile };
};

export default useUploadReports;
