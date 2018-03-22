# ember-imgix

[![Greenkeeper badge](https://badges.greenkeeper.io/Duder-onomy/ember-imgix.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/Duder-onomy/ember-imgix.svg?branch=master)](https://travis-ci.org/Duder-onomy/ember-imgix)

[![npm version](https://badge.fury.io/js/ember-imgix.svg)](https://badge.fury.io/js/ember-imgix)

[DEMO](https://duder-onomy.github.io/ember-imgix/)

An Ember addon for easily adding responsive imagery via [imgix](https://www.imgix.com) to your application.
As your components resize, we will fetch new optimized imgix images.
Uses [ember-singularity](https://github.com/trentmwillis/ember-singularity) under the hood for efficient and massively gangster event handling.

Works with FastBoot

**Note:** Front-end imgix libraries and framework integrations will not work with imgix Web Proxy Sources. They will only work with imgix Web Folder or S3 Sources.

## Installation

From within an existing ember-cli project:

```bash
$ ember install ember-imgix
```

Next, set up some configuration flags:

```javascript
// config/environment.js

module.exports = function(environment) {
  var ENV = {
    // snip
    APP: {
      imgix: {
        source: 'my-social-network.imgix.net',
        debug: true // Prints out diagnostic information on the image itself. Turn off in production.
      }
    }
    // snip
  }
};
```

## Usage

This addon exposes a single component `imgix-image` that you will want to use.

```hbs
{{imgix-image path='/users/1.png'}}
```

The HTML generated by this might look like the following:

```html
<img src="https://my-social-network.com/users/1.png?w=400&h=300&dpr=1" >
```

The `src` attribute will have [imgix URL API parameters](https://www.imgix.com/docs/reference) added to it to perform the resize.

Note! This element works by calculating the width/height from its parent. If its parent has no width/height, then this component will do nothing.

You can pass through most of the [params that imgix urls accept](https://docs.imgix.com/apis/url).

Some of the defaults are:

```javascript
path: null, // The path to your image
aspectRatio: null,
crop: 'faces',
fit: 'crop',
pixelStep: 10, // round to the nearest pixelStep
onLoad: null,
crossorigin: 'anonymous',
alt: '', // image alt
options: {}, // arbitrary imgix options
auto: null, // https://docs.imgix.com/apis/url/auto

width: null, // override if you want to hardcode a width into the image
height: null, // override if you want to hardcode a height into the image
```

If you want to pass in any other arbitrary imgix options, use the hash helper
```hbs
{{imgix-image
  path='/users/1.png'
  options=(hash
    invert=true
  )
}}
```

This element also exposes an `onLoad` action which you can hook into to know when the image has loaded:

```hbs
{{imgix-image
  path='/users/1.png'
  onLoad=(action 'handleImageLoad')
}}
```

## Imgix Core JS

Imgix core js is available to you shimmed as:

```javascript
import ImgixCoreJs from 'imgix-core-js';
```

## Running Tests

To see this in action with some stock photos, clone this repo and then run `ember serve`

```bash
git clone git@github.com:Duder-onomy/ember-imgix.git
cd ember-imgix
ember serve
```

Now visit [http://localhost:4200](http://localhost:4200).

## Running Tests

Pretty simple:

```base
ember test
```

This is heavily inspired by [ember-cli-imgix](https://github.com/imgix/ember-cli-imgix), except I have re-written all the pertinent bits.
