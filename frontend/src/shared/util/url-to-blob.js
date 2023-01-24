import { Buffer } from "buffer";

export const encodeBase64 = (data) => {
  return Buffer.from(data).toString("base64");
};
export const decodeBase64 = (data) => {
  return Buffer.from(data, "base64").toString("ascii");
};

export const datatURLtoBlob = (dataURI) => {
  // convert base64/URLEncoded data component to raw binary data held in a string
  const splitdataURI = dataURI.split(",");
  let byteString;
  let data;
  if (splitdataURI[0].indexOf("base64") >= 0) {
    data = splitdataURI[1];
    // byteString = decodeBase64(data);
    byteString = window.atob(data);
  }

  // separate out the mime component
  const mimeString = splitdataURI[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  let uInt8Array = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    uInt8Array[i] = byteString.charCodeAt(i);
  }

  const myBlob = new Blob([uInt8Array], { type: mimeString });

  return [myBlob, data];
};

const convertImgURL = (draftRawData) => {
  const imgBlobs = [];
  let newRawData = JSON.parse(draftRawData);
  let data_;
  const newEntityMap = newRawData.entityMap;
  for (const entity in newEntityMap) {
    const item = newEntityMap[entity];

    if (item?.type === "IMAGE" && item?.data?.src) {
      const [dataBlob, data] = datatURLtoBlob(item.data.src);
      data_ = data;
      imgBlobs.push(dataBlob);
      newEntityMap[entity].data.src = "";
    }
  }
  newRawData.entityMap = newEntityMap;
  return [imgBlobs, JSON.stringify(newRawData), data_];
};

export default convertImgURL;
