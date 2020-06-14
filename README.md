# wdio-selenoid-video-reporter [![Build Status](https://travis-ci.org/sherlock1982/wdio-selenoid-video-reporter.svg?branch=master)](https://travis-ci.org/sherlock1982/wdio-selenoid-video-reporter)

Reporter for WebdriverIO v6 that downloads videos from Selenoid Hub 

This is a reporter for [Webdriver IO v6](https://webdriver.io/) that downloads videos from your [Selenoid Hub](https://aerokube.com/selenoid/).


Installation
============

Install the reporter
--------------------

`yarn add wdio-selenoid-video-reporter`
or
`npm install wdio-selenoid-video-reporter`


Add the reporter to config
--------------------------

At the top of the `wdio.conf.js`-file, require the library:
```
const selenoidVideo = require('wdio-selenoid-video-reporter').default;
```

Then add the video reporter to the configuration in the reporters property:

```
 reporters: [
    [selenoidVideo, {
      saveAllVideos: false,       // If true, also saves videos for successful test cases
    }],
  ],
```

Configuration
=============

Normal configuration parameters
-------------------------------

Most users may want to set these

- `saveAllVideos` Set to true to save videos for passing tests. `Default: false`
- `deleteDownloadedVideos` Set to false to keep downloaded videos on Selenoid Hub `Default: true`, 
- `deleteSuccessfulVideos` Set to false to keep successfull videos on Selenoid Hub `Default: true`, 
- `outputDir` Directory to save video files. `Default: video`
- `retries` Number of retries to download video. `Default: 3`
- `minTimeout` The number of milliseconds before starting the first retry. `Default: 2000`
- `maxTimeout` The maximum number of milliseconds between two retries. `Default: 6000`
- `outputFileFormat` A function to define downloaded videos filenames. `Default: function(runner){ return "wdio-${options.cid}-selenoid.mp4"}` 

Troubleshooting
============

Default reporter timeout allocated by WebdriverIO is 5 seconds.
If your videos taking longer to download please increase `reporterSyncTimeout` in `wdio.conf.js` 
to a bigger value.

Thanks
============

Thanks to [presdienten](https://github.com/presidenten) for great ideas.
