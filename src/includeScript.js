'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (_ref) {
    var t = _ref.types;

    return {
        visitor: {
            CallExpression: function CallExpression(p, state) {
                var name = p.node.callee.name;
                var args = p.node.arguments;

                if (name === "includeScript") {
                    // Get the path of file
                    var filename = this.file.parserOpts.sourceFileName || this.file.parserOpts.filename;

                    // Settings
                    var root = _path2.default.dirname(filename);
                    var encoding = 'utf8';

                    // Require first arg to be string
                    t.assertStringLiteral(args[0]);

                    // Error if filename is not found
                    if (filename === undefined || filename === "unknown") throw new Error("`includeScript` function called outside of file");

                    // Generate and locate the file
                    var fileRelPath = args[0].value; // Get literal string value
                    var filePath = _path2.default.join(root, fileRelPath);
                    var fileSrc = _fs2.default.readFileSync(filePath, { encoding: encoding });

                    // Convert from a buffer to a string if so
                    if (fileSrc instanceof Buffer) fileSrc = fileSrc.toString(encoding);

                    p.replaceWithSourceString( fileSrc.replace(/;\s*$/, '') );
                }
            }
        }
    };
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
