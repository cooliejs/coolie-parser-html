/**
 * boolean-attribute
 * @author ydr.me
 * @create 2018-12-04 09:20:11
 * @update 2018-12-04 09:20:11
 */


'use strict';

var parser = require('../src/index');

describe('test', function () {
    var html = '<TEXTAREA rows="10" cols=\'20\' disabled data-group-ABC=123 id="a"class="b"></TEXTAREA>';
    var ast = parser(html);

});

