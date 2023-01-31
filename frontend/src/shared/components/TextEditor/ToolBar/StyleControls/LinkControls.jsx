import { useDispatch } from "react-redux";
import { EditorState, SelectionState, Modifier } from "draft-js";

//Redux Slicer
import { toolbarActions } from "../../../../../store/toolbar-slice.js";

export const getSelectionBlock = (editorState) => {
  const selection = editorState.getSelection();
  return editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey());
};

export const getSelectionText = (editorState) => {
  const selection = editorState.getSelection();
  const block = getSelectionBlock(editorState);
  const focusOffset = selection.getFocusOffset();
  const anchorOffset = selection.getAnchorOffset();
  const text = block.getText();
  if (anchorOffset < focusOffset) return text.slice(anchorOffset, focusOffset);
  return text.slice(focusOffset, anchorOffset);
};

export const getSelectionLinkEntity = (editorState) => {
  let entityKey;
  //Setting Selection Range
  const selection = editorState.getSelection();
  let start = selection.getStartOffset();
  let end = selection.getEndOffset();

  if (start === end && start === 0) {
    end = 1;
  } else if (start === end) {
    start -= 1;
  }
  // const lastEntityKey = block.getEntityAt(end-1);
  const removeBlankEnd = end - 2;
  const block = getSelectionBlock(editorState);
  for (let i = removeBlankEnd; i >= start; i -= 1) {
    const currentEntityKey = block.getEntityAt(i);
    //No Entity break
    if (entityKey && !currentEntityKey) {
      break;
    }
    if (currentEntityKey) {
      entityKey = currentEntityKey;
    }
  }

  return entityKey;
};

export const getEntityRange = (editorState, entityKey) => {
  let entityRange;
  const block = getSelectionBlock(editorState);
  block.findEntityRanges(
    (value) => value.get("entity") === entityKey,
    (start, end) => {
      entityRange = {
        start,
        end,
        text: block.get("text").slice(start, end),
      };
    }
  );
  return entityRange;
};

const LinkControls = (props) => {
  const { editorState, onChange } = props;
  const dispatch = useDispatch();

  const forceSelection = () => {
    onChange(
      EditorState.forceSelection(editorState, editorState.getSelection())
    );
  };

  const addLinkHandler = (hyperLink) => {
    let link = hyperLink;
    if (!hyperLink) return;
    if (!hyperLink.startsWith("http://") && !hyperLink.startsWith("https://")) {
      link = `http://${hyperLink}`;
    }
    const selectionText = getSelectionText(editorState);
    const currentContent = editorState.getCurrentContent();
    currentContent.createEntity("LINK", "MUTABLE", {
      url: link,
      linkText: selectionText,
    });

    const selection = editorState.getSelection();
    const entityKey = currentContent.getLastCreatedEntityKey();
    const newContentState = Modifier.replaceText(
      currentContent,
      selection,
      selectionText,
      editorState.getCurrentInlineStyle(),
      entityKey
    );
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "insert-characters"
    );

    // insert a blank space after link
    const blankSelection = newEditorState.getSelection().merge({
      anchorOffset: selection.get("anchorOffset") + selectionText.length,
      focusOffset: selection.get("anchorOffset") + selectionText.length,
    });
    const adjustSelectionEditorState = EditorState.acceptSelection(
      newEditorState,
      blankSelection
    );
    const blankContentState = Modifier.insertText(
      adjustSelectionEditorState.getCurrentContent(),
      blankSelection,
      " ",
      adjustSelectionEditorState.getCurrentInlineStyle(),
      undefined
    );
    const blankEditorState = EditorState.push(
      adjustSelectionEditorState,
      blankContentState,
      "insert-characters"
    );
    onChange(blankEditorState);
  };

  const unlinkHandler = () => {
    const selection = editorState.getSelection();
    const entityKey = getSelectionLinkEntity(editorState);
    if (!entityKey) return;

    const contentState = editorState.getCurrentContent();
    const currentEntity = contentState.getEntity(entityKey);
    if (!(currentEntity && currentEntity.type === "LINK")) return;

    const startKey = selection.getStartKey();
    const block = contentState.getBlockForKey(startKey);
    const newSelection = SelectionState.createEmpty(block.getKey());

    const entityRange = getEntityRange(editorState, entityKey);
    if (!entityRange) return;

    const updatedSelection = newSelection.merge({
      anchorOffset: entityRange.start,
      focusOffset: entityRange.end,
    });
    const newContentState = Modifier.applyEntity(
      contentState,
      updatedSelection,
      null
    );
    const newEditorState = EditorState.set(editorState, {
      currentContent: newContentState,
    });
    onChange(newEditorState);
  };

  const toggleLinkModalHandler = () => {
    forceSelection();
    dispatch(toolbarActions.toggleLinkModal());
  };

  return { toggleLinkModalHandler, addLinkHandler, unlinkHandler };
};

export default LinkControls;
