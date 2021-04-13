const https = require('https');

class Emitter {
  channels = {};
  on(channel, callback) {
    this.channels[channel] = callback;
  }
  emit(channel, ...data) {
    if (typeof this.channels[channel] !== 'function') {
      return;
    }

    this.channels[channel](...data);
  }
}

const CHECK_TASK_CHANNEL = 'check_task';
const REQ_TIMEOUT = 10e3;

const batchRequest = async (urls, concurrent = 1) => {
  console.log(`[batchRequest] start`);

  return new Promise(async (resolve) => {
    const responses = [];
    const emitter = new Emitter();
    const clients = [];
    let current = 0;

    // 检查是否有新任务，有就执行，没有则等待结果确定后返回。
    const checkAndRunTask = async () => {
      const i = current;
      const url = urls[i];

      if (!url) {
        // 必须先等待全部请求结束，否则可能有些请求还未返回就resolve了
        await Promise.all(clients);
        resolve(responses);
        return;
      }

      const client = doRequest(url)
      .catch(() => {
        // 失败则把res置空并resolve
        return '';
      }).then(res => {
        responses[i] = res;

        // 每次有任务结束（无论成功失败），才推入下一个任务，保证并发数不超过concurrent
        emitter.emit(CHECK_TASK_CHANNEL);
      });

      clients.push(client);
  
      current += 1;
    };
  
    emitter.on(CHECK_TASK_CHANNEL, checkAndRunTask);
  
    for (let i = 0; i < concurrent; i++) {
      await checkAndRunTask();
    }
  });
};

const doRequest = async (url) => {
  console.log(`[doRequest] start ${url}`);

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      console.log(`[doRequest] timeout ${url}`);
      client.abort();
      reject(new Error(`req ${url} timeout`));
    }, REQ_TIMEOUT);

    const client = https.get(url, res => {
      console.log(`[doRequest] success ${url}`);

      const body = [];
      res.on('data', chunk => {
        body.push(chunk);
      });

      res.on('end', () => {
        resolve(Buffer.concat(body).toString());
        clearTimeout(timer);
      });
    }).on('error', err => {
      console.log(`[doRequest] fail ${url}`);

      reject(err);
      clearTimeout(timer);
    });
  });
};

module.exports = batchRequest;