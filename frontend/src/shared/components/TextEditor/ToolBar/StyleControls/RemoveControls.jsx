import { EditorState, Modifier, RichUtils, SelectionState } from "draft-js";

//Remove prev style
export const removePrevStyle = (editorState, targets, createTargetStyleFn) => {
  let newEditorState;
  const selection = editorState.getSelection();
  if (selection.isCollapsed()) {
    //If No Select anything than only modify the InlineStyleOverride
    newEditorState = EditorState.setInlineStyleOverride(editorState, null);
  } else {
    //Remove all the FontSize in the setting
    let contentState = editorState.getCurrentContent();
    targets.forEach((target) => {
      contentState = Modifier.removeInlineStyle(
        contentState,
        editorState.getSelection(),
        createTargetStyleFn(target)
      );
    });
    newEditorState = EditorState.push(
      editorState,
      contentState,
      "change-inline-style"
    );
  }
  return newEditorState;
};

//Remove Specific InlineStyle
export const removeTargetInlineStyles = (editorState, targets) => {
  let contentState = editorState.getCurrentContent();
  targets.forEach((target) => {
    contentState = Modifier.removeInlineStyle(
      contentState,
      editorState.getSelection(),
      target
    );
  });

  return EditorState.push(editorState, contentState, "change-inline-style");
};

//Remove All InlineStyle
export const removeAllInlineStyles = (toolbar, editorState) => {
  const selection = editorState.getSelection();
  let contentState = editorState.getCurrentContent();

  if (selection.isCollapsed()) {
    const nweEditorState = EditorState.setInlineStyleOverride(
      editorState,
      null
    );
    return nweEditorState;
  } else {
    toolbar.options.forEach((lines) => {
      lines.forEach((option) => {
        const feature = toolbar.features[option];
        if (feature?.type === "inline") {
          feature.options.forEach((option) => {
            contentState = Modifier.removeInlineStyle(
              contentState,
              editorState.getSelection(),
              feature.choices[option].style
            );
          });
        }
      });
    });
    return EditorState.push(editorState, contentState, "change-inline-style");
  }
};

//Remove Entity
export const removeEntities = (editorState) => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const contentWithoutEntities = Modifier.applyEntity(
    contentState,
    selection,
    null
  );

  const newEditorState = EditorState.push(
    editorState,
    contentWithoutEntities,
    "apply-entity"
  );

  return newEditorState;
};

//Remove All Style
export const removeAllStyles = (toolbar, editorState) => {
  //Remove Inline
  const contentState = editorState.getCurrentContent();
  let contentWithoutStyles = contentState;
  toolbar.options.forEach((option) => {
    const feature = toolbar.features[option];
    if (feature.type === "inline") {
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

function RemoveStyleControls(props) {
  const { toolbar, editorState, onChange } = props;

  const removeTargetsInlineStylesHandler = (targets) => {
    onChange(removeTargetInlineStyles(editorState, targets));
  };

  //Remove InlineStyle
  const removeAllInlineStylesHandler = () => {
    onChange(removeAllInlineStyles(toolbar, editorState));
  };

  //Remove Entities
  const removeEntityHandler = () => {
    onChange(removeEntities(editorState));
  };

  //Remove BlockType
  const removeBlockTypeHandler = () => {
    onChange(RichUtils.toggleBlockType(editorState, "unstyled"));
  };

  //Remove All
  const removeAllStylesHandler = () => {
    onChange(removeAllStyles(toolbar, editorState));
  };

  return {
    removeTargetsInlineStylesHandler,
    removeAllInlineStylesHandler,
    removeEntityHandler,
    removeBlockTypeHandler,
    removeAllStylesHandler,
  };
}

export default RemoveStyleControls;
//reference:https://medium.com/hackernoon/draft-js-how-to-remove-formatting-of-the-text-cd191866d9ad
