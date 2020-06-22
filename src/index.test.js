import nock from 'nock';
import fs from 'fs';
import SeleniumVideoReporter from './index';

const targetFile = 'video/wdio-0-0-selenoid.mp4';

describe('Main test', () => {
    let reporter;
    let downloadRequest;
    let deleteRequest;

    const config = {
        cid: '0-0',
        sessionId: 'xs3wt345t34tergde',
        config: {
            protocol: 'http',
            hostname: 'selenium',
            port: 4444,
        },
    };

    beforeEach(() => {
        if (fs.existsSync(targetFile)) {
            fs.unlinkSync(targetFile);
        }
        downloadRequest = nock('http://selenium:4444')
            .get('/video/not-found.mp4')
            .reply(404);

        downloadRequest = nock('http://selenium:4444')
            .delete('/video/not-found.mp4')
            .reply(404);

        downloadRequest = nock('http://selenium:4444')
            .get('/video/xs3wt345t34tergde.mp4')
            .reply(200, 'Hello world!');

        deleteRequest = nock('http://selenium:4444')
            .delete('/video/xs3wt345t34tergde.mp4')
            .reply(200);

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
        await reporter.onRunnerEnd({ failures: 1, ...config });

        expect(downloadRequest.isDone());
        expect(deleteRequest.isDone());
        expect(fs.existsSync(targetFile)).toBeTruthy();
        expect(fs.readFileSync(targetFile, 'utf-8')).toEqual('Hello world!');
        expect(reporter.isSynchronised).toBeTruthy();
    });

    it('Don\'t download on success', async () => {
        await reporter.onRunnerEnd({ failures: 0, ...config });

        expect(!downloadRequest.isDone());
        expect(!deleteRequest.isDone());
        expect(fs.existsSync(targetFile)).toBeFalsy();
        expect(reporter.isSynchronised).toBeTruthy();
    });

    it('Download on success if required', async () => {
        reporter = new SeleniumVideoReporter({
            saveAllVideos: true,
            writeStream: {
                write() {
                },
            },
        });
        await reporter.onRunnerEnd({ failures: 0, ...config });

        expect(downloadRequest.isDone());
        expect(deleteRequest.isDone());
        expect(fs.existsSync(targetFile)).toBeTruthy();
        expect(fs.readFileSync(targetFile, 'utf-8')).toEqual('Hello world!');
        expect(reporter.isSynchronised).toBeTruthy();
    });

    it('Keep successful video on server', async () => {
        reporter = new SeleniumVideoReporter({
            saveAllVideos: false,
            deleteSuccessfulVideos: false,
            writeStream: {
                write() {
                },
            },
        });
        await reporter.onRunnerEnd({ failures: 0, ...config });

        expect(!downloadRequest.isDone());
        expect(!deleteRequest.isDone());
        expect(reporter.isSynchronised).toBeTruthy();
    });

    it('Keep failed video on server', async () => {
        reporter = new SeleniumVideoReporter({
            saveAllVideos: false,
            deleteDownloadedVideos: false,
            writeStream: {
                write() {
                },
            },
        });
        await reporter.onRunnerEnd({ failures: 1, ...config });

        expect(downloadRequest.isDone());
        expect(!deleteRequest.isDone());
        expect(reporter.isSynchronised).toBeTruthy();
    });

    it('Shouldn\' fail promise on video download', async () => {
        reporter = new SeleniumVideoReporter({
            retries: 0,
            saveAllVideos: false,
            deleteDownloadedVideos: false,
            writeStream: {
                write() {
                },
            },
        });
        const myConfig = { failures: 1, ...config };
        myConfig.sessionId = 'not-found';
        expect.assertions(1);
        await expect(reporter.onRunnerEnd(myConfig)).resolves.toEqual(undefined);
    });

    it('Shouldn\' fail promise on video delete', async () => {
        reporter = new SeleniumVideoReporter({
            retries: 0,
            saveAllVideos: false,
            deleteSuccessfulVideos: true,
            writeStream: {
                write() {
                },
            },
        });
        const myConfig = { ...config };
        myConfig.sessionId = 'not-found';
        expect.assertions(1);
        await expect(reporter.onRunnerEnd(myConfig)).resolves.toEqual(undefined);
    });
});
