import util from "util";
import { composeDecorators } from "@draft-js-plugins/editor";
import createFocusPlugin from "@draft-js-plugins/focus";
import createImagePlugin from "@draft-js-plugins/image";
import createAlignmentPlugin from "@draft-js-plugins/alignment";
import createBlockDndPlugin from "@draft-js-plugins/drag-n-drop";
import createResizeablePlugin from "@draft-js-plugins/resizeable";
import createDragNDropUploadPlugin from "@draft-js-plugins/drag-n-drop-upload";

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

const imagePlugin = createImagePlugin({
  decorator,
  theme: { image: classes["image-plugin"] },
});

const uploadImage = (data, success, failed, progress) => {
  const readDropFile = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          resolve({ name: file.name, src: fileReader.result });
        } catch (err) {
          reject(err);
        }
      };
      fileReader.onerror = (err) => {
        reject(err);
      };
      fileReader.readAsDataURL(file);
    });
  };

  const readedFileHandler = async (data, success, failed, progress) => {
    let intervalId = -1;
    let currentProgress = 0;
    const dropFiles = data.files.map((file) => readDropFile(file));
    try {
      let dropFile;
      intervalId = setInterval(async () => {
        if (
          currentProgress < 100 &&
          util.inspect(dropFiles[0]).includes("pending")
        ) {
          currentProgress += 10;
          progress(currentProgress, dropFiles[0]);
        } else {
          currentProgress = 100;
          dropFile = await dropFiles[0];
        }

        if (currentProgress === 100) {
          clearInterval(intervalId);
          success([dropFile] /*, { retainSrc: true }*/);
        }
      }, 500);
    } catch (err) {
      failed();
    }
  };

  if (data.files && data.files.length === 1) {
    readedFileHandler(data, success, failed, progress);
  }
};

const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
  handleUpload: uploadImage,
  addImage: imagePlugin.addImage,
});

const plugins = [
  dragNDropFileUploadPlugin,
  blockDndPlugin,
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  imagePlugin,
];

export default plugins;
export const { AlignmentTool } = alignmentPlugin;
