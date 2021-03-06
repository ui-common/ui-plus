"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function label(input) {
  return resources.label(input);
}
exports.label = label;
function labelFromContainer(input) {
  return resources.labelFromContainer(input);
}
exports.labelFromContainer = labelFromContainer;
function container(ctrl) {
  return resources.container(ctrl);
}
exports.container = container;
var resources = (function () {
  function resources() {
  }
  resources.label = function (input) {
    if (!input || input.getAttribute('type') === 'hidden') {
      return '';
    }
    var l = input.getAttribute('label');
    if (l) {
      return l;
    }
    else if (!l || l.length === 0) {
      var key = input.getAttribute('key');
      if (!key || key.length === 0) {
        key = input.getAttribute('resource-key');
      }
      if (key !== null && key.length > 0) {
        l = resources.resource.value(key);
        input.setAttribute('label', l);
        return l;
      }
      else {
        return resources.labelFromContainer(input);
      }
    }
    else {
      return resources.labelFromContainer(input);
    }
  };
  resources.labelFromContainer = function (input) {
    var parent = resources.container(input);
    if (parent && parent.nodeName === 'LABEL' && parent.childNodes.length > 0) {
      var first = parent.childNodes[0];
      if (first.nodeType === 3) {
        return first.nodeValue;
      }
    }
    else if (parent && parent.nodeName !== 'LABEL') {
      if (parent.classList.contains('form-group') || parent.classList.contains('field')) {
        var firstChild = parent.firstChild;
        if (firstChild.nodeName === 'LABEL') {
          return firstChild.innerHTML;
        }
        else {
          return '';
        }
      }
      else {
        var node = parent.parentElement;
        if (node && node.nodeName === 'LABEL' && node.childNodes.length > 0) {
          var first = node.childNodes[0];
          if (first.nodeType === 3) {
            return first.nodeValue;
          }
        }
      }
    }
    return '';
  };
  resources.container = function (ctrl) {
    var p = ctrl.parentElement;
    if (p.nodeName === 'LABEL' || p.classList.contains('form-group') || p.classList.contains('field')) {
      return p;
    }
    else {
      var p1 = p.parentElement;
      if (p1.nodeName === 'LABEL' || p1.classList.contains('form-group') || p1.classList.contains('field')) {
        return p1;
      }
      else {
        var p2 = p1.parentElement;
        if (p2.nodeName === 'LABEL' || p2.classList.contains('form-group') || p2.classList.contains('field')) {
          return p2;
        }
        else {
          var p3 = p2.parentElement;
          if (p3.nodeName === 'LABEL' || p3.classList.contains('form-group') || p3.classList.contains('field')) {
            return p3;
          }
        }
      }
    }
    return null;
  };
  return resources;
}());
exports.resources = resources;
