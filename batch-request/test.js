const batchRequest = require('./index');

const urls = ['https://nossika.com', 'https://www.baidu.com', 'https://www.qq.com', 'https://www.sina.com', 'https://www.sohu.com', 'https://www.taobao.com', 'https://www.toutiao.com'];
const wrongURLs = ['https://nossika111.com'];


(async () => {
  const res = await batchRequest(urls, 3);
  console.log(res);

  const res2 = await batchRequest(wrongURLs, 3);
  console.log(res2);
})();