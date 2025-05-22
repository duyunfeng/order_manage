import axios from 'axios';

async function uploadFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await axios.post("/api/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data.data.url;
}

export { uploadFile as u };
//# sourceMappingURL=upload-D2iGuTey.mjs.map
