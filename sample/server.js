const { createReadStream } = require("fs");
const Koa = require('koa');
const KoaStatic = require('koa-static');
const path = require("path");

const app = new Koa();

// Serve assets
app.use(KoaStatic(__dirname + '/build'));

// Serve index.html for all routes

app.use(async (context, next) => {
    context.type = "html";
    context.body = createReadStream(
      path.resolve(__dirname, 'build/index.html')
    );
});

app.listen(process.env.PORT || 3000);
