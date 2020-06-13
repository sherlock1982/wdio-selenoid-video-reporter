# wdio-selenoid-video-reporter
Reporter for WebdriverIO v6 that downloads videos from Selenoid Hub

This is a reporter for [Webdriver IO v6](https://webdriver.io/) that downloads videos from your Selenoid Hub.


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
const selenoidVideo = require('wdio-selenoid-video-reporter');
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
- `outputDir` Directory to save video files. `Default: video`
- `retries` Number of retries to download video. `Default: 3`
- `minTimeout` The number of milliseconds before starting the first retry. `Default: 2000`
- `maxTimeout` The maximum number of milliseconds between two retries. `Default: 6000`

Thanks
============

Thanks to [presdienten](https://github.com/presidenten) for great ideas.
