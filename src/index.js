import promiseRetry from 'promise-retry';
import download from 'download';
import WDIOReporter from '@wdio/reporter';

const config = {
    // Save all videos or on failures only
    saveAllVideos: false,
    // Specify output directory
    outputDir: 'video',
    // Number of retries
    retries: 3,
    // The number of milliseconds before starting the first retry. Default is 1000
    minTimeout: 2000,
    // The maximum number of milliseconds between two retries.
    maxTimeout: 6000,
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

    onRunnerEnd(runner) {
        const url = `${runner.config.protocol}://${runner.config.hostname}:${runner.config.port}/video/${runner.sessionId}.mp4`;

        if (this.config.saveAllVideos || runner.failures > 0) {
            this.write(`${url}\n`);
            return promiseRetry(this.config,
                (retry) => download(url, this.config.outputDir).catch(retry)).finally(() => {
                this.synchronised = true;
            });
        }

        // Return resolved promise
        this.synchronised = true;
        return Promise.resolve();
    }
}

export default SeleniumVideoReporter;
