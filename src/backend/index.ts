
import {constants, createSecureServer, ServerHttp2Stream} from "http2";
import {resolve} from "path";
import {config} from "dotenv";
import {stat, readFileSync, Stats} from "fs";
import {promisify} from "util";
import {lookup} from "mime-types";

//Load .env.dist (Default Config)
config({path: resolve(process.cwd(), '.env.dist')});
//Load .env
config();

const {APP_PORT, APP_HOST, APP_KEY_PATH, APP_CRT_PATH} = process.env;
const {
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_METHOD_NOT_ALLOWED,
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_METHOD,
    HTTP2_HEADER_STATUS,
    HTTP2_HEADER_LOCATION,
    HTTP_STATUS_MOVED_PERMANENTLY
} = constants;
const allowedMethods = ['GET'];
const publicPath = resolve(__dirname, '..', 'public');
const pushFiles: {[path: string]: string[]} = {
    '/index.html': ['/index.css', '/index.js']
};

function respondStatus(stream: ServerHttp2Stream, status: number): void
{
    stream.respond({[HTTP2_HEADER_STATUS]: status});
}

async function respondFile(stream: ServerHttp2Stream, path: string): Promise<void>
{
    if (path.length > 0 && path[path.length - 1] === '/') {
        if (path === '/') {
            path = '';
        } else {
            respondStatus(stream, HTTP_STATUS_MOVED_PERMANENTLY)
            stream.respond({[HTTP2_HEADER_LOCATION]: path.substr(-1)});
            stream.end();
            return;
        }
    }

    const fullPath = resolve(publicPath, `.${path}`);
    console.log(`-- Serving ${path} -> ${fullPath}`);

    let stats: Stats;
    try {
        stats = await promisify(stat)(fullPath);
    } catch (err) {
        console.log(err);
        respondStatus(stream, HTTP_STATUS_NOT_FOUND);
        stream.end();
        return;
    }

    if (stats.isDirectory()) {
        return respondFile(stream, `${path}/index.html`);
    }

    if (!stats.isFile()) {
        respondStatus(stream, HTTP_STATUS_NOT_FOUND);
        stream.end();
        return;
    }

    const mimeType = lookup(fullPath);

    if (!mimeType) {
        respondStatus(stream, HTTP_STATUS_NOT_FOUND);
        stream.end();
        return;
    }

    stream.respondWithFile(fullPath, {'content-type': mimeType}, {
        onError: () =>
        {
            respondStatus(stream, HTTP_STATUS_NOT_FOUND);
            stream.end();
        }
    });

    if (path in pushFiles) {
        pushFiles[path].forEach(pushFilePath => stream.pushStream({[HTTP2_HEADER_PATH]: pushFilePath}, (err, pushStream) =>
        {
           if (err) {
               respondStatus(pushStream, HTTP_STATUS_NOT_FOUND);
               pushStream.end();
               return;
           }

           respondFile(pushStream, pushFilePath);
        }));
    }
}

const server = createSecureServer({
    key: readFileSync(<string>APP_KEY_PATH),
    cert: readFileSync(<string>APP_CRT_PATH)
});

server.on('stream', async (stream, headers) => {
    const path = headers[HTTP2_HEADER_PATH];
    const method = headers[HTTP2_HEADER_METHOD];

    if (!path) {
        respondStatus(stream, HTTP_STATUS_NOT_FOUND);
        stream.end();
        return;
    }

    if (!method || !allowedMethods.includes(Array.isArray(method) ? method[0] : method)) {
        respondStatus(stream, HTTP_STATUS_METHOD_NOT_ALLOWED);
        stream.end();
        return;
    }

    respondFile(stream, Array.isArray(path) ? path[0] : path);
});

server.listen(parseInt(<string>APP_PORT), <string>APP_HOST, () =>
{
    console.log(`Server listening on ${APP_HOST}:${APP_PORT}`)
});
