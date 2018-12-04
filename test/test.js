/**
 * boolean-attribute
 * @author ydr.me
 * @create 2018-12-04 09:20:11
 * @update 2018-12-04 09:20:11
 */


'use strict';

var parser = require('../src/index');

describe('测试', function () {
    it('属性', function () {
        var html = '<TEXTAREA rows="10" cols=\'20\' disabled data-group-ABC=123 id="a"class="b">' +
            '<script>abc</script>' +
            '<style>def</style>' +
            '</TEXTAREA>' +
            '<a :php1 :php2></a>';
        var ast = parser(html);
    });

    it('空白', function () {
        var html = '   \n\t\t\n   a   \n\t\t\n   b   \n\t\t\n   <a>   \n\t\t\n   c   \n\t\t\n   </a>   \n\t\t\n   ';
        var ast = parser(html);
    });

    it('注释', function () {
        var html = '' +
            '<!-- 单行注释 -->' +
            '<!-- 多\n行\n注\n释 -->' +
            '';
        var ast = parser(html);
    });

    it('文档声明', function () {
        var html = '<!doctype html>';
        var ast = parser(html);
    });

    it('<template>', function () {
        var html = '<template>' +
            '<textarea>' +
            '<script>' +
            'hello' +
            '</script>' +
            '</textarea>' +
            '</template>';
        var ast = parser(html);
    });
});

