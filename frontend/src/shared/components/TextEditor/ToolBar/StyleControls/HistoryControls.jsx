import { EditorState } from "draft-js";

const HistoryControls = (props) => {
  const { editorState, onChange } = props;

  //Undo
  const undoHandler = () => {
    onChange(EditorState.undo(editorState));
    console.log("undo");
  };

  //Redo
  const redoHandler = () => {
    onChange(EditorState.redo(editorState));
    console.log("redo");
  };

  return { undoHandler, redoHandler };
};

export default HistoryControls;
