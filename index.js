// Created by Jonathan Eiten on 1/7/16.

'use strict';


/**
 * @summary Walk a hierarchical object as JSON.stringify does but without serializing.
 *
 * @desc Usage:
 * * var myDistilledObject = unstrungify.call(myObject);
 * * var myDistilledObject = myApi.getState(); // where myApi.prototype.getState = unstrungify
 *
 * Result equivalent to `JSON.parse(JSON.stringify(this))`.
 *
 * > Do not use this function to get a JSON string; use `JSON.stringify(this)` instead.
 *
 * @this {*|object|*[]} - Object to walk; typically an object or array.
 *
 * @param {boolean} [options.preserve=false] - Preserve undefined array elements as `null`s.
 * Use this when precise index matters (not merely the order of the elements).
 *
 * @returns {object} - Distilled object.
 */
function unstrungify(options) {
    var clone, value,
        object = (typeof this.toJSON === 'function') ? this.toJSON() : this,
        preserve = options && options.preserve;

    if (unstrungify.isArray(object)) {
        clone = [];
        object.forEach(function(obj) {
            value = unstrungify.call(obj);
            if (value !== undefined) {
                clone.push(value);
            } else if (preserve) {
                clone.push(null); // undefined not a valid JSON value
            }
        });
    } else  if (typeof object === 'object') {
        clone = {};
        Object.keys(object).forEach(function(key) {
            value = unstrungify.call(object[key]);
            if (value !== undefined) {
                clone[key] = value;
            }
        });
    } else {
        clone = object;
    }

    return clone;
}

/**
 * Very fast array test.
 * For cross-frame scripting; use `crossFramesIsArray` instead.
 * @param {*} arr - The object to test.
 * @returns {boolean}
 */
function isArray(arr) { return arr.constructor === Array; }
unstrungify.isArray = isArray;

var toString = Object.prototype.toString, arrString = '[object Array]';

/**
 * Very slow array test. Suitable for cross-frame scripting.
 *
 * Suggestion: If you need this and have jQuery loaded, use `jQuery.isArray` instead which is reasonably fast.
 *
 * @param {*} arr - The object to test.
 * @returns {boolean}
 */
function crossFramesIsArray(arr) { return toString.call(arr) === arrString; } // eslint-disable-line no-unused-vars

module.exports = unstrungify;
