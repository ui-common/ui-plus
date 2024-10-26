"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
function label(input) {
  return resources.label(input)
}
exports.label = label
function labelFromContainer(input) {
  return resources.labelFromContainer(input)
}
exports.labelFromContainer = labelFromContainer
function container(ctrl) {
  return resources.container(ctrl)
}
exports.container = container
function parseDate(v, format) {
  if (!format || format.length === 0) {
    format = "MM/DD/YYYY"
  } else {
    format = format.toUpperCase()
  }
  var dateItems = format.split(/\/|\.| |-/)
  var valueItems = v.split(/\/|\.| |-/)
  var imonth = dateItems.indexOf("M")
  var iday = dateItems.indexOf("D")
  var iyear = dateItems.indexOf("YYYY")
  if (imonth === -1) {
    imonth = dateItems.indexOf("MM")
  }
  if (iday === -1) {
    iday = dateItems.indexOf("DD")
  }
  if (iyear === -1) {
    iyear = dateItems.indexOf("YY")
  }
  var month = parseInt(valueItems[imonth], 10) - 1
  var year = parseInt(valueItems[iyear], 10)
  if (year < 100) {
    year += 2000
  }
  var day = parseInt(valueItems[iday], 10)
  return new Date(year, month, day)
}
exports.parseDate = parseDate
var resources = (function () {
  function resources() {}
  resources.label = function (input) {
    if (!input) {
      return ""
    }
    var l = input.getAttribute("data-label")
    if (l) {
      return l
    } else if (!l || l.length === 0) {
      var key = input.getAttribute("data-resource")
      if (key !== null && key.length > 0) {
        l = resources.resource.value(key)
        input.setAttribute("label", l)
        return l
      } else {
        return resources.labelFromContainer(input)
      }
    } else {
      return resources.labelFromContainer(input)
    }
  }
  resources.labelFromContainer = function (input) {
    var parent = resources.container(input)
    if (parent && parent.nodeName === "LABEL" && parent.childNodes.length > 0) {
      var first = parent.childNodes[0]
      if (first.nodeType === 3) {
        return first.nodeValue ? first.nodeValue : ""
      }
    } else if (parent && parent.nodeName !== "LABEL") {
      if (parent.classList.contains("form-group") || parent.classList.contains("field")) {
        var firstChild = parent.firstChild
        if (firstChild && firstChild.nodeName === "LABEL") {
          return firstChild.innerHTML
        } else {
          return ""
        }
      } else {
        var node = parent.parentElement
        if (node && node.nodeName === "LABEL" && node.childNodes.length > 0) {
          var first = node.childNodes[0]
          if (first.nodeType === 3) {
            return first.nodeValue ? first.nodeValue : ""
          }
        }
      }
    }
    return ""
  }
  resources.container = function (ctrl) {
    var p = ctrl.parentElement
    if (!p) {
      return null
    }
    if (p.nodeName === "LABEL" || p.classList.contains("form-group") || p.classList.contains("field")) {
      return p
    } else {
      var p1 = p.parentElement
      if (!p1) {
        return null
      }
      if (p1.nodeName === "LABEL" || p1.classList.contains("form-group") || p1.classList.contains("field")) {
        return p1
      } else {
        var p2 = p1.parentElement
        if (!p2) {
          return null
        }
        if (p2.nodeName === "LABEL" || p2.classList.contains("form-group") || p2.classList.contains("field")) {
          return p2
        } else {
          var p3 = p2.parentElement
          if (!p3) {
            return null
          }
          if (p3.nodeName === "LABEL" || p3.classList.contains("form-group") || p3.classList.contains("field")) {
            return p3
          }
        }
      }
    }
    return null
  }
  resources.date = parseDate
  return resources
})()
exports.resources = resources
function findParent(ele, className) {
  var p = ele
  while (true) {
    p = p.parentElement
    if (!p) {
      return null
    }
    if (p.classList.contains(className)) {
      return p
    }
  }
}
exports.findParent = findParent
function toggleClass(ele, className) {
  if (ele.classList.contains(className)) {
    ele.classList.remove(className)
    return false
  } else {
    ele.classList.add(className)
    return true
  }
}
exports.toggleClass = toggleClass
