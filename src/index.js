const http = require('http');
const Koa = require('koa');
const Router = require('@koa/router');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const path = require('path');
const {faker} = require('@faker-js/faker');

// Server part
const app = new Koa();
const router = new Router();

// const public = path.join(__dirname, './public');
// app.use(koaStatic(public));

// Cross-origin middleware
app.use(async (ctx, next) => {
    const origin = ctx.request.get('Origin');
    if (!origin) {
        return await next();
    }
    const headers = {'Access-Control-Allow-Origin': '*'};
    if (ctx.request.method !== 'OPTIONS') {
        ctx.response.set({...headers});
        try {
            return await next();
        } catch (e) {
            e.headers = {...e.headers, ...headers};
            throw e;
        }
    }
    if (ctx.request.get('Access-Control-Request-Method')) {
        ctx.response.set({
            ...headers,
            'Access-Control-Allow-Methods': 'GET, POST, PUD, DELETE, PATCH',
        });

        if (ctx.request.get('Access-Control-Request-Headers')) {
            ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
        }

        ctx.response.status = 204;
    }
});

app.use(koaBody({
    text: true,
    urlencoded: true,
    multipart: true,
    json: true,
}));

router.get('/api/news', async (ctx, next) => {
    if (Math.random() > 0.5) {
        ctx.response.status = 500;
        return;
    }
    ctx.response.body = JSON.stringify([
        {
            header: faker.lorem.sentence(),
            imageURL: '/img/1.png',
            imageAlt: faker.lorem.word(),
            text: faker.lorem.paragraph(),
        },
        {
            header: faker.lorem.sentence(),
            imageURL: '/img/2.png',
            imageAlt: faker.lorem.word(),
            text: faker.lorem.paragraph(),
        },
        {
            header: faker.lorem.sentence(),
            imageURL: '/img/3.png',
            imageAlt: faker.lorem.word(),
            text: faker.lorem.paragraph(),
        },
    ]);
});

app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 8080;
const server = http.createServer(app.callback()).listen(port);
