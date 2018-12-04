/**
 * html parser
 * @author ydr.me
 * @create 2018-12-04 09:45:08
 * @update 2018-12-04 09:45:08
 */


'use strict';

var object = require('blear.utils.object');

var lib = require('../htmlparser2/index');

var defaults = {};

/**
 * html parser
 * @param html {String} html 文本
 * @param [options] {object} 配置
 * @returns {Array}
 */
module.exports = function (html, options) {
    options = object.assign({}, defaults, options);
    options.lowerCaseTags = false;
    options.lowerCaseAttributeNames = false;
    var ast = lib.parseDOM(html, options);
    ast.html = html;
    return ast;
};


