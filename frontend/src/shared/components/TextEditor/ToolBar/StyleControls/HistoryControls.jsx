import { EditorState } from "draft-js";

const HistoryControls = (props) => {
  const { editorState, onChange } = props;

  //Undo
  const undoHandler = () => {
    onChange(EditorState.undo(editorState));
  };

  //Redo
  const redoHandler = () => {
    onChange(EditorState.redo(editorState));
  };

  return { undoHandler, redoHandler };
};

export default HistoryControls;
