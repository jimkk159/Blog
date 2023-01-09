import { EditorState, Modifier } from "draft-js";

const getSelectionText = (editorState) => {
  const selection = editorState.getSelection();
  const block = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey());
  const focusOffset = selection.getFocusOffset();
  const anchorOffset = selection.getAnchorOffset();
  const text = block.getText();
  if (anchorOffset < focusOffset) return text.slice(anchorOffset, focusOffset);
  return text.slice(focusOffset, anchorOffset);
};

const LinkControls = (props) => {
  const { editorState, onChange } = props;

  const addLink = (hyperLink) => {
    let link = hyperLink;
    // if (!hyperLink) return;
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
    onChange(newEditorState);
  };

  const addLinkHandler = (hyperLink) => {
    addLink(hyperLink);
  };
  return { addLinkHandler };
};

export default LinkControls;
