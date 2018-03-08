import Component from '@ember/component';
import { computed, get, set } from '@ember/object';
import ResizeAware from 'ember-resize-aware/mixins/resize-aware';
import { merge } from '@ember/polyfills';
import { tryInvoke } from '@ember/utils';
import config from 'ember-get-config';
import EmberError from '@ember/error';
import ImgixClient from 'imgix-core-js';
import { debounce } from '@ember/runloop';

export default Component.extend(ResizeAware, {
  layout: null,
  tagName: 'img',
  attributeBindings: ['src', 'crossorigin', 'style', 'alt'],

  aspectRatio: null,
  path: null,
  crop: 'faces',
  fit: 'crop',
  pixelStep: 10,
  onLoad: null,
  auto: null,
  alt: null,
  width: null, // passed in
  height: null, // passed in

  _width: null,
  _height: null,

  debounceRate: 400,

  didResize(width, height) {
    const newWidth = Math.ceil(get(this, '_pathAsUrl.searchParams').get('width') || width / get(this, 'pixelStep')) * get(this, 'pixelStep');
    const newHeight = Math.floor(get(this, 'aspectRatio') ? newWidth / get(this, 'aspectRatio') : get(this, '_pathAsUrl.searchParams').get('height') || height);
    const newDpr = window.devicePixelRatio || 1;

    set(this, '_width', newWidth);
    set(this, '_height', newHeight);
    set(this, '_dpr', newDpr);
  },

  didInsertElement(...args) {
    if (get(this, 'onLoad')) {
      this._handleImageLoad = this._handleImageLoad.bind(this);
      this.element.addEventListener('load', this._handleImageLoad);
    }

    this.didResize(
      get(this, 'width') || get(this, '_width') || this.element.clientWidth || this.element.parentElement.clientWidth,
      get(this, 'height') || get(this, '_height') || this.element.clientHeight || this.element.parentElement.clientHeight);
    this._super(...args);
  },

  willDestroyElement(...args) {
    this.element.removeEventListener('load', this._handleImageLoad);
    this._super(...args);
  },

  _pathAsUrl: computed('path', function() {
    return new window.URL(get(this, 'path'), `https://${config.APP.imgix.source}`);
  }),

  _client: computed(function () {
    if (!config || !get(config, 'APP.imgix.source')) {
      throw new EmberError('Could not find a source in the application configuration. Please configure APP.imgix.source in config/environment.js. See https://github.com/imgix/ember-imgix for more information.');
    }

    return new ImgixClient({
      host: config.APP.imgix.source,
    });
  }),

  src: computed('_pathAsUrl', '_width', '_height', '_dpr', 'crop', 'fit', function () {
    if (!get(this, '_width')) { return; }

    let options = {
      crop: get(this, 'crop'),
      fit: get(this, 'fit'),
      w: get(this, '_width'),
      h: get(this, '_height'),
      dpr: get(this, '_dpr'),
    };

    if (this.get('auto')) {
      merge(options, { auto: this.get('auto') });
    }

    for (let param of get(this, '_pathAsUrl.searchParams')) {
      set(options, param[0], param[1]);
    }

    if (get(config, 'APP.imgix.debug')) {
      merge(options, get(this, '_debugParams'));
    }

    return get(this, '_client').buildURL(get(this, '_pathAsUrl.pathname'), options);
  }),

  _handleImageLoad(event) {
    debounce(this, () => tryInvoke(this, 'onLoad', [event.originalEvent]), 500);
  },

  _debugParams: computed('_width', '_height', '_dpr', function () {
    return {
      txt64: `${get(this, '_width')} x ${get(this, '_height')} @ DPR ${get(this, '_dpr')}`,
      txtalign: 'center,bottom',
      txtsize: 20,
      txtfont: 'Helvetica Neue',
      txtclr: 'ffffff',
      txtpad: 20,
      txtfit: 'max',
      exp: -2
    };
  }),
});
