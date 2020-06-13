import nock from 'nock';
import fs from 'fs';
import SeleniumVideoReporter from './index';

const targetFile = 'video/wdio-0-0-selenoid.mp4';

describe('Main test', () => {
    let reporter;

    beforeEach(() => {
        if (fs.existsSync(targetFile)) {
            fs.unlinkSync(targetFile);
        }
        nock('http://selenium:4444')
            .get('/video/xs3wt345t34tergde.mp4')
            .reply(200, 'Hello world!');

        reporter = new SeleniumVideoReporter({
            writeStream: {
                write() {
                },
            },
        });
    });

    afterEach(() => {
        if (fs.existsSync(targetFile)) {
            fs.unlinkSync(targetFile);
        }
    });

    it('Download on failure', async () => {
        await reporter.onRunnerEnd({
            failures: 1,
            cid: '0-0',
            sessionId: 'xs3wt345t34tergde',
            config: {
                protocol: 'http',
                hostname: 'selenium',
                port: 4444,
            },
        });
        expect(fs.existsSync(targetFile)).toBeTruthy();
        expect(fs.readFileSync(targetFile, 'utf-8')).toEqual('Hello world!');
    });

    it('Don\'t download on success', async () => {
        await reporter.onRunnerEnd({
            failures: 0,
            cid: '0-0',
            sessionId: 'xs3wt345t34tergde',
            config: {
                protocol: 'http',
                hostname: 'selenium',
                port: 4444,
            },
        });
        expect(fs.existsSync(targetFile)).toBeFalsy();
    });
});
