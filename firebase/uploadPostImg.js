import { storage } from "../firebase/config";

async function uploadPostImg(imageUri, uid) {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const filename = `${uid}-${new Date().getTime()}`;
  const ref = storage.ref().child(`images/${uid}/post/${filename}`);
  await ref.put(blob);

  const url = await ref.getDownloadURL();

  return url;
}

export default uploadPostImg;
