import tippy from 'tippy.js'
// eslint-disable-next-line no-unused-vars
import assign from 'nano-assign'

const hasBindingChanged = (value, oldValue) => {
  return Object.keys(value).some(key => {
    return value[key] !== oldValue[key]
  })
}

export default (opts = {}) => {
  const init = (el, { value = {}, oldValue = {} }, vnode) => {
    if (!el.getAttribute('title')) {
      var title = '';

      if (!!value.text) {
        if (!!value.header) {
          title += '<div class="tooltip-custom__header">' + value.header + '</div>';
        }
        if (!!value.src) {
          title += '<img class="tooltip-custom__img" src="' + value.src + '">';
        }
        title += '<div class="tooltip-custom__text">' + value.text + '</div>';
      } else {
        title =
          value.title ||
          (vnode.data.attrs && vnode.data.attrs.title) ||
          opts.title;
      }
      if (title) {
        el.setAttribute('title', title);
      }
    }

    if (el.tip) {
      if (hasBindingChanged(value, oldValue)) {
        // Re-initialize the element when binding value changes
        // TODO: find a way to update settings w/o recreate the tippy instance
        el.tip.destroyAll()
        el.tip = tippy(el, {
          ...opts,
          ...value
        })
      } else {
        // Only update content when title changes
        const popper = el.tip.getPopperElement(el)
        el.tip.update(popper)
      }
    } else {
      el.tip = tippy(el, {
        ...opts,
        ...value
      })
    }
  }

  const unbind = el => {
    if (el.tip) {
      el.tip.destroyAll()
    }
  }

  return {
    inserted: init,
    componentUpdated: init,
    unbind
  }
}
