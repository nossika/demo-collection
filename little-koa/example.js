const Koa = require('./little-koa');
const app = new Koa();

app.use(async (ctx, next) => {
    console.log(1);
    const t1 = Date.now();
    await next();
    console.log(5);
    ctx.res.responseTime = Date.now() - t1;
    console.log(`url: "${ctx.req.url}" / time: "${Date.now() - t1}ms"`);
});

app.use(async (ctx, next) => {
    console.log(2);
    await next();
    console.log(4);
});
app.use(async (ctx, next) => {
    console.log(3);
    ctx.res.url = ctx.req.url;
    await next();
});

// test
setTimeout(() => {
    app.exec({
        url: 'test',
    })
    .then(res => {
        console.log(res);
    });
}, 1000);

const http = require('http');
const server = http.createServer(app.callback());
server.listen(3333, () => {
    console.log(`server listen on 3333`);
});

// class HTTP {
//     constructor () {
//     }
//     createServer (serverCallback) {
//         return {
//             requested: req => new Promise(resolve => {
//                 serverCallback(req, {
//                     end (data) {
//                         resolve(data);
//                     }
//                 });
//             })
//         }
//     }
// }

// const http = new HTTP();
// // const server2 = http.createServer((req, res) => {
// //     res.end(req.val)
// // });
// // server2.requested({val: 3}).then(data => {
// //     console.log(data);
// // });
// const server = http.createServer(app.callback());
//
// server.requested({
//     val: 1,
// }).then(data => {
//     console.log(data);
// });

