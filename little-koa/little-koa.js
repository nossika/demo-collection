class Koa {
    constructor () {
        this.mids = [];
    }
    use (aFunc) {
        this.mids.push(aFunc);
    }
    async exec (req) {
        let ctx = {};
        ctx = {};
        ctx.req = req;
        ctx.res = {};
        function createNext (mid, next) {
            return async () => {
                await mid(ctx, next);
            }
        }
        let next = async () => Promise.resolve();
        for (let i = this.mids.length - 1; i >= 0; i--) {
            let mid = this.mids[i];
            next = createNext(mid, next);
        }
        await next();
        return ctx.res;
    }
    callback () {
        return (req, res) => {
            this.exec(req).then(data => {
                res.end(JSON.stringify(data));
            });
        }
    }

}

module.exports = Koa;



