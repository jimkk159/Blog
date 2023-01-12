import { EditorState } from "draft-js";

const minDepth = 0;
const maxDepth = 4;
const IndentControls = (props) => {
  const { editorState, onChange } = props;
  const selection = editorState.getSelection();
  const block = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey());
  const text = block.getText();
  const blockType = block.getType();
  const isDisabled =
    blockType !== "unordered-list-item" && blockType !== "ordered-list-item";

  //Adjust
  const adjustDepth = (adjustment) => {
    const blockKey = block.getKey();
    const depth = block.getDepth();
    const newDepth = depth + adjustment;

    //Check if Empty length
    if (text.length === 0) {
      return;
    }

    //Check if unordered-list or ordered-list
    if (
      blockType !== "unordered-list-item" &&
      blockType !== "ordered-list-item"
    ) {
      return;
    }

    if (minDepth <= newDepth && newDepth <= maxDepth) {
      const newBlock = block.set("depth", newDepth);
      const contentState = editorState.getCurrentContent();
      const blockMap = contentState.getBlockMap();
      const newBlockMap = blockMap.set(blockKey, newBlock);
      if (newBlockMap) {
        onChange(
          EditorState.push(
            editorState,
            contentState.merge({ blockMap: newBlockMap }),
            "adjust-depth"
          )
        );
      }
    }
  };

  //Indent
  const indentHandler = () => {
    adjustDepth(1);
  };

  //Outdent
  const outdentHandler = () => {
    adjustDepth(-1);
  };

  return { isDisabled, indentHandler, outdentHandler };
};

export default IndentControls;
//reference:https://itnext.io/draft-js-lists-depth-control-800fb3a6714c
