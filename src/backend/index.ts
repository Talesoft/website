
import {constants, createSecureServer, ServerHttp2Stream} from "http2";
import {resolve} from "path";
import {config} from "dotenv";
import {stat, readFileSync, Stats} from "fs";
import {promisify} from "util";
import {lookup} from "mime-types";
const {
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_METHOD_NOT_ALLOWED,
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_METHOD,
    HTTP2_HEADER_STATUS,
    HTTP2_HEADER_LOCATION,
    HTTP_STATUS_MOVED_PERMANENTLY
} = constants;

//Load .env.dist (Default Config)
config({path: resolve(process.cwd(), '.env.dist')});
//Load .env
config();

const {APP_PORT, APP_HOST, APP_KEY_PATH, APP_CRT_PATH} = process.env;
const allowedMethods = ['GET'];
const publicPath = resolve(__dirname, '..', 'public');
const pushFiles: {[path: string]: string[]} = {
    '/index.html': ['/index.css', '/index.js']
};

async function respondStatus(stream: ServerHttp2Stream, status: number): Promise<void>
{
    stream.respond({[HTTP2_HEADER_STATUS]: status});
    stream.end();
}

async function respondLocation(stream: ServerHttp2Stream, path: string): Promise<void>
{
    stream.respond({[HTTP2_HEADER_STATUS]: HTTP_STATUS_MOVED_PERMANENTLY, [HTTP2_HEADER_LOCATION]: path.substr(-1)});
    stream.end();
}

async function respondFile(stream: ServerHttp2Stream, path: string, push: boolean = false): Promise<void>
{
    const prefix = '-'.repeat(push ? 4 : 2);
    if (path === '') {
        path = '/';
    }

    if (!path.match(/^\/(?:[a-z0-9\-_/]+(?:\.[a-z0-9]+)?)?$/i)) {
        console.warn(`${prefix} Ignored request to ${path}`);
        return respondStatus(stream, HTTP_STATUS_NOT_FOUND);
    }

    if (path !== '/' && path[path.length - 1] === '/') {
        console.warn(`${prefix} Redirecting ${path} to ${path.substr(-1)}`);
        return respondLocation(stream, path.substr(-1));
    }

    if (path.charAt(0) !== '/') {
        path = `/${path}`;
    }

    const fullPath = resolve(publicPath, `.${path}`);
    console.log(`${prefix} ${push ? 'Pushing' : 'Serving'} ${path} @ ${fullPath}`);

    let stats: Stats;
    try {
        stats = await promisify(stat)(fullPath);
    } catch (err) {
        console.error(`${prefix}> ${path} not found or faulty (${err.code})`);
        return respondStatus(stream, HTTP_STATUS_NOT_FOUND);
    }

    if (stats.isDirectory()) {
        console.log(`${prefix}> ${path} is a directory, looking for index.html.`);
        return respondFile(stream, `${path === '/' ? '' : path}/index.html`);
    }

    if (!stats.isFile()) {
        console.error(`${prefix}> ${path} is not a file.`);
        return respondStatus(stream, HTTP_STATUS_NOT_FOUND);
    }

    console.info(`${prefix}> ${path} found, ${push ? 'pushing' : 'serving'}...`);

    const mimeType = lookup(fullPath);

    if (!mimeType) {
        return respondStatus(stream, HTTP_STATUS_NOT_FOUND);
    }

    let promises: Promise<void>[] = [];
    stream.respondWithFile(fullPath, {'content-type': mimeType}, {
        onError: async () =>
        {
            await respondStatus(stream, HTTP_STATUS_NOT_FOUND);
        }
    });

    if (path in pushFiles) {
        pushFiles[path].forEach(pushFilePath => stream.pushStream({[HTTP2_HEADER_PATH]: pushFilePath}, async (err, pushStream) =>
        {
           if (err) {
               promises.push(respondStatus(pushStream, HTTP_STATUS_NOT_FOUND));
               return;
           }

           promises.push(respondFile(pushStream, pushFilePath, true));
        }));
    }
    await Promise.all(promises);
}

const server = createSecureServer({
    key: readFileSync(<string>APP_KEY_PATH),
    cert: readFileSync(<string>APP_CRT_PATH)
});

server.on('stream', async (stream, headers) => {
    const path = headers[HTTP2_HEADER_PATH];
    const method = headers[HTTP2_HEADER_METHOD];

    if (typeof path === 'undefined') {
        await respondStatus(stream, HTTP_STATUS_NOT_FOUND);
        return;
    }

    if (!method || !allowedMethods.includes(Array.isArray(method) ? method[0] : method)) {
        await respondStatus(stream, HTTP_STATUS_METHOD_NOT_ALLOWED);
        return;
    }

    await Array.isArray(path)
        ? Promise.all((<string[]>path).map(p => respondFile(stream, p)))
        : respondFile(stream, <string>path);
});

server.listen(parseInt(<string>APP_PORT), <string>APP_HOST, () =>
{
    console.log(`Server listening on https://${APP_HOST}:${APP_PORT}/`)
});
