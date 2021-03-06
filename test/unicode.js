var htmlparser2 = require("../htmlparser2/index");
var assert = require("assert");

describe("WritableStream", function() {
    it("should decode fragmented unicode characters", function() {
        var processed = false;
        var stream = new htmlparser2.WritableStream({
            ontext: function(text) {
                assert.equal(text, "€");
                processed = true;
            }
        });

        stream.write(new Buffer([0xe2, 0x82]));
        stream.write(new Buffer([0xac]));
        stream.end();

        assert(processed);
    });
});
