import promiseRetry from 'promise-retry';
import download from 'download';
import WDIOReporter from '@wdio/reporter';
import got from 'got';

const config = {
    // Save all videos or on failures only
    saveAllVideos: false,
    // Delete downloaded videos
    deleteDownloadedVideos: true,
    // Delete successful videos
    deleteSuccessfulVideos: true,
    // Specify output directory
    outputDir: 'video',
    // Number of retries
    retries: 3,
    // The number of milliseconds before starting the first retry. Default is 1000
    minTimeout: 2000,
    // The maximum number of milliseconds between two retries.
    maxTimeout: 6000,
    outputFileFormat(options) {
        return `wdio-${options.cid}-selenoid.mp4`;
    },
};

class SeleniumVideoReporter extends WDIOReporter {
    constructor(options) {
        super(options);
        this.synchronised = false;
        this.config = { ...config, ...options };
    }

    get isSynchronised() {
        // Wait until we're completely finished with videos
        return this.synchronised;
    }

    async onRunnerEnd(runner) {
        try {
            const url = `${runner.config.protocol}://${runner.config.hostname}:${runner.config.port}/video/${runner.sessionId}.mp4`;
            if (this.config.saveAllVideos || runner.failures > 0) {
                await this.downloadVideo(runner, url);
                if (this.config.deleteDownloadedVideos) {
                    await got(url, {
                        method: 'DELETE',
                    });
                }
            } else if (this.config.deleteSuccessfulVideos) {
                await got(url, {
                    method: 'DELETE',
                });
            }
        } catch (e) {
            if (e.message) {
                // eslint-disable-next-line no-console
                console.log(e.message);
            } else {
                // eslint-disable-next-line no-console
                console.log(e);
            }
        }
        this.synchronised = true;
    }

    downloadVideo(runner, url) {
        return promiseRetry(this.config,
            (retry) => download(url, this.config.outputDir, {
                filename: this.config.outputFileFormat(runner),
            }).catch(retry));
    }
}

export default SeleniumVideoReporter;
