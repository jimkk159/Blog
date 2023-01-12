import { RichUtils } from "draft-js";

const BlockStyleControls = (props) => {
  const { editorState, onChange } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  //Toggle Block Type
  const toggleBlockTypeHandler = (inputBlockType) => {
    if (inputBlockType !== blockType) {
      onChange(RichUtils.toggleBlockType(editorState, inputBlockType));
    }
  };

  return { activeStyle: blockType, toggleBlockTypeHandler };
};

export default BlockStyleControls;
