// 웹 버전(index.html + img)을 토스 미니앱용 app/ 폴더로 복사하고 토스 광고 브리지를 끼워 넣습니다.
import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve('..'), app = path.resolve('app');
fs.rmSync(app, { recursive: true, force: true });
fs.mkdirSync(path.join(app, 'public'), { recursive: true });
fs.cpSync(path.join(root, 'img'), path.join(app, 'img'), { recursive: true });
fs.cpSync(path.join(root, 'img'), path.join(app, 'public', 'img'), { recursive: true });
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace(/<script[^>]*googlesyndication[^>]*><\/script>/g, '');
html = html.replace('</body>', '<script type="module" src="./toss-bridge.js"></script>\n</body>');
fs.writeFileSync(path.join(app, 'index.html'), html);
fs.copyFileSync(path.resolve('src/toss-bridge.js'), path.join(app, 'toss-bridge.js'));
fs.copyFileSync(path.resolve('ads.json'), path.join(app, 'ads.json'));
console.log('prep done');
