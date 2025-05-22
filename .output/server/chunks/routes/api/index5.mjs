import { c as defineEventHandler, e as readMultipartFormData } from '../../_/nitro.mjs';
import { mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { randomUUID } from 'crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'ipx';
import 'node:path';

const index = defineEventHandler(async (event) => {
  try {
    const uploadDir = process.env.UPLOAD_DIR || "./public/uploads";
    const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || "10485760");
    const formData = await readMultipartFormData(event);
    if (!formData || formData.length === 0) {
      return { code: 1, message: "\u6CA1\u6709\u4E0A\u4F20\u6587\u4EF6" };
    }
    const file = formData[0];
    if (file.data.length > maxFileSize) {
      return { code: 1, message: `\u6587\u4EF6\u5927\u5C0F\u8D85\u8FC7\u9650\u5236 ${maxFileSize / 1024 / 1024}MB` };
    }
    const originalFilename = file.filename || "unknown";
    const fileExt = originalFilename.includes(".") ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png").split(",");
    if (!allowedTypes.includes(fileExt.toLowerCase())) {
      return { code: 1, message: `\u4E0D\u652F\u6301\u7684\u6587\u4EF6\u7C7B\u578B: ${fileExt}` };
    }
    const uniqueFilename = `${randomUUID()}${fileExt}`;
    const relativePath = join(uploadDir.replace("./public", ""), uniqueFilename);
    const fullPath = join(process.cwd(), uploadDir, uniqueFilename);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, file.data);
    return {
      code: 0,
      data: {
        url: relativePath,
        originalName: originalFilename,
        size: file.data.length
      }
    };
  } catch (error) {
    console.error("\u6587\u4EF6\u4E0A\u4F20\u9519\u8BEF:", error);
    return { code: 1, message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" };
  }
});

export { index as default };
//# sourceMappingURL=index5.mjs.map
