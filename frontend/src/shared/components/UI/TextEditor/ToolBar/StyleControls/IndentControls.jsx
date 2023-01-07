import { EditorState } from "draft-js";

const minDepth = 0;
const maxDepth = 4;
const IndentControls = (props) => {
  const { editorState, onChange } = props;

  //Adjust
  const adjustDepth = (adjustment) => {
    const selection = editorState.getSelection();
    const block = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey());

    //Check if Empty length
    const text = block.getText();
    if (text.length === 0) {
      return;
    }
    
    //Check if unordered-list or ordered-list
    const blockType = block.getType();
    if (
      blockType !== "unordered-list-item" &&
      blockType !== "ordered-list-item"
    ) {
      return;
    }

    const blockKey = block.getKey();
    const depth = block.getDepth();
    const newDepth = depth + adjustment;
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

  return { indentHandler, outdentHandler };
};

export default IndentControls;
//reference:https://itnext.io/draft-js-lists-depth-control-800fb3a6714c
