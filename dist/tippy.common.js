'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var tippy = _interopDefault(require('tippy.js'));
var assign = _interopDefault(require('nano-assign'));

// eslint-disable-next-line no-unused-vars
var hasBindingChanged = function (value, oldValue) {
  return Object.keys(value).some(function (key) {
    return value[key] !== oldValue[key]
  })
};

var tippy$1 = function (opts) {
  if ( opts === void 0 ) opts = {};

  var init = function (el, ref, vnode) {
    var value = ref.value; if ( value === void 0 ) value = {};
    var oldValue = ref.oldValue; if ( oldValue === void 0 ) oldValue = {};

    if (!el.getAttribute('title')) {
      var titlePrepare = '';

      if (!!value.text) {
        if (!!value.header) {
          titlePrepare += '<div class="tooltip-custom__header">' + value.header + '</div>';
        }
        if (!!value.src) {
          titlePrepare += '<img class="tooltip-custom__img" src="' + value.src + '">';
        }
        titlePrepare += '<div class="tooltip-custom__text">' + value.text + '</div>';
      } else {
        titlePrepare =
          value.title ||
          (vnode.data.attrs && vnode.data.attrs.title) ||
          opts.title;
      }
      var title = titlePrepare;

      if (title) {
        el.setAttribute('title', title);
      }
    }

    if (el.tip) {
      if (hasBindingChanged(value, oldValue)) {
        // Re-initialize the element when binding value changes
        // TODO: find a way to update settings w/o recreate the tippy instance
        el.tip.destroyAll();
        el.tip = tippy(el, assign({}, opts,
          value));
      } else {
        // Only update content when title changes
        var popper = el.tip.getPopperElement(el);
        el.tip.update(popper);
      }
    } else {
      el.tip = tippy(el, assign({}, opts,
        value));
    }
  };

  var unbind = function (el) {
    if (el.tip) {
      el.tip.destroyAll();
    }
  };

  return {
    inserted: init,
    componentUpdated: init,
    unbind: unbind
  }
};

var index = function (Vue, opts) {
  Vue.directive('tippy', tippy$1(opts));
};

module.exports = index;
