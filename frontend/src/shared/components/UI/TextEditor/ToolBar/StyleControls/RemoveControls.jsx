import { RichUtils, SelectionState } from "draft-js";
import { EditorState, Modifier } from "draft-js";

const RemoveAllStyleControls = (props) => {
  const { toolbar, editorState, onChange } = props;

  //Remove InlineStyle
  const removeAllInlineStyles = (editorState) => {
    let contentState = editorState.getCurrentContent();
    toolbar.options.forEach((option) => {
      const feature = toolbar.features[option];
      if (feature.type === "inline") {
        feature.options.forEach((option) => {
          contentState = Modifier.removeInlineStyle(
            contentState,
            editorState.getSelection(),
            feature.choices[option].style
          );
        });
      }
    });
    return EditorState.push(editorState, contentState, "change-inline-style");
  };

  const removeInlineStylesHandler = () => {
    onChange(removeAllInlineStyles(editorState));
  };

  //Remove BlockType
  const removeBlockTypeHandler = () => {
    onChange(RichUtils.toggleBlockType(editorState, "unstyled"));
  };

  //Reove All Style
  const removeAllStyles = (editorState) => {
    //Remove Inline
    const contentState = editorState.getCurrentContent();
    let contentWithoutStyles = contentState;
    toolbar.options.forEach((option) => {
      const feature = toolbar.features[option];
      if (feature.type === "inline") {
        console.log("clean inline");
        feature.options.forEach((option) => {
          contentWithoutStyles = Modifier.removeInlineStyle(
            contentWithoutStyles,
            editorState.getSelection(),
            feature.choices[option].style
          );
        });
      }
    });

    const newEditorState = EditorState.push(
      editorState,
      contentWithoutStyles,
      "change-inline-style"
    );

    //Remove BlockType
    const selection = newEditorState.getSelection();

    const block = newEditorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    console.log(JSON.stringify(selection), block.getKey());
    if (block.getType() !== "unstyled") {
      //Select text range
      const selectionState = SelectionState.createEmpty(block.getKey());
      const updatedSelection = selectionState.merge({
        focusOffset: 0,
        anchorOffset: block.getText().length,
      });

      //Set Block
      const contentWithoutBlocks = Modifier.setBlockType(
        contentWithoutStyles,
        updatedSelection,
        "unstyled"
      );
      const newEditorState2 = EditorState.push(
        newEditorState,
        contentWithoutBlocks,
        "change-block-type"
      );
     return newEditorState2;
    }

    return newEditorState;
  };

  const removeAllStylesHandler = () => {
    onChange(removeAllStyles(editorState));
  };

  return {
    removeBlockTypeHandler,
    removeInlineStylesHandler,
    removeAllStylesHandler,
  };
};

export default RemoveAllStyleControls;
//reference:https://medium.com/hackernoon/draft-js-how-to-remove-formatting-of-the-text-cd191866d9ad
