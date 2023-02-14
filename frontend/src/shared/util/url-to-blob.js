export const datatURLtoBlob = (dataURI) => {
  // convert base64/URLEncoded data component to raw binary data held in a string
  const splitdataURI = dataURI.split(",");
  let byteString;
  if (splitdataURI[0].indexOf("base64") >= 0) {
    byteString = window.atob(splitdataURI[1]);
  }

  // separate out the mime component
  const mimeString = splitdataURI[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  const array = [];
  for (let i = 0; i < byteString.length; i++) {
    array.push(byteString.charCodeAt(i));
  }

  const myBlob = new Blob([new Uint8Array(array)], { type: mimeString });

  return [myBlob];
};

const convertImgURL = (draftRawData) => {
  const imgBlobs = [];
  const imgMap = [];
  let newRawData = JSON.parse(draftRawData);
  const newEntityMap = newRawData.entityMap;

  for (const entity in newEntityMap) {
    const item = newEntityMap[entity];
    const dataURI = item?.data?.src;
    if (item?.type === "IMAGE" && dataURI) {
      if (dataURI.startsWith("data:image")) {
        const [dataBlob] = datatURLtoBlob(item.data.src);
        imgMap.push(1);
        imgBlobs.push(dataBlob);
        newEntityMap[entity].data.src = "";
      } else {
        imgMap.push(0);
      }
    }
  }
  newRawData.entityMap = newEntityMap;
  return [JSON.stringify(newRawData), imgBlobs, imgMap];
};

export default convertImgURL;
