const Koa = require('koa');
const KoaStatic = require('koa-static');
const KoaBody = require('koa-body');
const KoaLogger = require('koa-logger');
const KoaRouter = require('@koa/router');
const { mergeFile, tempWriteLocal } = require('./utils');

// lowdb 作为本地缓存
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(__dirname + '/db/index.json')
const db = lowdb(adapter)
db.defaults({ files: [] })
  .write()

const HOST = '0.0.0.0';
const PORT = 9870;

const app = new Koa();
const router = new KoaRouter();

app.use(KoaLogger());
app.use(KoaBody({
  multipart: true,
}));

// 过滤响应
router.use(async (ctx, next) => {
  await next(ctx);
  ctx.status = 200;
  ctx.body = {
    code: 200,
    data: ctx.body,
  };
});

/**
 * 查询文件状态
 */
router.post('/fileStatus', async (ctx) => {
  const body = ctx.request.body;
  const key = body.key;
  const length = body.length;
  const filename = body.name;

  const current = db.get('files').find({ key });
  // 如果没有找到当前文件信息就增加
  if (!current.value()) {
    db.get('files').push({
      key,
      length,
      filename,
      blocks: [] // 存放已完的文件块信息
    }).write();
  }
  // 返回信息
  ctx.body = db.get('files').find({ key }).value();
});

/**
 * 上传切片
 */
router.post('/uploadBlock', async (ctx, next) => {
  const file = ctx.request.files.file; // 切片文件
  const body = ctx.request.body;  // 切片信息
  // 查询关联的文件信息
  const parent = db.get('files').find({ key: body.parent });
  // 如果没初始化就上传切片直接gg
  if (!parent.value()) {
    ctx.body = 'error';
    return;
  }
  // 写入到本地文件
  await tempWriteLocal(file.path, __dirname + '/files/' + body.key);
  // 检测是否可以找到当前块
  const is = parent.get('blocks').find({ key: body.key }).value();
  // 没有找到的话就说明没有上传过 就将块信息储存
  if (!is) {
    parent.get('blocks').push({
      index: body.index,
      key: body.key
    }).write();
  }
  // 通过检查长度判断是否上传完成
  if (parent.get('blocks').value().length == parent.get('length').value()) {
    const filename = parent.get('filename').value();
    const blocks = parent.get('blocks').value();
    // 将块信息排序
    blocks.sort((a, b) => a.index - b.index);
    // 获得排序后的块文件名(md5)
    const _blocks = blocks.map(item => item.key)
    // 合并
    mergeFile(filename, _blocks);
    // 将文件url写入到文件信息数据
    parent
      .set('url', filename).write();
  }
});

app
  .use(router.routes())
  .use(router.allowedMethods())

app
  .use(KoaStatic(__dirname + '/static'))
  .use(KoaStatic(__dirname + '/files'));

app.listen(PORT, HOST, () => {
  console.log('http://' + HOST + ':' + PORT);
});