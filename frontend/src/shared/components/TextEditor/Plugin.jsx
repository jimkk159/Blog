import { composeDecorators } from "@draft-js-plugins/editor";
import createFocusPlugin from "@draft-js-plugins/focus";
import createImagePlugin from "@draft-js-plugins/image";
import createAlignmentPlugin from "@draft-js-plugins/alignment";
import createBlockDndPlugin from "@draft-js-plugins/drag-n-drop";
import createResizeablePlugin from "@draft-js-plugins/resizeable";

//CSS
import "@draft-js-plugins/image/lib/plugin.css";
import "@draft-js-plugins/alignment/lib/plugin.css";
import classes from "./Plugin.module.css";

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin({ vertical: "relative" });
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
);

const droppableBlockDndPlugin = {
  ...blockDndPlugin,
  handleDrop: (
    selection,
    dataTransfer,
    isInternal,
    { getEditorState, setEditorState }
  ) => {
    console.log(123)
    const raw = dataTransfer.data.getData("text");
    console.log(raw);

    return blockDndPlugin.handleDrop(selection, dataTransfer, isInternal, {
      getEditorState,
      setEditorState,
    });
  },
};

const imagePlugin = createImagePlugin({
  decorator,
  theme: { image: classes["image-plugin"] },
});

const plugins = [
  blockDndPlugin,
  droppableBlockDndPlugin,
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  imagePlugin,
];

export default plugins;
export const { AlignmentTool } = alignmentPlugin;
