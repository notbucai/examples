const fs = require('fs');
const util = require('util');
const path = require('path');
/**
 * 用于copy文件
 * @param {String} input 输入文件地址
 * @param {String} output 输出文件地址
 */
function tempWriteLocal (input, output) {
  // 创建一个可读流
  const readerStream = fs.createReadStream(input);
  // 创建一个可写流
  const writerStream = fs.createWriteStream(output);
  // 管道读写操作
  // 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
  readerStream.pipe(writerStream);
  return new Promise((resolve, reject) => {
    writerStream.once('finish', () => {
      resolve();
      writerStream.close();
      readerStream.close();
    });
    writerStream.once('error', () => {
      reject();
      writerStream.close();
      readerStream.close();
    });
    readerStream.once('error', () => {
      reject();
      writerStream.close();
      readerStream.close();
    });
  })
}
/**
 * 合并切片成文件
 * @param {String} filename 文件名
 * @param {Array} keys 切片id（临时文件名）列表
 */
async function mergeFile (filename, keys) {
  const readFile = util.promisify(fs.readFile);

  const files = keys.map(key => {
    return readFile(path.join(__dirname, '../files/', key));
  });

  const filesBuffer = await Promise.all(files);
  // 合并切片
  const buffer = Buffer.concat(filesBuffer);
  // 写入
  fs.writeFileSync(path.join(__dirname, '../files/', filename), buffer);

  // 移除切片
  keys.forEach(key => {
    fs.unlink(path.join(__dirname, '../files/', key), function (err) {
      if (err) {
        throw err;
      }
    })
  });

}

module.exports = {
  tempWriteLocal,
  mergeFile
}