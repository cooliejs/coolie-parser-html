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
            '<!-- coolie -->' +
            'hello' +
            '<link href="style.css">' +
            '<!-- /coolie -->' +
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

    it('<script>', function () {
        var html = '<script>\n' +
            '// <a>a标签</a>\n' +
            '/* 注释 */\n' +
            '<!-- 注释 -->\n' +
            'var abc = 1;\n' +
            '</script>';
        var ast = parser(html);
    });

    it('<style>', function () {
        var html = '<style>\n' +
            '/* 注释 */\n' +
            '<!-- 注释 -->\n' +
            'body {\n' +
            '\t\tfont-size: 30px;\n' +
            '}\n' +
            '</style>';
        var ast = parser(html);
    });
});

