const https = require('https');

const request = async (url) => {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    
    });

    req.on('error', (err) => reject(err));
  });
};

const doRequest = async (url, callback) => {
  const result = await request(url)
    .then(res => {
      return {
        content: res,
        error: '',
      }
    })
    .catch((error) => {
      return {
        content: '',
        error: String(error),
      }
    });

  callback(result);
};

const batchRequest = async (urls, concurrent = 1) => {
  return new Promise((resolve => {
    let currentConcurrent = 0;
    const results = [];
    const remainTasks = urls.map((url, i) => {
      return {
        url,
        i,
      };
    });
  
    const checkAndExecTasks = () => {
      // 当结果数量等于输入时，认为整体任务结束，根据执行前的任务序号重新排序后返回
      if (results.length >= urls.length) {
        const resps = results.sort((a, b) => a.i < b.i ? -1 : 1).map(r => r.result);
        resolve(resps);
      }

      // 仅当并发数有空闲，且队列有剩余任务时，取一个任务出来执行
      while (currentConcurrent < concurrent && remainTasks.length) {
        const task = remainTasks.shift();
        currentConcurrent += 1;
        doRequest(task.url, (result) => {
          currentConcurrent -= 1;
          results.push({
            i: task.i,
            result,
          });

          // 每个任务完成后，重新检查并执行新任务
          checkAndExecTasks();
        });
      }
    };

    checkAndExecTasks();
  }));
};

module.exports = batchRequest;
