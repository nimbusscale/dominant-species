import {
  __awaiter,
  __generator
} from "./chunk-3GILONGS.js";
import {
  __async,
  __asyncGenerator,
  __await,
  __commonJS,
  __objRest,
  __spreadProps,
  __spreadValues,
  __toESM
} from "./chunk-MJNJUWOE.js";

// ../../node_modules/fast-xml-parser/src/util.js
var require_util = __commonJS({
  "../../node_modules/fast-xml-parser/src/util.js"(exports) {
    "use strict";
    var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    var regexName = new RegExp("^" + nameRegexp + "$");
    var getAllMatches = function(string, regex) {
      const matches = [];
      let match = regex.exec(string);
      while (match) {
        const allmatches = [];
        allmatches.startIndex = regex.lastIndex - match[0].length;
        const len = match.length;
        for (let index = 0; index < len; index++) {
          allmatches.push(match[index]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
      }
      return matches;
    };
    var isName = function(string) {
      const match = regexName.exec(string);
      return !(match === null || typeof match === "undefined");
    };
    exports.isExist = function(v2) {
      return typeof v2 !== "undefined";
    };
    exports.isEmptyObject = function(obj) {
      return Object.keys(obj).length === 0;
    };
    exports.merge = function(target, a2, arrayMode) {
      if (a2) {
        const keys = Object.keys(a2);
        const len = keys.length;
        for (let i2 = 0; i2 < len; i2++) {
          if (arrayMode === "strict") {
            target[keys[i2]] = [a2[keys[i2]]];
          } else {
            target[keys[i2]] = a2[keys[i2]];
          }
        }
      }
    };
    exports.getValue = function(v2) {
      if (exports.isExist(v2)) {
        return v2;
      } else {
        return "";
      }
    };
    exports.isName = isName;
    exports.getAllMatches = getAllMatches;
    exports.nameRegexp = nameRegexp;
  }
});

// ../../node_modules/fast-xml-parser/src/validator.js
var require_validator = __commonJS({
  "../../node_modules/fast-xml-parser/src/validator.js"(exports) {
    "use strict";
    var util = require_util();
    var defaultOptions = {
      allowBooleanAttributes: false,
      //A tag can have attributes without any value
      unpairedTags: []
    };
    exports.validate = function(xmlData, options) {
      options = Object.assign({}, defaultOptions, options);
      const tags = [];
      let tagFound = false;
      let reachedRoot = false;
      if (xmlData[0] === "\uFEFF") {
        xmlData = xmlData.substr(1);
      }
      for (let i2 = 0; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === "<" && xmlData[i2 + 1] === "?") {
          i2 += 2;
          i2 = readPI(xmlData, i2);
          if (i2.err) return i2;
        } else if (xmlData[i2] === "<") {
          let tagStartPos = i2;
          i2++;
          if (xmlData[i2] === "!") {
            i2 = readCommentAndCDATA(xmlData, i2);
            continue;
          } else {
            let closingTag = false;
            if (xmlData[i2] === "/") {
              closingTag = true;
              i2++;
            }
            let tagName = "";
            for (; i2 < xmlData.length && xmlData[i2] !== ">" && xmlData[i2] !== " " && xmlData[i2] !== "	" && xmlData[i2] !== "\n" && xmlData[i2] !== "\r"; i2++) {
              tagName += xmlData[i2];
            }
            tagName = tagName.trim();
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substring(0, tagName.length - 1);
              i2--;
            }
            if (!validateTagName(tagName)) {
              let msg;
              if (tagName.trim().length === 0) {
                msg = "Invalid space after '<'.";
              } else {
                msg = "Tag '" + tagName + "' is an invalid name.";
              }
              return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i2));
            }
            const result = readAttributeStr(xmlData, i2);
            if (result === false) {
              return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i2));
            }
            let attrStr = result.value;
            i2 = result.index;
            if (attrStr[attrStr.length - 1] === "/") {
              const attrStrStart = i2 - attrStr.length;
              attrStr = attrStr.substring(0, attrStr.length - 1);
              const isValid = validateAttributeString(attrStr, options);
              if (isValid === true) {
                tagFound = true;
              } else {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
              }
            } else if (closingTag) {
              if (!result.tagClosed) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i2));
              } else if (attrStr.trim().length > 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
              } else if (tags.length === 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
              } else {
                const otg = tags.pop();
                if (tagName !== otg.tagName) {
                  let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                  return getErrorObject("InvalidTag", "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.", getLineNumberForPosition(xmlData, tagStartPos));
                }
                if (tags.length == 0) {
                  reachedRoot = true;
                }
              }
            } else {
              const isValid = validateAttributeString(attrStr, options);
              if (isValid !== true) {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i2 - attrStr.length + isValid.err.line));
              }
              if (reachedRoot === true) {
                return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i2));
              } else if (options.unpairedTags.indexOf(tagName) !== -1) {
              } else {
                tags.push({
                  tagName,
                  tagStartPos
                });
              }
              tagFound = true;
            }
            for (i2++; i2 < xmlData.length; i2++) {
              if (xmlData[i2] === "<") {
                if (xmlData[i2 + 1] === "!") {
                  i2++;
                  i2 = readCommentAndCDATA(xmlData, i2);
                  continue;
                } else if (xmlData[i2 + 1] === "?") {
                  i2 = readPI(xmlData, ++i2);
                  if (i2.err) return i2;
                } else {
                  break;
                }
              } else if (xmlData[i2] === "&") {
                const afterAmp = validateAmpersand(xmlData, i2);
                if (afterAmp == -1) return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i2));
                i2 = afterAmp;
              } else {
                if (reachedRoot === true && !isWhiteSpace(xmlData[i2])) {
                  return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i2));
                }
              }
            }
            if (xmlData[i2] === "<") {
              i2--;
            }
          }
        } else {
          if (isWhiteSpace(xmlData[i2])) {
            continue;
          }
          return getErrorObject("InvalidChar", "char '" + xmlData[i2] + "' is not expected.", getLineNumberForPosition(xmlData, i2));
        }
      }
      if (!tagFound) {
        return getErrorObject("InvalidXml", "Start tag expected.", 1);
      } else if (tags.length == 1) {
        return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
      } else if (tags.length > 0) {
        return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t2) => t2.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", {
          line: 1,
          col: 1
        });
      }
      return true;
    };
    function isWhiteSpace(char) {
      return char === " " || char === "	" || char === "\n" || char === "\r";
    }
    function readPI(xmlData, i2) {
      const start = i2;
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] == "?" || xmlData[i2] == " ") {
          const tagname = xmlData.substr(start, i2 - start);
          if (i2 > 5 && tagname === "xml") {
            return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i2));
          } else if (xmlData[i2] == "?" && xmlData[i2 + 1] == ">") {
            i2++;
            break;
          } else {
            continue;
          }
        }
      }
      return i2;
    }
    function readCommentAndCDATA(xmlData, i2) {
      if (xmlData.length > i2 + 5 && xmlData[i2 + 1] === "-" && xmlData[i2 + 2] === "-") {
        for (i2 += 3; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "-" && xmlData[i2 + 1] === "-" && xmlData[i2 + 2] === ">") {
            i2 += 2;
            break;
          }
        }
      } else if (xmlData.length > i2 + 8 && xmlData[i2 + 1] === "D" && xmlData[i2 + 2] === "O" && xmlData[i2 + 3] === "C" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "Y" && xmlData[i2 + 6] === "P" && xmlData[i2 + 7] === "E") {
        let angleBracketsCount = 1;
        for (i2 += 8; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "<") {
            angleBracketsCount++;
          } else if (xmlData[i2] === ">") {
            angleBracketsCount--;
            if (angleBracketsCount === 0) {
              break;
            }
          }
        }
      } else if (xmlData.length > i2 + 9 && xmlData[i2 + 1] === "[" && xmlData[i2 + 2] === "C" && xmlData[i2 + 3] === "D" && xmlData[i2 + 4] === "A" && xmlData[i2 + 5] === "T" && xmlData[i2 + 6] === "A" && xmlData[i2 + 7] === "[") {
        for (i2 += 8; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "]" && xmlData[i2 + 1] === "]" && xmlData[i2 + 2] === ">") {
            i2 += 2;
            break;
          }
        }
      }
      return i2;
    }
    var doubleQuote = '"';
    var singleQuote = "'";
    function readAttributeStr(xmlData, i2) {
      let attrStr = "";
      let startChar = "";
      let tagClosed = false;
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === doubleQuote || xmlData[i2] === singleQuote) {
          if (startChar === "") {
            startChar = xmlData[i2];
          } else if (startChar !== xmlData[i2]) {
          } else {
            startChar = "";
          }
        } else if (xmlData[i2] === ">") {
          if (startChar === "") {
            tagClosed = true;
            break;
          }
        }
        attrStr += xmlData[i2];
      }
      if (startChar !== "") {
        return false;
      }
      return {
        value: attrStr,
        index: i2,
        tagClosed
      };
    }
    var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
    function validateAttributeString(attrStr, options) {
      const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
      const attrNames = {};
      for (let i2 = 0; i2 < matches.length; i2++) {
        if (matches[i2][1].length === 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i2][2] + "' has no space in starting.", getPositionFromMatch(matches[i2]));
        } else if (matches[i2][3] !== void 0 && matches[i2][4] === void 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i2][2] + "' is without value.", getPositionFromMatch(matches[i2]));
        } else if (matches[i2][3] === void 0 && !options.allowBooleanAttributes) {
          return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i2][2] + "' is not allowed.", getPositionFromMatch(matches[i2]));
        }
        const attrName = matches[i2][2];
        if (!validateAttrName(attrName)) {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i2]));
        }
        if (!attrNames.hasOwnProperty(attrName)) {
          attrNames[attrName] = 1;
        } else {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i2]));
        }
      }
      return true;
    }
    function validateNumberAmpersand(xmlData, i2) {
      let re = /\d/;
      if (xmlData[i2] === "x") {
        i2++;
        re = /[\da-fA-F]/;
      }
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === ";") return i2;
        if (!xmlData[i2].match(re)) break;
      }
      return -1;
    }
    function validateAmpersand(xmlData, i2) {
      i2++;
      if (xmlData[i2] === ";") return -1;
      if (xmlData[i2] === "#") {
        i2++;
        return validateNumberAmpersand(xmlData, i2);
      }
      let count = 0;
      for (; i2 < xmlData.length; i2++, count++) {
        if (xmlData[i2].match(/\w/) && count < 20) continue;
        if (xmlData[i2] === ";") break;
        return -1;
      }
      return i2;
    }
    function getErrorObject(code, message, lineNumber) {
      return {
        err: {
          code,
          msg: message,
          line: lineNumber.line || lineNumber,
          col: lineNumber.col
        }
      };
    }
    function validateAttrName(attrName) {
      return util.isName(attrName);
    }
    function validateTagName(tagname) {
      return util.isName(tagname);
    }
    function getLineNumberForPosition(xmlData, index) {
      const lines = xmlData.substring(0, index).split(/\r?\n/);
      return {
        line: lines.length,
        // column number is last line's length + 1, because column numbering starts at 1:
        col: lines[lines.length - 1].length + 1
      };
    }
    function getPositionFromMatch(match) {
      return match.startIndex + match[1].length;
    }
  }
});

// ../../node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
var require_OptionsBuilder = __commonJS({
  "../../node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js"(exports) {
    var defaultOptions = {
      preserveOrder: false,
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      removeNSPrefix: false,
      // remove NS from tag name or attribute name if true
      allowBooleanAttributes: false,
      //a tag can have attributes without any value
      //ignoreRootElement : false,
      parseTagValue: true,
      parseAttributeValue: false,
      trimValues: true,
      //Trim string values of tag and attributes
      cdataPropName: false,
      numberParseOptions: {
        hex: true,
        leadingZeros: true,
        eNotation: true
      },
      tagValueProcessor: function(tagName, val2) {
        return val2;
      },
      attributeValueProcessor: function(attrName, val2) {
        return val2;
      },
      stopNodes: [],
      //nested tags will not be parsed even for errors
      alwaysCreateTextNode: false,
      isArray: () => false,
      commentPropName: false,
      unpairedTags: [],
      processEntities: true,
      htmlEntities: false,
      ignoreDeclaration: false,
      ignorePiTags: false,
      transformTagName: false,
      transformAttributeName: false,
      updateTag: function(tagName, jPath, attrs) {
        return tagName;
      }
      // skipEmptyListItem: false
    };
    var buildOptions = function(options) {
      return Object.assign({}, defaultOptions, options);
    };
    exports.buildOptions = buildOptions;
    exports.defaultOptions = defaultOptions;
  }
});

// ../../node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
var require_xmlNode = __commonJS({
  "../../node_modules/fast-xml-parser/src/xmlparser/xmlNode.js"(exports, module) {
    "use strict";
    var XmlNode = class {
      constructor(tagname) {
        this.tagname = tagname;
        this.child = [];
        this[":@"] = {};
      }
      add(key, val2) {
        if (key === "__proto__") key = "#__proto__";
        this.child.push({
          [key]: val2
        });
      }
      addChild(node) {
        if (node.tagname === "__proto__") node.tagname = "#__proto__";
        if (node[":@"] && Object.keys(node[":@"]).length > 0) {
          this.child.push({
            [node.tagname]: node.child,
            [":@"]: node[":@"]
          });
        } else {
          this.child.push({
            [node.tagname]: node.child
          });
        }
      }
    };
    module.exports = XmlNode;
  }
});

// ../../node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
var require_DocTypeReader = __commonJS({
  "../../node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js"(exports, module) {
    var util = require_util();
    function readDocType(xmlData, i2) {
      const entities = {};
      if (xmlData[i2 + 3] === "O" && xmlData[i2 + 4] === "C" && xmlData[i2 + 5] === "T" && xmlData[i2 + 6] === "Y" && xmlData[i2 + 7] === "P" && xmlData[i2 + 8] === "E") {
        i2 = i2 + 9;
        let angleBracketsCount = 1;
        let hasBody = false, comment = false;
        let exp = "";
        for (; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "<" && !comment) {
            if (hasBody && isEntity(xmlData, i2)) {
              i2 += 7;
              [entityName, val, i2] = readEntityExp(xmlData, i2 + 1);
              if (val.indexOf("&") === -1)
                entities[validateEntityName(entityName)] = {
                  regx: RegExp(`&${entityName};`, "g"),
                  val
                };
            } else if (hasBody && isElement(xmlData, i2)) i2 += 8;
            else if (hasBody && isAttlist(xmlData, i2)) i2 += 8;
            else if (hasBody && isNotation(xmlData, i2)) i2 += 9;
            else if (isComment) comment = true;
            else throw new Error("Invalid DOCTYPE");
            angleBracketsCount++;
            exp = "";
          } else if (xmlData[i2] === ">") {
            if (comment) {
              if (xmlData[i2 - 1] === "-" && xmlData[i2 - 2] === "-") {
                comment = false;
                angleBracketsCount--;
              }
            } else {
              angleBracketsCount--;
            }
            if (angleBracketsCount === 0) {
              break;
            }
          } else if (xmlData[i2] === "[") {
            hasBody = true;
          } else {
            exp += xmlData[i2];
          }
        }
        if (angleBracketsCount !== 0) {
          throw new Error(`Unclosed DOCTYPE`);
        }
      } else {
        throw new Error(`Invalid Tag instead of DOCTYPE`);
      }
      return {
        entities,
        i: i2
      };
    }
    function readEntityExp(xmlData, i2) {
      let entityName2 = "";
      for (; i2 < xmlData.length && xmlData[i2] !== "'" && xmlData[i2] !== '"'; i2++) {
        entityName2 += xmlData[i2];
      }
      entityName2 = entityName2.trim();
      if (entityName2.indexOf(" ") !== -1) throw new Error("External entites are not supported");
      const startChar = xmlData[i2++];
      let val2 = "";
      for (; i2 < xmlData.length && xmlData[i2] !== startChar; i2++) {
        val2 += xmlData[i2];
      }
      return [entityName2, val2, i2];
    }
    function isComment(xmlData, i2) {
      if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "-" && xmlData[i2 + 3] === "-") return true;
      return false;
    }
    function isEntity(xmlData, i2) {
      if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "E" && xmlData[i2 + 3] === "N" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "I" && xmlData[i2 + 6] === "T" && xmlData[i2 + 7] === "Y") return true;
      return false;
    }
    function isElement(xmlData, i2) {
      if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "E" && xmlData[i2 + 3] === "L" && xmlData[i2 + 4] === "E" && xmlData[i2 + 5] === "M" && xmlData[i2 + 6] === "E" && xmlData[i2 + 7] === "N" && xmlData[i2 + 8] === "T") return true;
      return false;
    }
    function isAttlist(xmlData, i2) {
      if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "A" && xmlData[i2 + 3] === "T" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "L" && xmlData[i2 + 6] === "I" && xmlData[i2 + 7] === "S" && xmlData[i2 + 8] === "T") return true;
      return false;
    }
    function isNotation(xmlData, i2) {
      if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "N" && xmlData[i2 + 3] === "O" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "A" && xmlData[i2 + 6] === "T" && xmlData[i2 + 7] === "I" && xmlData[i2 + 8] === "O" && xmlData[i2 + 9] === "N") return true;
      return false;
    }
    function validateEntityName(name) {
      if (util.isName(name)) return name;
      else throw new Error(`Invalid entity name ${name}`);
    }
    module.exports = readDocType;
  }
});

// ../../node_modules/strnum/strnum.js
var require_strnum = __commonJS({
  "../../node_modules/strnum/strnum.js"(exports, module) {
    var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
    var numRegex = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
    if (!Number.parseInt && window.parseInt) {
      Number.parseInt = window.parseInt;
    }
    if (!Number.parseFloat && window.parseFloat) {
      Number.parseFloat = window.parseFloat;
    }
    var consider = {
      hex: true,
      leadingZeros: true,
      decimalPoint: ".",
      eNotation: true
      //skipLike: /regex/
    };
    function toNumber(str, options = {}) {
      options = Object.assign({}, consider, options);
      if (!str || typeof str !== "string") return str;
      let trimmedStr = str.trim();
      if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str;
      else if (options.hex && hexRegex.test(trimmedStr)) {
        return Number.parseInt(trimmedStr, 16);
      } else {
        const match = numRegex.exec(trimmedStr);
        if (match) {
          const sign = match[1];
          const leadingZeros = match[2];
          let numTrimmedByZeros = trimZeros(match[3]);
          const eNotation = match[4] || match[6];
          if (!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".") return str;
          else if (!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".") return str;
          else {
            const num = Number(trimmedStr);
            const numStr = "" + num;
            if (numStr.search(/[eE]/) !== -1) {
              if (options.eNotation) return num;
              else return str;
            } else if (eNotation) {
              if (options.eNotation) return num;
              else return str;
            } else if (trimmedStr.indexOf(".") !== -1) {
              if (numStr === "0" && numTrimmedByZeros === "") return num;
              else if (numStr === numTrimmedByZeros) return num;
              else if (sign && numStr === "-" + numTrimmedByZeros) return num;
              else return str;
            }
            if (leadingZeros) {
              if (numTrimmedByZeros === numStr) return num;
              else if (sign + numTrimmedByZeros === numStr) return num;
              else return str;
            }
            if (trimmedStr === numStr) return num;
            else if (trimmedStr === sign + numStr) return num;
            return str;
          }
        } else {
          return str;
        }
      }
    }
    function trimZeros(numStr) {
      if (numStr && numStr.indexOf(".") !== -1) {
        numStr = numStr.replace(/0+$/, "");
        if (numStr === ".") numStr = "0";
        else if (numStr[0] === ".") numStr = "0" + numStr;
        else if (numStr[numStr.length - 1] === ".") numStr = numStr.substr(0, numStr.length - 1);
        return numStr;
      }
      return numStr;
    }
    module.exports = toNumber;
  }
});

// ../../node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
var require_OrderedObjParser = __commonJS({
  "../../node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js"(exports, module) {
    "use strict";
    var util = require_util();
    var xmlNode = require_xmlNode();
    var readDocType = require_DocTypeReader();
    var toNumber = require_strnum();
    var OrderedObjParser = class {
      constructor(options) {
        this.options = options;
        this.currentNode = null;
        this.tagsNodeStack = [];
        this.docTypeEntities = {};
        this.lastEntities = {
          "apos": {
            regex: /&(apos|#39|#x27);/g,
            val: "'"
          },
          "gt": {
            regex: /&(gt|#62|#x3E);/g,
            val: ">"
          },
          "lt": {
            regex: /&(lt|#60|#x3C);/g,
            val: "<"
          },
          "quot": {
            regex: /&(quot|#34|#x22);/g,
            val: '"'
          }
        };
        this.ampEntity = {
          regex: /&(amp|#38|#x26);/g,
          val: "&"
        };
        this.htmlEntities = {
          "space": {
            regex: /&(nbsp|#160);/g,
            val: " "
          },
          // "lt" : { regex: /&(lt|#60);/g, val: "<" },
          // "gt" : { regex: /&(gt|#62);/g, val: ">" },
          // "amp" : { regex: /&(amp|#38);/g, val: "&" },
          // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
          // "apos" : { regex: /&(apos|#39);/g, val: "'" },
          "cent": {
            regex: /&(cent|#162);/g,
            val: "¢"
          },
          "pound": {
            regex: /&(pound|#163);/g,
            val: "£"
          },
          "yen": {
            regex: /&(yen|#165);/g,
            val: "¥"
          },
          "euro": {
            regex: /&(euro|#8364);/g,
            val: "€"
          },
          "copyright": {
            regex: /&(copy|#169);/g,
            val: "©"
          },
          "reg": {
            regex: /&(reg|#174);/g,
            val: "®"
          },
          "inr": {
            regex: /&(inr|#8377);/g,
            val: "₹"
          },
          "num_dec": {
            regex: /&#([0-9]{1,7});/g,
            val: (_, str) => String.fromCharCode(Number.parseInt(str, 10))
          },
          "num_hex": {
            regex: /&#x([0-9a-fA-F]{1,6});/g,
            val: (_, str) => String.fromCharCode(Number.parseInt(str, 16))
          }
        };
        this.addExternalEntities = addExternalEntities;
        this.parseXml = parseXml;
        this.parseTextData = parseTextData;
        this.resolveNameSpace = resolveNameSpace;
        this.buildAttributesMap = buildAttributesMap;
        this.isItStopNode = isItStopNode;
        this.replaceEntitiesValue = replaceEntitiesValue;
        this.readStopNodeData = readStopNodeData;
        this.saveTextToParentTag = saveTextToParentTag;
        this.addChild = addChild;
      }
    };
    function addExternalEntities(externalEntities) {
      const entKeys = Object.keys(externalEntities);
      for (let i2 = 0; i2 < entKeys.length; i2++) {
        const ent = entKeys[i2];
        this.lastEntities[ent] = {
          regex: new RegExp("&" + ent + ";", "g"),
          val: externalEntities[ent]
        };
      }
    }
    function parseTextData(val2, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
      if (val2 !== void 0) {
        if (this.options.trimValues && !dontTrim) {
          val2 = val2.trim();
        }
        if (val2.length > 0) {
          if (!escapeEntities) val2 = this.replaceEntitiesValue(val2);
          const newval = this.options.tagValueProcessor(tagName, val2, jPath, hasAttributes, isLeafNode);
          if (newval === null || newval === void 0) {
            return val2;
          } else if (typeof newval !== typeof val2 || newval !== val2) {
            return newval;
          } else if (this.options.trimValues) {
            return parseValue(val2, this.options.parseTagValue, this.options.numberParseOptions);
          } else {
            const trimmedVal = val2.trim();
            if (trimmedVal === val2) {
              return parseValue(val2, this.options.parseTagValue, this.options.numberParseOptions);
            } else {
              return val2;
            }
          }
        }
      }
    }
    function resolveNameSpace(tagname) {
      if (this.options.removeNSPrefix) {
        const tags = tagname.split(":");
        const prefix = tagname.charAt(0) === "/" ? "/" : "";
        if (tags[0] === "xmlns") {
          return "";
        }
        if (tags.length === 2) {
          tagname = prefix + tags[1];
        }
      }
      return tagname;
    }
    var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
    function buildAttributesMap(attrStr, jPath, tagName) {
      if (!this.options.ignoreAttributes && typeof attrStr === "string") {
        const matches = util.getAllMatches(attrStr, attrsRegx);
        const len = matches.length;
        const attrs = {};
        for (let i2 = 0; i2 < len; i2++) {
          const attrName = this.resolveNameSpace(matches[i2][1]);
          let oldVal = matches[i2][4];
          let aName = this.options.attributeNamePrefix + attrName;
          if (attrName.length) {
            if (this.options.transformAttributeName) {
              aName = this.options.transformAttributeName(aName);
            }
            if (aName === "__proto__") aName = "#__proto__";
            if (oldVal !== void 0) {
              if (this.options.trimValues) {
                oldVal = oldVal.trim();
              }
              oldVal = this.replaceEntitiesValue(oldVal);
              const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
              if (newVal === null || newVal === void 0) {
                attrs[aName] = oldVal;
              } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
                attrs[aName] = newVal;
              } else {
                attrs[aName] = parseValue(oldVal, this.options.parseAttributeValue, this.options.numberParseOptions);
              }
            } else if (this.options.allowBooleanAttributes) {
              attrs[aName] = true;
            }
          }
        }
        if (!Object.keys(attrs).length) {
          return;
        }
        if (this.options.attributesGroupName) {
          const attrCollection = {};
          attrCollection[this.options.attributesGroupName] = attrs;
          return attrCollection;
        }
        return attrs;
      }
    }
    var parseXml = function(xmlData) {
      xmlData = xmlData.replace(/\r\n?/g, "\n");
      const xmlObj = new xmlNode("!xml");
      let currentNode = xmlObj;
      let textData = "";
      let jPath = "";
      for (let i2 = 0; i2 < xmlData.length; i2++) {
        const ch = xmlData[i2];
        if (ch === "<") {
          if (xmlData[i2 + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i2, "Closing Tag is not closed.");
            let tagName = xmlData.substring(i2 + 2, closeIndex).trim();
            if (this.options.removeNSPrefix) {
              const colonIndex = tagName.indexOf(":");
              if (colonIndex !== -1) {
                tagName = tagName.substr(colonIndex + 1);
              }
            }
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode) {
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
            }
            const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
            if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
              throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
            }
            let propIndex = 0;
            if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
              propIndex = jPath.lastIndexOf(".", jPath.lastIndexOf(".") - 1);
              this.tagsNodeStack.pop();
            } else {
              propIndex = jPath.lastIndexOf(".");
            }
            jPath = jPath.substring(0, propIndex);
            currentNode = this.tagsNodeStack.pop();
            textData = "";
            i2 = closeIndex;
          } else if (xmlData[i2 + 1] === "?") {
            let tagData = readTagExp(xmlData, i2, false, "?>");
            if (!tagData) throw new Error("Pi Tag is not closed.");
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) {
            } else {
              const childNode = new xmlNode(tagData.tagName);
              childNode.add(this.options.textNodeName, "");
              if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
              }
              this.addChild(currentNode, childNode, jPath);
            }
            i2 = tagData.closeIndex + 1;
          } else if (xmlData.substr(i2 + 1, 3) === "!--") {
            const endIndex = findClosingIndex(xmlData, "-->", i2 + 4, "Comment is not closed.");
            if (this.options.commentPropName) {
              const comment = xmlData.substring(i2 + 4, endIndex - 2);
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
              currentNode.add(this.options.commentPropName, [{
                [this.options.textNodeName]: comment
              }]);
            }
            i2 = endIndex;
          } else if (xmlData.substr(i2 + 1, 2) === "!D") {
            const result = readDocType(xmlData, i2);
            this.docTypeEntities = result.entities;
            i2 = result.i;
          } else if (xmlData.substr(i2 + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i2, "CDATA is not closed.") - 2;
            const tagExp = xmlData.substring(i2 + 9, closeIndex);
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            let val2 = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true, true);
            if (val2 == void 0) val2 = "";
            if (this.options.cdataPropName) {
              currentNode.add(this.options.cdataPropName, [{
                [this.options.textNodeName]: tagExp
              }]);
            } else {
              currentNode.add(this.options.textNodeName, val2);
            }
            i2 = closeIndex + 2;
          } else {
            let result = readTagExp(xmlData, i2, this.options.removeNSPrefix);
            let tagName = result.tagName;
            const rawTagName = result.rawTagName;
            let tagExp = result.tagExp;
            let attrExpPresent = result.attrExpPresent;
            let closeIndex = result.closeIndex;
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode && textData) {
              if (currentNode.tagname !== "!xml") {
                textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
              }
            }
            const lastTag = currentNode;
            if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
              currentNode = this.tagsNodeStack.pop();
              jPath = jPath.substring(0, jPath.lastIndexOf("."));
            }
            if (tagName !== xmlObj.tagname) {
              jPath += jPath ? "." + tagName : tagName;
            }
            if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) {
              let tagContent = "";
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  jPath = jPath.substr(0, jPath.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                i2 = result.closeIndex;
              } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
                i2 = result.closeIndex;
              } else {
                const result2 = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
                if (!result2) throw new Error(`Unexpected end of ${rawTagName}`);
                i2 = result2.i;
                tagContent = result2.tagContent;
              }
              const childNode = new xmlNode(tagName);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              if (tagContent) {
                tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
              }
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
              childNode.add(this.options.textNodeName, tagContent);
              this.addChild(currentNode, childNode, jPath);
            } else {
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  jPath = jPath.substr(0, jPath.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                if (this.options.transformTagName) {
                  tagName = this.options.transformTagName(tagName);
                }
                const childNode = new xmlNode(tagName);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath);
                jPath = jPath.substr(0, jPath.lastIndexOf("."));
              } else {
                const childNode = new xmlNode(tagName);
                this.tagsNodeStack.push(currentNode);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath);
                currentNode = childNode;
              }
              textData = "";
              i2 = closeIndex;
            }
          }
        } else {
          textData += xmlData[i2];
        }
      }
      return xmlObj.child;
    };
    function addChild(currentNode, childNode, jPath) {
      const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
      if (result === false) {
      } else if (typeof result === "string") {
        childNode.tagname = result;
        currentNode.addChild(childNode);
      } else {
        currentNode.addChild(childNode);
      }
    }
    var replaceEntitiesValue = function(val2) {
      if (this.options.processEntities) {
        for (let entityName2 in this.docTypeEntities) {
          const entity = this.docTypeEntities[entityName2];
          val2 = val2.replace(entity.regx, entity.val);
        }
        for (let entityName2 in this.lastEntities) {
          const entity = this.lastEntities[entityName2];
          val2 = val2.replace(entity.regex, entity.val);
        }
        if (this.options.htmlEntities) {
          for (let entityName2 in this.htmlEntities) {
            const entity = this.htmlEntities[entityName2];
            val2 = val2.replace(entity.regex, entity.val);
          }
        }
        val2 = val2.replace(this.ampEntity.regex, this.ampEntity.val);
      }
      return val2;
    };
    function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
      if (textData) {
        if (isLeafNode === void 0) isLeafNode = Object.keys(currentNode.child).length === 0;
        textData = this.parseTextData(textData, currentNode.tagname, jPath, false, currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false, isLeafNode);
        if (textData !== void 0 && textData !== "") currentNode.add(this.options.textNodeName, textData);
        textData = "";
      }
      return textData;
    }
    function isItStopNode(stopNodes, jPath, currentTagName) {
      const allNodesExp = "*." + currentTagName;
      for (const stopNodePath in stopNodes) {
        const stopNodeExp = stopNodes[stopNodePath];
        if (allNodesExp === stopNodeExp || jPath === stopNodeExp) return true;
      }
      return false;
    }
    function tagExpWithClosingIndex(xmlData, i2, closingChar = ">") {
      let attrBoundary;
      let tagExp = "";
      for (let index = i2; index < xmlData.length; index++) {
        let ch = xmlData[index];
        if (attrBoundary) {
          if (ch === attrBoundary) attrBoundary = "";
        } else if (ch === '"' || ch === "'") {
          attrBoundary = ch;
        } else if (ch === closingChar[0]) {
          if (closingChar[1]) {
            if (xmlData[index + 1] === closingChar[1]) {
              return {
                data: tagExp,
                index
              };
            }
          } else {
            return {
              data: tagExp,
              index
            };
          }
        } else if (ch === "	") {
          ch = " ";
        }
        tagExp += ch;
      }
    }
    function findClosingIndex(xmlData, str, i2, errMsg) {
      const closingIndex = xmlData.indexOf(str, i2);
      if (closingIndex === -1) {
        throw new Error(errMsg);
      } else {
        return closingIndex + str.length - 1;
      }
    }
    function readTagExp(xmlData, i2, removeNSPrefix, closingChar = ">") {
      const result = tagExpWithClosingIndex(xmlData, i2 + 1, closingChar);
      if (!result) return;
      let tagExp = result.data;
      const closeIndex = result.index;
      const separatorIndex = tagExp.search(/\s/);
      let tagName = tagExp;
      let attrExpPresent = true;
      if (separatorIndex !== -1) {
        tagName = tagExp.substring(0, separatorIndex);
        tagExp = tagExp.substring(separatorIndex + 1).trimStart();
      }
      const rawTagName = tagName;
      if (removeNSPrefix) {
        const colonIndex = tagName.indexOf(":");
        if (colonIndex !== -1) {
          tagName = tagName.substr(colonIndex + 1);
          attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
        }
      }
      return {
        tagName,
        tagExp,
        closeIndex,
        attrExpPresent,
        rawTagName
      };
    }
    function readStopNodeData(xmlData, tagName, i2) {
      const startIndex = i2;
      let openTagCount = 1;
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === "<") {
          if (xmlData[i2 + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i2, `${tagName} is not closed`);
            let closeTagName = xmlData.substring(i2 + 2, closeIndex).trim();
            if (closeTagName === tagName) {
              openTagCount--;
              if (openTagCount === 0) {
                return {
                  tagContent: xmlData.substring(startIndex, i2),
                  i: closeIndex
                };
              }
            }
            i2 = closeIndex;
          } else if (xmlData[i2 + 1] === "?") {
            const closeIndex = findClosingIndex(xmlData, "?>", i2 + 1, "StopNode is not closed.");
            i2 = closeIndex;
          } else if (xmlData.substr(i2 + 1, 3) === "!--") {
            const closeIndex = findClosingIndex(xmlData, "-->", i2 + 3, "StopNode is not closed.");
            i2 = closeIndex;
          } else if (xmlData.substr(i2 + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i2, "StopNode is not closed.") - 2;
            i2 = closeIndex;
          } else {
            const tagData = readTagExp(xmlData, i2, ">");
            if (tagData) {
              const openTagName = tagData && tagData.tagName;
              if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
                openTagCount++;
              }
              i2 = tagData.closeIndex;
            }
          }
        }
      }
    }
    function parseValue(val2, shouldParse, options) {
      if (shouldParse && typeof val2 === "string") {
        const newval = val2.trim();
        if (newval === "true") return true;
        else if (newval === "false") return false;
        else return toNumber(val2, options);
      } else {
        if (util.isExist(val2)) {
          return val2;
        } else {
          return "";
        }
      }
    }
    module.exports = OrderedObjParser;
  }
});

// ../../node_modules/fast-xml-parser/src/xmlparser/node2json.js
var require_node2json = __commonJS({
  "../../node_modules/fast-xml-parser/src/xmlparser/node2json.js"(exports) {
    "use strict";
    function prettify(node, options) {
      return compress(node, options);
    }
    function compress(arr, options, jPath) {
      let text;
      const compressedObj = {};
      for (let i2 = 0; i2 < arr.length; i2++) {
        const tagObj = arr[i2];
        const property = propName(tagObj);
        let newJpath = "";
        if (jPath === void 0) newJpath = property;
        else newJpath = jPath + "." + property;
        if (property === options.textNodeName) {
          if (text === void 0) text = tagObj[property];
          else text += "" + tagObj[property];
        } else if (property === void 0) {
          continue;
        } else if (tagObj[property]) {
          let val2 = compress(tagObj[property], options, newJpath);
          const isLeaf = isLeafTag(val2, options);
          if (tagObj[":@"]) {
            assignAttributes(val2, tagObj[":@"], newJpath, options);
          } else if (Object.keys(val2).length === 1 && val2[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
            val2 = val2[options.textNodeName];
          } else if (Object.keys(val2).length === 0) {
            if (options.alwaysCreateTextNode) val2[options.textNodeName] = "";
            else val2 = "";
          }
          if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
            if (!Array.isArray(compressedObj[property])) {
              compressedObj[property] = [compressedObj[property]];
            }
            compressedObj[property].push(val2);
          } else {
            if (options.isArray(property, newJpath, isLeaf)) {
              compressedObj[property] = [val2];
            } else {
              compressedObj[property] = val2;
            }
          }
        }
      }
      if (typeof text === "string") {
        if (text.length > 0) compressedObj[options.textNodeName] = text;
      } else if (text !== void 0) compressedObj[options.textNodeName] = text;
      return compressedObj;
    }
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i2 = 0; i2 < keys.length; i2++) {
        const key = keys[i2];
        if (key !== ":@") return key;
      }
    }
    function assignAttributes(obj, attrMap, jpath, options) {
      if (attrMap) {
        const keys = Object.keys(attrMap);
        const len = keys.length;
        for (let i2 = 0; i2 < len; i2++) {
          const atrrName = keys[i2];
          if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
            obj[atrrName] = [attrMap[atrrName]];
          } else {
            obj[atrrName] = attrMap[atrrName];
          }
        }
      }
    }
    function isLeafTag(obj, options) {
      const {
        textNodeName
      } = options;
      const propCount = Object.keys(obj).length;
      if (propCount === 0) {
        return true;
      }
      if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
        return true;
      }
      return false;
    }
    exports.prettify = prettify;
  }
});

// ../../node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
var require_XMLParser = __commonJS({
  "../../node_modules/fast-xml-parser/src/xmlparser/XMLParser.js"(exports, module) {
    var {
      buildOptions
    } = require_OptionsBuilder();
    var OrderedObjParser = require_OrderedObjParser();
    var {
      prettify
    } = require_node2json();
    var validator = require_validator();
    var XMLParser2 = class {
      constructor(options) {
        this.externalEntities = {};
        this.options = buildOptions(options);
      }
      /**
       * Parse XML dats to JS object 
       * @param {string|Buffer} xmlData 
       * @param {boolean|Object} validationOption 
       */
      parse(xmlData, validationOption) {
        if (typeof xmlData === "string") {
        } else if (xmlData.toString) {
          xmlData = xmlData.toString();
        } else {
          throw new Error("XML data is accepted in String or Bytes[] form.");
        }
        if (validationOption) {
          if (validationOption === true) validationOption = {};
          const result = validator.validate(xmlData, validationOption);
          if (result !== true) {
            throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
          }
        }
        const orderedObjParser = new OrderedObjParser(this.options);
        orderedObjParser.addExternalEntities(this.externalEntities);
        const orderedResult = orderedObjParser.parseXml(xmlData);
        if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
        else return prettify(orderedResult, this.options);
      }
      /**
       * Add Entity which is not by default supported by this library
       * @param {string} key 
       * @param {string} value 
       */
      addEntity(key, value) {
        if (value.indexOf("&") !== -1) {
          throw new Error("Entity value can't have '&'");
        } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
          throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
        } else if (value === "&") {
          throw new Error("An entity with value '&' is not permitted");
        } else {
          this.externalEntities[key] = value;
        }
      }
    };
    module.exports = XMLParser2;
  }
});

// ../../node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js
var require_orderedJs2Xml = __commonJS({
  "../../node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js"(exports, module) {
    var EOL = "\n";
    function toXml(jArray, options) {
      let indentation = "";
      if (options.format && options.indentBy.length > 0) {
        indentation = EOL;
      }
      return arrToStr(jArray, options, "", indentation);
    }
    function arrToStr(arr, options, jPath, indentation) {
      let xmlStr = "";
      let isPreviousElementTag = false;
      for (let i2 = 0; i2 < arr.length; i2++) {
        const tagObj = arr[i2];
        const tagName = propName(tagObj);
        if (tagName === void 0) continue;
        let newJPath = "";
        if (jPath.length === 0) newJPath = tagName;
        else newJPath = `${jPath}.${tagName}`;
        if (tagName === options.textNodeName) {
          let tagText = tagObj[tagName];
          if (!isStopNode(newJPath, options)) {
            tagText = options.tagValueProcessor(tagName, tagText);
            tagText = replaceEntitiesValue(tagText, options);
          }
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += tagText;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.cdataPropName) {
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.commentPropName) {
          xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
          isPreviousElementTag = true;
          continue;
        } else if (tagName[0] === "?") {
          const attStr2 = attr_to_str(tagObj[":@"], options);
          const tempInd = tagName === "?xml" ? "" : indentation;
          let piTextNodeName = tagObj[tagName][0][options.textNodeName];
          piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
          xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
          isPreviousElementTag = true;
          continue;
        }
        let newIdentation = indentation;
        if (newIdentation !== "") {
          newIdentation += options.indentBy;
        }
        const attStr = attr_to_str(tagObj[":@"], options);
        const tagStart = indentation + `<${tagName}${attStr}`;
        const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
        if (options.unpairedTags.indexOf(tagName) !== -1) {
          if (options.suppressUnpairedNode) xmlStr += tagStart + ">";
          else xmlStr += tagStart + "/>";
        } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
          xmlStr += tagStart + "/>";
        } else if (tagValue && tagValue.endsWith(">")) {
          xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
        } else {
          xmlStr += tagStart + ">";
          if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
            xmlStr += indentation + options.indentBy + tagValue + indentation;
          } else {
            xmlStr += tagValue;
          }
          xmlStr += `</${tagName}>`;
        }
        isPreviousElementTag = true;
      }
      return xmlStr;
    }
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i2 = 0; i2 < keys.length; i2++) {
        const key = keys[i2];
        if (!obj.hasOwnProperty(key)) continue;
        if (key !== ":@") return key;
      }
    }
    function attr_to_str(attrMap, options) {
      let attrStr = "";
      if (attrMap && !options.ignoreAttributes) {
        for (let attr in attrMap) {
          if (!attrMap.hasOwnProperty(attr)) continue;
          let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
          attrVal = replaceEntitiesValue(attrVal, options);
          if (attrVal === true && options.suppressBooleanAttributes) {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
          } else {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
          }
        }
      }
      return attrStr;
    }
    function isStopNode(jPath, options) {
      jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
      let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
      for (let index in options.stopNodes) {
        if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName) return true;
      }
      return false;
    }
    function replaceEntitiesValue(textValue, options) {
      if (textValue && textValue.length > 0 && options.processEntities) {
        for (let i2 = 0; i2 < options.entities.length; i2++) {
          const entity = options.entities[i2];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    }
    module.exports = toXml;
  }
});

// ../../node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js
var require_json2xml = __commonJS({
  "../../node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js"(exports, module) {
    "use strict";
    var buildFromOrderedJs = require_orderedJs2Xml();
    var defaultOptions = {
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      cdataPropName: false,
      format: false,
      indentBy: "  ",
      suppressEmptyNode: false,
      suppressUnpairedNode: true,
      suppressBooleanAttributes: true,
      tagValueProcessor: function(key, a2) {
        return a2;
      },
      attributeValueProcessor: function(attrName, a2) {
        return a2;
      },
      preserveOrder: false,
      commentPropName: false,
      unpairedTags: [],
      entities: [
        {
          regex: new RegExp("&", "g"),
          val: "&amp;"
        },
        //it must be on top
        {
          regex: new RegExp(">", "g"),
          val: "&gt;"
        },
        {
          regex: new RegExp("<", "g"),
          val: "&lt;"
        },
        {
          regex: new RegExp("'", "g"),
          val: "&apos;"
        },
        {
          regex: new RegExp('"', "g"),
          val: "&quot;"
        }
      ],
      processEntities: true,
      stopNodes: [],
      // transformTagName: false,
      // transformAttributeName: false,
      oneListGroup: false
    };
    function Builder(options) {
      this.options = Object.assign({}, defaultOptions, options);
      if (this.options.ignoreAttributes || this.options.attributesGroupName) {
        this.isAttribute = function() {
          return false;
        };
      } else {
        this.attrPrefixLen = this.options.attributeNamePrefix.length;
        this.isAttribute = isAttribute;
      }
      this.processTextOrObjNode = processTextOrObjNode;
      if (this.options.format) {
        this.indentate = indentate;
        this.tagEndChar = ">\n";
        this.newLine = "\n";
      } else {
        this.indentate = function() {
          return "";
        };
        this.tagEndChar = ">";
        this.newLine = "";
      }
    }
    Builder.prototype.build = function(jObj) {
      if (this.options.preserveOrder) {
        return buildFromOrderedJs(jObj, this.options);
      } else {
        if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
          jObj = {
            [this.options.arrayNodeName]: jObj
          };
        }
        return this.j2x(jObj, 0).val;
      }
    };
    Builder.prototype.j2x = function(jObj, level) {
      let attrStr = "";
      let val2 = "";
      for (let key in jObj) {
        if (!Object.prototype.hasOwnProperty.call(jObj, key)) continue;
        if (typeof jObj[key] === "undefined") {
          if (this.isAttribute(key)) {
            val2 += "";
          }
        } else if (jObj[key] === null) {
          if (this.isAttribute(key)) {
            val2 += "";
          } else if (key[0] === "?") {
            val2 += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
          } else {
            val2 += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
          }
        } else if (jObj[key] instanceof Date) {
          val2 += this.buildTextValNode(jObj[key], key, "", level);
        } else if (typeof jObj[key] !== "object") {
          const attr = this.isAttribute(key);
          if (attr) {
            attrStr += this.buildAttrPairStr(attr, "" + jObj[key]);
          } else {
            if (key === this.options.textNodeName) {
              let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
              val2 += this.replaceEntitiesValue(newval);
            } else {
              val2 += this.buildTextValNode(jObj[key], key, "", level);
            }
          }
        } else if (Array.isArray(jObj[key])) {
          const arrLen = jObj[key].length;
          let listTagVal = "";
          let listTagAttr = "";
          for (let j2 = 0; j2 < arrLen; j2++) {
            const item = jObj[key][j2];
            if (typeof item === "undefined") {
            } else if (item === null) {
              if (key[0] === "?") val2 += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
              else val2 += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
            } else if (typeof item === "object") {
              if (this.options.oneListGroup) {
                const result = this.j2x(item, level + 1);
                listTagVal += result.val;
                if (this.options.attributesGroupName && item.hasOwnProperty(this.options.attributesGroupName)) {
                  listTagAttr += result.attrStr;
                }
              } else {
                listTagVal += this.processTextOrObjNode(item, key, level);
              }
            } else {
              if (this.options.oneListGroup) {
                let textValue = this.options.tagValueProcessor(key, item);
                textValue = this.replaceEntitiesValue(textValue);
                listTagVal += textValue;
              } else {
                listTagVal += this.buildTextValNode(item, key, "", level);
              }
            }
          }
          if (this.options.oneListGroup) {
            listTagVal = this.buildObjectNode(listTagVal, key, listTagAttr, level);
          }
          val2 += listTagVal;
        } else {
          if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
            const Ks = Object.keys(jObj[key]);
            const L = Ks.length;
            for (let j2 = 0; j2 < L; j2++) {
              attrStr += this.buildAttrPairStr(Ks[j2], "" + jObj[key][Ks[j2]]);
            }
          } else {
            val2 += this.processTextOrObjNode(jObj[key], key, level);
          }
        }
      }
      return {
        attrStr,
        val: val2
      };
    };
    Builder.prototype.buildAttrPairStr = function(attrName, val2) {
      val2 = this.options.attributeValueProcessor(attrName, "" + val2);
      val2 = this.replaceEntitiesValue(val2);
      if (this.options.suppressBooleanAttributes && val2 === "true") {
        return " " + attrName;
      } else return " " + attrName + '="' + val2 + '"';
    };
    function processTextOrObjNode(object, key, level) {
      const result = this.j2x(object, level + 1);
      if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
        return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
      } else {
        return this.buildObjectNode(result.val, key, result.attrStr, level);
      }
    }
    Builder.prototype.buildObjectNode = function(val2, key, attrStr, level) {
      if (val2 === "") {
        if (key[0] === "?") return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
        else {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        }
      } else {
        let tagEndExp = "</" + key + this.tagEndChar;
        let piClosingChar = "";
        if (key[0] === "?") {
          piClosingChar = "?";
          tagEndExp = "";
        }
        if ((attrStr || attrStr === "") && val2.indexOf("<") === -1) {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val2 + tagEndExp;
        } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
          return this.indentate(level) + `<!--${val2}-->` + this.newLine;
        } else {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val2 + this.indentate(level) + tagEndExp;
        }
      }
    };
    Builder.prototype.closeTag = function(key) {
      let closeTag = "";
      if (this.options.unpairedTags.indexOf(key) !== -1) {
        if (!this.options.suppressUnpairedNode) closeTag = "/";
      } else if (this.options.suppressEmptyNode) {
        closeTag = "/";
      } else {
        closeTag = `></${key}`;
      }
      return closeTag;
    };
    Builder.prototype.buildTextValNode = function(val2, key, attrStr, level) {
      if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
        return this.indentate(level) + `<![CDATA[${val2}]]>` + this.newLine;
      } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
        return this.indentate(level) + `<!--${val2}-->` + this.newLine;
      } else if (key[0] === "?") {
        return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
      } else {
        let textValue = this.options.tagValueProcessor(key, val2);
        textValue = this.replaceEntitiesValue(textValue);
        if (textValue === "") {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        } else {
          return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
        }
      }
    };
    Builder.prototype.replaceEntitiesValue = function(textValue) {
      if (textValue && textValue.length > 0 && this.options.processEntities) {
        for (let i2 = 0; i2 < this.options.entities.length; i2++) {
          const entity = this.options.entities[i2];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    };
    function indentate(level) {
      return this.options.indentBy.repeat(level);
    }
    function isAttribute(name) {
      if (name.startsWith(this.options.attributeNamePrefix) && name !== this.options.textNodeName) {
        return name.substr(this.attrPrefixLen);
      } else {
        return false;
      }
    }
    module.exports = Builder;
  }
});

// ../../node_modules/fast-xml-parser/src/fxp.js
var require_fxp = __commonJS({
  "../../node_modules/fast-xml-parser/src/fxp.js"(exports, module) {
    "use strict";
    var validator = require_validator();
    var XMLParser2 = require_XMLParser();
    var XMLBuilder = require_json2xml();
    module.exports = {
      XMLParser: XMLParser2,
      XMLValidator: validator,
      XMLBuilder
    };
  }
});

// ../../node_modules/@smithy/protocol-http/dist-es/extensions/httpExtensionConfiguration.js
var getHttpHandlerExtensionConfiguration = (runtimeConfig) => {
  let httpHandler = runtimeConfig.httpHandler;
  return {
    setHttpHandler(handler) {
      httpHandler = handler;
    },
    httpHandler() {
      return httpHandler;
    },
    updateHttpClientConfig(key, value) {
      httpHandler.updateHttpClientConfig(key, value);
    },
    httpHandlerConfigs() {
      return httpHandler.httpHandlerConfigs();
    }
  };
};
var resolveHttpHandlerRuntimeConfig = (httpHandlerExtensionConfiguration) => {
  return {
    httpHandler: httpHandlerExtensionConfiguration.httpHandler()
  };
};

// ../../node_modules/@smithy/types/dist-es/auth/auth.js
var HttpAuthLocation;
(function(HttpAuthLocation2) {
  HttpAuthLocation2["HEADER"] = "header";
  HttpAuthLocation2["QUERY"] = "query";
})(HttpAuthLocation || (HttpAuthLocation = {}));

// ../../node_modules/@smithy/types/dist-es/auth/HttpApiKeyAuth.js
var HttpApiKeyAuthLocation;
(function(HttpApiKeyAuthLocation2) {
  HttpApiKeyAuthLocation2["HEADER"] = "header";
  HttpApiKeyAuthLocation2["QUERY"] = "query";
})(HttpApiKeyAuthLocation || (HttpApiKeyAuthLocation = {}));

// ../../node_modules/@smithy/types/dist-es/endpoint.js
var EndpointURLScheme;
(function(EndpointURLScheme2) {
  EndpointURLScheme2["HTTP"] = "http";
  EndpointURLScheme2["HTTPS"] = "https";
})(EndpointURLScheme || (EndpointURLScheme = {}));

// ../../node_modules/@smithy/types/dist-es/extensions/checksum.js
var AlgorithmId;
(function(AlgorithmId2) {
  AlgorithmId2["MD5"] = "md5";
  AlgorithmId2["CRC32"] = "crc32";
  AlgorithmId2["CRC32C"] = "crc32c";
  AlgorithmId2["SHA1"] = "sha1";
  AlgorithmId2["SHA256"] = "sha256";
})(AlgorithmId || (AlgorithmId = {}));

// ../../node_modules/@smithy/types/dist-es/http.js
var FieldPosition;
(function(FieldPosition2) {
  FieldPosition2[FieldPosition2["HEADER"] = 0] = "HEADER";
  FieldPosition2[FieldPosition2["TRAILER"] = 1] = "TRAILER";
})(FieldPosition || (FieldPosition = {}));

// ../../node_modules/@smithy/types/dist-es/middleware.js
var SMITHY_CONTEXT_KEY = "__smithy_context";

// ../../node_modules/@smithy/types/dist-es/profile.js
var IniSectionType;
(function(IniSectionType2) {
  IniSectionType2["PROFILE"] = "profile";
  IniSectionType2["SSO_SESSION"] = "sso-session";
  IniSectionType2["SERVICES"] = "services";
})(IniSectionType || (IniSectionType = {}));

// ../../node_modules/@smithy/types/dist-es/transfer.js
var RequestHandlerProtocol;
(function(RequestHandlerProtocol2) {
  RequestHandlerProtocol2["HTTP_0_9"] = "http/0.9";
  RequestHandlerProtocol2["HTTP_1_0"] = "http/1.0";
  RequestHandlerProtocol2["TDS_8_0"] = "tds/8.0";
})(RequestHandlerProtocol || (RequestHandlerProtocol = {}));

// ../../node_modules/@smithy/protocol-http/dist-es/httpRequest.js
var HttpRequest = class _HttpRequest {
  constructor(options) {
    this.method = options.method || "GET";
    this.hostname = options.hostname || "localhost";
    this.port = options.port;
    this.query = options.query || {};
    this.headers = options.headers || {};
    this.body = options.body;
    this.protocol = options.protocol ? options.protocol.slice(-1) !== ":" ? `${options.protocol}:` : options.protocol : "https:";
    this.path = options.path ? options.path.charAt(0) !== "/" ? `/${options.path}` : options.path : "/";
    this.username = options.username;
    this.password = options.password;
    this.fragment = options.fragment;
  }
  static clone(request) {
    const cloned = new _HttpRequest(__spreadProps(__spreadValues({}, request), {
      headers: __spreadValues({}, request.headers)
    }));
    if (cloned.query) {
      cloned.query = cloneQuery(cloned.query);
    }
    return cloned;
  }
  static isInstance(request) {
    if (!request) {
      return false;
    }
    const req = request;
    return "method" in req && "protocol" in req && "hostname" in req && "path" in req && typeof req["query"] === "object" && typeof req["headers"] === "object";
  }
  clone() {
    return _HttpRequest.clone(this);
  }
};
function cloneQuery(query) {
  return Object.keys(query).reduce((carry, paramName) => {
    const param = query[paramName];
    return __spreadProps(__spreadValues({}, carry), {
      [paramName]: Array.isArray(param) ? [...param] : param
    });
  }, {});
}

// ../../node_modules/@smithy/protocol-http/dist-es/httpResponse.js
var HttpResponse = class {
  constructor(options) {
    this.statusCode = options.statusCode;
    this.reason = options.reason;
    this.headers = options.headers || {};
    this.body = options.body;
  }
  static isInstance(response) {
    if (!response) return false;
    const resp = response;
    return typeof resp.statusCode === "number" && typeof resp.headers === "object";
  }
};

// ../../node_modules/@aws-sdk/middleware-host-header/dist-es/index.js
function resolveHostHeaderConfig(input) {
  return input;
}
var hostHeaderMiddleware = (options) => (next) => (args) => __async(void 0, null, function* () {
  if (!HttpRequest.isInstance(args.request)) return next(args);
  const {
    request
  } = args;
  const {
    handlerProtocol = ""
  } = options.requestHandler.metadata || {};
  if (handlerProtocol.indexOf("h2") >= 0 && !request.headers[":authority"]) {
    delete request.headers["host"];
    request.headers[":authority"] = request.hostname + (request.port ? ":" + request.port : "");
  } else if (!request.headers["host"]) {
    let host = request.hostname;
    if (request.port != null) host += `:${request.port}`;
    request.headers["host"] = host;
  }
  return next(args);
});
var hostHeaderMiddlewareOptions = {
  name: "hostHeaderMiddleware",
  step: "build",
  priority: "low",
  tags: ["HOST"],
  override: true
};
var getHostHeaderPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(hostHeaderMiddleware(options), hostHeaderMiddlewareOptions);
  }
});

// ../../node_modules/@aws-sdk/middleware-logger/dist-es/loggerMiddleware.js
var loggerMiddleware = () => (next, context) => (args) => __async(void 0, null, function* () {
  try {
    const response = yield next(args);
    const {
      clientName,
      commandName,
      logger: logger2,
      dynamoDbDocumentClientOptions = {}
    } = context;
    const {
      overrideInputFilterSensitiveLog,
      overrideOutputFilterSensitiveLog
    } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
    const outputFilterSensitiveLog = overrideOutputFilterSensitiveLog ?? context.outputFilterSensitiveLog;
    const _a = response.output, {
      $metadata
    } = _a, outputWithoutMetadata = __objRest(_a, [
      "$metadata"
    ]);
    logger2?.info?.({
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      output: outputFilterSensitiveLog(outputWithoutMetadata),
      metadata: $metadata
    });
    return response;
  } catch (error) {
    const {
      clientName,
      commandName,
      logger: logger2,
      dynamoDbDocumentClientOptions = {}
    } = context;
    const {
      overrideInputFilterSensitiveLog
    } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
    logger2?.error?.({
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      error,
      metadata: error.$metadata
    });
    throw error;
  }
});
var loggerMiddlewareOptions = {
  name: "loggerMiddleware",
  tags: ["LOGGER"],
  step: "initialize",
  override: true
};
var getLoggerPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(loggerMiddleware(), loggerMiddlewareOptions);
  }
});

// ../../node_modules/@aws-sdk/middleware-recursion-detection/dist-es/index.js
var TRACE_ID_HEADER_NAME = "X-Amzn-Trace-Id";
var ENV_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME";
var ENV_TRACE_ID = "_X_AMZN_TRACE_ID";
var recursionDetectionMiddleware = (options) => (next) => (args) => __async(void 0, null, function* () {
  const {
    request
  } = args;
  if (!HttpRequest.isInstance(request) || options.runtime !== "node" || request.headers.hasOwnProperty(TRACE_ID_HEADER_NAME)) {
    return next(args);
  }
  const functionName = process.env[ENV_LAMBDA_FUNCTION_NAME];
  const traceId = process.env[ENV_TRACE_ID];
  const nonEmptyString = (str) => typeof str === "string" && str.length > 0;
  if (nonEmptyString(functionName) && nonEmptyString(traceId)) {
    request.headers[TRACE_ID_HEADER_NAME] = traceId;
  }
  return next(__spreadProps(__spreadValues({}, args), {
    request
  }));
});
var addRecursionDetectionMiddlewareOptions = {
  step: "build",
  tags: ["RECURSION_DETECTION"],
  name: "recursionDetectionMiddleware",
  override: true,
  priority: "low"
};
var getRecursionDetectionPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(recursionDetectionMiddleware(options), addRecursionDetectionMiddlewareOptions);
  }
});

// ../../node_modules/@smithy/util-middleware/dist-es/getSmithyContext.js
var getSmithyContext = (context) => context[SMITHY_CONTEXT_KEY] || (context[SMITHY_CONTEXT_KEY] = {});

// ../../node_modules/@smithy/util-middleware/dist-es/normalizeProvider.js
var normalizeProvider = (input) => {
  if (typeof input === "function") return input;
  const promisified = Promise.resolve(input);
  return () => promisified;
};

// ../../node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/httpAuthSchemeMiddleware.js
function convertHttpAuthSchemesToMap(httpAuthSchemes) {
  const map = /* @__PURE__ */ new Map();
  for (const scheme of httpAuthSchemes) {
    map.set(scheme.schemeId, scheme);
  }
  return map;
}
var httpAuthSchemeMiddleware = (config, mwOptions) => (next, context) => (args) => __async(void 0, null, function* () {
  const options = config.httpAuthSchemeProvider(yield mwOptions.httpAuthSchemeParametersProvider(config, context, args.input));
  const authSchemes = convertHttpAuthSchemesToMap(config.httpAuthSchemes);
  const smithyContext = getSmithyContext(context);
  const failureReasons = [];
  for (const option of options) {
    const scheme = authSchemes.get(option.schemeId);
    if (!scheme) {
      failureReasons.push(`HttpAuthScheme \`${option.schemeId}\` was not enabled for this service.`);
      continue;
    }
    const identityProvider = scheme.identityProvider(yield mwOptions.identityProviderConfigProvider(config));
    if (!identityProvider) {
      failureReasons.push(`HttpAuthScheme \`${option.schemeId}\` did not have an IdentityProvider configured.`);
      continue;
    }
    const {
      identityProperties = {},
      signingProperties = {}
    } = option.propertiesExtractor?.(config, context) || {};
    option.identityProperties = Object.assign(option.identityProperties || {}, identityProperties);
    option.signingProperties = Object.assign(option.signingProperties || {}, signingProperties);
    smithyContext.selectedHttpAuthScheme = {
      httpAuthOption: option,
      identity: yield identityProvider(option.identityProperties),
      signer: scheme.signer
    };
    break;
  }
  if (!smithyContext.selectedHttpAuthScheme) {
    throw new Error(failureReasons.join("\n"));
  }
  return next(args);
});

// ../../node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/getHttpAuthSchemeEndpointRuleSetPlugin.js
var httpAuthSchemeEndpointRuleSetMiddlewareOptions = {
  step: "serialize",
  tags: ["HTTP_AUTH_SCHEME"],
  name: "httpAuthSchemeMiddleware",
  override: true,
  relation: "before",
  toMiddleware: "endpointV2Middleware"
};
var getHttpAuthSchemeEndpointRuleSetPlugin = (config, {
  httpAuthSchemeParametersProvider,
  identityProviderConfigProvider
}) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(httpAuthSchemeMiddleware(config, {
      httpAuthSchemeParametersProvider,
      identityProviderConfigProvider
    }), httpAuthSchemeEndpointRuleSetMiddlewareOptions);
  }
});

// ../../node_modules/@smithy/middleware-serde/dist-es/deserializerMiddleware.js
var deserializerMiddleware = (options, deserializer) => (next) => (args) => __async(void 0, null, function* () {
  const {
    response
  } = yield next(args);
  try {
    const parsed = yield deserializer(response, options);
    return {
      response,
      output: parsed
    };
  } catch (error) {
    Object.defineProperty(error, "$response", {
      value: response
    });
    if (!("$metadata" in error)) {
      const hint = `Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`;
      error.message += "\n  " + hint;
      if (typeof error.$responseBodyText !== "undefined") {
        if (error.$response) {
          error.$response.body = error.$responseBodyText;
        }
      }
    }
    throw error;
  }
});

// ../../node_modules/@smithy/middleware-serde/dist-es/serializerMiddleware.js
var serializerMiddleware = (options, serializer) => (next, context) => (args) => __async(void 0, null, function* () {
  const endpoint = context.endpointV2?.url && options.urlParser ? () => __async(void 0, null, function* () {
    return options.urlParser(context.endpointV2.url);
  }) : options.endpoint;
  if (!endpoint) {
    throw new Error("No valid endpoint provider available.");
  }
  const request = yield serializer(args.input, __spreadProps(__spreadValues({}, options), {
    endpoint
  }));
  return next(__spreadProps(__spreadValues({}, args), {
    request
  }));
});

// ../../node_modules/@smithy/middleware-serde/dist-es/serdePlugin.js
var deserializerMiddlewareOption = {
  name: "deserializerMiddleware",
  step: "deserialize",
  tags: ["DESERIALIZER"],
  override: true
};
var serializerMiddlewareOption = {
  name: "serializerMiddleware",
  step: "serialize",
  tags: ["SERIALIZER"],
  override: true
};
function getSerdePlugin(config, serializer, deserializer) {
  return {
    applyToStack: (commandStack) => {
      commandStack.add(deserializerMiddleware(config, deserializer), deserializerMiddlewareOption);
      commandStack.add(serializerMiddleware(config, serializer), serializerMiddlewareOption);
    }
  };
}

// ../../node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/getHttpAuthSchemePlugin.js
var httpAuthSchemeMiddlewareOptions = {
  step: "serialize",
  tags: ["HTTP_AUTH_SCHEME"],
  name: "httpAuthSchemeMiddleware",
  override: true,
  relation: "before",
  toMiddleware: serializerMiddlewareOption.name
};

// ../../node_modules/@smithy/core/dist-es/middleware-http-signing/httpSigningMiddleware.js
var defaultErrorHandler = (signingProperties) => (error) => {
  throw error;
};
var defaultSuccessHandler = (httpResponse, signingProperties) => {
};
var httpSigningMiddleware = (config) => (next, context) => (args) => __async(void 0, null, function* () {
  if (!HttpRequest.isInstance(args.request)) {
    return next(args);
  }
  const smithyContext = getSmithyContext(context);
  const scheme = smithyContext.selectedHttpAuthScheme;
  if (!scheme) {
    throw new Error(`No HttpAuthScheme was selected: unable to sign request`);
  }
  const {
    httpAuthOption: {
      signingProperties = {}
    },
    identity,
    signer
  } = scheme;
  const output = yield next(__spreadProps(__spreadValues({}, args), {
    request: yield signer.sign(args.request, identity, signingProperties)
  })).catch((signer.errorHandler || defaultErrorHandler)(signingProperties));
  (signer.successHandler || defaultSuccessHandler)(output.response, signingProperties);
  return output;
});

// ../../node_modules/@smithy/core/dist-es/middleware-http-signing/getHttpSigningMiddleware.js
var httpSigningMiddlewareOptions = {
  step: "finalizeRequest",
  tags: ["HTTP_SIGNING"],
  name: "httpSigningMiddleware",
  aliases: ["apiKeyMiddleware", "tokenMiddleware", "awsAuthMiddleware"],
  override: true,
  relation: "after",
  toMiddleware: "retryMiddleware"
};
var getHttpSigningPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(httpSigningMiddleware(config), httpSigningMiddlewareOptions);
  }
});

// ../../node_modules/@smithy/core/dist-es/normalizeProvider.js
var normalizeProvider2 = (input) => {
  if (typeof input === "function") return input;
  const promisified = Promise.resolve(input);
  return () => promisified;
};

// ../../node_modules/@smithy/core/dist-es/pagination/createPaginator.js
var makePagedClientRequest = (CommandCtor, client, input, ...args) => __async(void 0, null, function* () {
  return yield client.send(new CommandCtor(input), ...args);
});
function createPaginator(ClientCtor, CommandCtor, inputTokenName, outputTokenName, pageSizeTokenName) {
  return function paginateOperation(config, input, ...additionalArguments) {
    return __asyncGenerator(this, null, function* () {
      let token = config.startingToken || void 0;
      let hasNext = true;
      let page;
      while (hasNext) {
        input[inputTokenName] = token;
        if (pageSizeTokenName) {
          input[pageSizeTokenName] = input[pageSizeTokenName] ?? config.pageSize;
        }
        if (config.client instanceof ClientCtor) {
          page = yield new __await(makePagedClientRequest(CommandCtor, config.client, input, ...additionalArguments));
        } else {
          throw new Error(`Invalid client, expected instance of ${ClientCtor.name}`);
        }
        yield page;
        const prevToken = token;
        token = get(page, outputTokenName);
        hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
      }
      return void 0;
    });
  };
}
var get = (fromObject, path) => {
  let cursor = fromObject;
  const pathComponents = path.split(".");
  for (const step of pathComponents) {
    if (!cursor || typeof cursor !== "object") {
      return void 0;
    }
    cursor = cursor[step];
  }
  return cursor;
};

// ../../node_modules/@smithy/util-base64/dist-es/constants.browser.js
var alphabetByEncoding = {};
var alphabetByValue = new Array(64);
for (let i2 = 0, start = "A".charCodeAt(0), limit = "Z".charCodeAt(0); i2 + start <= limit; i2++) {
  const char = String.fromCharCode(i2 + start);
  alphabetByEncoding[char] = i2;
  alphabetByValue[i2] = char;
}
for (let i2 = 0, start = "a".charCodeAt(0), limit = "z".charCodeAt(0); i2 + start <= limit; i2++) {
  const char = String.fromCharCode(i2 + start);
  const index = i2 + 26;
  alphabetByEncoding[char] = index;
  alphabetByValue[index] = char;
}
for (let i2 = 0; i2 < 10; i2++) {
  alphabetByEncoding[i2.toString(10)] = i2 + 52;
  const char = i2.toString(10);
  const index = i2 + 52;
  alphabetByEncoding[char] = index;
  alphabetByValue[index] = char;
}
alphabetByEncoding["+"] = 62;
alphabetByValue[62] = "+";
alphabetByEncoding["/"] = 63;
alphabetByValue[63] = "/";
var bitsPerLetter = 6;
var bitsPerByte = 8;
var maxLetterValue = 63;

// ../../node_modules/@smithy/util-base64/dist-es/fromBase64.browser.js
var fromBase64 = (input) => {
  let totalByteLength = input.length / 4 * 3;
  if (input.slice(-2) === "==") {
    totalByteLength -= 2;
  } else if (input.slice(-1) === "=") {
    totalByteLength--;
  }
  const out = new ArrayBuffer(totalByteLength);
  const dataView = new DataView(out);
  for (let i2 = 0; i2 < input.length; i2 += 4) {
    let bits = 0;
    let bitLength = 0;
    for (let j2 = i2, limit = i2 + 3; j2 <= limit; j2++) {
      if (input[j2] !== "=") {
        if (!(input[j2] in alphabetByEncoding)) {
          throw new TypeError(`Invalid character ${input[j2]} in base64 string.`);
        }
        bits |= alphabetByEncoding[input[j2]] << (limit - j2) * bitsPerLetter;
        bitLength += bitsPerLetter;
      } else {
        bits >>= bitsPerLetter;
      }
    }
    const chunkOffset = i2 / 4 * 3;
    bits >>= bitLength % bitsPerByte;
    const byteLength = Math.floor(bitLength / bitsPerByte);
    for (let k2 = 0; k2 < byteLength; k2++) {
      const offset = (byteLength - k2 - 1) * bitsPerByte;
      dataView.setUint8(chunkOffset + k2, (bits & 255 << offset) >> offset);
    }
  }
  return new Uint8Array(out);
};

// ../../node_modules/@smithy/util-utf8/dist-es/fromUtf8.browser.js
var fromUtf8 = (input) => new TextEncoder().encode(input);

// ../../node_modules/@smithy/util-utf8/dist-es/toUint8Array.js
var toUint8Array = (data) => {
  if (typeof data === "string") {
    return fromUtf8(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
};

// ../../node_modules/@smithy/util-utf8/dist-es/toUtf8.browser.js
var toUtf8 = (input) => {
  if (typeof input === "string") {
    return input;
  }
  if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") {
    throw new Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
  }
  return new TextDecoder("utf-8").decode(input);
};

// ../../node_modules/@smithy/util-base64/dist-es/toBase64.browser.js
function toBase64(_input) {
  let input;
  if (typeof _input === "string") {
    input = fromUtf8(_input);
  } else {
    input = _input;
  }
  const isArrayLike = typeof input === "object" && typeof input.length === "number";
  const isUint8Array = typeof input === "object" && typeof input.byteOffset === "number" && typeof input.byteLength === "number";
  if (!isArrayLike && !isUint8Array) {
    throw new Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
  }
  let str = "";
  for (let i2 = 0; i2 < input.length; i2 += 3) {
    let bits = 0;
    let bitLength = 0;
    for (let j2 = i2, limit = Math.min(i2 + 3, input.length); j2 < limit; j2++) {
      bits |= input[j2] << (limit - j2 - 1) * bitsPerByte;
      bitLength += bitsPerByte;
    }
    const bitClusterCount = Math.ceil(bitLength / bitsPerLetter);
    bits <<= bitClusterCount * bitsPerLetter - bitLength;
    for (let k2 = 1; k2 <= bitClusterCount; k2++) {
      const offset = (bitClusterCount - k2) * bitsPerLetter;
      str += alphabetByValue[(bits & maxLetterValue << offset) >> offset];
    }
    str += "==".slice(0, 4 - bitClusterCount);
  }
  return str;
}

// ../../node_modules/@smithy/util-stream/dist-es/blob/transforms.js
function transformToString(payload, encoding = "utf-8") {
  if (encoding === "base64") {
    return toBase64(payload);
  }
  return toUtf8(payload);
}
function transformFromString(str, encoding) {
  if (encoding === "base64") {
    return Uint8ArrayBlobAdapter.mutate(fromBase64(str));
  }
  return Uint8ArrayBlobAdapter.mutate(fromUtf8(str));
}

// ../../node_modules/@smithy/util-stream/dist-es/blob/Uint8ArrayBlobAdapter.js
var Uint8ArrayBlobAdapter = class _Uint8ArrayBlobAdapter extends Uint8Array {
  static fromString(source, encoding = "utf-8") {
    switch (typeof source) {
      case "string":
        return transformFromString(source, encoding);
      default:
        throw new Error(`Unsupported conversion from ${typeof source} to Uint8ArrayBlobAdapter.`);
    }
  }
  static mutate(source) {
    Object.setPrototypeOf(source, _Uint8ArrayBlobAdapter.prototype);
    return source;
  }
  transformToString(encoding = "utf-8") {
    return transformToString(this, encoding);
  }
};

// ../../node_modules/@smithy/util-uri-escape/dist-es/escape-uri.js
var escapeUri = (uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode);
var hexEncode = (c2) => `%${c2.charCodeAt(0).toString(16).toUpperCase()}`;

// ../../node_modules/@smithy/querystring-builder/dist-es/index.js
function buildQueryString(query) {
  const parts = [];
  for (let key of Object.keys(query).sort()) {
    const value = query[key];
    key = escapeUri(key);
    if (Array.isArray(value)) {
      for (let i2 = 0, iLen = value.length; i2 < iLen; i2++) {
        parts.push(`${key}=${escapeUri(value[i2])}`);
      }
    } else {
      let qsEntry = key;
      if (value || typeof value === "string") {
        qsEntry += `=${escapeUri(value)}`;
      }
      parts.push(qsEntry);
    }
  }
  return parts.join("&");
}

// ../../node_modules/@smithy/util-hex-encoding/dist-es/index.js
var SHORT_TO_HEX = {};
var HEX_TO_SHORT = {};
for (let i2 = 0; i2 < 256; i2++) {
  let encodedByte = i2.toString(16).toLowerCase();
  if (encodedByte.length === 1) {
    encodedByte = `0${encodedByte}`;
  }
  SHORT_TO_HEX[i2] = encodedByte;
  HEX_TO_SHORT[encodedByte] = i2;
}
function fromHex(encoded) {
  if (encoded.length % 2 !== 0) {
    throw new Error("Hex encoded strings must have an even number length");
  }
  const out = new Uint8Array(encoded.length / 2);
  for (let i2 = 0; i2 < encoded.length; i2 += 2) {
    const encodedByte = encoded.slice(i2, i2 + 2).toLowerCase();
    if (encodedByte in HEX_TO_SHORT) {
      out[i2 / 2] = HEX_TO_SHORT[encodedByte];
    } else {
      throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
    }
  }
  return out;
}
function toHex(bytes) {
  let out = "";
  for (let i2 = 0; i2 < bytes.byteLength; i2++) {
    out += SHORT_TO_HEX[bytes[i2]];
  }
  return out;
}

// ../../node_modules/@smithy/core/dist-es/submodules/protocols/collect-stream-body.js
var collectBody = (..._0) => __async(void 0, [..._0], function* (streamBody = new Uint8Array(), context) {
  if (streamBody instanceof Uint8Array) {
    return Uint8ArrayBlobAdapter.mutate(streamBody);
  }
  if (!streamBody) {
    return Uint8ArrayBlobAdapter.mutate(new Uint8Array());
  }
  const fromContext = context.streamCollector(streamBody);
  return Uint8ArrayBlobAdapter.mutate(yield fromContext);
});

// ../../node_modules/@smithy/core/dist-es/setFeature.js
function setFeature(context, feature, value) {
  if (!context.__smithy_context) {
    context.__smithy_context = {
      features: {}
    };
  } else if (!context.__smithy_context.features) {
    context.__smithy_context.features = {};
  }
  context.__smithy_context.features[feature] = value;
}

// ../../node_modules/@smithy/core/dist-es/util-identity-and-auth/DefaultIdentityProviderConfig.js
var DefaultIdentityProviderConfig = class {
  constructor(config) {
    this.authSchemes = /* @__PURE__ */ new Map();
    for (const [key, value] of Object.entries(config)) {
      if (value !== void 0) {
        this.authSchemes.set(key, value);
      }
    }
  }
  getIdentityProvider(schemeId) {
    return this.authSchemes.get(schemeId);
  }
};

// ../../node_modules/@smithy/core/dist-es/util-identity-and-auth/httpAuthSchemes/noAuth.js
var NoAuthSigner = class {
  sign(httpRequest, identity, signingProperties) {
    return __async(this, null, function* () {
      return httpRequest;
    });
  }
};

// ../../node_modules/@smithy/core/dist-es/util-identity-and-auth/memoizeIdentityProvider.js
var createIsIdentityExpiredFunction = (expirationMs) => (identity) => doesIdentityRequireRefresh(identity) && identity.expiration.getTime() - Date.now() < expirationMs;
var EXPIRATION_MS = 3e5;
var isIdentityExpired = createIsIdentityExpiredFunction(EXPIRATION_MS);
var doesIdentityRequireRefresh = (identity) => identity.expiration !== void 0;
var memoizeIdentityProvider = (provider, isExpired, requiresRefresh) => {
  if (provider === void 0) {
    return void 0;
  }
  const normalizedProvider = typeof provider !== "function" ? () => __async(void 0, null, function* () {
    return Promise.resolve(provider);
  }) : provider;
  let resolved;
  let pending;
  let hasResult;
  let isConstant = false;
  const coalesceProvider = (options) => __async(void 0, null, function* () {
    if (!pending) {
      pending = normalizedProvider(options);
    }
    try {
      resolved = yield pending;
      hasResult = true;
      isConstant = false;
    } finally {
      pending = void 0;
    }
    return resolved;
  });
  if (isExpired === void 0) {
    return (options) => __async(void 0, null, function* () {
      if (!hasResult || options?.forceRefresh) {
        resolved = yield coalesceProvider(options);
      }
      return resolved;
    });
  }
  return (options) => __async(void 0, null, function* () {
    if (!hasResult || options?.forceRefresh) {
      resolved = yield coalesceProvider(options);
    }
    if (isConstant) {
      return resolved;
    }
    if (!requiresRefresh(resolved)) {
      isConstant = true;
      return resolved;
    }
    if (isExpired(resolved)) {
      yield coalesceProvider(options);
      return resolved;
    }
    return resolved;
  });
};

// ../../node_modules/@aws-sdk/middleware-user-agent/dist-es/configurations.js
var DEFAULT_UA_APP_ID = void 0;
function isValidUserAgentAppId(appId) {
  if (appId === void 0) {
    return true;
  }
  return typeof appId === "string" && appId.length <= 50;
}
function resolveUserAgentConfig(input) {
  const normalizedAppIdProvider = normalizeProvider2(input.userAgentAppId ?? DEFAULT_UA_APP_ID);
  return __spreadProps(__spreadValues({}, input), {
    customUserAgent: typeof input.customUserAgent === "string" ? [[input.customUserAgent]] : input.customUserAgent,
    userAgentAppId: () => __async(this, null, function* () {
      const appId = yield normalizedAppIdProvider();
      if (!isValidUserAgentAppId(appId)) {
        const logger2 = input.logger?.constructor?.name === "NoOpLogger" || !input.logger ? console : input.logger;
        if (typeof appId !== "string") {
          logger2?.warn("userAgentAppId must be a string or undefined.");
        } else if (appId.length > 50) {
          logger2?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.");
        }
      }
      return appId;
    })
  });
}

// ../../node_modules/@smithy/util-endpoints/dist-es/cache/EndpointCache.js
var EndpointCache = class {
  constructor({
    size,
    params
  }) {
    this.data = /* @__PURE__ */ new Map();
    this.parameters = [];
    this.capacity = size ?? 50;
    if (params) {
      this.parameters = params;
    }
  }
  get(endpointParams, resolver) {
    const key = this.hash(endpointParams);
    if (key === false) {
      return resolver();
    }
    if (!this.data.has(key)) {
      if (this.data.size > this.capacity + 10) {
        const keys = this.data.keys();
        let i2 = 0;
        while (true) {
          const {
            value,
            done
          } = keys.next();
          this.data.delete(value);
          if (done || ++i2 > 10) {
            break;
          }
        }
      }
      this.data.set(key, resolver());
    }
    return this.data.get(key);
  }
  size() {
    return this.data.size;
  }
  hash(endpointParams) {
    let buffer = "";
    const {
      parameters
    } = this;
    if (parameters.length === 0) {
      return false;
    }
    for (const param of parameters) {
      const val2 = String(endpointParams[param] ?? "");
      if (val2.includes("|;")) {
        return false;
      }
      buffer += val2 + "|;";
    }
    return buffer;
  }
};

// ../../node_modules/@smithy/util-endpoints/dist-es/lib/isIpAddress.js
var IP_V4_REGEX = new RegExp(`^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$`);
var isIpAddress = (value) => IP_V4_REGEX.test(value) || value.startsWith("[") && value.endsWith("]");

// ../../node_modules/@smithy/util-endpoints/dist-es/lib/isValidHostLabel.js
var VALID_HOST_LABEL_REGEX = new RegExp(`^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$`);
var isValidHostLabel = (value, allowSubDomains = false) => {
  if (!allowSubDomains) {
    return VALID_HOST_LABEL_REGEX.test(value);
  }
  const labels = value.split(".");
  for (const label of labels) {
    if (!isValidHostLabel(label)) {
      return false;
    }
  }
  return true;
};

// ../../node_modules/@smithy/util-endpoints/dist-es/utils/customEndpointFunctions.js
var customEndpointFunctions = {};

// ../../node_modules/@smithy/util-endpoints/dist-es/debug/debugId.js
var debugId = "endpoints";

// ../../node_modules/@smithy/util-endpoints/dist-es/debug/toDebugString.js
function toDebugString(input) {
  if (typeof input !== "object" || input == null) {
    return input;
  }
  if ("ref" in input) {
    return `$${toDebugString(input.ref)}`;
  }
  if ("fn" in input) {
    return `${input.fn}(${(input.argv || []).map(toDebugString).join(", ")})`;
  }
  return JSON.stringify(input, null, 2);
}

// ../../node_modules/@smithy/util-endpoints/dist-es/types/EndpointError.js
var EndpointError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "EndpointError";
  }
};

// ../../node_modules/@smithy/util-endpoints/dist-es/lib/booleanEquals.js
var booleanEquals = (value1, value2) => value1 === value2;

// ../../node_modules/@smithy/util-endpoints/dist-es/lib/getAttrPathList.js
var getAttrPathList = (path) => {
  const parts = path.split(".");
  const pathList = [];
  for (const part of parts) {
    const squareBracketIndex = part.indexOf("[");
    if (squareBracketIndex !== -1) {
      if (part.indexOf("]") !== part.length - 1) {
        throw new EndpointError(`Path: '${path}' does not end with ']'`);
      }
      const arrayIndex = part.slice(squareBracketIndex + 1, -1);
      if (Number.isNaN(parseInt(arrayIndex))) {
        throw new EndpointError(`Invalid array index: '${arrayIndex}' in path: '${path}'`);
      }
      if (squareBracketIndex !== 0) {
        pathList.push(part.slice(0, squareBracketIndex));
      }
      pathList.push(arrayIndex);
    } else {
      pathList.push(part);
    }
  }
  return pathList;
};

// ../../node_modules/@smithy/util-endpoints/dist-es/lib/getAttr.js
var getAttr = (value, path) => getAttrPathList(path).reduce((acc, index) => {
  if (typeof acc !== "object") {
    throw new EndpointError(`Index '${index}' in '${path}' not found in '${JSON.stringify(value)}'`);
  } else if (Array.isArray(acc)) {
    return acc[parseInt(index)];
  }
  return acc[index];
}, value);

// ../../node_modules/@smithy/util-endpoints/dist-es/lib/isSet.js
var isSet = (value) => value != null;

// ../../node_modules/@smithy/util-endpoints/dist-es/lib/not.js
var not = (value) => !value;

// ../../node_modules/@smithy/util-endpoints/dist-es/lib/parseURL.js
var DEFAULT_PORTS = {
  [EndpointURLScheme.HTTP]: 80,
  [EndpointURLScheme.HTTPS]: 443
};
var parseURL = (value) => {
  const whatwgURL = (() => {
    try {
      if (value instanceof URL) {
        return value;
      }
      if (typeof value === "object" && "hostname" in value) {
        const {
          hostname: hostname2,
          port,
          protocol: protocol2 = "",
          path = "",
          query = {}
        } = value;
        const url = new URL(`${protocol2}//${hostname2}${port ? `:${port}` : ""}${path}`);
        url.search = Object.entries(query).map(([k2, v2]) => `${k2}=${v2}`).join("&");
        return url;
      }
      return new URL(value);
    } catch (error) {
      return null;
    }
  })();
  if (!whatwgURL) {
    console.error(`Unable to parse ${JSON.stringify(value)} as a whatwg URL.`);
    return null;
  }
  const urlString = whatwgURL.href;
  const {
    host,
    hostname,
    pathname,
    protocol,
    search
  } = whatwgURL;
  if (search) {
    return null;
  }
  const scheme = protocol.slice(0, -1);
  if (!Object.values(EndpointURLScheme).includes(scheme)) {
    return null;
  }
  const isIp = isIpAddress(hostname);
  const inputContainsDefaultPort = urlString.includes(`${host}:${DEFAULT_PORTS[scheme]}`) || typeof value === "string" && value.includes(`${host}:${DEFAULT_PORTS[scheme]}`);
  const authority = `${host}${inputContainsDefaultPort ? `:${DEFAULT_PORTS[scheme]}` : ``}`;
  return {
    scheme,
    authority,
    path: pathname,
    normalizedPath: pathname.endsWith("/") ? pathname : `${pathname}/`,
    isIp
  };
};

// ../../node_modules/@smithy/util-endpoints/dist-es/lib/stringEquals.js
var stringEquals = (value1, value2) => value1 === value2;

// ../../node_modules/@smithy/util-endpoints/dist-es/lib/substring.js
var substring = (input, start, stop, reverse) => {
  if (start >= stop || input.length < stop) {
    return null;
  }
  if (!reverse) {
    return input.substring(start, stop);
  }
  return input.substring(input.length - stop, input.length - start);
};

// ../../node_modules/@smithy/util-endpoints/dist-es/lib/uriEncode.js
var uriEncode = (value) => encodeURIComponent(value).replace(/[!*'()]/g, (c2) => `%${c2.charCodeAt(0).toString(16).toUpperCase()}`);

// ../../node_modules/@smithy/util-endpoints/dist-es/utils/endpointFunctions.js
var endpointFunctions = {
  booleanEquals,
  getAttr,
  isSet,
  isValidHostLabel,
  not,
  parseURL,
  stringEquals,
  substring,
  uriEncode
};

// ../../node_modules/@smithy/util-endpoints/dist-es/utils/evaluateTemplate.js
var evaluateTemplate = (template, options) => {
  const evaluatedTemplateArr = [];
  const templateContext = __spreadValues(__spreadValues({}, options.endpointParams), options.referenceRecord);
  let currentIndex = 0;
  while (currentIndex < template.length) {
    const openingBraceIndex = template.indexOf("{", currentIndex);
    if (openingBraceIndex === -1) {
      evaluatedTemplateArr.push(template.slice(currentIndex));
      break;
    }
    evaluatedTemplateArr.push(template.slice(currentIndex, openingBraceIndex));
    const closingBraceIndex = template.indexOf("}", openingBraceIndex);
    if (closingBraceIndex === -1) {
      evaluatedTemplateArr.push(template.slice(openingBraceIndex));
      break;
    }
    if (template[openingBraceIndex + 1] === "{" && template[closingBraceIndex + 1] === "}") {
      evaluatedTemplateArr.push(template.slice(openingBraceIndex + 1, closingBraceIndex));
      currentIndex = closingBraceIndex + 2;
    }
    const parameterName = template.substring(openingBraceIndex + 1, closingBraceIndex);
    if (parameterName.includes("#")) {
      const [refName, attrName] = parameterName.split("#");
      evaluatedTemplateArr.push(getAttr(templateContext[refName], attrName));
    } else {
      evaluatedTemplateArr.push(templateContext[parameterName]);
    }
    currentIndex = closingBraceIndex + 1;
  }
  return evaluatedTemplateArr.join("");
};

// ../../node_modules/@smithy/util-endpoints/dist-es/utils/getReferenceValue.js
var getReferenceValue = ({
  ref
}, options) => {
  const referenceRecord = __spreadValues(__spreadValues({}, options.endpointParams), options.referenceRecord);
  return referenceRecord[ref];
};

// ../../node_modules/@smithy/util-endpoints/dist-es/utils/evaluateExpression.js
var evaluateExpression = (obj, keyName, options) => {
  if (typeof obj === "string") {
    return evaluateTemplate(obj, options);
  } else if (obj["fn"]) {
    return callFunction(obj, options);
  } else if (obj["ref"]) {
    return getReferenceValue(obj, options);
  }
  throw new EndpointError(`'${keyName}': ${String(obj)} is not a string, function or reference.`);
};

// ../../node_modules/@smithy/util-endpoints/dist-es/utils/callFunction.js
var callFunction = ({
  fn,
  argv
}, options) => {
  const evaluatedArgs = argv.map((arg) => ["boolean", "number"].includes(typeof arg) ? arg : evaluateExpression(arg, "arg", options));
  const fnSegments = fn.split(".");
  if (fnSegments[0] in customEndpointFunctions && fnSegments[1] != null) {
    return customEndpointFunctions[fnSegments[0]][fnSegments[1]](...evaluatedArgs);
  }
  return endpointFunctions[fn](...evaluatedArgs);
};

// ../../node_modules/@smithy/util-endpoints/dist-es/utils/evaluateCondition.js
var evaluateCondition = (_a, options) => {
  var _b = _a, {
    assign
  } = _b, fnArgs = __objRest(_b, [
    "assign"
  ]);
  if (assign && assign in options.referenceRecord) {
    throw new EndpointError(`'${assign}' is already defined in Reference Record.`);
  }
  const value = callFunction(fnArgs, options);
  options.logger?.debug?.(`${debugId} evaluateCondition: ${toDebugString(fnArgs)} = ${toDebugString(value)}`);
  return __spreadValues({
    result: value === "" ? true : !!value
  }, assign != null && {
    toAssign: {
      name: assign,
      value
    }
  });
};

// ../../node_modules/@smithy/util-endpoints/dist-es/utils/evaluateConditions.js
var evaluateConditions = (conditions = [], options) => {
  const conditionsReferenceRecord = {};
  for (const condition of conditions) {
    const {
      result,
      toAssign
    } = evaluateCondition(condition, __spreadProps(__spreadValues({}, options), {
      referenceRecord: __spreadValues(__spreadValues({}, options.referenceRecord), conditionsReferenceRecord)
    }));
    if (!result) {
      return {
        result
      };
    }
    if (toAssign) {
      conditionsReferenceRecord[toAssign.name] = toAssign.value;
      options.logger?.debug?.(`${debugId} assign: ${toAssign.name} := ${toDebugString(toAssign.value)}`);
    }
  }
  return {
    result: true,
    referenceRecord: conditionsReferenceRecord
  };
};

// ../../node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointHeaders.js
var getEndpointHeaders = (headers, options) => Object.entries(headers).reduce((acc, [headerKey, headerVal]) => __spreadProps(__spreadValues({}, acc), {
  [headerKey]: headerVal.map((headerValEntry) => {
    const processedExpr = evaluateExpression(headerValEntry, "Header value entry", options);
    if (typeof processedExpr !== "string") {
      throw new EndpointError(`Header '${headerKey}' value '${processedExpr}' is not a string`);
    }
    return processedExpr;
  })
}), {});

// ../../node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointProperty.js
var getEndpointProperty = (property, options) => {
  if (Array.isArray(property)) {
    return property.map((propertyEntry) => getEndpointProperty(propertyEntry, options));
  }
  switch (typeof property) {
    case "string":
      return evaluateTemplate(property, options);
    case "object":
      if (property === null) {
        throw new EndpointError(`Unexpected endpoint property: ${property}`);
      }
      return getEndpointProperties(property, options);
    case "boolean":
      return property;
    default:
      throw new EndpointError(`Unexpected endpoint property type: ${typeof property}`);
  }
};

// ../../node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointProperties.js
var getEndpointProperties = (properties, options) => Object.entries(properties).reduce((acc, [propertyKey, propertyVal]) => __spreadProps(__spreadValues({}, acc), {
  [propertyKey]: getEndpointProperty(propertyVal, options)
}), {});

// ../../node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointUrl.js
var getEndpointUrl = (endpointUrl, options) => {
  const expression = evaluateExpression(endpointUrl, "Endpoint URL", options);
  if (typeof expression === "string") {
    try {
      return new URL(expression);
    } catch (error) {
      console.error(`Failed to construct URL with ${expression}`, error);
      throw error;
    }
  }
  throw new EndpointError(`Endpoint URL must be a string, got ${typeof expression}`);
};

// ../../node_modules/@smithy/util-endpoints/dist-es/utils/evaluateEndpointRule.js
var evaluateEndpointRule = (endpointRule, options) => {
  const {
    conditions,
    endpoint
  } = endpointRule;
  const {
    result,
    referenceRecord
  } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  const endpointRuleOptions = __spreadProps(__spreadValues({}, options), {
    referenceRecord: __spreadValues(__spreadValues({}, options.referenceRecord), referenceRecord)
  });
  const {
    url,
    properties,
    headers
  } = endpoint;
  options.logger?.debug?.(`${debugId} Resolving endpoint from template: ${toDebugString(endpoint)}`);
  return __spreadProps(__spreadValues(__spreadValues({}, headers != void 0 && {
    headers: getEndpointHeaders(headers, endpointRuleOptions)
  }), properties != void 0 && {
    properties: getEndpointProperties(properties, endpointRuleOptions)
  }), {
    url: getEndpointUrl(url, endpointRuleOptions)
  });
};

// ../../node_modules/@smithy/util-endpoints/dist-es/utils/evaluateErrorRule.js
var evaluateErrorRule = (errorRule, options) => {
  const {
    conditions,
    error
  } = errorRule;
  const {
    result,
    referenceRecord
  } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  throw new EndpointError(evaluateExpression(error, "Error", __spreadProps(__spreadValues({}, options), {
    referenceRecord: __spreadValues(__spreadValues({}, options.referenceRecord), referenceRecord)
  })));
};

// ../../node_modules/@smithy/util-endpoints/dist-es/utils/evaluateTreeRule.js
var evaluateTreeRule = (treeRule, options) => {
  const {
    conditions,
    rules
  } = treeRule;
  const {
    result,
    referenceRecord
  } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  return evaluateRules(rules, __spreadProps(__spreadValues({}, options), {
    referenceRecord: __spreadValues(__spreadValues({}, options.referenceRecord), referenceRecord)
  }));
};

// ../../node_modules/@smithy/util-endpoints/dist-es/utils/evaluateRules.js
var evaluateRules = (rules, options) => {
  for (const rule of rules) {
    if (rule.type === "endpoint") {
      const endpointOrUndefined = evaluateEndpointRule(rule, options);
      if (endpointOrUndefined) {
        return endpointOrUndefined;
      }
    } else if (rule.type === "error") {
      evaluateErrorRule(rule, options);
    } else if (rule.type === "tree") {
      const endpointOrUndefined = evaluateTreeRule(rule, options);
      if (endpointOrUndefined) {
        return endpointOrUndefined;
      }
    } else {
      throw new EndpointError(`Unknown endpoint rule: ${rule}`);
    }
  }
  throw new EndpointError(`Rules evaluation failed`);
};

// ../../node_modules/@smithy/util-endpoints/dist-es/resolveEndpoint.js
var resolveEndpoint = (ruleSetObject, options) => {
  const {
    endpointParams,
    logger: logger2
  } = options;
  const {
    parameters,
    rules
  } = ruleSetObject;
  options.logger?.debug?.(`${debugId} Initial EndpointParams: ${toDebugString(endpointParams)}`);
  const paramsWithDefault = Object.entries(parameters).filter(([, v2]) => v2.default != null).map(([k2, v2]) => [k2, v2.default]);
  if (paramsWithDefault.length > 0) {
    for (const [paramKey, paramDefaultValue] of paramsWithDefault) {
      endpointParams[paramKey] = endpointParams[paramKey] ?? paramDefaultValue;
    }
  }
  const requiredParams = Object.entries(parameters).filter(([, v2]) => v2.required).map(([k2]) => k2);
  for (const requiredParam of requiredParams) {
    if (endpointParams[requiredParam] == null) {
      throw new EndpointError(`Missing required parameter: '${requiredParam}'`);
    }
  }
  const endpoint = evaluateRules(rules, {
    endpointParams,
    logger: logger2,
    referenceRecord: {}
  });
  options.logger?.debug?.(`${debugId} Resolved endpoint: ${toDebugString(endpoint)}`);
  return endpoint;
};

// ../../node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/isVirtualHostableS3Bucket.js
var isVirtualHostableS3Bucket = (value, allowSubDomains = false) => {
  if (allowSubDomains) {
    for (const label of value.split(".")) {
      if (!isVirtualHostableS3Bucket(label)) {
        return false;
      }
    }
    return true;
  }
  if (!isValidHostLabel(value)) {
    return false;
  }
  if (value.length < 3 || value.length > 63) {
    return false;
  }
  if (value !== value.toLowerCase()) {
    return false;
  }
  if (isIpAddress(value)) {
    return false;
  }
  return true;
};

// ../../node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/parseArn.js
var ARN_DELIMITER = ":";
var RESOURCE_DELIMITER = "/";
var parseArn = (value) => {
  const segments = value.split(ARN_DELIMITER);
  if (segments.length < 6) return null;
  const [arn, partition2, service, region, accountId, ...resourcePath] = segments;
  if (arn !== "arn" || partition2 === "" || service === "" || resourcePath.join(ARN_DELIMITER) === "") return null;
  const resourceId = resourcePath.map((resource) => resource.split(RESOURCE_DELIMITER)).flat();
  return {
    partition: partition2,
    service,
    region,
    accountId,
    resourceId
  };
};

// ../../node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/partitions.json
var partitions_default = {
  partitions: [{
    id: "aws",
    outputs: {
      dnsSuffix: "amazonaws.com",
      dualStackDnsSuffix: "api.aws",
      implicitGlobalRegion: "us-east-1",
      name: "aws",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$",
    regions: {
      "af-south-1": {
        description: "Africa (Cape Town)"
      },
      "ap-east-1": {
        description: "Asia Pacific (Hong Kong)"
      },
      "ap-northeast-1": {
        description: "Asia Pacific (Tokyo)"
      },
      "ap-northeast-2": {
        description: "Asia Pacific (Seoul)"
      },
      "ap-northeast-3": {
        description: "Asia Pacific (Osaka)"
      },
      "ap-south-1": {
        description: "Asia Pacific (Mumbai)"
      },
      "ap-south-2": {
        description: "Asia Pacific (Hyderabad)"
      },
      "ap-southeast-1": {
        description: "Asia Pacific (Singapore)"
      },
      "ap-southeast-2": {
        description: "Asia Pacific (Sydney)"
      },
      "ap-southeast-3": {
        description: "Asia Pacific (Jakarta)"
      },
      "ap-southeast-4": {
        description: "Asia Pacific (Melbourne)"
      },
      "ap-southeast-5": {
        description: "Asia Pacific (Malaysia)"
      },
      "aws-global": {
        description: "AWS Standard global region"
      },
      "ca-central-1": {
        description: "Canada (Central)"
      },
      "ca-west-1": {
        description: "Canada West (Calgary)"
      },
      "eu-central-1": {
        description: "Europe (Frankfurt)"
      },
      "eu-central-2": {
        description: "Europe (Zurich)"
      },
      "eu-north-1": {
        description: "Europe (Stockholm)"
      },
      "eu-south-1": {
        description: "Europe (Milan)"
      },
      "eu-south-2": {
        description: "Europe (Spain)"
      },
      "eu-west-1": {
        description: "Europe (Ireland)"
      },
      "eu-west-2": {
        description: "Europe (London)"
      },
      "eu-west-3": {
        description: "Europe (Paris)"
      },
      "il-central-1": {
        description: "Israel (Tel Aviv)"
      },
      "me-central-1": {
        description: "Middle East (UAE)"
      },
      "me-south-1": {
        description: "Middle East (Bahrain)"
      },
      "sa-east-1": {
        description: "South America (Sao Paulo)"
      },
      "us-east-1": {
        description: "US East (N. Virginia)"
      },
      "us-east-2": {
        description: "US East (Ohio)"
      },
      "us-west-1": {
        description: "US West (N. California)"
      },
      "us-west-2": {
        description: "US West (Oregon)"
      }
    }
  }, {
    id: "aws-cn",
    outputs: {
      dnsSuffix: "amazonaws.com.cn",
      dualStackDnsSuffix: "api.amazonwebservices.com.cn",
      implicitGlobalRegion: "cn-northwest-1",
      name: "aws-cn",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^cn\\-\\w+\\-\\d+$",
    regions: {
      "aws-cn-global": {
        description: "AWS China global region"
      },
      "cn-north-1": {
        description: "China (Beijing)"
      },
      "cn-northwest-1": {
        description: "China (Ningxia)"
      }
    }
  }, {
    id: "aws-us-gov",
    outputs: {
      dnsSuffix: "amazonaws.com",
      dualStackDnsSuffix: "api.aws",
      implicitGlobalRegion: "us-gov-west-1",
      name: "aws-us-gov",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
    regions: {
      "aws-us-gov-global": {
        description: "AWS GovCloud (US) global region"
      },
      "us-gov-east-1": {
        description: "AWS GovCloud (US-East)"
      },
      "us-gov-west-1": {
        description: "AWS GovCloud (US-West)"
      }
    }
  }, {
    id: "aws-iso",
    outputs: {
      dnsSuffix: "c2s.ic.gov",
      dualStackDnsSuffix: "c2s.ic.gov",
      implicitGlobalRegion: "us-iso-east-1",
      name: "aws-iso",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
    regions: {
      "aws-iso-global": {
        description: "AWS ISO (US) global region"
      },
      "us-iso-east-1": {
        description: "US ISO East"
      },
      "us-iso-west-1": {
        description: "US ISO WEST"
      }
    }
  }, {
    id: "aws-iso-b",
    outputs: {
      dnsSuffix: "sc2s.sgov.gov",
      dualStackDnsSuffix: "sc2s.sgov.gov",
      implicitGlobalRegion: "us-isob-east-1",
      name: "aws-iso-b",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
    regions: {
      "aws-iso-b-global": {
        description: "AWS ISOB (US) global region"
      },
      "us-isob-east-1": {
        description: "US ISOB East (Ohio)"
      }
    }
  }, {
    id: "aws-iso-e",
    outputs: {
      dnsSuffix: "cloud.adc-e.uk",
      dualStackDnsSuffix: "cloud.adc-e.uk",
      implicitGlobalRegion: "eu-isoe-west-1",
      name: "aws-iso-e",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
    regions: {
      "eu-isoe-west-1": {
        description: "EU ISOE West"
      }
    }
  }, {
    id: "aws-iso-f",
    outputs: {
      dnsSuffix: "csp.hci.ic.gov",
      dualStackDnsSuffix: "csp.hci.ic.gov",
      implicitGlobalRegion: "us-isof-south-1",
      name: "aws-iso-f",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-isof\\-\\w+\\-\\d+$",
    regions: {}
  }],
  version: "1.1"
};

// ../../node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/partition.js
var selectedPartitionsInfo = partitions_default;
var selectedUserAgentPrefix = "";
var partition = (value) => {
  const {
    partitions
  } = selectedPartitionsInfo;
  for (const partition2 of partitions) {
    const {
      regions,
      outputs
    } = partition2;
    for (const [region, regionData] of Object.entries(regions)) {
      if (region === value) {
        return __spreadValues(__spreadValues({}, outputs), regionData);
      }
    }
  }
  for (const partition2 of partitions) {
    const {
      regionRegex,
      outputs
    } = partition2;
    if (new RegExp(regionRegex).test(value)) {
      return __spreadValues({}, outputs);
    }
  }
  const DEFAULT_PARTITION = partitions.find((partition2) => partition2.id === "aws");
  if (!DEFAULT_PARTITION) {
    throw new Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
  }
  return __spreadValues({}, DEFAULT_PARTITION.outputs);
};
var getUserAgentPrefix = () => selectedUserAgentPrefix;

// ../../node_modules/@aws-sdk/util-endpoints/dist-es/aws.js
var awsEndpointFunctions = {
  isVirtualHostableS3Bucket,
  parseArn,
  partition
};
customEndpointFunctions.aws = awsEndpointFunctions;

// ../../node_modules/@aws-sdk/core/dist-es/submodules/client/setCredentialFeature.js
function setCredentialFeature(credentials, feature, value) {
  if (!credentials.$source) {
    credentials.$source = {};
  }
  credentials.$source[feature] = value;
  return credentials;
}

// ../../node_modules/@aws-sdk/core/dist-es/submodules/client/setFeature.js
function setFeature2(context, feature, value) {
  if (!context.__aws_sdk_context) {
    context.__aws_sdk_context = {
      features: {}
    };
  } else if (!context.__aws_sdk_context.features) {
    context.__aws_sdk_context.features = {};
  }
  context.__aws_sdk_context.features[feature] = value;
}

// ../../node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getDateHeader.js
var getDateHeader = (response) => HttpResponse.isInstance(response) ? response.headers?.date ?? response.headers?.Date : void 0;

// ../../node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getSkewCorrectedDate.js
var getSkewCorrectedDate = (systemClockOffset) => new Date(Date.now() + systemClockOffset);

// ../../node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/isClockSkewed.js
var isClockSkewed = (clockTime, systemClockOffset) => Math.abs(getSkewCorrectedDate(systemClockOffset).getTime() - clockTime) >= 3e5;

// ../../node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getUpdatedSystemClockOffset.js
var getUpdatedSystemClockOffset = (clockTime, currentSystemClockOffset) => {
  const clockTimeInMs = Date.parse(clockTime);
  if (isClockSkewed(clockTimeInMs, currentSystemClockOffset)) {
    return clockTimeInMs - Date.now();
  }
  return currentSystemClockOffset;
};

// ../../node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/AwsSdkSigV4Signer.js
var throwSigningPropertyError = (name, property) => {
  if (!property) {
    throw new Error(`Property \`${name}\` is not resolved for AWS SDK SigV4Auth`);
  }
  return property;
};
var validateSigningProperties = (signingProperties) => __async(void 0, null, function* () {
  const context = throwSigningPropertyError("context", signingProperties.context);
  const config = throwSigningPropertyError("config", signingProperties.config);
  const authScheme = context.endpointV2?.properties?.authSchemes?.[0];
  const signerFunction = throwSigningPropertyError("signer", config.signer);
  const signer = yield signerFunction(authScheme);
  const signingRegion = signingProperties?.signingRegion;
  const signingRegionSet = signingProperties?.signingRegionSet;
  const signingName = signingProperties?.signingName;
  return {
    config,
    signer,
    signingRegion,
    signingRegionSet,
    signingName
  };
});
var AwsSdkSigV4Signer = class {
  sign(httpRequest, identity, signingProperties) {
    return __async(this, null, function* () {
      if (!HttpRequest.isInstance(httpRequest)) {
        throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
      }
      const validatedProps = yield validateSigningProperties(signingProperties);
      const {
        config,
        signer
      } = validatedProps;
      let {
        signingRegion,
        signingName
      } = validatedProps;
      const handlerExecutionContext = signingProperties.context;
      if (handlerExecutionContext?.authSchemes?.length ?? 0 > 1) {
        const [first, second] = handlerExecutionContext.authSchemes;
        if (first?.name === "sigv4a" && second?.name === "sigv4") {
          signingRegion = second?.signingRegion ?? signingRegion;
          signingName = second?.signingName ?? signingName;
        }
      }
      const signedRequest = yield signer.sign(httpRequest, {
        signingDate: getSkewCorrectedDate(config.systemClockOffset),
        signingRegion,
        signingService: signingName
      });
      return signedRequest;
    });
  }
  errorHandler(signingProperties) {
    return (error) => {
      const serverTime = error.ServerTime ?? getDateHeader(error.$response);
      if (serverTime) {
        const config = throwSigningPropertyError("config", signingProperties.config);
        const initialSystemClockOffset = config.systemClockOffset;
        config.systemClockOffset = getUpdatedSystemClockOffset(serverTime, config.systemClockOffset);
        const clockSkewCorrected = config.systemClockOffset !== initialSystemClockOffset;
        if (clockSkewCorrected && error.$metadata) {
          error.$metadata.clockSkewCorrected = true;
        }
      }
      throw error;
    };
  }
  successHandler(httpResponse, signingProperties) {
    const dateHeader = getDateHeader(httpResponse);
    if (dateHeader) {
      const config = throwSigningPropertyError("config", signingProperties.config);
      config.systemClockOffset = getUpdatedSystemClockOffset(dateHeader, config.systemClockOffset);
    }
  }
};

// ../../node_modules/@smithy/property-provider/dist-es/memoize.js
var memoize = (provider, isExpired, requiresRefresh) => {
  let resolved;
  let pending;
  let hasResult;
  let isConstant = false;
  const coalesceProvider = () => __async(void 0, null, function* () {
    if (!pending) {
      pending = provider();
    }
    try {
      resolved = yield pending;
      hasResult = true;
      isConstant = false;
    } finally {
      pending = void 0;
    }
    return resolved;
  });
  if (isExpired === void 0) {
    return (options) => __async(void 0, null, function* () {
      if (!hasResult || options?.forceRefresh) {
        resolved = yield coalesceProvider();
      }
      return resolved;
    });
  }
  return (options) => __async(void 0, null, function* () {
    if (!hasResult || options?.forceRefresh) {
      resolved = yield coalesceProvider();
    }
    if (isConstant) {
      return resolved;
    }
    if (requiresRefresh && !requiresRefresh(resolved)) {
      isConstant = true;
      return resolved;
    }
    if (isExpired(resolved)) {
      yield coalesceProvider();
      return resolved;
    }
    return resolved;
  });
};

// ../../node_modules/@smithy/signature-v4/dist-es/constants.js
var ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
var CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
var AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
var SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
var EXPIRES_QUERY_PARAM = "X-Amz-Expires";
var SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
var TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
var AUTH_HEADER = "authorization";
var AMZ_DATE_HEADER = AMZ_DATE_QUERY_PARAM.toLowerCase();
var DATE_HEADER = "date";
var GENERATED_HEADERS = [AUTH_HEADER, AMZ_DATE_HEADER, DATE_HEADER];
var SIGNATURE_HEADER = SIGNATURE_QUERY_PARAM.toLowerCase();
var SHA256_HEADER = "x-amz-content-sha256";
var TOKEN_HEADER = TOKEN_QUERY_PARAM.toLowerCase();
var ALWAYS_UNSIGNABLE_HEADERS = {
  authorization: true,
  "cache-control": true,
  connection: true,
  expect: true,
  from: true,
  "keep-alive": true,
  "max-forwards": true,
  pragma: true,
  referer: true,
  te: true,
  trailer: true,
  "transfer-encoding": true,
  upgrade: true,
  "user-agent": true,
  "x-amzn-trace-id": true
};
var PROXY_HEADER_PATTERN = /^proxy-/;
var SEC_HEADER_PATTERN = /^sec-/;
var ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
var EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
var UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
var MAX_CACHE_SIZE = 50;
var KEY_TYPE_IDENTIFIER = "aws4_request";
var MAX_PRESIGNED_TTL = 60 * 60 * 24 * 7;

// ../../node_modules/@smithy/signature-v4/dist-es/credentialDerivation.js
var signingKeyCache = {};
var cacheQueue = [];
var createScope = (shortDate, region, service) => `${shortDate}/${region}/${service}/${KEY_TYPE_IDENTIFIER}`;
var getSigningKey = (sha256Constructor, credentials, shortDate, region, service) => __async(void 0, null, function* () {
  const credsHash = yield hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId);
  const cacheKey = `${shortDate}:${region}:${service}:${toHex(credsHash)}:${credentials.sessionToken}`;
  if (cacheKey in signingKeyCache) {
    return signingKeyCache[cacheKey];
  }
  cacheQueue.push(cacheKey);
  while (cacheQueue.length > MAX_CACHE_SIZE) {
    delete signingKeyCache[cacheQueue.shift()];
  }
  let key = `AWS4${credentials.secretAccessKey}`;
  for (const signable of [shortDate, region, service, KEY_TYPE_IDENTIFIER]) {
    key = yield hmac(sha256Constructor, key, signable);
  }
  return signingKeyCache[cacheKey] = key;
});
var hmac = (ctor, secret, data) => {
  const hash = new ctor(secret);
  hash.update(toUint8Array(data));
  return hash.digest();
};

// ../../node_modules/@smithy/signature-v4/dist-es/getCanonicalHeaders.js
var getCanonicalHeaders = ({
  headers
}, unsignableHeaders, signableHeaders) => {
  const canonical = {};
  for (const headerName of Object.keys(headers).sort()) {
    if (headers[headerName] == void 0) {
      continue;
    }
    const canonicalHeaderName = headerName.toLowerCase();
    if (canonicalHeaderName in ALWAYS_UNSIGNABLE_HEADERS || unsignableHeaders?.has(canonicalHeaderName) || PROXY_HEADER_PATTERN.test(canonicalHeaderName) || SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
      if (!signableHeaders || signableHeaders && !signableHeaders.has(canonicalHeaderName)) {
        continue;
      }
    }
    canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
  }
  return canonical;
};

// ../../node_modules/@smithy/signature-v4/dist-es/getCanonicalQuery.js
var getCanonicalQuery = ({
  query = {}
}) => {
  const keys = [];
  const serialized = {};
  for (const key of Object.keys(query)) {
    if (key.toLowerCase() === SIGNATURE_HEADER) {
      continue;
    }
    const encodedKey = escapeUri(key);
    keys.push(encodedKey);
    const value = query[key];
    if (typeof value === "string") {
      serialized[encodedKey] = `${encodedKey}=${escapeUri(value)}`;
    } else if (Array.isArray(value)) {
      serialized[encodedKey] = value.slice(0).reduce((encoded, value2) => encoded.concat([`${encodedKey}=${escapeUri(value2)}`]), []).sort().join("&");
    }
  }
  return keys.sort().map((key) => serialized[key]).filter((serialized2) => serialized2).join("&");
};

// ../../node_modules/@smithy/is-array-buffer/dist-es/index.js
var isArrayBuffer = (arg) => typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer || Object.prototype.toString.call(arg) === "[object ArrayBuffer]";

// ../../node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js
var getPayloadHash = (_0, _1) => __async(void 0, [_0, _1], function* ({
  headers,
  body
}, hashConstructor) {
  for (const headerName of Object.keys(headers)) {
    if (headerName.toLowerCase() === SHA256_HEADER) {
      return headers[headerName];
    }
  }
  if (body == void 0) {
    return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  } else if (typeof body === "string" || ArrayBuffer.isView(body) || isArrayBuffer(body)) {
    const hashCtor = new hashConstructor();
    hashCtor.update(toUint8Array(body));
    return toHex(yield hashCtor.digest());
  }
  return UNSIGNED_PAYLOAD;
});

// ../../node_modules/@smithy/signature-v4/dist-es/HeaderFormatter.js
var HeaderFormatter = class {
  format(headers) {
    const chunks = [];
    for (const headerName of Object.keys(headers)) {
      const bytes = fromUtf8(headerName);
      chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
    }
    const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
    let position = 0;
    for (const chunk of chunks) {
      out.set(chunk, position);
      position += chunk.byteLength;
    }
    return out;
  }
  formatHeaderValue(header) {
    switch (header.type) {
      case "boolean":
        return Uint8Array.from([header.value ? 0 : 1]);
      case "byte":
        return Uint8Array.from([2, header.value]);
      case "short":
        const shortView = new DataView(new ArrayBuffer(3));
        shortView.setUint8(0, 3);
        shortView.setInt16(1, header.value, false);
        return new Uint8Array(shortView.buffer);
      case "integer":
        const intView = new DataView(new ArrayBuffer(5));
        intView.setUint8(0, 4);
        intView.setInt32(1, header.value, false);
        return new Uint8Array(intView.buffer);
      case "long":
        const longBytes = new Uint8Array(9);
        longBytes[0] = 5;
        longBytes.set(header.value.bytes, 1);
        return longBytes;
      case "binary":
        const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
        binView.setUint8(0, 6);
        binView.setUint16(1, header.value.byteLength, false);
        const binBytes = new Uint8Array(binView.buffer);
        binBytes.set(header.value, 3);
        return binBytes;
      case "string":
        const utf8Bytes = fromUtf8(header.value);
        const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
        strView.setUint8(0, 7);
        strView.setUint16(1, utf8Bytes.byteLength, false);
        const strBytes = new Uint8Array(strView.buffer);
        strBytes.set(utf8Bytes, 3);
        return strBytes;
      case "timestamp":
        const tsBytes = new Uint8Array(9);
        tsBytes[0] = 8;
        tsBytes.set(Int64.fromNumber(header.value.valueOf()).bytes, 1);
        return tsBytes;
      case "uuid":
        if (!UUID_PATTERN.test(header.value)) {
          throw new Error(`Invalid UUID received: ${header.value}`);
        }
        const uuidBytes = new Uint8Array(17);
        uuidBytes[0] = 9;
        uuidBytes.set(fromHex(header.value.replace(/\-/g, "")), 1);
        return uuidBytes;
    }
  }
};
var HEADER_VALUE_TYPE;
(function(HEADER_VALUE_TYPE2) {
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["boolTrue"] = 0] = "boolTrue";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["boolFalse"] = 1] = "boolFalse";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["byte"] = 2] = "byte";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["short"] = 3] = "short";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["integer"] = 4] = "integer";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["long"] = 5] = "long";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["byteArray"] = 6] = "byteArray";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["string"] = 7] = "string";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["timestamp"] = 8] = "timestamp";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["uuid"] = 9] = "uuid";
})(HEADER_VALUE_TYPE || (HEADER_VALUE_TYPE = {}));
var UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
var Int64 = class _Int64 {
  constructor(bytes) {
    this.bytes = bytes;
    if (bytes.byteLength !== 8) {
      throw new Error("Int64 buffers must be exactly 8 bytes");
    }
  }
  static fromNumber(number) {
    if (number > 9223372036854776e3 || number < -9223372036854776e3) {
      throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
    }
    const bytes = new Uint8Array(8);
    for (let i2 = 7, remaining = Math.abs(Math.round(number)); i2 > -1 && remaining > 0; i2--, remaining /= 256) {
      bytes[i2] = remaining;
    }
    if (number < 0) {
      negate(bytes);
    }
    return new _Int64(bytes);
  }
  valueOf() {
    const bytes = this.bytes.slice(0);
    const negative = bytes[0] & 128;
    if (negative) {
      negate(bytes);
    }
    return parseInt(toHex(bytes), 16) * (negative ? -1 : 1);
  }
  toString() {
    return String(this.valueOf());
  }
};
function negate(bytes) {
  for (let i2 = 0; i2 < 8; i2++) {
    bytes[i2] ^= 255;
  }
  for (let i2 = 7; i2 > -1; i2--) {
    bytes[i2]++;
    if (bytes[i2] !== 0) break;
  }
}

// ../../node_modules/@smithy/signature-v4/dist-es/headerUtil.js
var hasHeader = (soughtHeader, headers) => {
  soughtHeader = soughtHeader.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (soughtHeader === headerName.toLowerCase()) {
      return true;
    }
  }
  return false;
};

// ../../node_modules/@smithy/signature-v4/dist-es/moveHeadersToQuery.js
var moveHeadersToQuery = (request, options = {}) => {
  const {
    headers,
    query = {}
  } = HttpRequest.clone(request);
  for (const name of Object.keys(headers)) {
    const lname = name.toLowerCase();
    if (lname.slice(0, 6) === "x-amz-" && !options.unhoistableHeaders?.has(lname) || options.hoistableHeaders?.has(lname)) {
      query[name] = headers[name];
      delete headers[name];
    }
  }
  return __spreadProps(__spreadValues({}, request), {
    headers,
    query
  });
};

// ../../node_modules/@smithy/signature-v4/dist-es/prepareRequest.js
var prepareRequest = (request) => {
  request = HttpRequest.clone(request);
  for (const headerName of Object.keys(request.headers)) {
    if (GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) {
      delete request.headers[headerName];
    }
  }
  return request;
};

// ../../node_modules/@smithy/signature-v4/dist-es/utilDate.js
var iso8601 = (time) => toDate(time).toISOString().replace(/\.\d{3}Z$/, "Z");
var toDate = (time) => {
  if (typeof time === "number") {
    return new Date(time * 1e3);
  }
  if (typeof time === "string") {
    if (Number(time)) {
      return new Date(Number(time) * 1e3);
    }
    return new Date(time);
  }
  return time;
};

// ../../node_modules/@smithy/signature-v4/dist-es/SignatureV4.js
var SignatureV4 = class {
  constructor({
    applyChecksum,
    credentials,
    region,
    service,
    sha256,
    uriEscapePath = true
  }) {
    this.headerFormatter = new HeaderFormatter();
    this.service = service;
    this.sha256 = sha256;
    this.uriEscapePath = uriEscapePath;
    this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
    this.regionProvider = normalizeProvider(region);
    this.credentialProvider = normalizeProvider(credentials);
  }
  presign(_0) {
    return __async(this, arguments, function* (originalRequest, options = {}) {
      const {
        signingDate = /* @__PURE__ */ new Date(),
        expiresIn = 3600,
        unsignableHeaders,
        unhoistableHeaders,
        signableHeaders,
        hoistableHeaders,
        signingRegion,
        signingService
      } = options;
      const credentials = yield this.credentialProvider();
      this.validateResolvedCredentials(credentials);
      const region = signingRegion ?? (yield this.regionProvider());
      const {
        longDate,
        shortDate
      } = formatDate(signingDate);
      if (expiresIn > MAX_PRESIGNED_TTL) {
        return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
      }
      const scope = createScope(shortDate, region, signingService ?? this.service);
      const request = moveHeadersToQuery(prepareRequest(originalRequest), {
        unhoistableHeaders,
        hoistableHeaders
      });
      if (credentials.sessionToken) {
        request.query[TOKEN_QUERY_PARAM] = credentials.sessionToken;
      }
      request.query[ALGORITHM_QUERY_PARAM] = ALGORITHM_IDENTIFIER;
      request.query[CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`;
      request.query[AMZ_DATE_QUERY_PARAM] = longDate;
      request.query[EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
      const canonicalHeaders = getCanonicalHeaders(request, unsignableHeaders, signableHeaders);
      request.query[SIGNED_HEADERS_QUERY_PARAM] = getCanonicalHeaderList(canonicalHeaders);
      request.query[SIGNATURE_QUERY_PARAM] = yield this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, yield getPayloadHash(originalRequest, this.sha256)));
      return request;
    });
  }
  sign(toSign, options) {
    return __async(this, null, function* () {
      if (typeof toSign === "string") {
        return this.signString(toSign, options);
      } else if (toSign.headers && toSign.payload) {
        return this.signEvent(toSign, options);
      } else if (toSign.message) {
        return this.signMessage(toSign, options);
      } else {
        return this.signRequest(toSign, options);
      }
    });
  }
  signEvent(_0, _1) {
    return __async(this, arguments, function* ({
      headers,
      payload
    }, {
      signingDate = /* @__PURE__ */ new Date(),
      priorSignature,
      signingRegion,
      signingService
    }) {
      const region = signingRegion ?? (yield this.regionProvider());
      const {
        shortDate,
        longDate
      } = formatDate(signingDate);
      const scope = createScope(shortDate, region, signingService ?? this.service);
      const hashedPayload = yield getPayloadHash({
        headers: {},
        body: payload
      }, this.sha256);
      const hash = new this.sha256();
      hash.update(headers);
      const hashedHeaders = toHex(yield hash.digest());
      const stringToSign = [EVENT_ALGORITHM_IDENTIFIER, longDate, scope, priorSignature, hashedHeaders, hashedPayload].join("\n");
      return this.signString(stringToSign, {
        signingDate,
        signingRegion: region,
        signingService
      });
    });
  }
  signMessage(_0, _1) {
    return __async(this, arguments, function* (signableMessage, {
      signingDate = /* @__PURE__ */ new Date(),
      signingRegion,
      signingService
    }) {
      const promise = this.signEvent({
        headers: this.headerFormatter.format(signableMessage.message.headers),
        payload: signableMessage.message.body
      }, {
        signingDate,
        signingRegion,
        signingService,
        priorSignature: signableMessage.priorSignature
      });
      return promise.then((signature) => {
        return {
          message: signableMessage.message,
          signature
        };
      });
    });
  }
  signString(_0) {
    return __async(this, arguments, function* (stringToSign, {
      signingDate = /* @__PURE__ */ new Date(),
      signingRegion,
      signingService
    } = {}) {
      const credentials = yield this.credentialProvider();
      this.validateResolvedCredentials(credentials);
      const region = signingRegion ?? (yield this.regionProvider());
      const {
        shortDate
      } = formatDate(signingDate);
      const hash = new this.sha256(yield this.getSigningKey(credentials, region, shortDate, signingService));
      hash.update(toUint8Array(stringToSign));
      return toHex(yield hash.digest());
    });
  }
  signRequest(_0) {
    return __async(this, arguments, function* (requestToSign, {
      signingDate = /* @__PURE__ */ new Date(),
      signableHeaders,
      unsignableHeaders,
      signingRegion,
      signingService
    } = {}) {
      const credentials = yield this.credentialProvider();
      this.validateResolvedCredentials(credentials);
      const region = signingRegion ?? (yield this.regionProvider());
      const request = prepareRequest(requestToSign);
      const {
        longDate,
        shortDate
      } = formatDate(signingDate);
      const scope = createScope(shortDate, region, signingService ?? this.service);
      request.headers[AMZ_DATE_HEADER] = longDate;
      if (credentials.sessionToken) {
        request.headers[TOKEN_HEADER] = credentials.sessionToken;
      }
      const payloadHash = yield getPayloadHash(request, this.sha256);
      if (!hasHeader(SHA256_HEADER, request.headers) && this.applyChecksum) {
        request.headers[SHA256_HEADER] = payloadHash;
      }
      const canonicalHeaders = getCanonicalHeaders(request, unsignableHeaders, signableHeaders);
      const signature = yield this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, payloadHash));
      request.headers[AUTH_HEADER] = `${ALGORITHM_IDENTIFIER} Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${getCanonicalHeaderList(canonicalHeaders)}, Signature=${signature}`;
      return request;
    });
  }
  createCanonicalRequest(request, canonicalHeaders, payloadHash) {
    const sortedHeaders = Object.keys(canonicalHeaders).sort();
    return `${request.method}
${this.getCanonicalPath(request)}
${getCanonicalQuery(request)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders[name]}`).join("\n")}

${sortedHeaders.join(";")}
${payloadHash}`;
  }
  createStringToSign(longDate, credentialScope, canonicalRequest) {
    return __async(this, null, function* () {
      const hash = new this.sha256();
      hash.update(toUint8Array(canonicalRequest));
      const hashedRequest = yield hash.digest();
      return `${ALGORITHM_IDENTIFIER}
${longDate}
${credentialScope}
${toHex(hashedRequest)}`;
    });
  }
  getCanonicalPath({
    path
  }) {
    if (this.uriEscapePath) {
      const normalizedPathSegments = [];
      for (const pathSegment of path.split("/")) {
        if (pathSegment?.length === 0) continue;
        if (pathSegment === ".") continue;
        if (pathSegment === "..") {
          normalizedPathSegments.pop();
        } else {
          normalizedPathSegments.push(pathSegment);
        }
      }
      const normalizedPath = `${path?.startsWith("/") ? "/" : ""}${normalizedPathSegments.join("/")}${normalizedPathSegments.length > 0 && path?.endsWith("/") ? "/" : ""}`;
      const doubleEncoded = escapeUri(normalizedPath);
      return doubleEncoded.replace(/%2F/g, "/");
    }
    return path;
  }
  getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
    return __async(this, null, function* () {
      const stringToSign = yield this.createStringToSign(longDate, credentialScope, canonicalRequest);
      const hash = new this.sha256(yield keyPromise);
      hash.update(toUint8Array(stringToSign));
      return toHex(yield hash.digest());
    });
  }
  getSigningKey(credentials, region, shortDate, service) {
    return getSigningKey(this.sha256, credentials, shortDate, region, service || this.service);
  }
  validateResolvedCredentials(credentials) {
    if (typeof credentials !== "object" || typeof credentials.accessKeyId !== "string" || typeof credentials.secretAccessKey !== "string") {
      throw new Error("Resolved credential object is not valid");
    }
  }
};
var formatDate = (now) => {
  const longDate = iso8601(now).replace(/[\-:]/g, "");
  return {
    longDate,
    shortDate: longDate.slice(0, 8)
  };
};
var getCanonicalHeaderList = (headers) => Object.keys(headers).sort().join(";");

// ../../node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/resolveAwsSdkSigV4Config.js
var resolveAwsSdkSigV4Config = (config) => {
  let isUserSupplied = false;
  let normalizedCreds;
  if (config.credentials) {
    isUserSupplied = true;
    normalizedCreds = memoizeIdentityProvider(config.credentials, isIdentityExpired, doesIdentityRequireRefresh);
  }
  if (!normalizedCreds) {
    if (config.credentialDefaultProvider) {
      normalizedCreds = normalizeProvider2(config.credentialDefaultProvider(Object.assign({}, config, {
        parentClientConfig: config
      })));
    } else {
      normalizedCreds = () => __async(void 0, null, function* () {
        throw new Error("`credentials` is missing");
      });
    }
  }
  const {
    signingEscapePath = true,
    systemClockOffset = config.systemClockOffset || 0,
    sha256
  } = config;
  let signer;
  if (config.signer) {
    signer = normalizeProvider2(config.signer);
  } else if (config.regionInfoProvider) {
    signer = () => normalizeProvider2(config.region)().then((region) => __async(void 0, null, function* () {
      return [(yield config.regionInfoProvider(region, {
        useFipsEndpoint: yield config.useFipsEndpoint(),
        useDualstackEndpoint: yield config.useDualstackEndpoint()
      })) || {}, region];
    })).then(([regionInfo, region]) => {
      const {
        signingRegion,
        signingService
      } = regionInfo;
      config.signingRegion = config.signingRegion || signingRegion || region;
      config.signingName = config.signingName || signingService || config.serviceId;
      const params = __spreadProps(__spreadValues({}, config), {
        credentials: normalizedCreds,
        region: config.signingRegion,
        service: config.signingName,
        sha256,
        uriEscapePath: signingEscapePath
      });
      const SignerCtor = config.signerConstructor || SignatureV4;
      return new SignerCtor(params);
    });
  } else {
    signer = (authScheme) => __async(void 0, null, function* () {
      authScheme = Object.assign({}, {
        name: "sigv4",
        signingName: config.signingName || config.defaultSigningName,
        signingRegion: yield normalizeProvider2(config.region)(),
        properties: {}
      }, authScheme);
      const signingRegion = authScheme.signingRegion;
      const signingService = authScheme.signingName;
      config.signingRegion = config.signingRegion || signingRegion;
      config.signingName = config.signingName || signingService || config.serviceId;
      const params = __spreadProps(__spreadValues({}, config), {
        credentials: normalizedCreds,
        region: config.signingRegion,
        service: config.signingName,
        sha256,
        uriEscapePath: signingEscapePath
      });
      const SignerCtor = config.signerConstructor || SignatureV4;
      return new SignerCtor(params);
    });
  }
  return __spreadProps(__spreadValues({}, config), {
    systemClockOffset,
    signingEscapePath,
    credentials: isUserSupplied ? () => __async(void 0, null, function* () {
      return normalizedCreds().then((creds) => setCredentialFeature(creds, "CREDENTIALS_CODE", "e"));
    }) : normalizedCreds,
    signer
  });
};

// ../../node_modules/@smithy/middleware-stack/dist-es/MiddlewareStack.js
var getAllAliases = (name, aliases) => {
  const _aliases = [];
  if (name) {
    _aliases.push(name);
  }
  if (aliases) {
    for (const alias of aliases) {
      _aliases.push(alias);
    }
  }
  return _aliases;
};
var getMiddlewareNameWithAliases = (name, aliases) => {
  return `${name || "anonymous"}${aliases && aliases.length > 0 ? ` (a.k.a. ${aliases.join(",")})` : ""}`;
};
var constructStack = () => {
  let absoluteEntries = [];
  let relativeEntries = [];
  let identifyOnResolve = false;
  const entriesNameSet = /* @__PURE__ */ new Set();
  const sort = (entries) => entries.sort((a2, b2) => stepWeights[b2.step] - stepWeights[a2.step] || priorityWeights[b2.priority || "normal"] - priorityWeights[a2.priority || "normal"]);
  const removeByName = (toRemove) => {
    let isRemoved = false;
    const filterCb = (entry) => {
      const aliases = getAllAliases(entry.name, entry.aliases);
      if (aliases.includes(toRemove)) {
        isRemoved = true;
        for (const alias of aliases) {
          entriesNameSet.delete(alias);
        }
        return false;
      }
      return true;
    };
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  };
  const removeByReference = (toRemove) => {
    let isRemoved = false;
    const filterCb = (entry) => {
      if (entry.middleware === toRemove) {
        isRemoved = true;
        for (const alias of getAllAliases(entry.name, entry.aliases)) {
          entriesNameSet.delete(alias);
        }
        return false;
      }
      return true;
    };
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  };
  const cloneTo = (toStack) => {
    absoluteEntries.forEach((entry) => {
      toStack.add(entry.middleware, __spreadValues({}, entry));
    });
    relativeEntries.forEach((entry) => {
      toStack.addRelativeTo(entry.middleware, __spreadValues({}, entry));
    });
    toStack.identifyOnResolve?.(stack.identifyOnResolve());
    return toStack;
  };
  const expandRelativeMiddlewareList = (from) => {
    const expandedMiddlewareList = [];
    from.before.forEach((entry) => {
      if (entry.before.length === 0 && entry.after.length === 0) {
        expandedMiddlewareList.push(entry);
      } else {
        expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
      }
    });
    expandedMiddlewareList.push(from);
    from.after.reverse().forEach((entry) => {
      if (entry.before.length === 0 && entry.after.length === 0) {
        expandedMiddlewareList.push(entry);
      } else {
        expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
      }
    });
    return expandedMiddlewareList;
  };
  const getMiddlewareList = (debug = false) => {
    const normalizedAbsoluteEntries = [];
    const normalizedRelativeEntries = [];
    const normalizedEntriesNameMap = {};
    absoluteEntries.forEach((entry) => {
      const normalizedEntry = __spreadProps(__spreadValues({}, entry), {
        before: [],
        after: []
      });
      for (const alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases)) {
        normalizedEntriesNameMap[alias] = normalizedEntry;
      }
      normalizedAbsoluteEntries.push(normalizedEntry);
    });
    relativeEntries.forEach((entry) => {
      const normalizedEntry = __spreadProps(__spreadValues({}, entry), {
        before: [],
        after: []
      });
      for (const alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases)) {
        normalizedEntriesNameMap[alias] = normalizedEntry;
      }
      normalizedRelativeEntries.push(normalizedEntry);
    });
    normalizedRelativeEntries.forEach((entry) => {
      if (entry.toMiddleware) {
        const toMiddleware = normalizedEntriesNameMap[entry.toMiddleware];
        if (toMiddleware === void 0) {
          if (debug) {
            return;
          }
          throw new Error(`${entry.toMiddleware} is not found when adding ${getMiddlewareNameWithAliases(entry.name, entry.aliases)} middleware ${entry.relation} ${entry.toMiddleware}`);
        }
        if (entry.relation === "after") {
          toMiddleware.after.push(entry);
        }
        if (entry.relation === "before") {
          toMiddleware.before.push(entry);
        }
      }
    });
    const mainChain = sort(normalizedAbsoluteEntries).map(expandRelativeMiddlewareList).reduce((wholeList, expandedMiddlewareList) => {
      wholeList.push(...expandedMiddlewareList);
      return wholeList;
    }, []);
    return mainChain;
  };
  const stack = {
    add: (middleware, options = {}) => {
      const {
        name,
        override,
        aliases: _aliases
      } = options;
      const entry = __spreadValues({
        step: "initialize",
        priority: "normal",
        middleware
      }, options);
      const aliases = getAllAliases(name, _aliases);
      if (aliases.length > 0) {
        if (aliases.some((alias) => entriesNameSet.has(alias))) {
          if (!override) throw new Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
          for (const alias of aliases) {
            const toOverrideIndex = absoluteEntries.findIndex((entry2) => entry2.name === alias || entry2.aliases?.some((a2) => a2 === alias));
            if (toOverrideIndex === -1) {
              continue;
            }
            const toOverride = absoluteEntries[toOverrideIndex];
            if (toOverride.step !== entry.step || entry.priority !== toOverride.priority) {
              throw new Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware with ${toOverride.priority} priority in ${toOverride.step} step cannot be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware with ${entry.priority} priority in ${entry.step} step.`);
            }
            absoluteEntries.splice(toOverrideIndex, 1);
          }
        }
        for (const alias of aliases) {
          entriesNameSet.add(alias);
        }
      }
      absoluteEntries.push(entry);
    },
    addRelativeTo: (middleware, options) => {
      const {
        name,
        override,
        aliases: _aliases
      } = options;
      const entry = __spreadValues({
        middleware
      }, options);
      const aliases = getAllAliases(name, _aliases);
      if (aliases.length > 0) {
        if (aliases.some((alias) => entriesNameSet.has(alias))) {
          if (!override) throw new Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
          for (const alias of aliases) {
            const toOverrideIndex = relativeEntries.findIndex((entry2) => entry2.name === alias || entry2.aliases?.some((a2) => a2 === alias));
            if (toOverrideIndex === -1) {
              continue;
            }
            const toOverride = relativeEntries[toOverrideIndex];
            if (toOverride.toMiddleware !== entry.toMiddleware || toOverride.relation !== entry.relation) {
              throw new Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware ${toOverride.relation} "${toOverride.toMiddleware}" middleware cannot be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware ${entry.relation} "${entry.toMiddleware}" middleware.`);
            }
            relativeEntries.splice(toOverrideIndex, 1);
          }
        }
        for (const alias of aliases) {
          entriesNameSet.add(alias);
        }
      }
      relativeEntries.push(entry);
    },
    clone: () => cloneTo(constructStack()),
    use: (plugin) => {
      plugin.applyToStack(stack);
    },
    remove: (toRemove) => {
      if (typeof toRemove === "string") return removeByName(toRemove);
      else return removeByReference(toRemove);
    },
    removeByTag: (toRemove) => {
      let isRemoved = false;
      const filterCb = (entry) => {
        const {
          tags,
          name,
          aliases: _aliases
        } = entry;
        if (tags && tags.includes(toRemove)) {
          const aliases = getAllAliases(name, _aliases);
          for (const alias of aliases) {
            entriesNameSet.delete(alias);
          }
          isRemoved = true;
          return false;
        }
        return true;
      };
      absoluteEntries = absoluteEntries.filter(filterCb);
      relativeEntries = relativeEntries.filter(filterCb);
      return isRemoved;
    },
    concat: (from) => {
      const cloned = cloneTo(constructStack());
      cloned.use(from);
      cloned.identifyOnResolve(identifyOnResolve || cloned.identifyOnResolve() || (from.identifyOnResolve?.() ?? false));
      return cloned;
    },
    applyToStack: cloneTo,
    identify: () => {
      return getMiddlewareList(true).map((mw) => {
        const step = mw.step ?? mw.relation + " " + mw.toMiddleware;
        return getMiddlewareNameWithAliases(mw.name, mw.aliases) + " - " + step;
      });
    },
    identifyOnResolve(toggle) {
      if (typeof toggle === "boolean") identifyOnResolve = toggle;
      return identifyOnResolve;
    },
    resolve: (handler, context) => {
      for (const middleware of getMiddlewareList().map((entry) => entry.middleware).reverse()) {
        handler = middleware(handler, context);
      }
      if (identifyOnResolve) {
        console.log(stack.identify());
      }
      return handler;
    }
  };
  return stack;
};
var stepWeights = {
  initialize: 5,
  serialize: 4,
  build: 3,
  finalizeRequest: 2,
  deserialize: 1
};
var priorityWeights = {
  high: 3,
  normal: 2,
  low: 1
};

// ../../node_modules/@smithy/smithy-client/dist-es/client.js
var Client = class {
  constructor(config) {
    this.config = config;
    this.middlewareStack = constructStack();
  }
  send(command, optionsOrCb, cb) {
    const options = typeof optionsOrCb !== "function" ? optionsOrCb : void 0;
    const callback = typeof optionsOrCb === "function" ? optionsOrCb : cb;
    const useHandlerCache = options === void 0 && this.config.cacheMiddleware === true;
    let handler;
    if (useHandlerCache) {
      if (!this.handlers) {
        this.handlers = /* @__PURE__ */ new WeakMap();
      }
      const handlers = this.handlers;
      if (handlers.has(command.constructor)) {
        handler = handlers.get(command.constructor);
      } else {
        handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
        handlers.set(command.constructor, handler);
      }
    } else {
      delete this.handlers;
      handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
    }
    if (callback) {
      handler(command).then((result) => callback(null, result.output), (err) => callback(err)).catch(() => {
      });
    } else {
      return handler(command).then((result) => result.output);
    }
  }
  destroy() {
    this.config?.requestHandler?.destroy?.();
    delete this.handlers;
  }
};

// ../../node_modules/@smithy/smithy-client/dist-es/command.js
var Command = class {
  constructor() {
    this.middlewareStack = constructStack();
  }
  static classBuilder() {
    return new ClassBuilder();
  }
  resolveMiddlewareWithContext(clientStack, configuration, options, {
    middlewareFn,
    clientName,
    commandName,
    inputFilterSensitiveLog,
    outputFilterSensitiveLog,
    smithyContext,
    additionalContext,
    CommandCtor
  }) {
    for (const mw of middlewareFn.bind(this)(CommandCtor, clientStack, configuration, options)) {
      this.middlewareStack.use(mw);
    }
    const stack = clientStack.concat(this.middlewareStack);
    const {
      logger: logger2
    } = configuration;
    const handlerExecutionContext = __spreadValues({
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog,
      outputFilterSensitiveLog,
      [SMITHY_CONTEXT_KEY]: __spreadValues({
        commandInstance: this
      }, smithyContext)
    }, additionalContext);
    const {
      requestHandler
    } = configuration;
    return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
  }
};
var ClassBuilder = class {
  constructor() {
    this._init = () => {
    };
    this._ep = {};
    this._middlewareFn = () => [];
    this._commandName = "";
    this._clientName = "";
    this._additionalContext = {};
    this._smithyContext = {};
    this._inputFilterSensitiveLog = (_) => _;
    this._outputFilterSensitiveLog = (_) => _;
    this._serializer = null;
    this._deserializer = null;
  }
  init(cb) {
    this._init = cb;
  }
  ep(endpointParameterInstructions) {
    this._ep = endpointParameterInstructions;
    return this;
  }
  m(middlewareSupplier) {
    this._middlewareFn = middlewareSupplier;
    return this;
  }
  s(service, operation, smithyContext = {}) {
    this._smithyContext = __spreadValues({
      service,
      operation
    }, smithyContext);
    return this;
  }
  c(additionalContext = {}) {
    this._additionalContext = additionalContext;
    return this;
  }
  n(clientName, commandName) {
    this._clientName = clientName;
    this._commandName = commandName;
    return this;
  }
  f(inputFilter = (_) => _, outputFilter = (_) => _) {
    this._inputFilterSensitiveLog = inputFilter;
    this._outputFilterSensitiveLog = outputFilter;
    return this;
  }
  ser(serializer) {
    this._serializer = serializer;
    return this;
  }
  de(deserializer) {
    this._deserializer = deserializer;
    return this;
  }
  build() {
    const closure = this;
    let CommandRef;
    return CommandRef = class extends Command {
      static getEndpointParameterInstructions() {
        return closure._ep;
      }
      constructor(...[input]) {
        super();
        this.serialize = closure._serializer;
        this.deserialize = closure._deserializer;
        this.input = input ?? {};
        closure._init(this);
      }
      resolveMiddleware(stack, configuration, options) {
        return this.resolveMiddlewareWithContext(stack, configuration, options, {
          CommandCtor: CommandRef,
          middlewareFn: closure._middlewareFn,
          clientName: closure._clientName,
          commandName: closure._commandName,
          inputFilterSensitiveLog: closure._inputFilterSensitiveLog,
          outputFilterSensitiveLog: closure._outputFilterSensitiveLog,
          smithyContext: closure._smithyContext,
          additionalContext: closure._additionalContext
        });
      }
    };
  }
};

// ../../node_modules/@smithy/smithy-client/dist-es/constants.js
var SENSITIVE_STRING = "***SensitiveInformation***";

// ../../node_modules/@smithy/smithy-client/dist-es/create-aggregated-client.js
var createAggregatedClient = (commands2, Client2) => {
  for (const command of Object.keys(commands2)) {
    const CommandCtor = commands2[command];
    const methodImpl = function(args, optionsOrCb, cb) {
      return __async(this, null, function* () {
        const command2 = new CommandCtor(args);
        if (typeof optionsOrCb === "function") {
          this.send(command2, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object") throw new Error(`Expected http options but got ${typeof optionsOrCb}`);
          this.send(command2, optionsOrCb || {}, cb);
        } else {
          return this.send(command2, optionsOrCb);
        }
      });
    };
    const methodName = (command[0].toLowerCase() + command.slice(1)).replace(/Command$/, "");
    Client2.prototype[methodName] = methodImpl;
  }
};

// ../../node_modules/@smithy/smithy-client/dist-es/parse-utils.js
var expectBoolean = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "number") {
    if (value === 0 || value === 1) {
      logger.warn(stackTraceWarning(`Expected boolean, got ${typeof value}: ${value}`));
    }
    if (value === 0) {
      return false;
    }
    if (value === 1) {
      return true;
    }
  }
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (lower === "false" || lower === "true") {
      logger.warn(stackTraceWarning(`Expected boolean, got ${typeof value}: ${value}`));
    }
    if (lower === "false") {
      return false;
    }
    if (lower === "true") {
      return true;
    }
  }
  if (typeof value === "boolean") {
    return value;
  }
  throw new TypeError(`Expected boolean, got ${typeof value}: ${value}`);
};
var expectNumber = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (!Number.isNaN(parsed)) {
      if (String(parsed) !== String(value)) {
        logger.warn(stackTraceWarning(`Expected number but observed string: ${value}`));
      }
      return parsed;
    }
  }
  if (typeof value === "number") {
    return value;
  }
  throw new TypeError(`Expected number, got ${typeof value}: ${value}`);
};
var MAX_FLOAT = Math.ceil(2 ** 127 * (2 - 2 ** -23));
var expectLong = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (Number.isInteger(value) && !Number.isNaN(value)) {
    return value;
  }
  throw new TypeError(`Expected integer, got ${typeof value}: ${value}`);
};
var expectInt32 = (value) => expectSizedInt(value, 32);
var expectSizedInt = (value, size) => {
  const expected = expectLong(value);
  if (expected !== void 0 && castInt(expected, size) !== expected) {
    throw new TypeError(`Expected ${size}-bit integer, got ${value}`);
  }
  return expected;
};
var castInt = (value, size) => {
  switch (size) {
    case 32:
      return Int32Array.of(value)[0];
    case 16:
      return Int16Array.of(value)[0];
    case 8:
      return Int8Array.of(value)[0];
  }
};
var expectNonNull = (value, location) => {
  if (value === null || value === void 0) {
    if (location) {
      throw new TypeError(`Expected a non-null value for ${location}`);
    }
    throw new TypeError("Expected a non-null value");
  }
  return value;
};
var expectString = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "string") {
    return value;
  }
  if (["boolean", "number", "bigint"].includes(typeof value)) {
    logger.warn(stackTraceWarning(`Expected string, got ${typeof value}: ${value}`));
    return String(value);
  }
  throw new TypeError(`Expected string, got ${typeof value}: ${value}`);
};
var strictParseDouble = (value) => {
  if (typeof value == "string") {
    return expectNumber(parseNumber(value));
  }
  return expectNumber(value);
};
var NUMBER_REGEX = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g;
var parseNumber = (value) => {
  const matches = value.match(NUMBER_REGEX);
  if (matches === null || matches[0].length !== value.length) {
    throw new TypeError(`Expected real number, got implicit NaN`);
  }
  return parseFloat(value);
};
var stackTraceWarning = (message) => {
  return String(new TypeError(message).stack || message).split("\n").slice(0, 5).filter((s2) => !s2.includes("stackTraceWarning")).join("\n");
};
var logger = {
  warn: console.warn
};

// ../../node_modules/@smithy/smithy-client/dist-es/date-utils.js
var RFC3339 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/);
var RFC3339_WITH_OFFSET = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/);
var IMF_FIXDATE = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
var RFC_850_DATE = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
var ASC_TIME = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/);
var parseEpochTimestamp = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  let valueAsDouble;
  if (typeof value === "number") {
    valueAsDouble = value;
  } else if (typeof value === "string") {
    valueAsDouble = strictParseDouble(value);
  } else if (typeof value === "object" && value.tag === 1) {
    valueAsDouble = value.value;
  } else {
    throw new TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
  }
  if (Number.isNaN(valueAsDouble) || valueAsDouble === Infinity || valueAsDouble === -Infinity) {
    throw new TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
  }
  return new Date(Math.round(valueAsDouble * 1e3));
};
var FIFTY_YEARS_IN_MILLIS = 50 * 365 * 24 * 60 * 60 * 1e3;

// ../../node_modules/@smithy/smithy-client/dist-es/exceptions.js
var ServiceException = class _ServiceException extends Error {
  constructor(options) {
    super(options.message);
    Object.setPrototypeOf(this, _ServiceException.prototype);
    this.name = options.name;
    this.$fault = options.$fault;
    this.$metadata = options.$metadata;
  }
};
var decorateServiceException = (exception, additions = {}) => {
  Object.entries(additions).filter(([, v2]) => v2 !== void 0).forEach(([k2, v2]) => {
    if (exception[k2] == void 0 || exception[k2] === "") {
      exception[k2] = v2;
    }
  });
  const message = exception.message || exception.Message || "UnknownError";
  exception.message = message;
  delete exception.Message;
  return exception;
};

// ../../node_modules/@smithy/smithy-client/dist-es/default-error-handler.js
var throwDefaultError = ({
  output,
  parsedBody,
  exceptionCtor,
  errorCode
}) => {
  const $metadata = deserializeMetadata(output);
  const statusCode = $metadata.httpStatusCode ? $metadata.httpStatusCode + "" : void 0;
  const response = new exceptionCtor({
    name: parsedBody?.code || parsedBody?.Code || errorCode || statusCode || "UnknownError",
    $fault: "client",
    $metadata
  });
  throw decorateServiceException(response, parsedBody);
};
var withBaseException = (ExceptionCtor) => {
  return ({
    output,
    parsedBody,
    errorCode
  }) => {
    throwDefaultError({
      output,
      parsedBody,
      exceptionCtor: ExceptionCtor,
      errorCode
    });
  };
};
var deserializeMetadata = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});

// ../../node_modules/@smithy/smithy-client/dist-es/defaults-mode.js
var loadConfigsForDefaultMode = (mode) => {
  switch (mode) {
    case "standard":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "in-region":
      return {
        retryMode: "standard",
        connectionTimeout: 1100
      };
    case "cross-region":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "mobile":
      return {
        retryMode: "standard",
        connectionTimeout: 3e4
      };
    default:
      return {};
  }
};

// ../../node_modules/@smithy/smithy-client/dist-es/extensions/checksum.js
var getChecksumConfiguration2 = (runtimeConfig) => {
  const checksumAlgorithms = [];
  for (const id in AlgorithmId) {
    const algorithmId = AlgorithmId[id];
    if (runtimeConfig[algorithmId] === void 0) {
      continue;
    }
    checksumAlgorithms.push({
      algorithmId: () => algorithmId,
      checksumConstructor: () => runtimeConfig[algorithmId]
    });
  }
  return {
    _checksumAlgorithms: checksumAlgorithms,
    addChecksumAlgorithm(algo) {
      this._checksumAlgorithms.push(algo);
    },
    checksumAlgorithms() {
      return this._checksumAlgorithms;
    }
  };
};
var resolveChecksumRuntimeConfig2 = (clientConfig) => {
  const runtimeConfig = {};
  clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
    runtimeConfig[checksumAlgorithm.algorithmId()] = checksumAlgorithm.checksumConstructor();
  });
  return runtimeConfig;
};

// ../../node_modules/@smithy/smithy-client/dist-es/extensions/retry.js
var getRetryConfiguration = (runtimeConfig) => {
  let _retryStrategy = runtimeConfig.retryStrategy;
  return {
    setRetryStrategy(retryStrategy) {
      _retryStrategy = retryStrategy;
    },
    retryStrategy() {
      return _retryStrategy;
    }
  };
};
var resolveRetryRuntimeConfig = (retryStrategyConfiguration) => {
  const runtimeConfig = {};
  runtimeConfig.retryStrategy = retryStrategyConfiguration.retryStrategy();
  return runtimeConfig;
};

// ../../node_modules/@smithy/smithy-client/dist-es/extensions/defaultExtensionConfiguration.js
var getDefaultExtensionConfiguration = (runtimeConfig) => {
  return __spreadValues(__spreadValues({}, getChecksumConfiguration2(runtimeConfig)), getRetryConfiguration(runtimeConfig));
};
var resolveDefaultRuntimeConfig = (config) => {
  return __spreadValues(__spreadValues({}, resolveChecksumRuntimeConfig2(config)), resolveRetryRuntimeConfig(config));
};

// ../../node_modules/@smithy/smithy-client/dist-es/lazy-json.js
var StringWrapper = function() {
  const Class = Object.getPrototypeOf(this).constructor;
  const Constructor = Function.bind.apply(String, [null, ...arguments]);
  const instance = new Constructor();
  Object.setPrototypeOf(instance, Class.prototype);
  return instance;
};
StringWrapper.prototype = Object.create(String.prototype, {
  constructor: {
    value: StringWrapper,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
Object.setPrototypeOf(StringWrapper, String);

// ../../node_modules/@smithy/smithy-client/dist-es/NoOpLogger.js
var NoOpLogger = class {
  trace() {
  }
  debug() {
  }
  info() {
  }
  warn() {
  }
  error() {
  }
};

// ../../node_modules/@smithy/smithy-client/dist-es/object-mapping.js
var take = (source, instructions) => {
  const out = {};
  for (const key in instructions) {
    applyInstruction(out, source, instructions, key);
  }
  return out;
};
var applyInstruction = (target, source, instructions, targetKey) => {
  if (source !== null) {
    let instruction = instructions[targetKey];
    if (typeof instruction === "function") {
      instruction = [, instruction];
    }
    const [filter2 = nonNullish, valueFn = pass, sourceKey = targetKey] = instruction;
    if (typeof filter2 === "function" && filter2(source[sourceKey]) || typeof filter2 !== "function" && !!filter2) {
      target[targetKey] = valueFn(source[sourceKey]);
    }
    return;
  }
  let [filter, value] = instructions[targetKey];
  if (typeof value === "function") {
    let _value;
    const defaultFilterPassed = filter === void 0 && (_value = value()) != null;
    const customFilterPassed = typeof filter === "function" && !!filter(void 0) || typeof filter !== "function" && !!filter;
    if (defaultFilterPassed) {
      target[targetKey] = _value;
    } else if (customFilterPassed) {
      target[targetKey] = value();
    }
  } else {
    const defaultFilterPassed = filter === void 0 && value != null;
    const customFilterPassed = typeof filter === "function" && !!filter(value) || typeof filter !== "function" && !!filter;
    if (defaultFilterPassed || customFilterPassed) {
      target[targetKey] = value;
    }
  }
};
var nonNullish = (_) => _ != null;
var pass = (_) => _;

// ../../node_modules/@smithy/smithy-client/dist-es/serde-json.js
var _json = (obj) => {
  if (obj == null) {
    return {};
  }
  if (Array.isArray(obj)) {
    return obj.filter((_) => _ != null).map(_json);
  }
  if (typeof obj === "object") {
    const target = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] == null) {
        continue;
      }
      target[key] = _json(obj[key]);
    }
    return target;
  }
  return obj;
};

// ../../node_modules/@aws-sdk/core/dist-es/submodules/protocols/common.js
var collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));

// ../../node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/parseJsonBody.js
var parseJsonBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
  if (encoded.length) {
    try {
      return JSON.parse(encoded);
    } catch (e2) {
      if (e2?.name === "SyntaxError") {
        Object.defineProperty(e2, "$responseBodyText", {
          value: encoded
        });
      }
      throw e2;
    }
  }
  return {};
});
var parseJsonErrorBody = (errorBody, context) => __async(void 0, null, function* () {
  const value = yield parseJsonBody(errorBody, context);
  value.message = value.message ?? value.Message;
  return value;
});
var loadRestJsonErrorCode = (output, data) => {
  const findKey = (object, key) => Object.keys(object).find((k2) => k2.toLowerCase() === key.toLowerCase());
  const sanitizeErrorCode = (rawValue) => {
    let cleanValue = rawValue;
    if (typeof cleanValue === "number") {
      cleanValue = cleanValue.toString();
    }
    if (cleanValue.indexOf(",") >= 0) {
      cleanValue = cleanValue.split(",")[0];
    }
    if (cleanValue.indexOf(":") >= 0) {
      cleanValue = cleanValue.split(":")[0];
    }
    if (cleanValue.indexOf("#") >= 0) {
      cleanValue = cleanValue.split("#")[1];
    }
    return cleanValue;
  };
  const headerKey = findKey(output.headers, "x-amzn-errortype");
  if (headerKey !== void 0) {
    return sanitizeErrorCode(output.headers[headerKey]);
  }
  if (data.code !== void 0) {
    return sanitizeErrorCode(data.code);
  }
  if (data["__type"] !== void 0) {
    return sanitizeErrorCode(data["__type"]);
  }
};

// ../../node_modules/@aws-sdk/core/dist-es/submodules/protocols/xml/parseXmlBody.js
var import_fast_xml_parser = __toESM(require_fxp());

// ../../node_modules/@aws-sdk/middleware-user-agent/dist-es/check-features.js
var ACCOUNT_ID_ENDPOINT_REGEX = /\d{12}\.ddb/;
function checkFeatures(context, config, args) {
  return __async(this, null, function* () {
    const request = args.request;
    if (request?.headers?.["smithy-protocol"] === "rpc-v2-cbor") {
      setFeature2(context, "PROTOCOL_RPC_V2_CBOR", "M");
    }
    if (typeof config.retryStrategy === "function") {
      const retryStrategy = yield config.retryStrategy();
      if (typeof retryStrategy.acquireInitialRetryToken === "function") {
        if (retryStrategy.constructor?.name?.includes("Adaptive")) {
          setFeature2(context, "RETRY_MODE_ADAPTIVE", "F");
        } else {
          setFeature2(context, "RETRY_MODE_STANDARD", "E");
        }
      } else {
        setFeature2(context, "RETRY_MODE_LEGACY", "D");
      }
    }
    if (typeof config.accountIdEndpointMode === "function") {
      const endpointV2 = context.endpointV2;
      if (String(endpointV2?.url?.hostname).match(ACCOUNT_ID_ENDPOINT_REGEX)) {
        setFeature2(context, "ACCOUNT_ID_ENDPOINT", "O");
      }
      switch (yield config.accountIdEndpointMode?.()) {
        case "disabled":
          setFeature2(context, "ACCOUNT_ID_MODE_DISABLED", "Q");
          break;
        case "preferred":
          setFeature2(context, "ACCOUNT_ID_MODE_PREFERRED", "P");
          break;
        case "required":
          setFeature2(context, "ACCOUNT_ID_MODE_REQUIRED", "R");
          break;
      }
    }
    const identity = context.__smithy_context?.selectedHttpAuthScheme?.identity;
    if (identity?.$source) {
      const credentials = identity;
      if (credentials.accountId) {
        setFeature2(context, "RESOLVED_ACCOUNT_ID", "T");
      }
      for (const [key, value] of Object.entries(credentials.$source ?? {})) {
        setFeature2(context, key, value);
      }
    }
  });
}

// ../../node_modules/@aws-sdk/middleware-user-agent/dist-es/constants.js
var USER_AGENT = "user-agent";
var X_AMZ_USER_AGENT = "x-amz-user-agent";
var SPACE = " ";
var UA_NAME_SEPARATOR = "/";
var UA_NAME_ESCAPE_REGEX = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g;
var UA_VALUE_ESCAPE_REGEX = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w\#]/g;
var UA_ESCAPE_CHAR = "-";

// ../../node_modules/@aws-sdk/middleware-user-agent/dist-es/encode-features.js
var BYTE_LIMIT = 1024;
function encodeFeatures(features) {
  let buffer = "";
  for (const key in features) {
    const val2 = features[key];
    if (buffer.length + val2.length + 1 <= BYTE_LIMIT) {
      if (buffer.length) {
        buffer += "," + val2;
      } else {
        buffer += val2;
      }
      continue;
    }
    break;
  }
  return buffer;
}

// ../../node_modules/@aws-sdk/middleware-user-agent/dist-es/user-agent-middleware.js
var userAgentMiddleware = (options) => (next, context) => (args) => __async(void 0, null, function* () {
  const {
    request
  } = args;
  if (!HttpRequest.isInstance(request)) {
    return next(args);
  }
  const {
    headers
  } = request;
  const userAgent = context?.userAgent?.map(escapeUserAgent) || [];
  const defaultUserAgent = (yield options.defaultUserAgentProvider()).map(escapeUserAgent);
  yield checkFeatures(context, options, args);
  const awsContext = context;
  defaultUserAgent.push(`m/${encodeFeatures(Object.assign({}, context.__smithy_context?.features, awsContext.__aws_sdk_context?.features))}`);
  const customUserAgent = options?.customUserAgent?.map(escapeUserAgent) || [];
  const appId = yield options.userAgentAppId();
  if (appId) {
    defaultUserAgent.push(escapeUserAgent([`app/${appId}`]));
  }
  const prefix = getUserAgentPrefix();
  const sdkUserAgentValue = (prefix ? [prefix] : []).concat([...defaultUserAgent, ...userAgent, ...customUserAgent]).join(SPACE);
  const normalUAValue = [...defaultUserAgent.filter((section) => section.startsWith("aws-sdk-")), ...customUserAgent].join(SPACE);
  if (options.runtime !== "browser") {
    if (normalUAValue) {
      headers[X_AMZ_USER_AGENT] = headers[X_AMZ_USER_AGENT] ? `${headers[USER_AGENT]} ${normalUAValue}` : normalUAValue;
    }
    headers[USER_AGENT] = sdkUserAgentValue;
  } else {
    headers[X_AMZ_USER_AGENT] = sdkUserAgentValue;
  }
  return next(__spreadProps(__spreadValues({}, args), {
    request
  }));
});
var escapeUserAgent = (userAgentPair) => {
  const name = userAgentPair[0].split(UA_NAME_SEPARATOR).map((part) => part.replace(UA_NAME_ESCAPE_REGEX, UA_ESCAPE_CHAR)).join(UA_NAME_SEPARATOR);
  const version = userAgentPair[1]?.replace(UA_VALUE_ESCAPE_REGEX, UA_ESCAPE_CHAR);
  const prefixSeparatorIndex = name.indexOf(UA_NAME_SEPARATOR);
  const prefix = name.substring(0, prefixSeparatorIndex);
  let uaName = name.substring(prefixSeparatorIndex + 1);
  if (prefix === "api") {
    uaName = uaName.toLowerCase();
  }
  return [prefix, uaName, version].filter((item) => item && item.length > 0).reduce((acc, item, index) => {
    switch (index) {
      case 0:
        return item;
      case 1:
        return `${acc}/${item}`;
      default:
        return `${acc}#${item}`;
    }
  }, "");
};
var getUserAgentMiddlewareOptions = {
  name: "getUserAgentMiddleware",
  step: "build",
  priority: "low",
  tags: ["SET_USER_AGENT", "USER_AGENT"],
  override: true
};
var getUserAgentPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.add(userAgentMiddleware(config), getUserAgentMiddlewareOptions);
  }
});

// ../../node_modules/@smithy/util-config-provider/dist-es/types.js
var SelectorType;
(function(SelectorType2) {
  SelectorType2["ENV"] = "env";
  SelectorType2["CONFIG"] = "shared config entry";
})(SelectorType || (SelectorType = {}));

// ../../node_modules/@smithy/config-resolver/dist-es/endpointsConfig/NodeUseDualstackEndpointConfigOptions.js
var DEFAULT_USE_DUALSTACK_ENDPOINT = false;

// ../../node_modules/@smithy/config-resolver/dist-es/endpointsConfig/NodeUseFipsEndpointConfigOptions.js
var DEFAULT_USE_FIPS_ENDPOINT = false;

// ../../node_modules/@smithy/config-resolver/dist-es/regionConfig/isFipsRegion.js
var isFipsRegion = (region) => typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips"));

// ../../node_modules/@smithy/config-resolver/dist-es/regionConfig/getRealRegion.js
var getRealRegion = (region) => isFipsRegion(region) ? ["fips-aws-global", "aws-fips"].includes(region) ? "us-east-1" : region.replace(/fips-(dkr-|prod-)?|-fips/, "") : region;

// ../../node_modules/@smithy/config-resolver/dist-es/regionConfig/resolveRegionConfig.js
var resolveRegionConfig = (input) => {
  const {
    region,
    useFipsEndpoint
  } = input;
  if (!region) {
    throw new Error("Region is missing");
  }
  return __spreadProps(__spreadValues({}, input), {
    region: () => __async(void 0, null, function* () {
      if (typeof region === "string") {
        return getRealRegion(region);
      }
      const providedRegion = yield region();
      return getRealRegion(providedRegion);
    }),
    useFipsEndpoint: () => __async(void 0, null, function* () {
      const providedRegion = typeof region === "string" ? region : yield region();
      if (isFipsRegion(providedRegion)) {
        return true;
      }
      return typeof useFipsEndpoint !== "function" ? Promise.resolve(!!useFipsEndpoint) : useFipsEndpoint();
    })
  });
};

// ../../node_modules/@smithy/middleware-content-length/dist-es/index.js
var CONTENT_LENGTH_HEADER = "content-length";
function contentLengthMiddleware(bodyLengthChecker) {
  return (next) => (args) => __async(this, null, function* () {
    const request = args.request;
    if (HttpRequest.isInstance(request)) {
      const {
        body,
        headers
      } = request;
      if (body && Object.keys(headers).map((str) => str.toLowerCase()).indexOf(CONTENT_LENGTH_HEADER) === -1) {
        try {
          const length = bodyLengthChecker(body);
          request.headers = __spreadProps(__spreadValues({}, request.headers), {
            [CONTENT_LENGTH_HEADER]: String(length)
          });
        } catch (error) {
        }
      }
    }
    return next(__spreadProps(__spreadValues({}, args), {
      request
    }));
  });
}
var contentLengthMiddlewareOptions = {
  step: "build",
  tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
  name: "contentLengthMiddleware",
  override: true
};
var getContentLengthPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), contentLengthMiddlewareOptions);
  }
});

// ../../node_modules/@smithy/middleware-endpoint/dist-es/service-customizations/s3.js
var resolveParamsForS3 = (endpointParams) => __async(void 0, null, function* () {
  const bucket = endpointParams?.Bucket || "";
  if (typeof endpointParams.Bucket === "string") {
    endpointParams.Bucket = bucket.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
  }
  if (isArnBucketName(bucket)) {
    if (endpointParams.ForcePathStyle === true) {
      throw new Error("Path-style addressing cannot be used with ARN buckets");
    }
  } else if (!isDnsCompatibleBucketName(bucket) || bucket.indexOf(".") !== -1 && !String(endpointParams.Endpoint).startsWith("http:") || bucket.toLowerCase() !== bucket || bucket.length < 3) {
    endpointParams.ForcePathStyle = true;
  }
  if (endpointParams.DisableMultiRegionAccessPoints) {
    endpointParams.disableMultiRegionAccessPoints = true;
    endpointParams.DisableMRAP = true;
  }
  return endpointParams;
});
var DOMAIN_PATTERN = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/;
var IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/;
var DOTS_PATTERN = /\.\./;
var isDnsCompatibleBucketName = (bucketName) => DOMAIN_PATTERN.test(bucketName) && !IP_ADDRESS_PATTERN.test(bucketName) && !DOTS_PATTERN.test(bucketName);
var isArnBucketName = (bucketName) => {
  const [arn, partition2, service, , , bucket] = bucketName.split(":");
  const isArn = arn === "arn" && bucketName.split(":").length >= 6;
  const isValidArn = Boolean(isArn && partition2 && service && bucket);
  if (isArn && !isValidArn) {
    throw new Error(`Invalid ARN: ${bucketName} was an invalid ARN.`);
  }
  return isValidArn;
};

// ../../node_modules/@smithy/middleware-endpoint/dist-es/adaptors/createConfigValueProvider.js
var createConfigValueProvider = (configKey, canonicalEndpointParamKey, config) => {
  const configProvider = () => __async(void 0, null, function* () {
    const configValue = config[configKey] ?? config[canonicalEndpointParamKey];
    if (typeof configValue === "function") {
      return configValue();
    }
    return configValue;
  });
  if (configKey === "credentialScope" || canonicalEndpointParamKey === "CredentialScope") {
    return () => __async(void 0, null, function* () {
      const credentials = typeof config.credentials === "function" ? yield config.credentials() : config.credentials;
      const configValue = credentials?.credentialScope ?? credentials?.CredentialScope;
      return configValue;
    });
  }
  if (configKey === "accountId" || canonicalEndpointParamKey === "AccountId") {
    return () => __async(void 0, null, function* () {
      const credentials = typeof config.credentials === "function" ? yield config.credentials() : config.credentials;
      const configValue = credentials?.accountId ?? credentials?.AccountId;
      return configValue;
    });
  }
  if (configKey === "endpoint" || canonicalEndpointParamKey === "endpoint") {
    return () => __async(void 0, null, function* () {
      const endpoint = yield configProvider();
      if (endpoint && typeof endpoint === "object") {
        if ("url" in endpoint) {
          return endpoint.url.href;
        }
        if ("hostname" in endpoint) {
          const {
            protocol,
            hostname,
            port,
            path
          } = endpoint;
          return `${protocol}//${hostname}${port ? ":" + port : ""}${path}`;
        }
      }
      return endpoint;
    });
  }
  return configProvider;
};

// ../../node_modules/@smithy/middleware-endpoint/dist-es/adaptors/getEndpointFromConfig.browser.js
var getEndpointFromConfig = (serviceId) => __async(void 0, null, function* () {
  return void 0;
});

// ../../node_modules/@smithy/querystring-parser/dist-es/index.js
function parseQueryString(querystring) {
  const query = {};
  querystring = querystring.replace(/^\?/, "");
  if (querystring) {
    for (const pair of querystring.split("&")) {
      let [key, value = null] = pair.split("=");
      key = decodeURIComponent(key);
      if (value) {
        value = decodeURIComponent(value);
      }
      if (!(key in query)) {
        query[key] = value;
      } else if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    }
  }
  return query;
}

// ../../node_modules/@smithy/url-parser/dist-es/index.js
var parseUrl = (url) => {
  if (typeof url === "string") {
    return parseUrl(new URL(url));
  }
  const {
    hostname,
    pathname,
    port,
    protocol,
    search
  } = url;
  let query;
  if (search) {
    query = parseQueryString(search);
  }
  return {
    hostname,
    port: port ? parseInt(port) : void 0,
    protocol,
    path: pathname,
    query
  };
};

// ../../node_modules/@smithy/middleware-endpoint/dist-es/adaptors/toEndpointV1.js
var toEndpointV1 = (endpoint) => {
  if (typeof endpoint === "object") {
    if ("url" in endpoint) {
      return parseUrl(endpoint.url);
    }
    return endpoint;
  }
  return parseUrl(endpoint);
};

// ../../node_modules/@smithy/middleware-endpoint/dist-es/adaptors/getEndpointFromInstructions.js
var getEndpointFromInstructions = (commandInput, instructionsSupplier, clientConfig, context) => __async(void 0, null, function* () {
  if (!clientConfig.endpoint) {
    let endpointFromConfig;
    if (clientConfig.serviceConfiguredEndpoint) {
      endpointFromConfig = yield clientConfig.serviceConfiguredEndpoint();
    } else {
      endpointFromConfig = yield getEndpointFromConfig(clientConfig.serviceId);
    }
    if (endpointFromConfig) {
      clientConfig.endpoint = () => Promise.resolve(toEndpointV1(endpointFromConfig));
    }
  }
  const endpointParams = yield resolveParams(commandInput, instructionsSupplier, clientConfig);
  if (typeof clientConfig.endpointProvider !== "function") {
    throw new Error("config.endpointProvider is not set.");
  }
  const endpoint = clientConfig.endpointProvider(endpointParams, context);
  return endpoint;
});
var resolveParams = (commandInput, instructionsSupplier, clientConfig) => __async(void 0, null, function* () {
  const endpointParams = {};
  const instructions = instructionsSupplier?.getEndpointParameterInstructions?.() || {};
  for (const [name, instruction] of Object.entries(instructions)) {
    switch (instruction.type) {
      case "staticContextParams":
        endpointParams[name] = instruction.value;
        break;
      case "contextParams":
        endpointParams[name] = commandInput[instruction.name];
        break;
      case "clientContextParams":
      case "builtInParams":
        endpointParams[name] = yield createConfigValueProvider(instruction.name, name, clientConfig)();
        break;
      default:
        throw new Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(instruction));
    }
  }
  if (Object.keys(instructions).length === 0) {
    Object.assign(endpointParams, clientConfig);
  }
  if (String(clientConfig.serviceId).toLowerCase() === "s3") {
    yield resolveParamsForS3(endpointParams);
  }
  return endpointParams;
});

// ../../node_modules/@smithy/middleware-endpoint/dist-es/endpointMiddleware.js
var endpointMiddleware = ({
  config,
  instructions
}) => {
  return (next, context) => (args) => __async(void 0, null, function* () {
    if (config.endpoint) {
      setFeature(context, "ENDPOINT_OVERRIDE", "N");
    }
    const endpoint = yield getEndpointFromInstructions(args.input, {
      getEndpointParameterInstructions() {
        return instructions;
      }
    }, __spreadValues({}, config), context);
    context.endpointV2 = endpoint;
    context.authSchemes = endpoint.properties?.authSchemes;
    const authScheme = context.authSchemes?.[0];
    if (authScheme) {
      context["signing_region"] = authScheme.signingRegion;
      context["signing_service"] = authScheme.signingName;
      const smithyContext = getSmithyContext(context);
      const httpAuthOption = smithyContext?.selectedHttpAuthScheme?.httpAuthOption;
      if (httpAuthOption) {
        httpAuthOption.signingProperties = Object.assign(httpAuthOption.signingProperties || {}, {
          signing_region: authScheme.signingRegion,
          signingRegion: authScheme.signingRegion,
          signing_service: authScheme.signingName,
          signingName: authScheme.signingName,
          signingRegionSet: authScheme.signingRegionSet
        }, authScheme.properties);
      }
    }
    return next(__spreadValues({}, args));
  });
};

// ../../node_modules/@smithy/middleware-endpoint/dist-es/getEndpointPlugin.js
var endpointMiddlewareOptions = {
  step: "serialize",
  tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
  name: "endpointV2Middleware",
  override: true,
  relation: "before",
  toMiddleware: serializerMiddlewareOption.name
};
var getEndpointPlugin = (config, instructions) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(endpointMiddleware({
      config,
      instructions
    }), endpointMiddlewareOptions);
  }
});

// ../../node_modules/@smithy/middleware-endpoint/dist-es/resolveEndpointConfig.js
var resolveEndpointConfig = (input) => {
  const tls = input.tls ?? true;
  const {
    endpoint
  } = input;
  const customEndpointProvider = endpoint != null ? () => __async(void 0, null, function* () {
    return toEndpointV1(yield normalizeProvider(endpoint)());
  }) : void 0;
  const isCustomEndpoint = !!endpoint;
  const resolvedConfig = __spreadProps(__spreadValues({}, input), {
    endpoint: customEndpointProvider,
    tls,
    isCustomEndpoint,
    useDualstackEndpoint: normalizeProvider(input.useDualstackEndpoint ?? false),
    useFipsEndpoint: normalizeProvider(input.useFipsEndpoint ?? false)
  });
  let configuredEndpointPromise = void 0;
  resolvedConfig.serviceConfiguredEndpoint = () => __async(void 0, null, function* () {
    if (input.serviceId && !configuredEndpointPromise) {
      configuredEndpointPromise = getEndpointFromConfig(input.serviceId);
    }
    return configuredEndpointPromise;
  });
  return resolvedConfig;
};

// ../../node_modules/@smithy/util-retry/dist-es/config.js
var RETRY_MODES;
(function(RETRY_MODES2) {
  RETRY_MODES2["STANDARD"] = "standard";
  RETRY_MODES2["ADAPTIVE"] = "adaptive";
})(RETRY_MODES || (RETRY_MODES = {}));
var DEFAULT_MAX_ATTEMPTS = 3;
var DEFAULT_RETRY_MODE = RETRY_MODES.STANDARD;

// ../../node_modules/@smithy/service-error-classification/dist-es/constants.js
var THROTTLING_ERROR_CODES = ["BandwidthLimitExceeded", "EC2ThrottledException", "LimitExceededException", "PriorRequestNotComplete", "ProvisionedThroughputExceededException", "RequestLimitExceeded", "RequestThrottled", "RequestThrottledException", "SlowDown", "ThrottledException", "Throttling", "ThrottlingException", "TooManyRequestsException", "TransactionInProgressException"];
var TRANSIENT_ERROR_CODES = ["TimeoutError", "RequestTimeout", "RequestTimeoutException"];
var TRANSIENT_ERROR_STATUS_CODES = [500, 502, 503, 504];
var NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT"];

// ../../node_modules/@smithy/service-error-classification/dist-es/index.js
var isClockSkewCorrectedError = (error) => error.$metadata?.clockSkewCorrected;
var isThrottlingError = (error) => error.$metadata?.httpStatusCode === 429 || THROTTLING_ERROR_CODES.includes(error.name) || error.$retryable?.throttling == true;
var isTransientError = (error) => isClockSkewCorrectedError(error) || TRANSIENT_ERROR_CODES.includes(error.name) || NODEJS_TIMEOUT_ERROR_CODES.includes(error?.code || "") || TRANSIENT_ERROR_STATUS_CODES.includes(error.$metadata?.httpStatusCode || 0);
var isServerError = (error) => {
  if (error.$metadata?.httpStatusCode !== void 0) {
    const statusCode = error.$metadata.httpStatusCode;
    if (500 <= statusCode && statusCode <= 599 && !isTransientError(error)) {
      return true;
    }
    return false;
  }
  return false;
};

// ../../node_modules/@smithy/util-retry/dist-es/DefaultRateLimiter.js
var DefaultRateLimiter = class {
  constructor(options) {
    this.currentCapacity = 0;
    this.enabled = false;
    this.lastMaxRate = 0;
    this.measuredTxRate = 0;
    this.requestCount = 0;
    this.lastTimestamp = 0;
    this.timeWindow = 0;
    this.beta = options?.beta ?? 0.7;
    this.minCapacity = options?.minCapacity ?? 1;
    this.minFillRate = options?.minFillRate ?? 0.5;
    this.scaleConstant = options?.scaleConstant ?? 0.4;
    this.smooth = options?.smooth ?? 0.8;
    const currentTimeInSeconds = this.getCurrentTimeInSeconds();
    this.lastThrottleTime = currentTimeInSeconds;
    this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds());
    this.fillRate = this.minFillRate;
    this.maxCapacity = this.minCapacity;
  }
  getCurrentTimeInSeconds() {
    return Date.now() / 1e3;
  }
  getSendToken() {
    return __async(this, null, function* () {
      return this.acquireTokenBucket(1);
    });
  }
  acquireTokenBucket(amount) {
    return __async(this, null, function* () {
      if (!this.enabled) {
        return;
      }
      this.refillTokenBucket();
      if (amount > this.currentCapacity) {
        const delay = (amount - this.currentCapacity) / this.fillRate * 1e3;
        yield new Promise((resolve) => setTimeout(resolve, delay));
      }
      this.currentCapacity = this.currentCapacity - amount;
    });
  }
  refillTokenBucket() {
    const timestamp = this.getCurrentTimeInSeconds();
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      return;
    }
    const fillAmount = (timestamp - this.lastTimestamp) * this.fillRate;
    this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + fillAmount);
    this.lastTimestamp = timestamp;
  }
  updateClientSendingRate(response) {
    let calculatedRate;
    this.updateMeasuredRate();
    if (isThrottlingError(response)) {
      const rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
      this.lastMaxRate = rateToUse;
      this.calculateTimeWindow();
      this.lastThrottleTime = this.getCurrentTimeInSeconds();
      calculatedRate = this.cubicThrottle(rateToUse);
      this.enableTokenBucket();
    } else {
      this.calculateTimeWindow();
      calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
    }
    const newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
    this.updateTokenBucketRate(newRate);
  }
  calculateTimeWindow() {
    this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 1 / 3));
  }
  cubicThrottle(rateToUse) {
    return this.getPrecise(rateToUse * this.beta);
  }
  cubicSuccess(timestamp) {
    return this.getPrecise(this.scaleConstant * Math.pow(timestamp - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
  }
  enableTokenBucket() {
    this.enabled = true;
  }
  updateTokenBucketRate(newRate) {
    this.refillTokenBucket();
    this.fillRate = Math.max(newRate, this.minFillRate);
    this.maxCapacity = Math.max(newRate, this.minCapacity);
    this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity);
  }
  updateMeasuredRate() {
    const t2 = this.getCurrentTimeInSeconds();
    const timeBucket = Math.floor(t2 * 2) / 2;
    this.requestCount++;
    if (timeBucket > this.lastTxRateBucket) {
      const currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
      this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth));
      this.requestCount = 0;
      this.lastTxRateBucket = timeBucket;
    }
  }
  getPrecise(num) {
    return parseFloat(num.toFixed(8));
  }
};

// ../../node_modules/@smithy/util-retry/dist-es/constants.js
var DEFAULT_RETRY_DELAY_BASE = 100;
var MAXIMUM_RETRY_DELAY = 20 * 1e3;
var THROTTLING_RETRY_DELAY_BASE = 500;
var INITIAL_RETRY_TOKENS = 500;
var RETRY_COST = 5;
var TIMEOUT_RETRY_COST = 10;
var NO_RETRY_INCREMENT = 1;
var INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
var REQUEST_HEADER = "amz-sdk-request";

// ../../node_modules/@smithy/util-retry/dist-es/defaultRetryBackoffStrategy.js
var getDefaultRetryBackoffStrategy = () => {
  let delayBase = DEFAULT_RETRY_DELAY_BASE;
  const computeNextBackoffDelay = (attempts) => {
    return Math.floor(Math.min(MAXIMUM_RETRY_DELAY, Math.random() * 2 ** attempts * delayBase));
  };
  const setDelayBase = (delay) => {
    delayBase = delay;
  };
  return {
    computeNextBackoffDelay,
    setDelayBase
  };
};

// ../../node_modules/@smithy/util-retry/dist-es/defaultRetryToken.js
var createDefaultRetryToken = ({
  retryDelay,
  retryCount,
  retryCost
}) => {
  const getRetryCount = () => retryCount;
  const getRetryDelay = () => Math.min(MAXIMUM_RETRY_DELAY, retryDelay);
  const getRetryCost = () => retryCost;
  return {
    getRetryCount,
    getRetryDelay,
    getRetryCost
  };
};

// ../../node_modules/@smithy/util-retry/dist-es/StandardRetryStrategy.js
var StandardRetryStrategy = class {
  constructor(maxAttempts) {
    this.maxAttempts = maxAttempts;
    this.mode = RETRY_MODES.STANDARD;
    this.capacity = INITIAL_RETRY_TOKENS;
    this.retryBackoffStrategy = getDefaultRetryBackoffStrategy();
    this.maxAttemptsProvider = typeof maxAttempts === "function" ? maxAttempts : () => __async(this, null, function* () {
      return maxAttempts;
    });
  }
  acquireInitialRetryToken(retryTokenScope) {
    return __async(this, null, function* () {
      return createDefaultRetryToken({
        retryDelay: DEFAULT_RETRY_DELAY_BASE,
        retryCount: 0
      });
    });
  }
  refreshRetryTokenForRetry(token, errorInfo) {
    return __async(this, null, function* () {
      const maxAttempts = yield this.getMaxAttempts();
      if (this.shouldRetry(token, errorInfo, maxAttempts)) {
        const errorType = errorInfo.errorType;
        this.retryBackoffStrategy.setDelayBase(errorType === "THROTTLING" ? THROTTLING_RETRY_DELAY_BASE : DEFAULT_RETRY_DELAY_BASE);
        const delayFromErrorType = this.retryBackoffStrategy.computeNextBackoffDelay(token.getRetryCount());
        const retryDelay = errorInfo.retryAfterHint ? Math.max(errorInfo.retryAfterHint.getTime() - Date.now() || 0, delayFromErrorType) : delayFromErrorType;
        const capacityCost = this.getCapacityCost(errorType);
        this.capacity -= capacityCost;
        return createDefaultRetryToken({
          retryDelay,
          retryCount: token.getRetryCount() + 1,
          retryCost: capacityCost
        });
      }
      throw new Error("No retry token available");
    });
  }
  recordSuccess(token) {
    this.capacity = Math.max(INITIAL_RETRY_TOKENS, this.capacity + (token.getRetryCost() ?? NO_RETRY_INCREMENT));
  }
  getCapacity() {
    return this.capacity;
  }
  getMaxAttempts() {
    return __async(this, null, function* () {
      try {
        return yield this.maxAttemptsProvider();
      } catch (error) {
        console.warn(`Max attempts provider could not resolve. Using default of ${DEFAULT_MAX_ATTEMPTS}`);
        return DEFAULT_MAX_ATTEMPTS;
      }
    });
  }
  shouldRetry(tokenToRenew, errorInfo, maxAttempts) {
    const attempts = tokenToRenew.getRetryCount() + 1;
    return attempts < maxAttempts && this.capacity >= this.getCapacityCost(errorInfo.errorType) && this.isRetryableError(errorInfo.errorType);
  }
  getCapacityCost(errorType) {
    return errorType === "TRANSIENT" ? TIMEOUT_RETRY_COST : RETRY_COST;
  }
  isRetryableError(errorType) {
    return errorType === "THROTTLING" || errorType === "TRANSIENT";
  }
};

// ../../node_modules/@smithy/util-retry/dist-es/AdaptiveRetryStrategy.js
var AdaptiveRetryStrategy = class {
  constructor(maxAttemptsProvider, options) {
    this.maxAttemptsProvider = maxAttemptsProvider;
    this.mode = RETRY_MODES.ADAPTIVE;
    const {
      rateLimiter
    } = options ?? {};
    this.rateLimiter = rateLimiter ?? new DefaultRateLimiter();
    this.standardRetryStrategy = new StandardRetryStrategy(maxAttemptsProvider);
  }
  acquireInitialRetryToken(retryTokenScope) {
    return __async(this, null, function* () {
      yield this.rateLimiter.getSendToken();
      return this.standardRetryStrategy.acquireInitialRetryToken(retryTokenScope);
    });
  }
  refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
    return __async(this, null, function* () {
      this.rateLimiter.updateClientSendingRate(errorInfo);
      return this.standardRetryStrategy.refreshRetryTokenForRetry(tokenToRenew, errorInfo);
    });
  }
  recordSuccess(token) {
    this.rateLimiter.updateClientSendingRate({});
    this.standardRetryStrategy.recordSuccess(token);
  }
};

// ../../node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}

// ../../node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/regex.js
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

// ../../node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default = validate;

// ../../node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/stringify.js
var byteToHex = [];
for (let i2 = 0; i2 < 256; ++i2) {
  byteToHex.push((i2 + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

// ../../node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/parse.js
function parse(uuid) {
  if (!validate_default(uuid)) {
    throw TypeError("Invalid UUID");
  }
  let v2;
  const arr = new Uint8Array(16);
  arr[0] = (v2 = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v2 >>> 16 & 255;
  arr[2] = v2 >>> 8 & 255;
  arr[3] = v2 & 255;
  arr[4] = (v2 = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v2 & 255;
  arr[6] = (v2 = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v2 & 255;
  arr[8] = (v2 = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v2 & 255;
  arr[10] = (v2 = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
  arr[11] = v2 / 4294967296 & 255;
  arr[12] = v2 >>> 24 & 255;
  arr[13] = v2 >>> 16 & 255;
  arr[14] = v2 >>> 8 & 255;
  arr[15] = v2 & 255;
  return arr;
}
var parse_default = parse;

// ../../node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/v35.js
function stringToBytes(str) {
  str = unescape(encodeURIComponent(str));
  const bytes = [];
  for (let i2 = 0; i2 < str.length; ++i2) {
    bytes.push(str.charCodeAt(i2));
  }
  return bytes;
}
var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
var URL2 = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    var _namespace;
    if (typeof value === "string") {
      value = stringToBytes(value);
    }
    if (typeof namespace === "string") {
      namespace = parse_default(namespace);
    }
    if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
      throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
    }
    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 15 | version;
    bytes[8] = bytes[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i2 = 0; i2 < 16; ++i2) {
        buf[offset + i2] = bytes[i2];
      }
      return buf;
    }
    return unsafeStringify(bytes);
  }
  try {
    generateUUID.name = name;
  } catch (err) {
  }
  generateUUID.DNS = DNS;
  generateUUID.URL = URL2;
  return generateUUID;
}

// ../../node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/md5.js
function md5(bytes) {
  if (typeof bytes === "string") {
    const msg = unescape(encodeURIComponent(bytes));
    bytes = new Uint8Array(msg.length);
    for (let i2 = 0; i2 < msg.length; ++i2) {
      bytes[i2] = msg.charCodeAt(i2);
    }
  }
  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
function md5ToHexEncodedArray(input) {
  const output = [];
  const length32 = input.length * 32;
  const hexTab = "0123456789abcdef";
  for (let i2 = 0; i2 < length32; i2 += 8) {
    const x = input[i2 >> 5] >>> i2 % 32 & 255;
    const hex = parseInt(hexTab.charAt(x >>> 4 & 15) + hexTab.charAt(x & 15), 16);
    output.push(hex);
  }
  return output;
}
function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
function wordsToMd5(x, len) {
  x[len >> 5] |= 128 << len % 32;
  x[getOutputLength(len) - 1] = len;
  let a2 = 1732584193;
  let b2 = -271733879;
  let c2 = -1732584194;
  let d2 = 271733878;
  for (let i2 = 0; i2 < x.length; i2 += 16) {
    const olda = a2;
    const oldb = b2;
    const oldc = c2;
    const oldd = d2;
    a2 = md5ff(a2, b2, c2, d2, x[i2], 7, -680876936);
    d2 = md5ff(d2, a2, b2, c2, x[i2 + 1], 12, -389564586);
    c2 = md5ff(c2, d2, a2, b2, x[i2 + 2], 17, 606105819);
    b2 = md5ff(b2, c2, d2, a2, x[i2 + 3], 22, -1044525330);
    a2 = md5ff(a2, b2, c2, d2, x[i2 + 4], 7, -176418897);
    d2 = md5ff(d2, a2, b2, c2, x[i2 + 5], 12, 1200080426);
    c2 = md5ff(c2, d2, a2, b2, x[i2 + 6], 17, -1473231341);
    b2 = md5ff(b2, c2, d2, a2, x[i2 + 7], 22, -45705983);
    a2 = md5ff(a2, b2, c2, d2, x[i2 + 8], 7, 1770035416);
    d2 = md5ff(d2, a2, b2, c2, x[i2 + 9], 12, -1958414417);
    c2 = md5ff(c2, d2, a2, b2, x[i2 + 10], 17, -42063);
    b2 = md5ff(b2, c2, d2, a2, x[i2 + 11], 22, -1990404162);
    a2 = md5ff(a2, b2, c2, d2, x[i2 + 12], 7, 1804603682);
    d2 = md5ff(d2, a2, b2, c2, x[i2 + 13], 12, -40341101);
    c2 = md5ff(c2, d2, a2, b2, x[i2 + 14], 17, -1502002290);
    b2 = md5ff(b2, c2, d2, a2, x[i2 + 15], 22, 1236535329);
    a2 = md5gg(a2, b2, c2, d2, x[i2 + 1], 5, -165796510);
    d2 = md5gg(d2, a2, b2, c2, x[i2 + 6], 9, -1069501632);
    c2 = md5gg(c2, d2, a2, b2, x[i2 + 11], 14, 643717713);
    b2 = md5gg(b2, c2, d2, a2, x[i2], 20, -373897302);
    a2 = md5gg(a2, b2, c2, d2, x[i2 + 5], 5, -701558691);
    d2 = md5gg(d2, a2, b2, c2, x[i2 + 10], 9, 38016083);
    c2 = md5gg(c2, d2, a2, b2, x[i2 + 15], 14, -660478335);
    b2 = md5gg(b2, c2, d2, a2, x[i2 + 4], 20, -405537848);
    a2 = md5gg(a2, b2, c2, d2, x[i2 + 9], 5, 568446438);
    d2 = md5gg(d2, a2, b2, c2, x[i2 + 14], 9, -1019803690);
    c2 = md5gg(c2, d2, a2, b2, x[i2 + 3], 14, -187363961);
    b2 = md5gg(b2, c2, d2, a2, x[i2 + 8], 20, 1163531501);
    a2 = md5gg(a2, b2, c2, d2, x[i2 + 13], 5, -1444681467);
    d2 = md5gg(d2, a2, b2, c2, x[i2 + 2], 9, -51403784);
    c2 = md5gg(c2, d2, a2, b2, x[i2 + 7], 14, 1735328473);
    b2 = md5gg(b2, c2, d2, a2, x[i2 + 12], 20, -1926607734);
    a2 = md5hh(a2, b2, c2, d2, x[i2 + 5], 4, -378558);
    d2 = md5hh(d2, a2, b2, c2, x[i2 + 8], 11, -2022574463);
    c2 = md5hh(c2, d2, a2, b2, x[i2 + 11], 16, 1839030562);
    b2 = md5hh(b2, c2, d2, a2, x[i2 + 14], 23, -35309556);
    a2 = md5hh(a2, b2, c2, d2, x[i2 + 1], 4, -1530992060);
    d2 = md5hh(d2, a2, b2, c2, x[i2 + 4], 11, 1272893353);
    c2 = md5hh(c2, d2, a2, b2, x[i2 + 7], 16, -155497632);
    b2 = md5hh(b2, c2, d2, a2, x[i2 + 10], 23, -1094730640);
    a2 = md5hh(a2, b2, c2, d2, x[i2 + 13], 4, 681279174);
    d2 = md5hh(d2, a2, b2, c2, x[i2], 11, -358537222);
    c2 = md5hh(c2, d2, a2, b2, x[i2 + 3], 16, -722521979);
    b2 = md5hh(b2, c2, d2, a2, x[i2 + 6], 23, 76029189);
    a2 = md5hh(a2, b2, c2, d2, x[i2 + 9], 4, -640364487);
    d2 = md5hh(d2, a2, b2, c2, x[i2 + 12], 11, -421815835);
    c2 = md5hh(c2, d2, a2, b2, x[i2 + 15], 16, 530742520);
    b2 = md5hh(b2, c2, d2, a2, x[i2 + 2], 23, -995338651);
    a2 = md5ii(a2, b2, c2, d2, x[i2], 6, -198630844);
    d2 = md5ii(d2, a2, b2, c2, x[i2 + 7], 10, 1126891415);
    c2 = md5ii(c2, d2, a2, b2, x[i2 + 14], 15, -1416354905);
    b2 = md5ii(b2, c2, d2, a2, x[i2 + 5], 21, -57434055);
    a2 = md5ii(a2, b2, c2, d2, x[i2 + 12], 6, 1700485571);
    d2 = md5ii(d2, a2, b2, c2, x[i2 + 3], 10, -1894986606);
    c2 = md5ii(c2, d2, a2, b2, x[i2 + 10], 15, -1051523);
    b2 = md5ii(b2, c2, d2, a2, x[i2 + 1], 21, -2054922799);
    a2 = md5ii(a2, b2, c2, d2, x[i2 + 8], 6, 1873313359);
    d2 = md5ii(d2, a2, b2, c2, x[i2 + 15], 10, -30611744);
    c2 = md5ii(c2, d2, a2, b2, x[i2 + 6], 15, -1560198380);
    b2 = md5ii(b2, c2, d2, a2, x[i2 + 13], 21, 1309151649);
    a2 = md5ii(a2, b2, c2, d2, x[i2 + 4], 6, -145523070);
    d2 = md5ii(d2, a2, b2, c2, x[i2 + 11], 10, -1120210379);
    c2 = md5ii(c2, d2, a2, b2, x[i2 + 2], 15, 718787259);
    b2 = md5ii(b2, c2, d2, a2, x[i2 + 9], 21, -343485551);
    a2 = safeAdd(a2, olda);
    b2 = safeAdd(b2, oldb);
    c2 = safeAdd(c2, oldc);
    d2 = safeAdd(d2, oldd);
  }
  return [a2, b2, c2, d2];
}
function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }
  const length8 = input.length * 8;
  const output = new Uint32Array(getOutputLength(length8));
  for (let i2 = 0; i2 < length8; i2 += 8) {
    output[i2 >> 5] |= (input[i2 / 8] & 255) << i2 % 32;
  }
  return output;
}
function safeAdd(x, y) {
  const lsw = (x & 65535) + (y & 65535);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 65535;
}
function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
function md5cmn(q2, a2, b2, x, s2, t2) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a2, q2), safeAdd(x, t2)), s2), b2);
}
function md5ff(a2, b2, c2, d2, x, s2, t2) {
  return md5cmn(b2 & c2 | ~b2 & d2, a2, b2, x, s2, t2);
}
function md5gg(a2, b2, c2, d2, x, s2, t2) {
  return md5cmn(b2 & d2 | c2 & ~d2, a2, b2, x, s2, t2);
}
function md5hh(a2, b2, c2, d2, x, s2, t2) {
  return md5cmn(b2 ^ c2 ^ d2, a2, b2, x, s2, t2);
}
function md5ii(a2, b2, c2, d2, x, s2, t2) {
  return md5cmn(c2 ^ (b2 | ~d2), a2, b2, x, s2, t2);
}
var md5_default = md5;

// ../../node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/v3.js
var v3 = v35("v3", 48, md5_default);

// ../../node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/native.js
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = {
  randomUUID
};

// ../../node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i2 = 0; i2 < 16; ++i2) {
      buf[offset + i2] = rnds[i2];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// ../../node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/sha1.js
function f(s2, x, y, z) {
  switch (s2) {
    case 0:
      return x & y ^ ~x & z;
    case 1:
      return x ^ y ^ z;
    case 2:
      return x & y ^ x & z ^ y & z;
    case 3:
      return x ^ y ^ z;
  }
}
function ROTL(x, n2) {
  return x << n2 | x >>> 32 - n2;
}
function sha1(bytes) {
  const K = [1518500249, 1859775393, 2400959708, 3395469782];
  const H = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
  if (typeof bytes === "string") {
    const msg = unescape(encodeURIComponent(bytes));
    bytes = [];
    for (let i2 = 0; i2 < msg.length; ++i2) {
      bytes.push(msg.charCodeAt(i2));
    }
  } else if (!Array.isArray(bytes)) {
    bytes = Array.prototype.slice.call(bytes);
  }
  bytes.push(128);
  const l2 = bytes.length / 4 + 2;
  const N = Math.ceil(l2 / 16);
  const M = new Array(N);
  for (let i2 = 0; i2 < N; ++i2) {
    const arr = new Uint32Array(16);
    for (let j2 = 0; j2 < 16; ++j2) {
      arr[j2] = bytes[i2 * 64 + j2 * 4] << 24 | bytes[i2 * 64 + j2 * 4 + 1] << 16 | bytes[i2 * 64 + j2 * 4 + 2] << 8 | bytes[i2 * 64 + j2 * 4 + 3];
    }
    M[i2] = arr;
  }
  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 4294967295;
  for (let i2 = 0; i2 < N; ++i2) {
    const W = new Uint32Array(80);
    for (let t2 = 0; t2 < 16; ++t2) {
      W[t2] = M[i2][t2];
    }
    for (let t2 = 16; t2 < 80; ++t2) {
      W[t2] = ROTL(W[t2 - 3] ^ W[t2 - 8] ^ W[t2 - 14] ^ W[t2 - 16], 1);
    }
    let a2 = H[0];
    let b2 = H[1];
    let c2 = H[2];
    let d2 = H[3];
    let e2 = H[4];
    for (let t2 = 0; t2 < 80; ++t2) {
      const s2 = Math.floor(t2 / 20);
      const T = ROTL(a2, 5) + f(s2, b2, c2, d2) + e2 + K[s2] + W[t2] >>> 0;
      e2 = d2;
      d2 = c2;
      c2 = ROTL(b2, 30) >>> 0;
      b2 = a2;
      a2 = T;
    }
    H[0] = H[0] + a2 >>> 0;
    H[1] = H[1] + b2 >>> 0;
    H[2] = H[2] + c2 >>> 0;
    H[3] = H[3] + d2 >>> 0;
    H[4] = H[4] + e2 >>> 0;
  }
  return [H[0] >> 24 & 255, H[0] >> 16 & 255, H[0] >> 8 & 255, H[0] & 255, H[1] >> 24 & 255, H[1] >> 16 & 255, H[1] >> 8 & 255, H[1] & 255, H[2] >> 24 & 255, H[2] >> 16 & 255, H[2] >> 8 & 255, H[2] & 255, H[3] >> 24 & 255, H[3] >> 16 & 255, H[3] >> 8 & 255, H[3] & 255, H[4] >> 24 & 255, H[4] >> 16 & 255, H[4] >> 8 & 255, H[4] & 255];
}
var sha1_default = sha1;

// ../../node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/v5.js
var v5 = v35("v5", 80, sha1_default);

// ../../node_modules/@smithy/middleware-retry/dist-es/util.js
var asSdkError = (error) => {
  if (error instanceof Error) return error;
  if (error instanceof Object) return Object.assign(new Error(), error);
  if (typeof error === "string") return new Error(error);
  return new Error(`AWS SDK error wrapper for ${error}`);
};

// ../../node_modules/@smithy/middleware-retry/dist-es/configurations.js
var resolveRetryConfig = (input) => {
  const {
    retryStrategy
  } = input;
  const maxAttempts = normalizeProvider(input.maxAttempts ?? DEFAULT_MAX_ATTEMPTS);
  return __spreadProps(__spreadValues({}, input), {
    maxAttempts,
    retryStrategy: () => __async(void 0, null, function* () {
      if (retryStrategy) {
        return retryStrategy;
      }
      const retryMode = yield normalizeProvider(input.retryMode)();
      if (retryMode === RETRY_MODES.ADAPTIVE) {
        return new AdaptiveRetryStrategy(maxAttempts);
      }
      return new StandardRetryStrategy(maxAttempts);
    })
  });
};

// ../../node_modules/@smithy/middleware-retry/dist-es/isStreamingPayload/isStreamingPayload.browser.js
var isStreamingPayload = (request) => request?.body instanceof ReadableStream;

// ../../node_modules/@smithy/middleware-retry/dist-es/retryMiddleware.js
var retryMiddleware = (options) => (next, context) => (args) => __async(void 0, null, function* () {
  let retryStrategy = yield options.retryStrategy();
  const maxAttempts = yield options.maxAttempts();
  if (isRetryStrategyV2(retryStrategy)) {
    retryStrategy = retryStrategy;
    let retryToken = yield retryStrategy.acquireInitialRetryToken(context["partition_id"]);
    let lastError = new Error();
    let attempts = 0;
    let totalRetryDelay = 0;
    const {
      request
    } = args;
    const isRequest = HttpRequest.isInstance(request);
    if (isRequest) {
      request.headers[INVOCATION_ID_HEADER] = v4_default();
    }
    while (true) {
      try {
        if (isRequest) {
          request.headers[REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
        }
        const {
          response,
          output
        } = yield next(args);
        retryStrategy.recordSuccess(retryToken);
        output.$metadata.attempts = attempts + 1;
        output.$metadata.totalRetryDelay = totalRetryDelay;
        return {
          response,
          output
        };
      } catch (e2) {
        const retryErrorInfo = getRetryErrorInfo(e2);
        lastError = asSdkError(e2);
        if (isRequest && isStreamingPayload(request)) {
          (context.logger instanceof NoOpLogger ? console : context.logger)?.warn("An error was encountered in a non-retryable streaming request.");
          throw lastError;
        }
        try {
          retryToken = yield retryStrategy.refreshRetryTokenForRetry(retryToken, retryErrorInfo);
        } catch (refreshError) {
          if (!lastError.$metadata) {
            lastError.$metadata = {};
          }
          lastError.$metadata.attempts = attempts + 1;
          lastError.$metadata.totalRetryDelay = totalRetryDelay;
          throw lastError;
        }
        attempts = retryToken.getRetryCount();
        const delay = retryToken.getRetryDelay();
        totalRetryDelay += delay;
        yield new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  } else {
    retryStrategy = retryStrategy;
    if (retryStrategy?.mode) context.userAgent = [...context.userAgent || [], ["cfg/retry-mode", retryStrategy.mode]];
    return retryStrategy.retry(next, args);
  }
});
var isRetryStrategyV2 = (retryStrategy) => typeof retryStrategy.acquireInitialRetryToken !== "undefined" && typeof retryStrategy.refreshRetryTokenForRetry !== "undefined" && typeof retryStrategy.recordSuccess !== "undefined";
var getRetryErrorInfo = (error) => {
  const errorInfo = {
    error,
    errorType: getRetryErrorType(error)
  };
  const retryAfterHint = getRetryAfterHint(error.$response);
  if (retryAfterHint) {
    errorInfo.retryAfterHint = retryAfterHint;
  }
  return errorInfo;
};
var getRetryErrorType = (error) => {
  if (isThrottlingError(error)) return "THROTTLING";
  if (isTransientError(error)) return "TRANSIENT";
  if (isServerError(error)) return "SERVER_ERROR";
  return "CLIENT_ERROR";
};
var retryMiddlewareOptions = {
  name: "retryMiddleware",
  tags: ["RETRY"],
  step: "finalizeRequest",
  priority: "high",
  override: true
};
var getRetryPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(retryMiddleware(options), retryMiddlewareOptions);
  }
});
var getRetryAfterHint = (response) => {
  if (!HttpResponse.isInstance(response)) return;
  const retryAfterHeaderName = Object.keys(response.headers).find((key) => key.toLowerCase() === "retry-after");
  if (!retryAfterHeaderName) return;
  const retryAfter = response.headers[retryAfterHeaderName];
  const retryAfterSeconds = Number(retryAfter);
  if (!Number.isNaN(retryAfterSeconds)) return new Date(retryAfterSeconds * 1e3);
  const retryAfterDate = new Date(retryAfter);
  return retryAfterDate;
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/auth/httpAuthSchemeProvider.js
var defaultCognitoIdentityProviderHttpAuthSchemeParametersProvider = (config, context, input) => __async(void 0, null, function* () {
  return {
    operation: getSmithyContext(context).operation,
    region: (yield normalizeProvider(config.region)()) || (() => {
      throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
    })()
  };
});
function createAwsAuthSigv4HttpAuthOption(authParameters) {
  return {
    schemeId: "aws.auth#sigv4",
    signingProperties: {
      name: "cognito-idp",
      region: authParameters.region
    },
    propertiesExtractor: (config, context) => ({
      signingProperties: {
        config,
        context
      }
    })
  };
}
function createSmithyApiNoAuthHttpAuthOption(authParameters) {
  return {
    schemeId: "smithy.api#noAuth"
  };
}
var defaultCognitoIdentityProviderHttpAuthSchemeProvider = (authParameters) => {
  const options = [];
  switch (authParameters.operation) {
    case "AssociateSoftwareToken": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "ChangePassword": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "ConfirmDevice": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "ConfirmForgotPassword": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "ConfirmSignUp": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "DeleteUser": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "DeleteUserAttributes": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "ForgetDevice": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "ForgotPassword": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "GetDevice": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "GetUser": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "GetUserAttributeVerificationCode": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "GlobalSignOut": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "InitiateAuth": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "ListDevices": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "ResendConfirmationCode": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "RespondToAuthChallenge": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "RevokeToken": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "SetUserMFAPreference": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "SetUserSettings": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "SignUp": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "UpdateAuthEventFeedback": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "UpdateDeviceStatus": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "UpdateUserAttributes": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "VerifySoftwareToken": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "VerifyUserAttribute": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    default: {
      options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
    }
  }
  return options;
};
var resolveHttpAuthSchemeConfig = (config) => {
  const config_0 = resolveAwsSdkSigV4Config(config);
  return __spreadValues({}, config_0);
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/endpoint/EndpointParameters.js
var resolveClientEndpointParameters = (options) => {
  return __spreadProps(__spreadValues({}, options), {
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    defaultSigningName: "cognito-idp"
  });
};
var commonParams = {
  UseFIPS: {
    type: "builtInParams",
    name: "useFipsEndpoint"
  },
  Endpoint: {
    type: "builtInParams",
    name: "endpoint"
  },
  Region: {
    type: "builtInParams",
    name: "region"
  },
  UseDualStack: {
    type: "builtInParams",
    name: "useDualstackEndpoint"
  }
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/package.json
var package_default = {
  name: "@aws-sdk/client-cognito-identity-provider",
  description: "AWS SDK for JavaScript Cognito Identity Provider Client for Node.js, Browser and React Native",
  version: "3.677.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "node ../../scripts/compilation/inline client-cognito-identity-provider",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo cognito-identity-provider"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "5.2.0",
    "@aws-crypto/sha256-js": "5.2.0",
    "@aws-sdk/client-sso-oidc": "3.677.0",
    "@aws-sdk/client-sts": "3.677.0",
    "@aws-sdk/core": "3.677.0",
    "@aws-sdk/credential-provider-node": "3.677.0",
    "@aws-sdk/middleware-host-header": "3.667.0",
    "@aws-sdk/middleware-logger": "3.667.0",
    "@aws-sdk/middleware-recursion-detection": "3.667.0",
    "@aws-sdk/middleware-user-agent": "3.677.0",
    "@aws-sdk/region-config-resolver": "3.667.0",
    "@aws-sdk/types": "3.667.0",
    "@aws-sdk/util-endpoints": "3.667.0",
    "@aws-sdk/util-user-agent-browser": "3.675.0",
    "@aws-sdk/util-user-agent-node": "3.677.0",
    "@smithy/config-resolver": "^3.0.9",
    "@smithy/core": "^2.4.8",
    "@smithy/fetch-http-handler": "^3.2.9",
    "@smithy/hash-node": "^3.0.7",
    "@smithy/invalid-dependency": "^3.0.7",
    "@smithy/middleware-content-length": "^3.0.9",
    "@smithy/middleware-endpoint": "^3.1.4",
    "@smithy/middleware-retry": "^3.0.23",
    "@smithy/middleware-serde": "^3.0.7",
    "@smithy/middleware-stack": "^3.0.7",
    "@smithy/node-config-provider": "^3.1.8",
    "@smithy/node-http-handler": "^3.2.4",
    "@smithy/protocol-http": "^4.1.4",
    "@smithy/smithy-client": "^3.4.0",
    "@smithy/types": "^3.5.0",
    "@smithy/url-parser": "^3.0.7",
    "@smithy/util-base64": "^3.0.0",
    "@smithy/util-body-length-browser": "^3.0.0",
    "@smithy/util-body-length-node": "^3.0.0",
    "@smithy/util-defaults-mode-browser": "^3.0.23",
    "@smithy/util-defaults-mode-node": "^3.0.23",
    "@smithy/util-endpoints": "^2.1.3",
    "@smithy/util-middleware": "^3.0.7",
    "@smithy/util-retry": "^3.0.7",
    "@smithy/util-utf8": "^3.0.0",
    tslib: "^2.6.2"
  },
  devDependencies: {
    "@tsconfig/node16": "16.1.3",
    "@types/node": "^16.18.96",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typescript: "~4.9.5"
  },
  engines: {
    node: ">=16.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*/**"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-cognito-identity-provider",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-cognito-identity-provider"
  }
};

// ../../node_modules/@aws-crypto/util/node_modules/@smithy/util-utf8/dist-es/fromUtf8.browser.js
var fromUtf82 = (input) => new TextEncoder().encode(input);

// ../../node_modules/@aws-crypto/util/build/module/convertToBuffer.js
var fromUtf83 = typeof Buffer !== "undefined" && Buffer.from ? function(input) {
  return Buffer.from(input, "utf8");
} : fromUtf82;
function convertToBuffer(data) {
  if (data instanceof Uint8Array) return data;
  if (typeof data === "string") {
    return fromUtf83(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
}

// ../../node_modules/@aws-crypto/util/build/module/isEmptyData.js
function isEmptyData(data) {
  if (typeof data === "string") {
    return data.length === 0;
  }
  return data.byteLength === 0;
}

// ../../node_modules/@aws-crypto/sha256-browser/build/module/constants.js
var SHA_256_HASH = {
  name: "SHA-256"
};
var SHA_256_HMAC_ALGO = {
  name: "HMAC",
  hash: SHA_256_HASH
};
var EMPTY_DATA_SHA_256 = new Uint8Array([227, 176, 196, 66, 152, 252, 28, 20, 154, 251, 244, 200, 153, 111, 185, 36, 39, 174, 65, 228, 100, 155, 147, 76, 164, 149, 153, 27, 120, 82, 184, 85]);

// ../../node_modules/@aws-sdk/util-locate-window/dist-es/index.js
var fallbackWindow = {};
function locateWindow() {
  if (typeof window !== "undefined") {
    return window;
  } else if (typeof self !== "undefined") {
    return self;
  }
  return fallbackWindow;
}

// ../../node_modules/@aws-crypto/sha256-browser/build/module/webCryptoSha256.js
var Sha256 = (
  /** @class */
  function() {
    function Sha2564(secret) {
      this.toHash = new Uint8Array(0);
      this.secret = secret;
      this.reset();
    }
    Sha2564.prototype.update = function(data) {
      if (isEmptyData(data)) {
        return;
      }
      var update = convertToBuffer(data);
      var typedArray = new Uint8Array(this.toHash.byteLength + update.byteLength);
      typedArray.set(this.toHash, 0);
      typedArray.set(update, this.toHash.byteLength);
      this.toHash = typedArray;
    };
    Sha2564.prototype.digest = function() {
      var _this = this;
      if (this.key) {
        return this.key.then(function(key) {
          return locateWindow().crypto.subtle.sign(SHA_256_HMAC_ALGO, key, _this.toHash).then(function(data) {
            return new Uint8Array(data);
          });
        });
      }
      if (isEmptyData(this.toHash)) {
        return Promise.resolve(EMPTY_DATA_SHA_256);
      }
      return Promise.resolve().then(function() {
        return locateWindow().crypto.subtle.digest(SHA_256_HASH, _this.toHash);
      }).then(function(data) {
        return Promise.resolve(new Uint8Array(data));
      });
    };
    Sha2564.prototype.reset = function() {
      var _this = this;
      this.toHash = new Uint8Array(0);
      if (this.secret && this.secret !== void 0) {
        this.key = new Promise(function(resolve, reject) {
          locateWindow().crypto.subtle.importKey("raw", convertToBuffer(_this.secret), SHA_256_HMAC_ALGO, false, ["sign"]).then(resolve, reject);
        });
        this.key.catch(function() {
        });
      }
    };
    return Sha2564;
  }()
);

// ../../node_modules/@aws-crypto/sha256-js/build/module/constants.js
var BLOCK_SIZE = 64;
var DIGEST_LENGTH = 32;
var KEY = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]);
var INIT = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
var MAX_HASHABLE_LENGTH = Math.pow(2, 53) - 1;

// ../../node_modules/@aws-crypto/sha256-js/build/module/RawSha256.js
var RawSha256 = (
  /** @class */
  function() {
    function RawSha2562() {
      this.state = Int32Array.from(INIT);
      this.temp = new Int32Array(64);
      this.buffer = new Uint8Array(64);
      this.bufferLength = 0;
      this.bytesHashed = 0;
      this.finished = false;
    }
    RawSha2562.prototype.update = function(data) {
      if (this.finished) {
        throw new Error("Attempted to update an already finished hash.");
      }
      var position = 0;
      var byteLength = data.byteLength;
      this.bytesHashed += byteLength;
      if (this.bytesHashed * 8 > MAX_HASHABLE_LENGTH) {
        throw new Error("Cannot hash more than 2^53 - 1 bits");
      }
      while (byteLength > 0) {
        this.buffer[this.bufferLength++] = data[position++];
        byteLength--;
        if (this.bufferLength === BLOCK_SIZE) {
          this.hashBuffer();
          this.bufferLength = 0;
        }
      }
    };
    RawSha2562.prototype.digest = function() {
      if (!this.finished) {
        var bitsHashed = this.bytesHashed * 8;
        var bufferView = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
        var undecoratedLength = this.bufferLength;
        bufferView.setUint8(this.bufferLength++, 128);
        if (undecoratedLength % BLOCK_SIZE >= BLOCK_SIZE - 8) {
          for (var i2 = this.bufferLength; i2 < BLOCK_SIZE; i2++) {
            bufferView.setUint8(i2, 0);
          }
          this.hashBuffer();
          this.bufferLength = 0;
        }
        for (var i2 = this.bufferLength; i2 < BLOCK_SIZE - 8; i2++) {
          bufferView.setUint8(i2, 0);
        }
        bufferView.setUint32(BLOCK_SIZE - 8, Math.floor(bitsHashed / 4294967296), true);
        bufferView.setUint32(BLOCK_SIZE - 4, bitsHashed);
        this.hashBuffer();
        this.finished = true;
      }
      var out = new Uint8Array(DIGEST_LENGTH);
      for (var i2 = 0; i2 < 8; i2++) {
        out[i2 * 4] = this.state[i2] >>> 24 & 255;
        out[i2 * 4 + 1] = this.state[i2] >>> 16 & 255;
        out[i2 * 4 + 2] = this.state[i2] >>> 8 & 255;
        out[i2 * 4 + 3] = this.state[i2] >>> 0 & 255;
      }
      return out;
    };
    RawSha2562.prototype.hashBuffer = function() {
      var _a = this, buffer = _a.buffer, state = _a.state;
      var state0 = state[0], state1 = state[1], state2 = state[2], state3 = state[3], state4 = state[4], state5 = state[5], state6 = state[6], state7 = state[7];
      for (var i2 = 0; i2 < BLOCK_SIZE; i2++) {
        if (i2 < 16) {
          this.temp[i2] = (buffer[i2 * 4] & 255) << 24 | (buffer[i2 * 4 + 1] & 255) << 16 | (buffer[i2 * 4 + 2] & 255) << 8 | buffer[i2 * 4 + 3] & 255;
        } else {
          var u2 = this.temp[i2 - 2];
          var t1_1 = (u2 >>> 17 | u2 << 15) ^ (u2 >>> 19 | u2 << 13) ^ u2 >>> 10;
          u2 = this.temp[i2 - 15];
          var t2_1 = (u2 >>> 7 | u2 << 25) ^ (u2 >>> 18 | u2 << 14) ^ u2 >>> 3;
          this.temp[i2] = (t1_1 + this.temp[i2 - 7] | 0) + (t2_1 + this.temp[i2 - 16] | 0);
        }
        var t1 = (((state4 >>> 6 | state4 << 26) ^ (state4 >>> 11 | state4 << 21) ^ (state4 >>> 25 | state4 << 7)) + (state4 & state5 ^ ~state4 & state6) | 0) + (state7 + (KEY[i2] + this.temp[i2] | 0) | 0) | 0;
        var t2 = ((state0 >>> 2 | state0 << 30) ^ (state0 >>> 13 | state0 << 19) ^ (state0 >>> 22 | state0 << 10)) + (state0 & state1 ^ state0 & state2 ^ state1 & state2) | 0;
        state7 = state6;
        state6 = state5;
        state5 = state4;
        state4 = state3 + t1 | 0;
        state3 = state2;
        state2 = state1;
        state1 = state0;
        state0 = t1 + t2 | 0;
      }
      state[0] += state0;
      state[1] += state1;
      state[2] += state2;
      state[3] += state3;
      state[4] += state4;
      state[5] += state5;
      state[6] += state6;
      state[7] += state7;
    };
    return RawSha2562;
  }()
);

// ../../node_modules/@aws-crypto/sha256-js/build/module/jsSha256.js
var Sha2562 = (
  /** @class */
  function() {
    function Sha2564(secret) {
      this.secret = secret;
      this.hash = new RawSha256();
      this.reset();
    }
    Sha2564.prototype.update = function(toHash) {
      if (isEmptyData(toHash) || this.error) {
        return;
      }
      try {
        this.hash.update(convertToBuffer(toHash));
      } catch (e2) {
        this.error = e2;
      }
    };
    Sha2564.prototype.digestSync = function() {
      if (this.error) {
        throw this.error;
      }
      if (this.outer) {
        if (!this.outer.finished) {
          this.outer.update(this.hash.digest());
        }
        return this.outer.digest();
      }
      return this.hash.digest();
    };
    Sha2564.prototype.digest = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, this.digestSync()];
        });
      });
    };
    Sha2564.prototype.reset = function() {
      this.hash = new RawSha256();
      if (this.secret) {
        this.outer = new RawSha256();
        var inner = bufferFromSecret(this.secret);
        var outer = new Uint8Array(BLOCK_SIZE);
        outer.set(inner);
        for (var i2 = 0; i2 < BLOCK_SIZE; i2++) {
          inner[i2] ^= 54;
          outer[i2] ^= 92;
        }
        this.hash.update(inner);
        this.outer.update(outer);
        for (var i2 = 0; i2 < inner.byteLength; i2++) {
          inner[i2] = 0;
        }
      }
    };
    return Sha2564;
  }()
);
function bufferFromSecret(secret) {
  var input = convertToBuffer(secret);
  if (input.byteLength > BLOCK_SIZE) {
    var bufferHash = new RawSha256();
    bufferHash.update(input);
    input = bufferHash.digest();
  }
  var buffer = new Uint8Array(BLOCK_SIZE);
  buffer.set(input);
  return buffer;
}

// ../../node_modules/@aws-crypto/supports-web-crypto/build/module/supportsWebCrypto.js
var subtleCryptoMethods = ["decrypt", "digest", "encrypt", "exportKey", "generateKey", "importKey", "sign", "verify"];
function supportsWebCrypto(window2) {
  if (supportsSecureRandom(window2) && typeof window2.crypto.subtle === "object") {
    var subtle = window2.crypto.subtle;
    return supportsSubtleCrypto(subtle);
  }
  return false;
}
function supportsSecureRandom(window2) {
  if (typeof window2 === "object" && typeof window2.crypto === "object") {
    var getRandomValues2 = window2.crypto.getRandomValues;
    return typeof getRandomValues2 === "function";
  }
  return false;
}
function supportsSubtleCrypto(subtle) {
  return subtle && subtleCryptoMethods.every(function(methodName) {
    return typeof subtle[methodName] === "function";
  });
}

// ../../node_modules/@aws-crypto/sha256-browser/build/module/crossPlatformSha256.js
var Sha2563 = (
  /** @class */
  function() {
    function Sha2564(secret) {
      if (supportsWebCrypto(locateWindow())) {
        this.hash = new Sha256(secret);
      } else {
        this.hash = new Sha2562(secret);
      }
    }
    Sha2564.prototype.update = function(data, encoding) {
      this.hash.update(convertToBuffer(data));
    };
    Sha2564.prototype.digest = function() {
      return this.hash.digest();
    };
    Sha2564.prototype.reset = function() {
      this.hash.reset();
    };
    return Sha2564;
  }()
);

// ../../node_modules/bowser/src/constants.js
var BROWSER_ALIASES_MAP = {
  "Amazon Silk": "amazon_silk",
  "Android Browser": "android",
  Bada: "bada",
  BlackBerry: "blackberry",
  Chrome: "chrome",
  Chromium: "chromium",
  Electron: "electron",
  Epiphany: "epiphany",
  Firefox: "firefox",
  Focus: "focus",
  Generic: "generic",
  "Google Search": "google_search",
  Googlebot: "googlebot",
  "Internet Explorer": "ie",
  "K-Meleon": "k_meleon",
  Maxthon: "maxthon",
  "Microsoft Edge": "edge",
  "MZ Browser": "mz",
  "NAVER Whale Browser": "naver",
  Opera: "opera",
  "Opera Coast": "opera_coast",
  PhantomJS: "phantomjs",
  Puffin: "puffin",
  QupZilla: "qupzilla",
  QQ: "qq",
  QQLite: "qqlite",
  Safari: "safari",
  Sailfish: "sailfish",
  "Samsung Internet for Android": "samsung_internet",
  SeaMonkey: "seamonkey",
  Sleipnir: "sleipnir",
  Swing: "swing",
  Tizen: "tizen",
  "UC Browser": "uc",
  Vivaldi: "vivaldi",
  "WebOS Browser": "webos",
  WeChat: "wechat",
  "Yandex Browser": "yandex",
  Roku: "roku"
};
var BROWSER_MAP = {
  amazon_silk: "Amazon Silk",
  android: "Android Browser",
  bada: "Bada",
  blackberry: "BlackBerry",
  chrome: "Chrome",
  chromium: "Chromium",
  electron: "Electron",
  epiphany: "Epiphany",
  firefox: "Firefox",
  focus: "Focus",
  generic: "Generic",
  googlebot: "Googlebot",
  google_search: "Google Search",
  ie: "Internet Explorer",
  k_meleon: "K-Meleon",
  maxthon: "Maxthon",
  edge: "Microsoft Edge",
  mz: "MZ Browser",
  naver: "NAVER Whale Browser",
  opera: "Opera",
  opera_coast: "Opera Coast",
  phantomjs: "PhantomJS",
  puffin: "Puffin",
  qupzilla: "QupZilla",
  qq: "QQ Browser",
  qqlite: "QQ Browser Lite",
  safari: "Safari",
  sailfish: "Sailfish",
  samsung_internet: "Samsung Internet for Android",
  seamonkey: "SeaMonkey",
  sleipnir: "Sleipnir",
  swing: "Swing",
  tizen: "Tizen",
  uc: "UC Browser",
  vivaldi: "Vivaldi",
  webos: "WebOS Browser",
  wechat: "WeChat",
  yandex: "Yandex Browser"
};
var PLATFORMS_MAP = {
  tablet: "tablet",
  mobile: "mobile",
  desktop: "desktop",
  tv: "tv"
};
var OS_MAP = {
  WindowsPhone: "Windows Phone",
  Windows: "Windows",
  MacOS: "macOS",
  iOS: "iOS",
  Android: "Android",
  WebOS: "WebOS",
  BlackBerry: "BlackBerry",
  Bada: "Bada",
  Tizen: "Tizen",
  Linux: "Linux",
  ChromeOS: "Chrome OS",
  PlayStation4: "PlayStation 4",
  Roku: "Roku"
};
var ENGINE_MAP = {
  EdgeHTML: "EdgeHTML",
  Blink: "Blink",
  Trident: "Trident",
  Presto: "Presto",
  Gecko: "Gecko",
  WebKit: "WebKit"
};

// ../../node_modules/bowser/src/utils.js
var Utils = class _Utils {
  /**
   * Get first matched item for a string
   * @param {RegExp} regexp
   * @param {String} ua
   * @return {Array|{index: number, input: string}|*|boolean|string}
   */
  static getFirstMatch(regexp, ua) {
    const match = ua.match(regexp);
    return match && match.length > 0 && match[1] || "";
  }
  /**
   * Get second matched item for a string
   * @param regexp
   * @param {String} ua
   * @return {Array|{index: number, input: string}|*|boolean|string}
   */
  static getSecondMatch(regexp, ua) {
    const match = ua.match(regexp);
    return match && match.length > 1 && match[2] || "";
  }
  /**
   * Match a regexp and return a constant or undefined
   * @param {RegExp} regexp
   * @param {String} ua
   * @param {*} _const Any const that will be returned if regexp matches the string
   * @return {*}
   */
  static matchAndReturnConst(regexp, ua, _const) {
    if (regexp.test(ua)) {
      return _const;
    }
    return void 0;
  }
  static getWindowsVersionName(version) {
    switch (version) {
      case "NT":
        return "NT";
      case "XP":
        return "XP";
      case "NT 5.0":
        return "2000";
      case "NT 5.1":
        return "XP";
      case "NT 5.2":
        return "2003";
      case "NT 6.0":
        return "Vista";
      case "NT 6.1":
        return "7";
      case "NT 6.2":
        return "8";
      case "NT 6.3":
        return "8.1";
      case "NT 10.0":
        return "10";
      default:
        return void 0;
    }
  }
  /**
   * Get macOS version name
   *    10.5 - Leopard
   *    10.6 - Snow Leopard
   *    10.7 - Lion
   *    10.8 - Mountain Lion
   *    10.9 - Mavericks
   *    10.10 - Yosemite
   *    10.11 - El Capitan
   *    10.12 - Sierra
   *    10.13 - High Sierra
   *    10.14 - Mojave
   *    10.15 - Catalina
   *
   * @example
   *   getMacOSVersionName("10.14") // 'Mojave'
   *
   * @param  {string} version
   * @return {string} versionName
   */
  static getMacOSVersionName(version) {
    const v2 = version.split(".").splice(0, 2).map((s2) => parseInt(s2, 10) || 0);
    v2.push(0);
    if (v2[0] !== 10) return void 0;
    switch (v2[1]) {
      case 5:
        return "Leopard";
      case 6:
        return "Snow Leopard";
      case 7:
        return "Lion";
      case 8:
        return "Mountain Lion";
      case 9:
        return "Mavericks";
      case 10:
        return "Yosemite";
      case 11:
        return "El Capitan";
      case 12:
        return "Sierra";
      case 13:
        return "High Sierra";
      case 14:
        return "Mojave";
      case 15:
        return "Catalina";
      default:
        return void 0;
    }
  }
  /**
   * Get Android version name
   *    1.5 - Cupcake
   *    1.6 - Donut
   *    2.0 - Eclair
   *    2.1 - Eclair
   *    2.2 - Froyo
   *    2.x - Gingerbread
   *    3.x - Honeycomb
   *    4.0 - Ice Cream Sandwich
   *    4.1 - Jelly Bean
   *    4.4 - KitKat
   *    5.x - Lollipop
   *    6.x - Marshmallow
   *    7.x - Nougat
   *    8.x - Oreo
   *    9.x - Pie
   *
   * @example
   *   getAndroidVersionName("7.0") // 'Nougat'
   *
   * @param  {string} version
   * @return {string} versionName
   */
  static getAndroidVersionName(version) {
    const v2 = version.split(".").splice(0, 2).map((s2) => parseInt(s2, 10) || 0);
    v2.push(0);
    if (v2[0] === 1 && v2[1] < 5) return void 0;
    if (v2[0] === 1 && v2[1] < 6) return "Cupcake";
    if (v2[0] === 1 && v2[1] >= 6) return "Donut";
    if (v2[0] === 2 && v2[1] < 2) return "Eclair";
    if (v2[0] === 2 && v2[1] === 2) return "Froyo";
    if (v2[0] === 2 && v2[1] > 2) return "Gingerbread";
    if (v2[0] === 3) return "Honeycomb";
    if (v2[0] === 4 && v2[1] < 1) return "Ice Cream Sandwich";
    if (v2[0] === 4 && v2[1] < 4) return "Jelly Bean";
    if (v2[0] === 4 && v2[1] >= 4) return "KitKat";
    if (v2[0] === 5) return "Lollipop";
    if (v2[0] === 6) return "Marshmallow";
    if (v2[0] === 7) return "Nougat";
    if (v2[0] === 8) return "Oreo";
    if (v2[0] === 9) return "Pie";
    return void 0;
  }
  /**
   * Get version precisions count
   *
   * @example
   *   getVersionPrecision("1.10.3") // 3
   *
   * @param  {string} version
   * @return {number}
   */
  static getVersionPrecision(version) {
    return version.split(".").length;
  }
  /**
   * Calculate browser version weight
   *
   * @example
   *   compareVersions('1.10.2.1',  '1.8.2.1.90')    // 1
   *   compareVersions('1.010.2.1', '1.09.2.1.90');  // 1
   *   compareVersions('1.10.2.1',  '1.10.2.1');     // 0
   *   compareVersions('1.10.2.1',  '1.0800.2');     // -1
   *   compareVersions('1.10.2.1',  '1.10',  true);  // 0
   *
   * @param {String} versionA versions versions to compare
   * @param {String} versionB versions versions to compare
   * @param {boolean} [isLoose] enable loose comparison
   * @return {Number} comparison result: -1 when versionA is lower,
   * 1 when versionA is bigger, 0 when both equal
   */
  /* eslint consistent-return: 1 */
  static compareVersions(versionA, versionB, isLoose = false) {
    const versionAPrecision = _Utils.getVersionPrecision(versionA);
    const versionBPrecision = _Utils.getVersionPrecision(versionB);
    let precision = Math.max(versionAPrecision, versionBPrecision);
    let lastPrecision = 0;
    const chunks = _Utils.map([versionA, versionB], (version) => {
      const delta = precision - _Utils.getVersionPrecision(version);
      const _version = version + new Array(delta + 1).join(".0");
      return _Utils.map(_version.split("."), (chunk) => new Array(20 - chunk.length).join("0") + chunk).reverse();
    });
    if (isLoose) {
      lastPrecision = precision - Math.min(versionAPrecision, versionBPrecision);
    }
    precision -= 1;
    while (precision >= lastPrecision) {
      if (chunks[0][precision] > chunks[1][precision]) {
        return 1;
      }
      if (chunks[0][precision] === chunks[1][precision]) {
        if (precision === lastPrecision) {
          return 0;
        }
        precision -= 1;
      } else if (chunks[0][precision] < chunks[1][precision]) {
        return -1;
      }
    }
    return void 0;
  }
  /**
   * Array::map polyfill
   *
   * @param  {Array} arr
   * @param  {Function} iterator
   * @return {Array}
   */
  static map(arr, iterator) {
    const result = [];
    let i2;
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, iterator);
    }
    for (i2 = 0; i2 < arr.length; i2 += 1) {
      result.push(iterator(arr[i2]));
    }
    return result;
  }
  /**
   * Array::find polyfill
   *
   * @param  {Array} arr
   * @param  {Function} predicate
   * @return {Array}
   */
  static find(arr, predicate) {
    let i2;
    let l2;
    if (Array.prototype.find) {
      return Array.prototype.find.call(arr, predicate);
    }
    for (i2 = 0, l2 = arr.length; i2 < l2; i2 += 1) {
      const value = arr[i2];
      if (predicate(value, i2)) {
        return value;
      }
    }
    return void 0;
  }
  /**
   * Object::assign polyfill
   *
   * @param  {Object} obj
   * @param  {Object} ...objs
   * @return {Object}
   */
  static assign(obj, ...assigners) {
    const result = obj;
    let i2;
    let l2;
    if (Object.assign) {
      return Object.assign(obj, ...assigners);
    }
    for (i2 = 0, l2 = assigners.length; i2 < l2; i2 += 1) {
      const assigner = assigners[i2];
      if (typeof assigner === "object" && assigner !== null) {
        const keys = Object.keys(assigner);
        keys.forEach((key) => {
          result[key] = assigner[key];
        });
      }
    }
    return obj;
  }
  /**
   * Get short version/alias for a browser name
   *
   * @example
   *   getBrowserAlias('Microsoft Edge') // edge
   *
   * @param  {string} browserName
   * @return {string}
   */
  static getBrowserAlias(browserName) {
    return BROWSER_ALIASES_MAP[browserName];
  }
  /**
   * Get short version/alias for a browser name
   *
   * @example
   *   getBrowserAlias('edge') // Microsoft Edge
   *
   * @param  {string} browserAlias
   * @return {string}
   */
  static getBrowserTypeByAlias(browserAlias) {
    return BROWSER_MAP[browserAlias] || "";
  }
};

// ../../node_modules/bowser/src/parser-browsers.js
var commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;
var browsersList = [
  /* Googlebot */
  {
    test: [/googlebot/i],
    describe(ua) {
      const browser = {
        name: "Googlebot"
      };
      const version = Utils.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* Opera < 13.0 */
  {
    test: [/opera/i],
    describe(ua) {
      const browser = {
        name: "Opera"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* Opera > 13.0 */
  {
    test: [/opr\/|opios/i],
    describe(ua) {
      const browser = {
        name: "Opera"
      };
      const version = Utils.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/SamsungBrowser/i],
    describe(ua) {
      const browser = {
        name: "Samsung Internet for Android"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/Whale/i],
    describe(ua) {
      const browser = {
        name: "NAVER Whale Browser"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/MZBrowser/i],
    describe(ua) {
      const browser = {
        name: "MZ Browser"
      };
      const version = Utils.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/focus/i],
    describe(ua) {
      const browser = {
        name: "Focus"
      };
      const version = Utils.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/swing/i],
    describe(ua) {
      const browser = {
        name: "Swing"
      };
      const version = Utils.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/coast/i],
    describe(ua) {
      const browser = {
        name: "Opera Coast"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/opt\/\d+(?:.?_?\d+)+/i],
    describe(ua) {
      const browser = {
        name: "Opera Touch"
      };
      const version = Utils.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/yabrowser/i],
    describe(ua) {
      const browser = {
        name: "Yandex Browser"
      };
      const version = Utils.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/ucbrowser/i],
    describe(ua) {
      const browser = {
        name: "UC Browser"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/Maxthon|mxios/i],
    describe(ua) {
      const browser = {
        name: "Maxthon"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/epiphany/i],
    describe(ua) {
      const browser = {
        name: "Epiphany"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/puffin/i],
    describe(ua) {
      const browser = {
        name: "Puffin"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/sleipnir/i],
    describe(ua) {
      const browser = {
        name: "Sleipnir"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/k-meleon/i],
    describe(ua) {
      const browser = {
        name: "K-Meleon"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/micromessenger/i],
    describe(ua) {
      const browser = {
        name: "WeChat"
      };
      const version = Utils.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/qqbrowser/i],
    describe(ua) {
      const browser = {
        name: /qqbrowserlite/i.test(ua) ? "QQ Browser Lite" : "QQ Browser"
      };
      const version = Utils.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/msie|trident/i],
    describe(ua) {
      const browser = {
        name: "Internet Explorer"
      };
      const version = Utils.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/\sedg\//i],
    describe(ua) {
      const browser = {
        name: "Microsoft Edge"
      };
      const version = Utils.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/edg([ea]|ios)/i],
    describe(ua) {
      const browser = {
        name: "Microsoft Edge"
      };
      const version = Utils.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/vivaldi/i],
    describe(ua) {
      const browser = {
        name: "Vivaldi"
      };
      const version = Utils.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/seamonkey/i],
    describe(ua) {
      const browser = {
        name: "SeaMonkey"
      };
      const version = Utils.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/sailfish/i],
    describe(ua) {
      const browser = {
        name: "Sailfish"
      };
      const version = Utils.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/silk/i],
    describe(ua) {
      const browser = {
        name: "Amazon Silk"
      };
      const version = Utils.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/phantom/i],
    describe(ua) {
      const browser = {
        name: "PhantomJS"
      };
      const version = Utils.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/slimerjs/i],
    describe(ua) {
      const browser = {
        name: "SlimerJS"
      };
      const version = Utils.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
    describe(ua) {
      const browser = {
        name: "BlackBerry"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/(web|hpw)[o0]s/i],
    describe(ua) {
      const browser = {
        name: "WebOS Browser"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/bada/i],
    describe(ua) {
      const browser = {
        name: "Bada"
      };
      const version = Utils.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/tizen/i],
    describe(ua) {
      const browser = {
        name: "Tizen"
      };
      const version = Utils.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/qupzilla/i],
    describe(ua) {
      const browser = {
        name: "QupZilla"
      };
      const version = Utils.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/firefox|iceweasel|fxios/i],
    describe(ua) {
      const browser = {
        name: "Firefox"
      };
      const version = Utils.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/electron/i],
    describe(ua) {
      const browser = {
        name: "Electron"
      };
      const version = Utils.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/MiuiBrowser/i],
    describe(ua) {
      const browser = {
        name: "Miui"
      };
      const version = Utils.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/chromium/i],
    describe(ua) {
      const browser = {
        name: "Chromium"
      };
      const version = Utils.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/chrome|crios|crmo/i],
    describe(ua) {
      const browser = {
        name: "Chrome"
      };
      const version = Utils.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/GSA/i],
    describe(ua) {
      const browser = {
        name: "Google Search"
      };
      const version = Utils.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* Android Browser */
  {
    test(parser) {
      const notLikeAndroid = !parser.test(/like android/i);
      const butAndroid = parser.test(/android/i);
      return notLikeAndroid && butAndroid;
    },
    describe(ua) {
      const browser = {
        name: "Android Browser"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* PlayStation 4 */
  {
    test: [/playstation 4/i],
    describe(ua) {
      const browser = {
        name: "PlayStation 4"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* Safari */
  {
    test: [/safari|applewebkit/i],
    describe(ua) {
      const browser = {
        name: "Safari"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* Something else */
  {
    test: [/.*/i],
    describe(ua) {
      const regexpWithoutDeviceSpec = /^(.*)\/(.*) /;
      const regexpWithDeviceSpec = /^(.*)\/(.*)[ \t]\((.*)/;
      const hasDeviceSpec = ua.search("\\(") !== -1;
      const regexp = hasDeviceSpec ? regexpWithDeviceSpec : regexpWithoutDeviceSpec;
      return {
        name: Utils.getFirstMatch(regexp, ua),
        version: Utils.getSecondMatch(regexp, ua)
      };
    }
  }
];
var parser_browsers_default = browsersList;

// ../../node_modules/bowser/src/parser-os.js
var parser_os_default = [
  /* Roku */
  {
    test: [/Roku\/DVP/],
    describe(ua) {
      const version = Utils.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, ua);
      return {
        name: OS_MAP.Roku,
        version
      };
    }
  },
  /* Windows Phone */
  {
    test: [/windows phone/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.WindowsPhone,
        version
      };
    }
  },
  /* Windows */
  {
    test: [/windows /i],
    describe(ua) {
      const version = Utils.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, ua);
      const versionName = Utils.getWindowsVersionName(version);
      return {
        name: OS_MAP.Windows,
        version,
        versionName
      };
    }
  },
  /* Firefox on iPad */
  {
    test: [/Macintosh(.*?) FxiOS(.*?)\//],
    describe(ua) {
      const result = {
        name: OS_MAP.iOS
      };
      const version = Utils.getSecondMatch(/(Version\/)(\d[\d.]+)/, ua);
      if (version) {
        result.version = version;
      }
      return result;
    }
  },
  /* macOS */
  {
    test: [/macintosh/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, ua).replace(/[_\s]/g, ".");
      const versionName = Utils.getMacOSVersionName(version);
      const os = {
        name: OS_MAP.MacOS,
        version
      };
      if (versionName) {
        os.versionName = versionName;
      }
      return os;
    }
  },
  /* iOS */
  {
    test: [/(ipod|iphone|ipad)/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, ua).replace(/[_\s]/g, ".");
      return {
        name: OS_MAP.iOS,
        version
      };
    }
  },
  /* Android */
  {
    test(parser) {
      const notLikeAndroid = !parser.test(/like android/i);
      const butAndroid = parser.test(/android/i);
      return notLikeAndroid && butAndroid;
    },
    describe(ua) {
      const version = Utils.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, ua);
      const versionName = Utils.getAndroidVersionName(version);
      const os = {
        name: OS_MAP.Android,
        version
      };
      if (versionName) {
        os.versionName = versionName;
      }
      return os;
    }
  },
  /* WebOS */
  {
    test: [/(web|hpw)[o0]s/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, ua);
      const os = {
        name: OS_MAP.WebOS
      };
      if (version && version.length) {
        os.version = version;
      }
      return os;
    }
  },
  /* BlackBerry */
  {
    test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, ua) || Utils.getFirstMatch(/\bbb(\d+)/i, ua);
      return {
        name: OS_MAP.BlackBerry,
        version
      };
    }
  },
  /* Bada */
  {
    test: [/bada/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.Bada,
        version
      };
    }
  },
  /* Tizen */
  {
    test: [/tizen/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.Tizen,
        version
      };
    }
  },
  /* Linux */
  {
    test: [/linux/i],
    describe() {
      return {
        name: OS_MAP.Linux
      };
    }
  },
  /* Chrome OS */
  {
    test: [/CrOS/],
    describe() {
      return {
        name: OS_MAP.ChromeOS
      };
    }
  },
  /* Playstation 4 */
  {
    test: [/PlayStation 4/],
    describe(ua) {
      const version = Utils.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.PlayStation4,
        version
      };
    }
  }
];

// ../../node_modules/bowser/src/parser-platforms.js
var parser_platforms_default = [
  /* Googlebot */
  {
    test: [/googlebot/i],
    describe() {
      return {
        type: "bot",
        vendor: "Google"
      };
    }
  },
  /* Huawei */
  {
    test: [/huawei/i],
    describe(ua) {
      const model = Utils.getFirstMatch(/(can-l01)/i, ua) && "Nova";
      const platform = {
        type: PLATFORMS_MAP.mobile,
        vendor: "Huawei"
      };
      if (model) {
        platform.model = model;
      }
      return platform;
    }
  },
  /* Nexus Tablet */
  {
    test: [/nexus\s*(?:7|8|9|10).*/i],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Nexus"
      };
    }
  },
  /* iPad */
  {
    test: [/ipad/i],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Apple",
        model: "iPad"
      };
    }
  },
  /* Firefox on iPad */
  {
    test: [/Macintosh(.*?) FxiOS(.*?)\//],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Apple",
        model: "iPad"
      };
    }
  },
  /* Amazon Kindle Fire */
  {
    test: [/kftt build/i],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Amazon",
        model: "Kindle Fire HD 7"
      };
    }
  },
  /* Another Amazon Tablet with Silk */
  {
    test: [/silk/i],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Amazon"
      };
    }
  },
  /* Tablet */
  {
    test: [/tablet(?! pc)/i],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet
      };
    }
  },
  /* iPod/iPhone */
  {
    test(parser) {
      const iDevice = parser.test(/ipod|iphone/i);
      const likeIDevice = parser.test(/like (ipod|iphone)/i);
      return iDevice && !likeIDevice;
    },
    describe(ua) {
      const model = Utils.getFirstMatch(/(ipod|iphone)/i, ua);
      return {
        type: PLATFORMS_MAP.mobile,
        vendor: "Apple",
        model
      };
    }
  },
  /* Nexus Mobile */
  {
    test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
    describe() {
      return {
        type: PLATFORMS_MAP.mobile,
        vendor: "Nexus"
      };
    }
  },
  /* Mobile */
  {
    test: [/[^-]mobi/i],
    describe() {
      return {
        type: PLATFORMS_MAP.mobile
      };
    }
  },
  /* BlackBerry */
  {
    test(parser) {
      return parser.getBrowserName(true) === "blackberry";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.mobile,
        vendor: "BlackBerry"
      };
    }
  },
  /* Bada */
  {
    test(parser) {
      return parser.getBrowserName(true) === "bada";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.mobile
      };
    }
  },
  /* Windows Phone */
  {
    test(parser) {
      return parser.getBrowserName() === "windows phone";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.mobile,
        vendor: "Microsoft"
      };
    }
  },
  /* Android Tablet */
  {
    test(parser) {
      const osMajorVersion = Number(String(parser.getOSVersion()).split(".")[0]);
      return parser.getOSName(true) === "android" && osMajorVersion >= 3;
    },
    describe() {
      return {
        type: PLATFORMS_MAP.tablet
      };
    }
  },
  /* Android Mobile */
  {
    test(parser) {
      return parser.getOSName(true) === "android";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.mobile
      };
    }
  },
  /* desktop */
  {
    test(parser) {
      return parser.getOSName(true) === "macos";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.desktop,
        vendor: "Apple"
      };
    }
  },
  /* Windows */
  {
    test(parser) {
      return parser.getOSName(true) === "windows";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.desktop
      };
    }
  },
  /* Linux */
  {
    test(parser) {
      return parser.getOSName(true) === "linux";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.desktop
      };
    }
  },
  /* PlayStation 4 */
  {
    test(parser) {
      return parser.getOSName(true) === "playstation 4";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.tv
      };
    }
  },
  /* Roku */
  {
    test(parser) {
      return parser.getOSName(true) === "roku";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.tv
      };
    }
  }
];

// ../../node_modules/bowser/src/parser-engines.js
var parser_engines_default = [
  /* EdgeHTML */
  {
    test(parser) {
      return parser.getBrowserName(true) === "microsoft edge";
    },
    describe(ua) {
      const isBlinkBased = /\sedg\//i.test(ua);
      if (isBlinkBased) {
        return {
          name: ENGINE_MAP.Blink
        };
      }
      const version = Utils.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, ua);
      return {
        name: ENGINE_MAP.EdgeHTML,
        version
      };
    }
  },
  /* Trident */
  {
    test: [/trident/i],
    describe(ua) {
      const engine = {
        name: ENGINE_MAP.Trident
      };
      const version = Utils.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        engine.version = version;
      }
      return engine;
    }
  },
  /* Presto */
  {
    test(parser) {
      return parser.test(/presto/i);
    },
    describe(ua) {
      const engine = {
        name: ENGINE_MAP.Presto
      };
      const version = Utils.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        engine.version = version;
      }
      return engine;
    }
  },
  /* Gecko */
  {
    test(parser) {
      const isGecko = parser.test(/gecko/i);
      const likeGecko = parser.test(/like gecko/i);
      return isGecko && !likeGecko;
    },
    describe(ua) {
      const engine = {
        name: ENGINE_MAP.Gecko
      };
      const version = Utils.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        engine.version = version;
      }
      return engine;
    }
  },
  /* Blink */
  {
    test: [/(apple)?webkit\/537\.36/i],
    describe() {
      return {
        name: ENGINE_MAP.Blink
      };
    }
  },
  /* WebKit */
  {
    test: [/(apple)?webkit/i],
    describe(ua) {
      const engine = {
        name: ENGINE_MAP.WebKit
      };
      const version = Utils.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        engine.version = version;
      }
      return engine;
    }
  }
];

// ../../node_modules/bowser/src/parser.js
var Parser = class {
  /**
   * Create instance of Parser
   *
   * @param {String} UA User-Agent string
   * @param {Boolean} [skipParsing=false] parser can skip parsing in purpose of performance
   * improvements if you need to make a more particular parsing
   * like {@link Parser#parseBrowser} or {@link Parser#parsePlatform}
   *
   * @throw {Error} in case of empty UA String
   *
   * @constructor
   */
  constructor(UA, skipParsing = false) {
    if (UA === void 0 || UA === null || UA === "") {
      throw new Error("UserAgent parameter can't be empty");
    }
    this._ua = UA;
    this.parsedResult = {};
    if (skipParsing !== true) {
      this.parse();
    }
  }
  /**
   * Get UserAgent string of current Parser instance
   * @return {String} User-Agent String of the current <Parser> object
   *
   * @public
   */
  getUA() {
    return this._ua;
  }
  /**
   * Test a UA string for a regexp
   * @param {RegExp} regex
   * @return {Boolean}
   */
  test(regex) {
    return regex.test(this._ua);
  }
  /**
   * Get parsed browser object
   * @return {Object}
   */
  parseBrowser() {
    this.parsedResult.browser = {};
    const browserDescriptor = Utils.find(parser_browsers_default, (_browser) => {
      if (typeof _browser.test === "function") {
        return _browser.test(this);
      }
      if (_browser.test instanceof Array) {
        return _browser.test.some((condition) => this.test(condition));
      }
      throw new Error("Browser's test function is not valid");
    });
    if (browserDescriptor) {
      this.parsedResult.browser = browserDescriptor.describe(this.getUA());
    }
    return this.parsedResult.browser;
  }
  /**
   * Get parsed browser object
   * @return {Object}
   *
   * @public
   */
  getBrowser() {
    if (this.parsedResult.browser) {
      return this.parsedResult.browser;
    }
    return this.parseBrowser();
  }
  /**
   * Get browser's name
   * @return {String} Browser's name or an empty string
   *
   * @public
   */
  getBrowserName(toLowerCase) {
    if (toLowerCase) {
      return String(this.getBrowser().name).toLowerCase() || "";
    }
    return this.getBrowser().name || "";
  }
  /**
   * Get browser's version
   * @return {String} version of browser
   *
   * @public
   */
  getBrowserVersion() {
    return this.getBrowser().version;
  }
  /**
   * Get OS
   * @return {Object}
   *
   * @example
   * this.getOS();
   * {
   *   name: 'macOS',
   *   version: '10.11.12'
   * }
   */
  getOS() {
    if (this.parsedResult.os) {
      return this.parsedResult.os;
    }
    return this.parseOS();
  }
  /**
   * Parse OS and save it to this.parsedResult.os
   * @return {*|{}}
   */
  parseOS() {
    this.parsedResult.os = {};
    const os = Utils.find(parser_os_default, (_os) => {
      if (typeof _os.test === "function") {
        return _os.test(this);
      }
      if (_os.test instanceof Array) {
        return _os.test.some((condition) => this.test(condition));
      }
      throw new Error("Browser's test function is not valid");
    });
    if (os) {
      this.parsedResult.os = os.describe(this.getUA());
    }
    return this.parsedResult.os;
  }
  /**
   * Get OS name
   * @param {Boolean} [toLowerCase] return lower-cased value
   * @return {String} name of the OS — macOS, Windows, Linux, etc.
   */
  getOSName(toLowerCase) {
    const {
      name
    } = this.getOS();
    if (toLowerCase) {
      return String(name).toLowerCase() || "";
    }
    return name || "";
  }
  /**
   * Get OS version
   * @return {String} full version with dots ('10.11.12', '5.6', etc)
   */
  getOSVersion() {
    return this.getOS().version;
  }
  /**
   * Get parsed platform
   * @return {{}}
   */
  getPlatform() {
    if (this.parsedResult.platform) {
      return this.parsedResult.platform;
    }
    return this.parsePlatform();
  }
  /**
   * Get platform name
   * @param {Boolean} [toLowerCase=false]
   * @return {*}
   */
  getPlatformType(toLowerCase = false) {
    const {
      type
    } = this.getPlatform();
    if (toLowerCase) {
      return String(type).toLowerCase() || "";
    }
    return type || "";
  }
  /**
   * Get parsed platform
   * @return {{}}
   */
  parsePlatform() {
    this.parsedResult.platform = {};
    const platform = Utils.find(parser_platforms_default, (_platform) => {
      if (typeof _platform.test === "function") {
        return _platform.test(this);
      }
      if (_platform.test instanceof Array) {
        return _platform.test.some((condition) => this.test(condition));
      }
      throw new Error("Browser's test function is not valid");
    });
    if (platform) {
      this.parsedResult.platform = platform.describe(this.getUA());
    }
    return this.parsedResult.platform;
  }
  /**
   * Get parsed engine
   * @return {{}}
   */
  getEngine() {
    if (this.parsedResult.engine) {
      return this.parsedResult.engine;
    }
    return this.parseEngine();
  }
  /**
   * Get engines's name
   * @return {String} Engines's name or an empty string
   *
   * @public
   */
  getEngineName(toLowerCase) {
    if (toLowerCase) {
      return String(this.getEngine().name).toLowerCase() || "";
    }
    return this.getEngine().name || "";
  }
  /**
   * Get parsed platform
   * @return {{}}
   */
  parseEngine() {
    this.parsedResult.engine = {};
    const engine = Utils.find(parser_engines_default, (_engine) => {
      if (typeof _engine.test === "function") {
        return _engine.test(this);
      }
      if (_engine.test instanceof Array) {
        return _engine.test.some((condition) => this.test(condition));
      }
      throw new Error("Browser's test function is not valid");
    });
    if (engine) {
      this.parsedResult.engine = engine.describe(this.getUA());
    }
    return this.parsedResult.engine;
  }
  /**
   * Parse full information about the browser
   * @returns {Parser}
   */
  parse() {
    this.parseBrowser();
    this.parseOS();
    this.parsePlatform();
    this.parseEngine();
    return this;
  }
  /**
   * Get parsed result
   * @return {ParsedResult}
   */
  getResult() {
    return Utils.assign({}, this.parsedResult);
  }
  /**
   * Check if parsed browser matches certain conditions
   *
   * @param {Object} checkTree It's one or two layered object,
   * which can include a platform or an OS on the first layer
   * and should have browsers specs on the bottom-laying layer
   *
   * @returns {Boolean|undefined} Whether the browser satisfies the set conditions or not.
   * Returns `undefined` when the browser is no described in the checkTree object.
   *
   * @example
   * const browser = Bowser.getParser(window.navigator.userAgent);
   * if (browser.satisfies({chrome: '>118.01.1322' }))
   * // or with os
   * if (browser.satisfies({windows: { chrome: '>118.01.1322' } }))
   * // or with platforms
   * if (browser.satisfies({desktop: { chrome: '>118.01.1322' } }))
   */
  satisfies(checkTree) {
    const platformsAndOSes = {};
    let platformsAndOSCounter = 0;
    const browsers = {};
    let browsersCounter = 0;
    const allDefinitions = Object.keys(checkTree);
    allDefinitions.forEach((key) => {
      const currentDefinition = checkTree[key];
      if (typeof currentDefinition === "string") {
        browsers[key] = currentDefinition;
        browsersCounter += 1;
      } else if (typeof currentDefinition === "object") {
        platformsAndOSes[key] = currentDefinition;
        platformsAndOSCounter += 1;
      }
    });
    if (platformsAndOSCounter > 0) {
      const platformsAndOSNames = Object.keys(platformsAndOSes);
      const OSMatchingDefinition = Utils.find(platformsAndOSNames, (name) => this.isOS(name));
      if (OSMatchingDefinition) {
        const osResult = this.satisfies(platformsAndOSes[OSMatchingDefinition]);
        if (osResult !== void 0) {
          return osResult;
        }
      }
      const platformMatchingDefinition = Utils.find(platformsAndOSNames, (name) => this.isPlatform(name));
      if (platformMatchingDefinition) {
        const platformResult = this.satisfies(platformsAndOSes[platformMatchingDefinition]);
        if (platformResult !== void 0) {
          return platformResult;
        }
      }
    }
    if (browsersCounter > 0) {
      const browserNames = Object.keys(browsers);
      const matchingDefinition = Utils.find(browserNames, (name) => this.isBrowser(name, true));
      if (matchingDefinition !== void 0) {
        return this.compareVersion(browsers[matchingDefinition]);
      }
    }
    return void 0;
  }
  /**
   * Check if the browser name equals the passed string
   * @param browserName The string to compare with the browser name
   * @param [includingAlias=false] The flag showing whether alias will be included into comparison
   * @returns {boolean}
   */
  isBrowser(browserName, includingAlias = false) {
    const defaultBrowserName = this.getBrowserName().toLowerCase();
    let browserNameLower = browserName.toLowerCase();
    const alias = Utils.getBrowserTypeByAlias(browserNameLower);
    if (includingAlias && alias) {
      browserNameLower = alias.toLowerCase();
    }
    return browserNameLower === defaultBrowserName;
  }
  compareVersion(version) {
    let expectedResults = [0];
    let comparableVersion = version;
    let isLoose = false;
    const currentBrowserVersion = this.getBrowserVersion();
    if (typeof currentBrowserVersion !== "string") {
      return void 0;
    }
    if (version[0] === ">" || version[0] === "<") {
      comparableVersion = version.substr(1);
      if (version[1] === "=") {
        isLoose = true;
        comparableVersion = version.substr(2);
      } else {
        expectedResults = [];
      }
      if (version[0] === ">") {
        expectedResults.push(1);
      } else {
        expectedResults.push(-1);
      }
    } else if (version[0] === "=") {
      comparableVersion = version.substr(1);
    } else if (version[0] === "~") {
      isLoose = true;
      comparableVersion = version.substr(1);
    }
    return expectedResults.indexOf(Utils.compareVersions(currentBrowserVersion, comparableVersion, isLoose)) > -1;
  }
  isOS(osName) {
    return this.getOSName(true) === String(osName).toLowerCase();
  }
  isPlatform(platformType) {
    return this.getPlatformType(true) === String(platformType).toLowerCase();
  }
  isEngine(engineName) {
    return this.getEngineName(true) === String(engineName).toLowerCase();
  }
  /**
   * Is anything? Check if the browser is called "anything",
   * the OS called "anything" or the platform called "anything"
   * @param {String} anything
   * @param [includingAlias=false] The flag showing whether alias will be included into comparison
   * @returns {Boolean}
   */
  is(anything, includingAlias = false) {
    return this.isBrowser(anything, includingAlias) || this.isOS(anything) || this.isPlatform(anything);
  }
  /**
   * Check if any of the given values satisfies this.is(anything)
   * @param {String[]} anythings
   * @returns {Boolean}
   */
  some(anythings = []) {
    return anythings.some((anything) => this.is(anything));
  }
};
var parser_default = Parser;

// ../../node_modules/bowser/src/bowser.js
var Bowser = class {
  /**
   * Creates a {@link Parser} instance
   *
   * @param {String} UA UserAgent string
   * @param {Boolean} [skipParsing=false] Will make the Parser postpone parsing until you ask it
   * explicitly. Same as `skipParsing` for {@link Parser}.
   * @returns {Parser}
   * @throws {Error} when UA is not a String
   *
   * @example
   * const parser = Bowser.getParser(window.navigator.userAgent);
   * const result = parser.getResult();
   */
  static getParser(UA, skipParsing = false) {
    if (typeof UA !== "string") {
      throw new Error("UserAgent should be a string");
    }
    return new parser_default(UA, skipParsing);
  }
  /**
   * Creates a {@link Parser} instance and runs {@link Parser.getResult} immediately
   *
   * @param UA
   * @return {ParsedResult}
   *
   * @example
   * const result = Bowser.parse(window.navigator.userAgent);
   */
  static parse(UA) {
    return new parser_default(UA).getResult();
  }
  static get BROWSER_MAP() {
    return BROWSER_MAP;
  }
  static get ENGINE_MAP() {
    return ENGINE_MAP;
  }
  static get OS_MAP() {
    return OS_MAP;
  }
  static get PLATFORMS_MAP() {
    return PLATFORMS_MAP;
  }
};
var bowser_default = Bowser;

// ../../node_modules/@aws-sdk/util-user-agent-browser/dist-es/index.js
var createDefaultUserAgentProvider = ({
  serviceId,
  clientVersion
}) => (config) => __async(void 0, null, function* () {
  const parsedUA = typeof window !== "undefined" && window?.navigator?.userAgent ? bowser_default.parse(window.navigator.userAgent) : void 0;
  const sections = [["aws-sdk-js", clientVersion], ["ua", "2.1"], [`os/${parsedUA?.os?.name || "other"}`, parsedUA?.os?.version], ["lang/js"], ["md/browser", `${parsedUA?.browser?.name ?? "unknown"}_${parsedUA?.browser?.version ?? "unknown"}`]];
  if (serviceId) {
    sections.push([`api/${serviceId}`, clientVersion]);
  }
  const appId = yield config?.userAgentAppId?.();
  if (appId) {
    sections.push([`app/${appId}`]);
  }
  return sections;
});

// ../../node_modules/@smithy/fetch-http-handler/dist-es/request-timeout.js
function requestTimeout2(timeoutInMs = 0) {
  return new Promise((resolve, reject) => {
    if (timeoutInMs) {
      setTimeout(() => {
        const timeoutError = new Error(`Request did not complete within ${timeoutInMs} ms`);
        timeoutError.name = "TimeoutError";
        reject(timeoutError);
      }, timeoutInMs);
    }
  });
}

// ../../node_modules/@smithy/fetch-http-handler/dist-es/fetch-http-handler.js
var keepAliveSupport = {
  supported: void 0
};
var FetchHttpHandler = class _FetchHttpHandler {
  static create(instanceOrOptions) {
    if (typeof instanceOrOptions?.handle === "function") {
      return instanceOrOptions;
    }
    return new _FetchHttpHandler(instanceOrOptions);
  }
  constructor(options) {
    if (typeof options === "function") {
      this.configProvider = options().then((opts) => opts || {});
    } else {
      this.config = options ?? {};
      this.configProvider = Promise.resolve(this.config);
    }
    if (keepAliveSupport.supported === void 0) {
      keepAliveSupport.supported = Boolean(typeof Request !== "undefined" && "keepalive" in new Request("https://[::1]"));
    }
  }
  destroy() {
  }
  handle(_0) {
    return __async(this, arguments, function* (request, {
      abortSignal
    } = {}) {
      if (!this.config) {
        this.config = yield this.configProvider;
      }
      const requestTimeoutInMs = this.config.requestTimeout;
      const keepAlive = this.config.keepAlive === true;
      const credentials = this.config.credentials;
      if (abortSignal?.aborted) {
        const abortError = new Error("Request aborted");
        abortError.name = "AbortError";
        return Promise.reject(abortError);
      }
      let path = request.path;
      const queryString = buildQueryString(request.query || {});
      if (queryString) {
        path += `?${queryString}`;
      }
      if (request.fragment) {
        path += `#${request.fragment}`;
      }
      let auth = "";
      if (request.username != null || request.password != null) {
        const username = request.username ?? "";
        const password = request.password ?? "";
        auth = `${username}:${password}@`;
      }
      const {
        port,
        method
      } = request;
      const url = `${request.protocol}//${auth}${request.hostname}${port ? `:${port}` : ""}${path}`;
      const body = method === "GET" || method === "HEAD" ? void 0 : request.body;
      const requestOptions = {
        body,
        headers: new Headers(request.headers),
        method,
        credentials
      };
      if (this.config?.cache) {
        requestOptions.cache = this.config.cache;
      }
      if (body) {
        requestOptions.duplex = "half";
      }
      if (typeof AbortController !== "undefined") {
        requestOptions.signal = abortSignal;
      }
      if (keepAliveSupport.supported) {
        requestOptions.keepalive = keepAlive;
      }
      if (typeof this.config.requestInit === "function") {
        Object.assign(requestOptions, this.config.requestInit(request));
      }
      let removeSignalEventListener = () => {
      };
      const fetchRequest = new Request(url, requestOptions);
      const raceOfPromises = [fetch(fetchRequest).then((response) => {
        const fetchHeaders = response.headers;
        const transformedHeaders = {};
        for (const pair of fetchHeaders.entries()) {
          transformedHeaders[pair[0]] = pair[1];
        }
        const hasReadableStream = response.body != void 0;
        if (!hasReadableStream) {
          return response.blob().then((body2) => ({
            response: new HttpResponse({
              headers: transformedHeaders,
              reason: response.statusText,
              statusCode: response.status,
              body: body2
            })
          }));
        }
        return {
          response: new HttpResponse({
            headers: transformedHeaders,
            reason: response.statusText,
            statusCode: response.status,
            body: response.body
          })
        };
      }), requestTimeout2(requestTimeoutInMs)];
      if (abortSignal) {
        raceOfPromises.push(new Promise((resolve, reject) => {
          const onAbort = () => {
            const abortError = new Error("Request aborted");
            abortError.name = "AbortError";
            reject(abortError);
          };
          if (typeof abortSignal.addEventListener === "function") {
            const signal = abortSignal;
            signal.addEventListener("abort", onAbort, {
              once: true
            });
            removeSignalEventListener = () => signal.removeEventListener("abort", onAbort);
          } else {
            abortSignal.onabort = onAbort;
          }
        }));
      }
      return Promise.race(raceOfPromises).finally(removeSignalEventListener);
    });
  }
  updateHttpClientConfig(key, value) {
    this.config = void 0;
    this.configProvider = this.configProvider.then((config) => {
      config[key] = value;
      return config;
    });
  }
  httpHandlerConfigs() {
    return this.config ?? {};
  }
};

// ../../node_modules/@smithy/fetch-http-handler/dist-es/stream-collector.js
var streamCollector2 = (stream) => {
  if (typeof Blob === "function" && stream instanceof Blob) {
    return collectBlob(stream);
  }
  return collectStream(stream);
};
function collectBlob(blob) {
  return __async(this, null, function* () {
    const base64 = yield readToBase64(blob);
    const arrayBuffer = fromBase64(base64);
    return new Uint8Array(arrayBuffer);
  });
}
function collectStream(stream) {
  return __async(this, null, function* () {
    const chunks = [];
    const reader = stream.getReader();
    let isDone = false;
    let length = 0;
    while (!isDone) {
      const {
        done,
        value
      } = yield reader.read();
      if (value) {
        chunks.push(value);
        length += value.length;
      }
      isDone = done;
    }
    const collected = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      collected.set(chunk, offset);
      offset += chunk.length;
    }
    return collected;
  });
}
function readToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.readyState !== 2) {
        return reject(new Error("Reader aborted too early"));
      }
      const result = reader.result ?? "";
      const commaIndex = result.indexOf(",");
      const dataOffset = commaIndex > -1 ? commaIndex + 1 : result.length;
      resolve(result.substring(dataOffset));
    };
    reader.onabort = () => reject(new Error("Read aborted"));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

// ../../node_modules/@smithy/invalid-dependency/dist-es/invalidProvider.js
var invalidProvider = (message) => () => Promise.reject(message);

// ../../node_modules/@smithy/util-body-length-browser/dist-es/calculateBodyLength.js
var TEXT_ENCODER = typeof TextEncoder == "function" ? new TextEncoder() : null;
var calculateBodyLength = (body) => {
  if (typeof body === "string") {
    if (TEXT_ENCODER) {
      return TEXT_ENCODER.encode(body).byteLength;
    }
    let len = body.length;
    for (let i2 = len - 1; i2 >= 0; i2--) {
      const code = body.charCodeAt(i2);
      if (code > 127 && code <= 2047) len++;
      else if (code > 2047 && code <= 65535) len += 2;
      if (code >= 56320 && code <= 57343) i2--;
    }
    return len;
  } else if (typeof body.byteLength === "number") {
    return body.byteLength;
  } else if (typeof body.size === "number") {
    return body.size;
  }
  throw new Error(`Body Length computation failed for ${body}`);
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/endpoint/ruleset.js
var s = "required";
var t = "fn";
var u = "argv";
var v = "ref";
var a = true;
var b = "isSet";
var c = "booleanEquals";
var d = "error";
var e = "endpoint";
var f2 = "tree";
var g = "PartitionResult";
var h = {
  [s]: false,
  "type": "String"
};
var i = {
  [s]: true,
  "default": false,
  "type": "Boolean"
};
var j = {
  [v]: "Endpoint"
};
var k = {
  [t]: c,
  [u]: [{
    [v]: "UseFIPS"
  }, true]
};
var l = {
  [t]: c,
  [u]: [{
    [v]: "UseDualStack"
  }, true]
};
var m = {};
var n = {
  [t]: "getAttr",
  [u]: [{
    [v]: g
  }, "supportsFIPS"]
};
var o = {
  [t]: c,
  [u]: [true, {
    [t]: "getAttr",
    [u]: [{
      [v]: g
    }, "supportsDualStack"]
  }]
};
var p = [k];
var q = [l];
var r = [{
  [v]: "Region"
}];
var _data = {
  version: "1.0",
  parameters: {
    Region: h,
    UseDualStack: i,
    UseFIPS: i,
    Endpoint: h
  },
  rules: [{
    conditions: [{
      [t]: b,
      [u]: [j]
    }],
    rules: [{
      conditions: p,
      error: "Invalid Configuration: FIPS and custom endpoint are not supported",
      type: d
    }, {
      conditions: q,
      error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
      type: d
    }, {
      endpoint: {
        url: j,
        properties: m,
        headers: m
      },
      type: e
    }],
    type: f2
  }, {
    conditions: [{
      [t]: b,
      [u]: r
    }],
    rules: [{
      conditions: [{
        [t]: "aws.partition",
        [u]: r,
        assign: g
      }],
      rules: [{
        conditions: [k, l],
        rules: [{
          conditions: [{
            [t]: c,
            [u]: [a, n]
          }, o],
          rules: [{
            endpoint: {
              url: "https://cognito-idp-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
              properties: m,
              headers: m
            },
            type: e
          }],
          type: f2
        }, {
          error: "FIPS and DualStack are enabled, but this partition does not support one or both",
          type: d
        }],
        type: f2
      }, {
        conditions: p,
        rules: [{
          conditions: [{
            [t]: c,
            [u]: [n, a]
          }],
          rules: [{
            endpoint: {
              url: "https://cognito-idp-fips.{Region}.{PartitionResult#dnsSuffix}",
              properties: m,
              headers: m
            },
            type: e
          }],
          type: f2
        }, {
          error: "FIPS is enabled but this partition does not support FIPS",
          type: d
        }],
        type: f2
      }, {
        conditions: q,
        rules: [{
          conditions: [o],
          rules: [{
            endpoint: {
              url: "https://cognito-idp.{Region}.{PartitionResult#dualStackDnsSuffix}",
              properties: m,
              headers: m
            },
            type: e
          }],
          type: f2
        }, {
          error: "DualStack is enabled but this partition does not support DualStack",
          type: d
        }],
        type: f2
      }, {
        endpoint: {
          url: "https://cognito-idp.{Region}.{PartitionResult#dnsSuffix}",
          properties: m,
          headers: m
        },
        type: e
      }],
      type: f2
    }],
    type: f2
  }, {
    error: "Invalid Configuration: Missing Region",
    type: d
  }]
};
var ruleSet = _data;

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/endpoint/endpointResolver.js
var cache = new EndpointCache({
  size: 50,
  params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
});
var defaultEndpointResolver = (endpointParams, context = {}) => {
  return cache.get(endpointParams, () => resolveEndpoint(ruleSet, {
    endpointParams,
    logger: context.logger
  }));
};
customEndpointFunctions.aws = awsEndpointFunctions;

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/runtimeConfig.shared.js
var getRuntimeConfig = (config) => {
  return {
    apiVersion: "2016-04-18",
    base64Decoder: config?.base64Decoder ?? fromBase64,
    base64Encoder: config?.base64Encoder ?? toBase64,
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
    extensions: config?.extensions ?? [],
    httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultCognitoIdentityProviderHttpAuthSchemeProvider,
    httpAuthSchemes: config?.httpAuthSchemes ?? [{
      schemeId: "aws.auth#sigv4",
      identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
      signer: new AwsSdkSigV4Signer()
    }, {
      schemeId: "smithy.api#noAuth",
      identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (() => __async(void 0, null, function* () {
        return {};
      })),
      signer: new NoAuthSigner()
    }],
    logger: config?.logger ?? new NoOpLogger(),
    serviceId: config?.serviceId ?? "Cognito Identity Provider",
    urlParser: config?.urlParser ?? parseUrl,
    utf8Decoder: config?.utf8Decoder ?? fromUtf8,
    utf8Encoder: config?.utf8Encoder ?? toUtf8
  };
};

// ../../node_modules/@smithy/util-defaults-mode-browser/dist-es/constants.js
var DEFAULTS_MODE_OPTIONS = ["in-region", "cross-region", "mobile", "standard", "legacy"];

// ../../node_modules/@smithy/util-defaults-mode-browser/dist-es/resolveDefaultsModeConfig.js
var resolveDefaultsModeConfig = ({
  defaultsMode
} = {}) => memoize(() => __async(void 0, null, function* () {
  const mode = typeof defaultsMode === "function" ? yield defaultsMode() : defaultsMode;
  switch (mode?.toLowerCase()) {
    case "auto":
      return Promise.resolve(isMobileBrowser() ? "mobile" : "standard");
    case "mobile":
    case "in-region":
    case "cross-region":
    case "standard":
    case "legacy":
      return Promise.resolve(mode?.toLocaleLowerCase());
    case void 0:
      return Promise.resolve("legacy");
    default:
      throw new Error(`Invalid parameter for "defaultsMode", expect ${DEFAULTS_MODE_OPTIONS.join(", ")}, got ${mode}`);
  }
}));
var isMobileBrowser = () => {
  const parsedUA = typeof window !== "undefined" && window?.navigator?.userAgent ? bowser_default.parse(window.navigator.userAgent) : void 0;
  const platform = parsedUA?.platform?.type;
  return platform === "tablet" || platform === "mobile";
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/runtimeConfig.browser.js
var getRuntimeConfig2 = (config) => {
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig(config);
  return __spreadProps(__spreadValues(__spreadValues({}, clientSharedValues), config), {
    runtime: "browser",
    defaultsMode,
    bodyLengthChecker: config?.bodyLengthChecker ?? calculateBodyLength,
    credentialDefaultProvider: config?.credentialDefaultProvider ?? ((_) => () => Promise.reject(new Error("Credential is missing"))),
    defaultUserAgentProvider: config?.defaultUserAgentProvider ?? createDefaultUserAgentProvider({
      serviceId: clientSharedValues.serviceId,
      clientVersion: package_default.version
    }),
    maxAttempts: config?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS,
    region: config?.region ?? invalidProvider("Region is missing"),
    requestHandler: FetchHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
    retryMode: config?.retryMode ?? (() => __async(void 0, null, function* () {
      return (yield defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE;
    })),
    sha256: config?.sha256 ?? Sha2563,
    streamCollector: config?.streamCollector ?? streamCollector2,
    useDualstackEndpoint: config?.useDualstackEndpoint ?? (() => Promise.resolve(DEFAULT_USE_DUALSTACK_ENDPOINT)),
    useFipsEndpoint: config?.useFipsEndpoint ?? (() => Promise.resolve(DEFAULT_USE_FIPS_ENDPOINT))
  });
};

// ../../node_modules/@aws-sdk/region-config-resolver/dist-es/extensions/index.js
var getAwsRegionExtensionConfiguration = (runtimeConfig) => {
  let runtimeConfigRegion = () => __async(void 0, null, function* () {
    if (runtimeConfig.region === void 0) {
      throw new Error("Region is missing from runtimeConfig");
    }
    const region = runtimeConfig.region;
    if (typeof region === "string") {
      return region;
    }
    return region();
  });
  return {
    setRegion(region) {
      runtimeConfigRegion = region;
    },
    region() {
      return runtimeConfigRegion;
    }
  };
};
var resolveAwsRegionExtensionConfiguration = (awsRegionExtensionConfiguration) => {
  return {
    region: awsRegionExtensionConfiguration.region()
  };
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/auth/httpAuthExtensionConfiguration.js
var getHttpAuthExtensionConfiguration = (runtimeConfig) => {
  const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
  let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
  let _credentials = runtimeConfig.credentials;
  return {
    setHttpAuthScheme(httpAuthScheme) {
      const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
      if (index === -1) {
        _httpAuthSchemes.push(httpAuthScheme);
      } else {
        _httpAuthSchemes.splice(index, 1, httpAuthScheme);
      }
    },
    httpAuthSchemes() {
      return _httpAuthSchemes;
    },
    setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
      _httpAuthSchemeProvider = httpAuthSchemeProvider;
    },
    httpAuthSchemeProvider() {
      return _httpAuthSchemeProvider;
    },
    setCredentials(credentials) {
      _credentials = credentials;
    },
    credentials() {
      return _credentials;
    }
  };
};
var resolveHttpAuthRuntimeConfig = (config) => {
  return {
    httpAuthSchemes: config.httpAuthSchemes(),
    httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
    credentials: config.credentials()
  };
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/runtimeExtensions.js
var asPartial = (t2) => t2;
var resolveRuntimeExtensions = (runtimeConfig, extensions) => {
  const extensionConfiguration = __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, asPartial(getAwsRegionExtensionConfiguration(runtimeConfig))), asPartial(getDefaultExtensionConfiguration(runtimeConfig))), asPartial(getHttpHandlerExtensionConfiguration(runtimeConfig))), asPartial(getHttpAuthExtensionConfiguration(runtimeConfig)));
  extensions.forEach((extension) => extension.configure(extensionConfiguration));
  return __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, runtimeConfig), resolveAwsRegionExtensionConfiguration(extensionConfiguration)), resolveDefaultRuntimeConfig(extensionConfiguration)), resolveHttpHandlerRuntimeConfig(extensionConfiguration)), resolveHttpAuthRuntimeConfig(extensionConfiguration));
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/CognitoIdentityProviderClient.js
var CognitoIdentityProviderClient = class extends Client {
  constructor(...[configuration]) {
    const _config_0 = getRuntimeConfig2(configuration || {});
    const _config_1 = resolveClientEndpointParameters(_config_0);
    const _config_2 = resolveUserAgentConfig(_config_1);
    const _config_3 = resolveRetryConfig(_config_2);
    const _config_4 = resolveRegionConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveEndpointConfig(_config_5);
    const _config_7 = resolveHttpAuthSchemeConfig(_config_6);
    const _config_8 = resolveRuntimeExtensions(_config_7, configuration?.extensions || []);
    super(_config_8);
    this.config = _config_8;
    this.middlewareStack.use(getUserAgentPlugin(this.config));
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
      httpAuthSchemeParametersProvider: defaultCognitoIdentityProviderHttpAuthSchemeParametersProvider,
      identityProviderConfigProvider: (config) => __async(this, null, function* () {
        return new DefaultIdentityProviderConfig({
          "aws.auth#sigv4": config.credentials
        });
      })
    }));
    this.middlewareStack.use(getHttpSigningPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/models/CognitoIdentityProviderServiceException.js
var CognitoIdentityProviderServiceException = class _CognitoIdentityProviderServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _CognitoIdentityProviderServiceException.prototype);
  }
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/models/models_0.js
var RecoveryOptionNameType = {
  ADMIN_ONLY: "admin_only",
  VERIFIED_EMAIL: "verified_email",
  VERIFIED_PHONE_NUMBER: "verified_phone_number"
};
var AccountTakeoverEventActionType = {
  BLOCK: "BLOCK",
  MFA_IF_CONFIGURED: "MFA_IF_CONFIGURED",
  MFA_REQUIRED: "MFA_REQUIRED",
  NO_ACTION: "NO_ACTION"
};
var AttributeDataType = {
  BOOLEAN: "Boolean",
  DATETIME: "DateTime",
  NUMBER: "Number",
  STRING: "String"
};
var InternalErrorException = class _InternalErrorException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InternalErrorException",
      $fault: "server"
    }, opts));
    this.name = "InternalErrorException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _InternalErrorException.prototype);
  }
};
var InvalidParameterException = class _InvalidParameterException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidParameterException",
      $fault: "client"
    }, opts));
    this.name = "InvalidParameterException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidParameterException.prototype);
  }
};
var NotAuthorizedException = class _NotAuthorizedException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "NotAuthorizedException",
      $fault: "client"
    }, opts));
    this.name = "NotAuthorizedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _NotAuthorizedException.prototype);
  }
};
var ResourceNotFoundException = class _ResourceNotFoundException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ResourceNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "ResourceNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ResourceNotFoundException.prototype);
  }
};
var TooManyRequestsException = class _TooManyRequestsException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TooManyRequestsException",
      $fault: "client"
    }, opts));
    this.name = "TooManyRequestsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TooManyRequestsException.prototype);
  }
};
var UserImportInProgressException = class _UserImportInProgressException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "UserImportInProgressException",
      $fault: "client"
    }, opts));
    this.name = "UserImportInProgressException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UserImportInProgressException.prototype);
  }
};
var UserNotFoundException = class _UserNotFoundException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "UserNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "UserNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UserNotFoundException.prototype);
  }
};
var InvalidLambdaResponseException = class _InvalidLambdaResponseException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidLambdaResponseException",
      $fault: "client"
    }, opts));
    this.name = "InvalidLambdaResponseException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidLambdaResponseException.prototype);
  }
};
var LimitExceededException = class _LimitExceededException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "LimitExceededException",
      $fault: "client"
    }, opts));
    this.name = "LimitExceededException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _LimitExceededException.prototype);
  }
};
var TooManyFailedAttemptsException = class _TooManyFailedAttemptsException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TooManyFailedAttemptsException",
      $fault: "client"
    }, opts));
    this.name = "TooManyFailedAttemptsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TooManyFailedAttemptsException.prototype);
  }
};
var UnexpectedLambdaException = class _UnexpectedLambdaException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "UnexpectedLambdaException",
      $fault: "client"
    }, opts));
    this.name = "UnexpectedLambdaException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UnexpectedLambdaException.prototype);
  }
};
var UserLambdaValidationException = class _UserLambdaValidationException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "UserLambdaValidationException",
      $fault: "client"
    }, opts));
    this.name = "UserLambdaValidationException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UserLambdaValidationException.prototype);
  }
};
var DeliveryMediumType = {
  EMAIL: "EMAIL",
  SMS: "SMS"
};
var MessageActionType = {
  RESEND: "RESEND",
  SUPPRESS: "SUPPRESS"
};
var UserStatusType = {
  ARCHIVED: "ARCHIVED",
  COMPROMISED: "COMPROMISED",
  CONFIRMED: "CONFIRMED",
  EXTERNAL_PROVIDER: "EXTERNAL_PROVIDER",
  FORCE_CHANGE_PASSWORD: "FORCE_CHANGE_PASSWORD",
  RESET_REQUIRED: "RESET_REQUIRED",
  UNCONFIRMED: "UNCONFIRMED",
  UNKNOWN: "UNKNOWN"
};
var CodeDeliveryFailureException = class _CodeDeliveryFailureException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "CodeDeliveryFailureException",
      $fault: "client"
    }, opts));
    this.name = "CodeDeliveryFailureException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _CodeDeliveryFailureException.prototype);
  }
};
var InvalidPasswordException = class _InvalidPasswordException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidPasswordException",
      $fault: "client"
    }, opts));
    this.name = "InvalidPasswordException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidPasswordException.prototype);
  }
};
var InvalidSmsRoleAccessPolicyException = class _InvalidSmsRoleAccessPolicyException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidSmsRoleAccessPolicyException",
      $fault: "client"
    }, opts));
    this.name = "InvalidSmsRoleAccessPolicyException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidSmsRoleAccessPolicyException.prototype);
  }
};
var InvalidSmsRoleTrustRelationshipException = class _InvalidSmsRoleTrustRelationshipException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidSmsRoleTrustRelationshipException",
      $fault: "client"
    }, opts));
    this.name = "InvalidSmsRoleTrustRelationshipException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidSmsRoleTrustRelationshipException.prototype);
  }
};
var PreconditionNotMetException = class _PreconditionNotMetException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "PreconditionNotMetException",
      $fault: "client"
    }, opts));
    this.name = "PreconditionNotMetException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _PreconditionNotMetException.prototype);
  }
};
var UnsupportedUserStateException = class _UnsupportedUserStateException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "UnsupportedUserStateException",
      $fault: "client"
    }, opts));
    this.name = "UnsupportedUserStateException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UnsupportedUserStateException.prototype);
  }
};
var UsernameExistsException = class _UsernameExistsException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "UsernameExistsException",
      $fault: "client"
    }, opts));
    this.name = "UsernameExistsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UsernameExistsException.prototype);
  }
};
var AliasExistsException = class _AliasExistsException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "AliasExistsException",
      $fault: "client"
    }, opts));
    this.name = "AliasExistsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _AliasExistsException.prototype);
  }
};
var InvalidUserPoolConfigurationException = class _InvalidUserPoolConfigurationException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidUserPoolConfigurationException",
      $fault: "client"
    }, opts));
    this.name = "InvalidUserPoolConfigurationException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidUserPoolConfigurationException.prototype);
  }
};
var AuthFlowType = {
  ADMIN_NO_SRP_AUTH: "ADMIN_NO_SRP_AUTH",
  ADMIN_USER_PASSWORD_AUTH: "ADMIN_USER_PASSWORD_AUTH",
  CUSTOM_AUTH: "CUSTOM_AUTH",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  REFRESH_TOKEN_AUTH: "REFRESH_TOKEN_AUTH",
  USER_PASSWORD_AUTH: "USER_PASSWORD_AUTH",
  USER_SRP_AUTH: "USER_SRP_AUTH"
};
var ChallengeNameType = {
  ADMIN_NO_SRP_AUTH: "ADMIN_NO_SRP_AUTH",
  CUSTOM_CHALLENGE: "CUSTOM_CHALLENGE",
  DEVICE_PASSWORD_VERIFIER: "DEVICE_PASSWORD_VERIFIER",
  DEVICE_SRP_AUTH: "DEVICE_SRP_AUTH",
  EMAIL_OTP: "EMAIL_OTP",
  MFA_SETUP: "MFA_SETUP",
  NEW_PASSWORD_REQUIRED: "NEW_PASSWORD_REQUIRED",
  PASSWORD_VERIFIER: "PASSWORD_VERIFIER",
  SELECT_MFA_TYPE: "SELECT_MFA_TYPE",
  SMS_MFA: "SMS_MFA",
  SOFTWARE_TOKEN_MFA: "SOFTWARE_TOKEN_MFA"
};
var InvalidEmailRoleAccessPolicyException = class _InvalidEmailRoleAccessPolicyException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidEmailRoleAccessPolicyException",
      $fault: "client"
    }, opts));
    this.name = "InvalidEmailRoleAccessPolicyException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidEmailRoleAccessPolicyException.prototype);
  }
};
var MFAMethodNotFoundException = class _MFAMethodNotFoundException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "MFAMethodNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "MFAMethodNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _MFAMethodNotFoundException.prototype);
  }
};
var PasswordResetRequiredException = class _PasswordResetRequiredException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "PasswordResetRequiredException",
      $fault: "client"
    }, opts));
    this.name = "PasswordResetRequiredException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _PasswordResetRequiredException.prototype);
  }
};
var UserNotConfirmedException = class _UserNotConfirmedException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "UserNotConfirmedException",
      $fault: "client"
    }, opts));
    this.name = "UserNotConfirmedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UserNotConfirmedException.prototype);
  }
};
var ChallengeName = {
  Mfa: "Mfa",
  Password: "Password"
};
var ChallengeResponse = {
  Failure: "Failure",
  Success: "Success"
};
var FeedbackValueType = {
  INVALID: "Invalid",
  VALID: "Valid"
};
var EventResponseType = {
  Fail: "Fail",
  InProgress: "InProgress",
  Pass: "Pass"
};
var RiskDecisionType = {
  AccountTakeover: "AccountTakeover",
  Block: "Block",
  NoRisk: "NoRisk"
};
var RiskLevelType = {
  High: "High",
  Low: "Low",
  Medium: "Medium"
};
var EventType = {
  ForgotPassword: "ForgotPassword",
  PasswordChange: "PasswordChange",
  ResendCode: "ResendCode",
  SignIn: "SignIn",
  SignUp: "SignUp"
};
var UserPoolAddOnNotEnabledException = class _UserPoolAddOnNotEnabledException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "UserPoolAddOnNotEnabledException",
      $fault: "client"
    }, opts));
    this.name = "UserPoolAddOnNotEnabledException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UserPoolAddOnNotEnabledException.prototype);
  }
};
var CodeMismatchException = class _CodeMismatchException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "CodeMismatchException",
      $fault: "client"
    }, opts));
    this.name = "CodeMismatchException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _CodeMismatchException.prototype);
  }
};
var ExpiredCodeException = class _ExpiredCodeException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ExpiredCodeException",
      $fault: "client"
    }, opts));
    this.name = "ExpiredCodeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ExpiredCodeException.prototype);
  }
};
var PasswordHistoryPolicyViolationException = class _PasswordHistoryPolicyViolationException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "PasswordHistoryPolicyViolationException",
      $fault: "client"
    }, opts));
    this.name = "PasswordHistoryPolicyViolationException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _PasswordHistoryPolicyViolationException.prototype);
  }
};
var SoftwareTokenMFANotFoundException = class _SoftwareTokenMFANotFoundException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "SoftwareTokenMFANotFoundException",
      $fault: "client"
    }, opts));
    this.name = "SoftwareTokenMFANotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _SoftwareTokenMFANotFoundException.prototype);
  }
};
var DeviceRememberedStatusType = {
  NOT_REMEMBERED: "not_remembered",
  REMEMBERED: "remembered"
};
var AdvancedSecurityEnabledModeType = {
  AUDIT: "AUDIT",
  ENFORCED: "ENFORCED"
};
var AdvancedSecurityModeType = {
  AUDIT: "AUDIT",
  ENFORCED: "ENFORCED",
  OFF: "OFF"
};
var AliasAttributeType = {
  EMAIL: "email",
  PHONE_NUMBER: "phone_number",
  PREFERRED_USERNAME: "preferred_username"
};
var ConcurrentModificationException = class _ConcurrentModificationException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ConcurrentModificationException",
      $fault: "client"
    }, opts));
    this.name = "ConcurrentModificationException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ConcurrentModificationException.prototype);
  }
};
var ForbiddenException = class _ForbiddenException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ForbiddenException",
      $fault: "client"
    }, opts));
    this.name = "ForbiddenException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ForbiddenException.prototype);
  }
};
var VerifiedAttributeType = {
  EMAIL: "email",
  PHONE_NUMBER: "phone_number"
};
var GroupExistsException = class _GroupExistsException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "GroupExistsException",
      $fault: "client"
    }, opts));
    this.name = "GroupExistsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _GroupExistsException.prototype);
  }
};
var IdentityProviderTypeType = {
  Facebook: "Facebook",
  Google: "Google",
  LoginWithAmazon: "LoginWithAmazon",
  OIDC: "OIDC",
  SAML: "SAML",
  SignInWithApple: "SignInWithApple"
};
var DuplicateProviderException = class _DuplicateProviderException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "DuplicateProviderException",
      $fault: "client"
    }, opts));
    this.name = "DuplicateProviderException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _DuplicateProviderException.prototype);
  }
};
var UserImportJobStatusType = {
  Created: "Created",
  Expired: "Expired",
  Failed: "Failed",
  InProgress: "InProgress",
  Pending: "Pending",
  Stopped: "Stopped",
  Stopping: "Stopping",
  Succeeded: "Succeeded"
};
var DeletionProtectionType = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE"
};
var EmailSendingAccountType = {
  COGNITO_DEFAULT: "COGNITO_DEFAULT",
  DEVELOPER: "DEVELOPER"
};
var CustomEmailSenderLambdaVersionType = {
  V1_0: "V1_0"
};
var CustomSMSSenderLambdaVersionType = {
  V1_0: "V1_0"
};
var PreTokenGenerationLambdaVersionType = {
  V1_0: "V1_0",
  V2_0: "V2_0"
};
var UserPoolMfaType = {
  OFF: "OFF",
  ON: "ON",
  OPTIONAL: "OPTIONAL"
};
var UsernameAttributeType = {
  EMAIL: "email",
  PHONE_NUMBER: "phone_number"
};
var DefaultEmailOptionType = {
  CONFIRM_WITH_CODE: "CONFIRM_WITH_CODE",
  CONFIRM_WITH_LINK: "CONFIRM_WITH_LINK"
};
var StatusType = {
  Disabled: "Disabled",
  Enabled: "Enabled"
};
var UserPoolTaggingException = class _UserPoolTaggingException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "UserPoolTaggingException",
      $fault: "client"
    }, opts));
    this.name = "UserPoolTaggingException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UserPoolTaggingException.prototype);
  }
};
var OAuthFlowType = {
  client_credentials: "client_credentials",
  code: "code",
  implicit: "implicit"
};
var ExplicitAuthFlowsType = {
  ADMIN_NO_SRP_AUTH: "ADMIN_NO_SRP_AUTH",
  ALLOW_ADMIN_USER_PASSWORD_AUTH: "ALLOW_ADMIN_USER_PASSWORD_AUTH",
  ALLOW_CUSTOM_AUTH: "ALLOW_CUSTOM_AUTH",
  ALLOW_REFRESH_TOKEN_AUTH: "ALLOW_REFRESH_TOKEN_AUTH",
  ALLOW_USER_PASSWORD_AUTH: "ALLOW_USER_PASSWORD_AUTH",
  ALLOW_USER_SRP_AUTH: "ALLOW_USER_SRP_AUTH",
  CUSTOM_AUTH_FLOW_ONLY: "CUSTOM_AUTH_FLOW_ONLY",
  USER_PASSWORD_AUTH: "USER_PASSWORD_AUTH"
};
var PreventUserExistenceErrorTypes = {
  ENABLED: "ENABLED",
  LEGACY: "LEGACY"
};
var TimeUnitsType = {
  DAYS: "days",
  HOURS: "hours",
  MINUTES: "minutes",
  SECONDS: "seconds"
};
var InvalidOAuthFlowException = class _InvalidOAuthFlowException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidOAuthFlowException",
      $fault: "client"
    }, opts));
    this.name = "InvalidOAuthFlowException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidOAuthFlowException.prototype);
  }
};
var ScopeDoesNotExistException = class _ScopeDoesNotExistException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ScopeDoesNotExistException",
      $fault: "client"
    }, opts));
    this.name = "ScopeDoesNotExistException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ScopeDoesNotExistException.prototype);
  }
};
var UnsupportedIdentityProviderException = class _UnsupportedIdentityProviderException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "UnsupportedIdentityProviderException",
      $fault: "client"
    }, opts));
    this.name = "UnsupportedIdentityProviderException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UnsupportedIdentityProviderException.prototype);
  }
};
var CompromisedCredentialsEventActionType = {
  BLOCK: "BLOCK",
  NO_ACTION: "NO_ACTION"
};
var EventFilterType = {
  PASSWORD_CHANGE: "PASSWORD_CHANGE",
  SIGN_IN: "SIGN_IN",
  SIGN_UP: "SIGN_UP"
};
var DomainStatusType = {
  ACTIVE: "ACTIVE",
  CREATING: "CREATING",
  DELETING: "DELETING",
  FAILED: "FAILED",
  UPDATING: "UPDATING"
};
var EventSourceName = {
  USER_AUTH_EVENTS: "userAuthEvents",
  USER_NOTIFICATION: "userNotification"
};
var LogLevel = {
  ERROR: "ERROR",
  INFO: "INFO"
};
var AdminAddUserToGroupRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AdminConfirmSignUpRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AttributeTypeFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Value && {
  Value: SENSITIVE_STRING
});
var AdminCreateUserRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
}), obj.UserAttributes && {
  UserAttributes: obj.UserAttributes.map((item) => AttributeTypeFilterSensitiveLog(item))
}), obj.ValidationData && {
  ValidationData: obj.ValidationData.map((item) => AttributeTypeFilterSensitiveLog(item))
}), obj.TemporaryPassword && {
  TemporaryPassword: SENSITIVE_STRING
});
var UserTypeFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
}), obj.Attributes && {
  Attributes: obj.Attributes.map((item) => AttributeTypeFilterSensitiveLog(item))
});
var AdminCreateUserResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.User && {
  User: UserTypeFilterSensitiveLog(obj.User)
});
var AdminDeleteUserRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AdminDeleteUserAttributesRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AdminDisableUserRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AdminEnableUserRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AdminForgetDeviceRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AdminGetDeviceRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var DeviceTypeFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.DeviceAttributes && {
  DeviceAttributes: obj.DeviceAttributes.map((item) => AttributeTypeFilterSensitiveLog(item))
});
var AdminGetDeviceResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Device && {
  Device: DeviceTypeFilterSensitiveLog(obj.Device)
});
var AdminGetUserRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AdminGetUserResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
}), obj.UserAttributes && {
  UserAttributes: obj.UserAttributes.map((item) => AttributeTypeFilterSensitiveLog(item))
});
var AdminInitiateAuthRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
}), obj.AuthParameters && {
  AuthParameters: SENSITIVE_STRING
});
var AuthenticationResultTypeFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, obj), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
}), obj.RefreshToken && {
  RefreshToken: SENSITIVE_STRING
}), obj.IdToken && {
  IdToken: SENSITIVE_STRING
});
var AdminInitiateAuthResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.Session && {
  Session: SENSITIVE_STRING
}), obj.AuthenticationResult && {
  AuthenticationResult: AuthenticationResultTypeFilterSensitiveLog(obj.AuthenticationResult)
});
var AdminListDevicesRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AdminListDevicesResponseFilterSensitiveLog = (obj) => __spreadValues({}, obj);
var AdminListGroupsForUserRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AdminListUserAuthEventsRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AdminRemoveUserFromGroupRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AdminResetUserPasswordRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AdminRespondToAuthChallengeRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
}), obj.ChallengeResponses && {
  ChallengeResponses: SENSITIVE_STRING
}), obj.Session && {
  Session: SENSITIVE_STRING
});
var AdminRespondToAuthChallengeResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.Session && {
  Session: SENSITIVE_STRING
}), obj.AuthenticationResult && {
  AuthenticationResult: AuthenticationResultTypeFilterSensitiveLog(obj.AuthenticationResult)
});
var AdminSetUserMFAPreferenceRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AdminSetUserPasswordRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
}), obj.Password && {
  Password: SENSITIVE_STRING
});
var AdminSetUserSettingsRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AdminUpdateAuthEventFeedbackRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AdminUpdateDeviceStatusRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AdminUpdateUserAttributesRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
}), obj.UserAttributes && {
  UserAttributes: obj.UserAttributes.map((item) => AttributeTypeFilterSensitiveLog(item))
});
var AdminUserGlobalSignOutRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
});
var AssociateSoftwareTokenRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
}), obj.Session && {
  Session: SENSITIVE_STRING
});
var AssociateSoftwareTokenResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.SecretCode && {
  SecretCode: SENSITIVE_STRING
}), obj.Session && {
  Session: SENSITIVE_STRING
});
var ChangePasswordRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, obj), obj.PreviousPassword && {
  PreviousPassword: SENSITIVE_STRING
}), obj.ProposedPassword && {
  ProposedPassword: SENSITIVE_STRING
}), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
});
var ConfirmDeviceRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
});
var UserContextDataTypeFilterSensitiveLog = (obj) => __spreadValues({}, obj);
var ConfirmForgotPasswordRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
}), obj.SecretHash && {
  SecretHash: SENSITIVE_STRING
}), obj.Username && {
  Username: SENSITIVE_STRING
}), obj.Password && {
  Password: SENSITIVE_STRING
}), obj.UserContextData && {
  UserContextData: SENSITIVE_STRING
});
var ConfirmSignUpRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
}), obj.SecretHash && {
  SecretHash: SENSITIVE_STRING
}), obj.Username && {
  Username: SENSITIVE_STRING
}), obj.UserContextData && {
  UserContextData: SENSITIVE_STRING
});
var UserPoolClientTypeFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
}), obj.ClientSecret && {
  ClientSecret: SENSITIVE_STRING
});
var CreateUserPoolClientResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.UserPoolClient && {
  UserPoolClient: UserPoolClientTypeFilterSensitiveLog(obj.UserPoolClient)
});
var DeleteUserRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
});
var DeleteUserAttributesRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
});
var DeleteUserPoolClientRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
});
var DescribeRiskConfigurationRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
});
var RiskConfigurationTypeFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
});
var DescribeRiskConfigurationResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.RiskConfiguration && {
  RiskConfiguration: RiskConfigurationTypeFilterSensitiveLog(obj.RiskConfiguration)
});
var DescribeUserPoolClientRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
});
var DescribeUserPoolClientResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.UserPoolClient && {
  UserPoolClient: UserPoolClientTypeFilterSensitiveLog(obj.UserPoolClient)
});
var ForgetDeviceRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
});
var ForgotPasswordRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
}), obj.SecretHash && {
  SecretHash: SENSITIVE_STRING
}), obj.UserContextData && {
  UserContextData: SENSITIVE_STRING
}), obj.Username && {
  Username: SENSITIVE_STRING
});
var GetDeviceRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
});
var GetDeviceResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Device && {
  Device: DeviceTypeFilterSensitiveLog(obj.Device)
});
var GetUICustomizationRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
});
var UICustomizationTypeFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
});
var GetUICustomizationResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.UICustomization && {
  UICustomization: UICustomizationTypeFilterSensitiveLog(obj.UICustomization)
});
var GetUserRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
});
var GetUserResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
}), obj.UserAttributes && {
  UserAttributes: obj.UserAttributes.map((item) => AttributeTypeFilterSensitiveLog(item))
});
var GetUserAttributeVerificationCodeRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
});
var GlobalSignOutRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
});
var InitiateAuthRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, obj), obj.AuthParameters && {
  AuthParameters: SENSITIVE_STRING
}), obj.ClientId && {
  ClientId: SENSITIVE_STRING
}), obj.UserContextData && {
  UserContextData: SENSITIVE_STRING
});
var InitiateAuthResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.Session && {
  Session: SENSITIVE_STRING
}), obj.AuthenticationResult && {
  AuthenticationResult: AuthenticationResultTypeFilterSensitiveLog(obj.AuthenticationResult)
});
var ListDevicesRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
});
var ListDevicesResponseFilterSensitiveLog = (obj) => __spreadValues({}, obj);
var UserPoolClientDescriptionFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
});
var ListUserPoolClientsResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.UserPoolClients && {
  UserPoolClients: obj.UserPoolClients.map((item) => UserPoolClientDescriptionFilterSensitiveLog(item))
});
var ListUsersResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Users && {
  Users: obj.Users.map((item) => UserTypeFilterSensitiveLog(item))
});
var ListUsersInGroupResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Users && {
  Users: obj.Users.map((item) => UserTypeFilterSensitiveLog(item))
});
var ResendConfirmationCodeRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
}), obj.SecretHash && {
  SecretHash: SENSITIVE_STRING
}), obj.UserContextData && {
  UserContextData: SENSITIVE_STRING
}), obj.Username && {
  Username: SENSITIVE_STRING
});
var RespondToAuthChallengeRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
}), obj.Session && {
  Session: SENSITIVE_STRING
}), obj.ChallengeResponses && {
  ChallengeResponses: SENSITIVE_STRING
}), obj.UserContextData && {
  UserContextData: SENSITIVE_STRING
});

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/models/models_1.js
var UnauthorizedException = class _UnauthorizedException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "UnauthorizedException",
      $fault: "client"
    }, opts));
    this.name = "UnauthorizedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UnauthorizedException.prototype);
  }
};
var UnsupportedOperationException = class _UnsupportedOperationException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "UnsupportedOperationException",
      $fault: "client"
    }, opts));
    this.name = "UnsupportedOperationException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UnsupportedOperationException.prototype);
  }
};
var UnsupportedTokenTypeException = class _UnsupportedTokenTypeException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "UnsupportedTokenTypeException",
      $fault: "client"
    }, opts));
    this.name = "UnsupportedTokenTypeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UnsupportedTokenTypeException.prototype);
  }
};
var EnableSoftwareTokenMFAException = class _EnableSoftwareTokenMFAException extends CognitoIdentityProviderServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EnableSoftwareTokenMFAException",
      $fault: "client"
    }, opts));
    this.name = "EnableSoftwareTokenMFAException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _EnableSoftwareTokenMFAException.prototype);
  }
};
var VerifySoftwareTokenResponseType = {
  ERROR: "ERROR",
  SUCCESS: "SUCCESS"
};
var RespondToAuthChallengeResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.Session && {
  Session: SENSITIVE_STRING
}), obj.AuthenticationResult && {
  AuthenticationResult: AuthenticationResultTypeFilterSensitiveLog(obj.AuthenticationResult)
});
var RevokeTokenRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, obj), obj.Token && {
  Token: SENSITIVE_STRING
}), obj.ClientId && {
  ClientId: SENSITIVE_STRING
}), obj.ClientSecret && {
  ClientSecret: SENSITIVE_STRING
});
var SetRiskConfigurationRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
});
var SetRiskConfigurationResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.RiskConfiguration && {
  RiskConfiguration: RiskConfigurationTypeFilterSensitiveLog(obj.RiskConfiguration)
});
var SetUICustomizationRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
});
var SetUICustomizationResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.UICustomization && {
  UICustomization: UICustomizationTypeFilterSensitiveLog(obj.UICustomization)
});
var SetUserMFAPreferenceRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
});
var SetUserSettingsRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
});
var SignUpRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
}), obj.SecretHash && {
  SecretHash: SENSITIVE_STRING
}), obj.Username && {
  Username: SENSITIVE_STRING
}), obj.Password && {
  Password: SENSITIVE_STRING
}), obj.UserAttributes && {
  UserAttributes: obj.UserAttributes.map((item) => AttributeTypeFilterSensitiveLog(item))
}), obj.ValidationData && {
  ValidationData: obj.ValidationData.map((item) => AttributeTypeFilterSensitiveLog(item))
}), obj.UserContextData && {
  UserContextData: SENSITIVE_STRING
});
var UpdateAuthEventFeedbackRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.Username && {
  Username: SENSITIVE_STRING
}), obj.FeedbackToken && {
  FeedbackToken: SENSITIVE_STRING
});
var UpdateDeviceStatusRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
});
var UpdateUserAttributesRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.UserAttributes && {
  UserAttributes: obj.UserAttributes.map((item) => AttributeTypeFilterSensitiveLog(item))
}), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
});
var UpdateUserPoolClientRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.ClientId && {
  ClientId: SENSITIVE_STRING
});
var UpdateUserPoolClientResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.UserPoolClient && {
  UserPoolClient: UserPoolClientTypeFilterSensitiveLog(obj.UserPoolClient)
});
var VerifySoftwareTokenRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, obj), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
}), obj.Session && {
  Session: SENSITIVE_STRING
}), obj.UserCode && {
  UserCode: SENSITIVE_STRING
});
var VerifySoftwareTokenResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Session && {
  Session: SENSITIVE_STRING
});
var VerifyUserAttributeRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.AccessToken && {
  AccessToken: SENSITIVE_STRING
});

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/protocols/Aws_json1_1.js
var se_AddCustomAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AddCustomAttributes");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminAddUserToGroupCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminAddUserToGroup");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminConfirmSignUpCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminConfirmSignUp");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminCreateUserCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminCreateUser");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminDeleteUserCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminDeleteUser");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminDeleteUserAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminDeleteUserAttributes");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminDisableProviderForUserCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminDisableProviderForUser");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminDisableUserCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminDisableUser");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminEnableUserCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminEnableUser");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminForgetDeviceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminForgetDevice");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminGetDeviceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminGetDevice");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminGetUserCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminGetUser");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminInitiateAuthCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminInitiateAuth");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminLinkProviderForUserCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminLinkProviderForUser");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminListDevicesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminListDevices");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminListGroupsForUserCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminListGroupsForUser");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminListUserAuthEventsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminListUserAuthEvents");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminRemoveUserFromGroupCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminRemoveUserFromGroup");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminResetUserPasswordCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminResetUserPassword");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminRespondToAuthChallengeCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminRespondToAuthChallenge");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminSetUserMFAPreferenceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminSetUserMFAPreference");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminSetUserPasswordCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminSetUserPassword");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminSetUserSettingsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminSetUserSettings");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminUpdateAuthEventFeedbackCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminUpdateAuthEventFeedback");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminUpdateDeviceStatusCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminUpdateDeviceStatus");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminUpdateUserAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminUpdateUserAttributes");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AdminUserGlobalSignOutCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AdminUserGlobalSignOut");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_AssociateSoftwareTokenCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("AssociateSoftwareToken");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ChangePasswordCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ChangePassword");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ConfirmDeviceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ConfirmDevice");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ConfirmForgotPasswordCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ConfirmForgotPassword");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ConfirmSignUpCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ConfirmSignUp");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateGroupCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("CreateGroup");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateIdentityProviderCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("CreateIdentityProvider");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateResourceServerCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("CreateResourceServer");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateUserImportJobCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("CreateUserImportJob");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateUserPoolCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("CreateUserPool");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateUserPoolClientCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("CreateUserPoolClient");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_CreateUserPoolDomainCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("CreateUserPoolDomain");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteGroupCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DeleteGroup");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteIdentityProviderCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DeleteIdentityProvider");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteResourceServerCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DeleteResourceServer");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteUserCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DeleteUser");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteUserAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DeleteUserAttributes");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteUserPoolCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DeleteUserPool");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteUserPoolClientCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DeleteUserPoolClient");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DeleteUserPoolDomainCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DeleteUserPoolDomain");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeIdentityProviderCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeIdentityProvider");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeResourceServerCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeResourceServer");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeRiskConfigurationCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeRiskConfiguration");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeUserImportJobCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeUserImportJob");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeUserPoolCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeUserPool");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeUserPoolClientCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeUserPoolClient");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_DescribeUserPoolDomainCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("DescribeUserPoolDomain");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ForgetDeviceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ForgetDevice");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ForgotPasswordCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ForgotPassword");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetCSVHeaderCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("GetCSVHeader");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetDeviceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("GetDevice");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetGroupCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("GetGroup");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetIdentityProviderByIdentifierCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("GetIdentityProviderByIdentifier");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetLogDeliveryConfigurationCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("GetLogDeliveryConfiguration");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetSigningCertificateCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("GetSigningCertificate");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetUICustomizationCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("GetUICustomization");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetUserCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("GetUser");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetUserAttributeVerificationCodeCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("GetUserAttributeVerificationCode");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GetUserPoolMfaConfigCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("GetUserPoolMfaConfig");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_GlobalSignOutCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("GlobalSignOut");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_InitiateAuthCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("InitiateAuth");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListDevicesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListDevices");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListGroupsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListGroups");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListIdentityProvidersCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListIdentityProviders");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListResourceServersCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListResourceServers");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListTagsForResourceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListTagsForResource");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListUserImportJobsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListUserImportJobs");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListUserPoolClientsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListUserPoolClients");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListUserPoolsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListUserPools");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListUsersCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListUsers");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ListUsersInGroupCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ListUsersInGroup");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_ResendConfirmationCodeCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("ResendConfirmationCode");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_RespondToAuthChallengeCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("RespondToAuthChallenge");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_RevokeTokenCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("RevokeToken");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetLogDeliveryConfigurationCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("SetLogDeliveryConfiguration");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetRiskConfigurationCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("SetRiskConfiguration");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetUICustomizationCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("SetUICustomization");
  let body;
  body = JSON.stringify(se_SetUICustomizationRequest(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetUserMFAPreferenceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("SetUserMFAPreference");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetUserPoolMfaConfigCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("SetUserPoolMfaConfig");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SetUserSettingsCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("SetUserSettings");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_SignUpCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("SignUp");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_StartUserImportJobCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("StartUserImportJob");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_StopUserImportJobCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("StopUserImportJob");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_TagResourceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("TagResource");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UntagResourceCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UntagResource");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateAuthEventFeedbackCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateAuthEventFeedback");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateDeviceStatusCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateDeviceStatus");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateGroupCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateGroup");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateIdentityProviderCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateIdentityProvider");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateResourceServerCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateResourceServer");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateUserAttributesCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateUserAttributes");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateUserPoolCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateUserPool");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateUserPoolClientCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateUserPoolClient");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_UpdateUserPoolDomainCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("UpdateUserPoolDomain");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_VerifySoftwareTokenCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("VerifySoftwareToken");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var se_VerifyUserAttributeCommand = (input, context) => __async(void 0, null, function* () {
  const headers = sharedHeaders("VerifyUserAttribute");
  let body;
  body = JSON.stringify(_json(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
});
var de_AddCustomAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminAddUserToGroupCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata2(output)
  };
  return response;
});
var de_AdminConfirmSignUpCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminCreateUserCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_AdminCreateUserResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminDeleteUserCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata2(output)
  };
  return response;
});
var de_AdminDeleteUserAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminDisableProviderForUserCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminDisableUserCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminEnableUserCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminForgetDeviceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata2(output)
  };
  return response;
});
var de_AdminGetDeviceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_AdminGetDeviceResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminGetUserCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_AdminGetUserResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminInitiateAuthCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminLinkProviderForUserCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminListDevicesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_AdminListDevicesResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminListGroupsForUserCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_AdminListGroupsForUserResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminListUserAuthEventsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_AdminListUserAuthEventsResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminRemoveUserFromGroupCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata2(output)
  };
  return response;
});
var de_AdminResetUserPasswordCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminRespondToAuthChallengeCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminSetUserMFAPreferenceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminSetUserPasswordCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminSetUserSettingsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminUpdateAuthEventFeedbackCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminUpdateDeviceStatusCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminUpdateUserAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AdminUserGlobalSignOutCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_AssociateSoftwareTokenCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_ChangePasswordCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_ConfirmDeviceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_ConfirmForgotPasswordCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_ConfirmSignUpCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_CreateGroupCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_CreateGroupResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_CreateIdentityProviderCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_CreateIdentityProviderResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_CreateResourceServerCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_CreateUserImportJobCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_CreateUserImportJobResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_CreateUserPoolCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_CreateUserPoolResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_CreateUserPoolClientCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_CreateUserPoolClientResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_CreateUserPoolDomainCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_DeleteGroupCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata2(output)
  };
  return response;
});
var de_DeleteIdentityProviderCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata2(output)
  };
  return response;
});
var de_DeleteResourceServerCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata2(output)
  };
  return response;
});
var de_DeleteUserCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata2(output)
  };
  return response;
});
var de_DeleteUserAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_DeleteUserPoolCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata2(output)
  };
  return response;
});
var de_DeleteUserPoolClientCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata2(output)
  };
  return response;
});
var de_DeleteUserPoolDomainCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_DescribeIdentityProviderCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DescribeIdentityProviderResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_DescribeResourceServerCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_DescribeRiskConfigurationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DescribeRiskConfigurationResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_DescribeUserImportJobCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DescribeUserImportJobResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_DescribeUserPoolCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DescribeUserPoolResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_DescribeUserPoolClientCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_DescribeUserPoolClientResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_DescribeUserPoolDomainCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_ForgetDeviceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  yield collectBody(output.body, context);
  const response = {
    $metadata: deserializeMetadata2(output)
  };
  return response;
});
var de_ForgotPasswordCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_GetCSVHeaderCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_GetDeviceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_GetDeviceResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_GetGroupCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_GetGroupResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_GetIdentityProviderByIdentifierCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_GetIdentityProviderByIdentifierResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_GetLogDeliveryConfigurationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_GetSigningCertificateCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_GetUICustomizationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_GetUICustomizationResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_GetUserCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_GetUserAttributeVerificationCodeCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_GetUserPoolMfaConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_GlobalSignOutCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_InitiateAuthCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_ListDevicesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_ListDevicesResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_ListGroupsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_ListGroupsResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_ListIdentityProvidersCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_ListIdentityProvidersResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_ListResourceServersCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_ListTagsForResourceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_ListUserImportJobsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_ListUserImportJobsResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_ListUserPoolClientsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_ListUserPoolsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_ListUserPoolsResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_ListUsersCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_ListUsersResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_ListUsersInGroupCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_ListUsersInGroupResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_ResendConfirmationCodeCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_RespondToAuthChallengeCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_RevokeTokenCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_SetLogDeliveryConfigurationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_SetRiskConfigurationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_SetRiskConfigurationResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_SetUICustomizationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_SetUICustomizationResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_SetUserMFAPreferenceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_SetUserPoolMfaConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_SetUserSettingsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_SignUpCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_StartUserImportJobCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_StartUserImportJobResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_StopUserImportJobCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_StopUserImportJobResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_TagResourceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_UntagResourceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_UpdateAuthEventFeedbackCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_UpdateDeviceStatusCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_UpdateGroupCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_UpdateGroupResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_UpdateIdentityProviderCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_UpdateIdentityProviderResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_UpdateResourceServerCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_UpdateUserAttributesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_UpdateUserPoolCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_UpdateUserPoolClientCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = de_UpdateUserPoolClientResponse(data, context);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_UpdateUserPoolDomainCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_VerifySoftwareTokenCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_VerifyUserAttributeCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = yield parseJsonBody(output.body, context);
  let contents = {};
  contents = _json(data);
  const response = __spreadValues({
    $metadata: deserializeMetadata2(output)
  }, contents);
  return response;
});
var de_CommandError = (output, context) => __async(void 0, null, function* () {
  const parsedOutput = __spreadProps(__spreadValues({}, output), {
    body: yield parseJsonErrorBody(output.body, context)
  });
  const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "InternalErrorException":
    case "com.amazonaws.cognitoidentityprovider#InternalErrorException":
      throw yield de_InternalErrorExceptionRes(parsedOutput, context);
    case "InvalidParameterException":
    case "com.amazonaws.cognitoidentityprovider#InvalidParameterException":
      throw yield de_InvalidParameterExceptionRes(parsedOutput, context);
    case "NotAuthorizedException":
    case "com.amazonaws.cognitoidentityprovider#NotAuthorizedException":
      throw yield de_NotAuthorizedExceptionRes(parsedOutput, context);
    case "ResourceNotFoundException":
    case "com.amazonaws.cognitoidentityprovider#ResourceNotFoundException":
      throw yield de_ResourceNotFoundExceptionRes(parsedOutput, context);
    case "TooManyRequestsException":
    case "com.amazonaws.cognitoidentityprovider#TooManyRequestsException":
      throw yield de_TooManyRequestsExceptionRes(parsedOutput, context);
    case "UserImportInProgressException":
    case "com.amazonaws.cognitoidentityprovider#UserImportInProgressException":
      throw yield de_UserImportInProgressExceptionRes(parsedOutput, context);
    case "UserNotFoundException":
    case "com.amazonaws.cognitoidentityprovider#UserNotFoundException":
      throw yield de_UserNotFoundExceptionRes(parsedOutput, context);
    case "InvalidLambdaResponseException":
    case "com.amazonaws.cognitoidentityprovider#InvalidLambdaResponseException":
      throw yield de_InvalidLambdaResponseExceptionRes(parsedOutput, context);
    case "LimitExceededException":
    case "com.amazonaws.cognitoidentityprovider#LimitExceededException":
      throw yield de_LimitExceededExceptionRes(parsedOutput, context);
    case "TooManyFailedAttemptsException":
    case "com.amazonaws.cognitoidentityprovider#TooManyFailedAttemptsException":
      throw yield de_TooManyFailedAttemptsExceptionRes(parsedOutput, context);
    case "UnexpectedLambdaException":
    case "com.amazonaws.cognitoidentityprovider#UnexpectedLambdaException":
      throw yield de_UnexpectedLambdaExceptionRes(parsedOutput, context);
    case "UserLambdaValidationException":
    case "com.amazonaws.cognitoidentityprovider#UserLambdaValidationException":
      throw yield de_UserLambdaValidationExceptionRes(parsedOutput, context);
    case "CodeDeliveryFailureException":
    case "com.amazonaws.cognitoidentityprovider#CodeDeliveryFailureException":
      throw yield de_CodeDeliveryFailureExceptionRes(parsedOutput, context);
    case "InvalidPasswordException":
    case "com.amazonaws.cognitoidentityprovider#InvalidPasswordException":
      throw yield de_InvalidPasswordExceptionRes(parsedOutput, context);
    case "InvalidSmsRoleAccessPolicyException":
    case "com.amazonaws.cognitoidentityprovider#InvalidSmsRoleAccessPolicyException":
      throw yield de_InvalidSmsRoleAccessPolicyExceptionRes(parsedOutput, context);
    case "InvalidSmsRoleTrustRelationshipException":
    case "com.amazonaws.cognitoidentityprovider#InvalidSmsRoleTrustRelationshipException":
      throw yield de_InvalidSmsRoleTrustRelationshipExceptionRes(parsedOutput, context);
    case "PreconditionNotMetException":
    case "com.amazonaws.cognitoidentityprovider#PreconditionNotMetException":
      throw yield de_PreconditionNotMetExceptionRes(parsedOutput, context);
    case "UnsupportedUserStateException":
    case "com.amazonaws.cognitoidentityprovider#UnsupportedUserStateException":
      throw yield de_UnsupportedUserStateExceptionRes(parsedOutput, context);
    case "UsernameExistsException":
    case "com.amazonaws.cognitoidentityprovider#UsernameExistsException":
      throw yield de_UsernameExistsExceptionRes(parsedOutput, context);
    case "AliasExistsException":
    case "com.amazonaws.cognitoidentityprovider#AliasExistsException":
      throw yield de_AliasExistsExceptionRes(parsedOutput, context);
    case "InvalidUserPoolConfigurationException":
    case "com.amazonaws.cognitoidentityprovider#InvalidUserPoolConfigurationException":
      throw yield de_InvalidUserPoolConfigurationExceptionRes(parsedOutput, context);
    case "InvalidEmailRoleAccessPolicyException":
    case "com.amazonaws.cognitoidentityprovider#InvalidEmailRoleAccessPolicyException":
      throw yield de_InvalidEmailRoleAccessPolicyExceptionRes(parsedOutput, context);
    case "MFAMethodNotFoundException":
    case "com.amazonaws.cognitoidentityprovider#MFAMethodNotFoundException":
      throw yield de_MFAMethodNotFoundExceptionRes(parsedOutput, context);
    case "PasswordResetRequiredException":
    case "com.amazonaws.cognitoidentityprovider#PasswordResetRequiredException":
      throw yield de_PasswordResetRequiredExceptionRes(parsedOutput, context);
    case "UserNotConfirmedException":
    case "com.amazonaws.cognitoidentityprovider#UserNotConfirmedException":
      throw yield de_UserNotConfirmedExceptionRes(parsedOutput, context);
    case "UserPoolAddOnNotEnabledException":
    case "com.amazonaws.cognitoidentityprovider#UserPoolAddOnNotEnabledException":
      throw yield de_UserPoolAddOnNotEnabledExceptionRes(parsedOutput, context);
    case "CodeMismatchException":
    case "com.amazonaws.cognitoidentityprovider#CodeMismatchException":
      throw yield de_CodeMismatchExceptionRes(parsedOutput, context);
    case "ExpiredCodeException":
    case "com.amazonaws.cognitoidentityprovider#ExpiredCodeException":
      throw yield de_ExpiredCodeExceptionRes(parsedOutput, context);
    case "PasswordHistoryPolicyViolationException":
    case "com.amazonaws.cognitoidentityprovider#PasswordHistoryPolicyViolationException":
      throw yield de_PasswordHistoryPolicyViolationExceptionRes(parsedOutput, context);
    case "SoftwareTokenMFANotFoundException":
    case "com.amazonaws.cognitoidentityprovider#SoftwareTokenMFANotFoundException":
      throw yield de_SoftwareTokenMFANotFoundExceptionRes(parsedOutput, context);
    case "ConcurrentModificationException":
    case "com.amazonaws.cognitoidentityprovider#ConcurrentModificationException":
      throw yield de_ConcurrentModificationExceptionRes(parsedOutput, context);
    case "ForbiddenException":
    case "com.amazonaws.cognitoidentityprovider#ForbiddenException":
      throw yield de_ForbiddenExceptionRes(parsedOutput, context);
    case "GroupExistsException":
    case "com.amazonaws.cognitoidentityprovider#GroupExistsException":
      throw yield de_GroupExistsExceptionRes(parsedOutput, context);
    case "DuplicateProviderException":
    case "com.amazonaws.cognitoidentityprovider#DuplicateProviderException":
      throw yield de_DuplicateProviderExceptionRes(parsedOutput, context);
    case "UserPoolTaggingException":
    case "com.amazonaws.cognitoidentityprovider#UserPoolTaggingException":
      throw yield de_UserPoolTaggingExceptionRes(parsedOutput, context);
    case "InvalidOAuthFlowException":
    case "com.amazonaws.cognitoidentityprovider#InvalidOAuthFlowException":
      throw yield de_InvalidOAuthFlowExceptionRes(parsedOutput, context);
    case "ScopeDoesNotExistException":
    case "com.amazonaws.cognitoidentityprovider#ScopeDoesNotExistException":
      throw yield de_ScopeDoesNotExistExceptionRes(parsedOutput, context);
    case "UnsupportedIdentityProviderException":
    case "com.amazonaws.cognitoidentityprovider#UnsupportedIdentityProviderException":
      throw yield de_UnsupportedIdentityProviderExceptionRes(parsedOutput, context);
    case "UnauthorizedException":
    case "com.amazonaws.cognitoidentityprovider#UnauthorizedException":
      throw yield de_UnauthorizedExceptionRes(parsedOutput, context);
    case "UnsupportedOperationException":
    case "com.amazonaws.cognitoidentityprovider#UnsupportedOperationException":
      throw yield de_UnsupportedOperationExceptionRes(parsedOutput, context);
    case "UnsupportedTokenTypeException":
    case "com.amazonaws.cognitoidentityprovider#UnsupportedTokenTypeException":
      throw yield de_UnsupportedTokenTypeExceptionRes(parsedOutput, context);
    case "EnableSoftwareTokenMFAException":
    case "com.amazonaws.cognitoidentityprovider#EnableSoftwareTokenMFAException":
      throw yield de_EnableSoftwareTokenMFAExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError2({
        output,
        parsedBody,
        errorCode
      });
  }
});
var de_AliasExistsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new AliasExistsException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_CodeDeliveryFailureExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new CodeDeliveryFailureException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_CodeMismatchExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new CodeMismatchException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ConcurrentModificationExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ConcurrentModificationException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_DuplicateProviderExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new DuplicateProviderException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_EnableSoftwareTokenMFAExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new EnableSoftwareTokenMFAException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ExpiredCodeExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ExpiredCodeException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ForbiddenExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ForbiddenException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_GroupExistsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new GroupExistsException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InternalErrorExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InternalErrorException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidEmailRoleAccessPolicyExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InvalidEmailRoleAccessPolicyException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidLambdaResponseExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InvalidLambdaResponseException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidOAuthFlowExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InvalidOAuthFlowException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidParameterExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InvalidParameterException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidPasswordExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InvalidPasswordException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidSmsRoleAccessPolicyExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InvalidSmsRoleAccessPolicyException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidSmsRoleTrustRelationshipExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InvalidSmsRoleTrustRelationshipException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_InvalidUserPoolConfigurationExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new InvalidUserPoolConfigurationException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_LimitExceededExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new LimitExceededException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_MFAMethodNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new MFAMethodNotFoundException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_NotAuthorizedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new NotAuthorizedException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_PasswordHistoryPolicyViolationExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new PasswordHistoryPolicyViolationException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_PasswordResetRequiredExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new PasswordResetRequiredException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_PreconditionNotMetExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new PreconditionNotMetException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ResourceNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ResourceNotFoundException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_ScopeDoesNotExistExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new ScopeDoesNotExistException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_SoftwareTokenMFANotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new SoftwareTokenMFANotFoundException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_TooManyFailedAttemptsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new TooManyFailedAttemptsException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_TooManyRequestsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new TooManyRequestsException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_UnauthorizedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new UnauthorizedException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_UnexpectedLambdaExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new UnexpectedLambdaException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_UnsupportedIdentityProviderExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new UnsupportedIdentityProviderException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_UnsupportedOperationExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new UnsupportedOperationException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_UnsupportedTokenTypeExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new UnsupportedTokenTypeException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_UnsupportedUserStateExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new UnsupportedUserStateException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_UserImportInProgressExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new UserImportInProgressException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_UserLambdaValidationExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new UserLambdaValidationException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_UsernameExistsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new UsernameExistsException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_UserNotConfirmedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new UserNotConfirmedException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_UserNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new UserNotFoundException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_UserPoolAddOnNotEnabledExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new UserPoolAddOnNotEnabledException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var de_UserPoolTaggingExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const body = parsedOutput.body;
  const deserialized = _json(body);
  const exception = new UserPoolTaggingException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, deserialized));
  return decorateServiceException(exception, body);
});
var se_SetUICustomizationRequest = (input, context) => {
  return take(input, {
    CSS: [],
    ClientId: [],
    ImageFile: context.base64Encoder,
    UserPoolId: []
  });
};
var de_AdminCreateUserResponse = (output, context) => {
  return take(output, {
    User: (_) => de_UserType(_, context)
  });
};
var de_AdminGetDeviceResponse = (output, context) => {
  return take(output, {
    Device: (_) => de_DeviceType(_, context)
  });
};
var de_AdminGetUserResponse = (output, context) => {
  return take(output, {
    Enabled: expectBoolean,
    MFAOptions: _json,
    PreferredMfaSetting: expectString,
    UserAttributes: _json,
    UserCreateDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    UserLastModifiedDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    UserMFASettingList: _json,
    UserStatus: expectString,
    Username: expectString
  });
};
var de_AdminListDevicesResponse = (output, context) => {
  return take(output, {
    Devices: (_) => de_DeviceListType(_, context),
    PaginationToken: expectString
  });
};
var de_AdminListGroupsForUserResponse = (output, context) => {
  return take(output, {
    Groups: (_) => de_GroupListType(_, context),
    NextToken: expectString
  });
};
var de_AdminListUserAuthEventsResponse = (output, context) => {
  return take(output, {
    AuthEvents: (_) => de_AuthEventsType(_, context),
    NextToken: expectString
  });
};
var de_AuthEventsType = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_AuthEventType(entry, context);
  });
  return retVal;
};
var de_AuthEventType = (output, context) => {
  return take(output, {
    ChallengeResponses: _json,
    CreationDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    EventContextData: _json,
    EventFeedback: (_) => de_EventFeedbackType(_, context),
    EventId: expectString,
    EventResponse: expectString,
    EventRisk: _json,
    EventType: expectString
  });
};
var de_CreateGroupResponse = (output, context) => {
  return take(output, {
    Group: (_) => de_GroupType(_, context)
  });
};
var de_CreateIdentityProviderResponse = (output, context) => {
  return take(output, {
    IdentityProvider: (_) => de_IdentityProviderType(_, context)
  });
};
var de_CreateUserImportJobResponse = (output, context) => {
  return take(output, {
    UserImportJob: (_) => de_UserImportJobType(_, context)
  });
};
var de_CreateUserPoolClientResponse = (output, context) => {
  return take(output, {
    UserPoolClient: (_) => de_UserPoolClientType(_, context)
  });
};
var de_CreateUserPoolResponse = (output, context) => {
  return take(output, {
    UserPool: (_) => de_UserPoolType(_, context)
  });
};
var de_DescribeIdentityProviderResponse = (output, context) => {
  return take(output, {
    IdentityProvider: (_) => de_IdentityProviderType(_, context)
  });
};
var de_DescribeRiskConfigurationResponse = (output, context) => {
  return take(output, {
    RiskConfiguration: (_) => de_RiskConfigurationType(_, context)
  });
};
var de_DescribeUserImportJobResponse = (output, context) => {
  return take(output, {
    UserImportJob: (_) => de_UserImportJobType(_, context)
  });
};
var de_DescribeUserPoolClientResponse = (output, context) => {
  return take(output, {
    UserPoolClient: (_) => de_UserPoolClientType(_, context)
  });
};
var de_DescribeUserPoolResponse = (output, context) => {
  return take(output, {
    UserPool: (_) => de_UserPoolType(_, context)
  });
};
var de_DeviceListType = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_DeviceType(entry, context);
  });
  return retVal;
};
var de_DeviceType = (output, context) => {
  return take(output, {
    DeviceAttributes: _json,
    DeviceCreateDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    DeviceKey: expectString,
    DeviceLastAuthenticatedDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    DeviceLastModifiedDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_)))
  });
};
var de_EventFeedbackType = (output, context) => {
  return take(output, {
    FeedbackDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    FeedbackValue: expectString,
    Provider: expectString
  });
};
var de_GetDeviceResponse = (output, context) => {
  return take(output, {
    Device: (_) => de_DeviceType(_, context)
  });
};
var de_GetGroupResponse = (output, context) => {
  return take(output, {
    Group: (_) => de_GroupType(_, context)
  });
};
var de_GetIdentityProviderByIdentifierResponse = (output, context) => {
  return take(output, {
    IdentityProvider: (_) => de_IdentityProviderType(_, context)
  });
};
var de_GetUICustomizationResponse = (output, context) => {
  return take(output, {
    UICustomization: (_) => de_UICustomizationType(_, context)
  });
};
var de_GroupListType = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_GroupType(entry, context);
  });
  return retVal;
};
var de_GroupType = (output, context) => {
  return take(output, {
    CreationDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    Description: expectString,
    GroupName: expectString,
    LastModifiedDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    Precedence: expectInt32,
    RoleArn: expectString,
    UserPoolId: expectString
  });
};
var de_IdentityProviderType = (output, context) => {
  return take(output, {
    AttributeMapping: _json,
    CreationDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    IdpIdentifiers: _json,
    LastModifiedDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    ProviderDetails: _json,
    ProviderName: expectString,
    ProviderType: expectString,
    UserPoolId: expectString
  });
};
var de_ListDevicesResponse = (output, context) => {
  return take(output, {
    Devices: (_) => de_DeviceListType(_, context),
    PaginationToken: expectString
  });
};
var de_ListGroupsResponse = (output, context) => {
  return take(output, {
    Groups: (_) => de_GroupListType(_, context),
    NextToken: expectString
  });
};
var de_ListIdentityProvidersResponse = (output, context) => {
  return take(output, {
    NextToken: expectString,
    Providers: (_) => de_ProvidersListType(_, context)
  });
};
var de_ListUserImportJobsResponse = (output, context) => {
  return take(output, {
    PaginationToken: expectString,
    UserImportJobs: (_) => de_UserImportJobsListType(_, context)
  });
};
var de_ListUserPoolsResponse = (output, context) => {
  return take(output, {
    NextToken: expectString,
    UserPools: (_) => de_UserPoolListType(_, context)
  });
};
var de_ListUsersInGroupResponse = (output, context) => {
  return take(output, {
    NextToken: expectString,
    Users: (_) => de_UsersListType(_, context)
  });
};
var de_ListUsersResponse = (output, context) => {
  return take(output, {
    PaginationToken: expectString,
    Users: (_) => de_UsersListType(_, context)
  });
};
var de_ProviderDescription = (output, context) => {
  return take(output, {
    CreationDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    LastModifiedDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    ProviderName: expectString,
    ProviderType: expectString
  });
};
var de_ProvidersListType = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_ProviderDescription(entry, context);
  });
  return retVal;
};
var de_RiskConfigurationType = (output, context) => {
  return take(output, {
    AccountTakeoverRiskConfiguration: _json,
    ClientId: expectString,
    CompromisedCredentialsRiskConfiguration: _json,
    LastModifiedDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    RiskExceptionConfiguration: _json,
    UserPoolId: expectString
  });
};
var de_SetRiskConfigurationResponse = (output, context) => {
  return take(output, {
    RiskConfiguration: (_) => de_RiskConfigurationType(_, context)
  });
};
var de_SetUICustomizationResponse = (output, context) => {
  return take(output, {
    UICustomization: (_) => de_UICustomizationType(_, context)
  });
};
var de_StartUserImportJobResponse = (output, context) => {
  return take(output, {
    UserImportJob: (_) => de_UserImportJobType(_, context)
  });
};
var de_StopUserImportJobResponse = (output, context) => {
  return take(output, {
    UserImportJob: (_) => de_UserImportJobType(_, context)
  });
};
var de_UICustomizationType = (output, context) => {
  return take(output, {
    CSS: expectString,
    CSSVersion: expectString,
    ClientId: expectString,
    CreationDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    ImageUrl: expectString,
    LastModifiedDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    UserPoolId: expectString
  });
};
var de_UpdateGroupResponse = (output, context) => {
  return take(output, {
    Group: (_) => de_GroupType(_, context)
  });
};
var de_UpdateIdentityProviderResponse = (output, context) => {
  return take(output, {
    IdentityProvider: (_) => de_IdentityProviderType(_, context)
  });
};
var de_UpdateUserPoolClientResponse = (output, context) => {
  return take(output, {
    UserPoolClient: (_) => de_UserPoolClientType(_, context)
  });
};
var de_UserImportJobsListType = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_UserImportJobType(entry, context);
  });
  return retVal;
};
var de_UserImportJobType = (output, context) => {
  return take(output, {
    CloudWatchLogsRoleArn: expectString,
    CompletionDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    CompletionMessage: expectString,
    CreationDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    FailedUsers: expectLong,
    ImportedUsers: expectLong,
    JobId: expectString,
    JobName: expectString,
    PreSignedUrl: expectString,
    SkippedUsers: expectLong,
    StartDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    Status: expectString,
    UserPoolId: expectString
  });
};
var de_UserPoolClientType = (output, context) => {
  return take(output, {
    AccessTokenValidity: expectInt32,
    AllowedOAuthFlows: _json,
    AllowedOAuthFlowsUserPoolClient: expectBoolean,
    AllowedOAuthScopes: _json,
    AnalyticsConfiguration: _json,
    AuthSessionValidity: expectInt32,
    CallbackURLs: _json,
    ClientId: expectString,
    ClientName: expectString,
    ClientSecret: expectString,
    CreationDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    DefaultRedirectURI: expectString,
    EnablePropagateAdditionalUserContextData: expectBoolean,
    EnableTokenRevocation: expectBoolean,
    ExplicitAuthFlows: _json,
    IdTokenValidity: expectInt32,
    LastModifiedDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    LogoutURLs: _json,
    PreventUserExistenceErrors: expectString,
    ReadAttributes: _json,
    RefreshTokenValidity: expectInt32,
    SupportedIdentityProviders: _json,
    TokenValidityUnits: _json,
    UserPoolId: expectString,
    WriteAttributes: _json
  });
};
var de_UserPoolDescriptionType = (output, context) => {
  return take(output, {
    CreationDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    Id: expectString,
    LambdaConfig: _json,
    LastModifiedDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    Name: expectString,
    Status: expectString
  });
};
var de_UserPoolListType = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_UserPoolDescriptionType(entry, context);
  });
  return retVal;
};
var de_UserPoolType = (output, context) => {
  return take(output, {
    AccountRecoverySetting: _json,
    AdminCreateUserConfig: _json,
    AliasAttributes: _json,
    Arn: expectString,
    AutoVerifiedAttributes: _json,
    CreationDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    CustomDomain: expectString,
    DeletionProtection: expectString,
    DeviceConfiguration: _json,
    Domain: expectString,
    EmailConfiguration: _json,
    EmailConfigurationFailure: expectString,
    EmailVerificationMessage: expectString,
    EmailVerificationSubject: expectString,
    EstimatedNumberOfUsers: expectInt32,
    Id: expectString,
    LambdaConfig: _json,
    LastModifiedDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    MfaConfiguration: expectString,
    Name: expectString,
    Policies: _json,
    SchemaAttributes: _json,
    SmsAuthenticationMessage: expectString,
    SmsConfiguration: _json,
    SmsConfigurationFailure: expectString,
    SmsVerificationMessage: expectString,
    Status: expectString,
    UserAttributeUpdateSettings: _json,
    UserPoolAddOns: _json,
    UserPoolTags: _json,
    UsernameAttributes: _json,
    UsernameConfiguration: _json,
    VerificationMessageTemplate: _json
  });
};
var de_UsersListType = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_UserType(entry, context);
  });
  return retVal;
};
var de_UserType = (output, context) => {
  return take(output, {
    Attributes: _json,
    Enabled: expectBoolean,
    MFAOptions: _json,
    UserCreateDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    UserLastModifiedDate: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    UserStatus: expectString,
    Username: expectString
  });
};
var deserializeMetadata2 = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});
var throwDefaultError2 = withBaseException(CognitoIdentityProviderServiceException);
var buildHttpRpcRequest = (context, headers, path, resolvedHostname, body) => __async(void 0, null, function* () {
  const {
    hostname,
    protocol = "https",
    port,
    path: basePath
  } = yield context.endpoint();
  const contents = {
    protocol,
    hostname,
    port,
    method: "POST",
    path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
    headers
  };
  if (resolvedHostname !== void 0) {
    contents.hostname = resolvedHostname;
  }
  if (body !== void 0) {
    contents.body = body;
  }
  return new HttpRequest(contents);
});
function sharedHeaders(operation) {
  return {
    "content-type": "application/x-amz-json-1.1",
    "x-amz-target": `AWSCognitoIdentityProviderService.${operation}`
  };
}

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AddCustomAttributesCommand.js
var AddCustomAttributesCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AddCustomAttributes", {}).n("CognitoIdentityProviderClient", "AddCustomAttributesCommand").f(void 0, void 0).ser(se_AddCustomAttributesCommand).de(de_AddCustomAttributesCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminAddUserToGroupCommand.js
var AdminAddUserToGroupCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminAddUserToGroup", {}).n("CognitoIdentityProviderClient", "AdminAddUserToGroupCommand").f(AdminAddUserToGroupRequestFilterSensitiveLog, void 0).ser(se_AdminAddUserToGroupCommand).de(de_AdminAddUserToGroupCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminConfirmSignUpCommand.js
var AdminConfirmSignUpCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminConfirmSignUp", {}).n("CognitoIdentityProviderClient", "AdminConfirmSignUpCommand").f(AdminConfirmSignUpRequestFilterSensitiveLog, void 0).ser(se_AdminConfirmSignUpCommand).de(de_AdminConfirmSignUpCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminCreateUserCommand.js
var AdminCreateUserCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminCreateUser", {}).n("CognitoIdentityProviderClient", "AdminCreateUserCommand").f(AdminCreateUserRequestFilterSensitiveLog, AdminCreateUserResponseFilterSensitiveLog).ser(se_AdminCreateUserCommand).de(de_AdminCreateUserCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminDeleteUserAttributesCommand.js
var AdminDeleteUserAttributesCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminDeleteUserAttributes", {}).n("CognitoIdentityProviderClient", "AdminDeleteUserAttributesCommand").f(AdminDeleteUserAttributesRequestFilterSensitiveLog, void 0).ser(se_AdminDeleteUserAttributesCommand).de(de_AdminDeleteUserAttributesCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminDeleteUserCommand.js
var AdminDeleteUserCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminDeleteUser", {}).n("CognitoIdentityProviderClient", "AdminDeleteUserCommand").f(AdminDeleteUserRequestFilterSensitiveLog, void 0).ser(se_AdminDeleteUserCommand).de(de_AdminDeleteUserCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminDisableProviderForUserCommand.js
var AdminDisableProviderForUserCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminDisableProviderForUser", {}).n("CognitoIdentityProviderClient", "AdminDisableProviderForUserCommand").f(void 0, void 0).ser(se_AdminDisableProviderForUserCommand).de(de_AdminDisableProviderForUserCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminDisableUserCommand.js
var AdminDisableUserCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminDisableUser", {}).n("CognitoIdentityProviderClient", "AdminDisableUserCommand").f(AdminDisableUserRequestFilterSensitiveLog, void 0).ser(se_AdminDisableUserCommand).de(de_AdminDisableUserCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminEnableUserCommand.js
var AdminEnableUserCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminEnableUser", {}).n("CognitoIdentityProviderClient", "AdminEnableUserCommand").f(AdminEnableUserRequestFilterSensitiveLog, void 0).ser(se_AdminEnableUserCommand).de(de_AdminEnableUserCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminForgetDeviceCommand.js
var AdminForgetDeviceCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminForgetDevice", {}).n("CognitoIdentityProviderClient", "AdminForgetDeviceCommand").f(AdminForgetDeviceRequestFilterSensitiveLog, void 0).ser(se_AdminForgetDeviceCommand).de(de_AdminForgetDeviceCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminGetDeviceCommand.js
var AdminGetDeviceCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminGetDevice", {}).n("CognitoIdentityProviderClient", "AdminGetDeviceCommand").f(AdminGetDeviceRequestFilterSensitiveLog, AdminGetDeviceResponseFilterSensitiveLog).ser(se_AdminGetDeviceCommand).de(de_AdminGetDeviceCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminGetUserCommand.js
var AdminGetUserCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminGetUser", {}).n("CognitoIdentityProviderClient", "AdminGetUserCommand").f(AdminGetUserRequestFilterSensitiveLog, AdminGetUserResponseFilterSensitiveLog).ser(se_AdminGetUserCommand).de(de_AdminGetUserCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminInitiateAuthCommand.js
var AdminInitiateAuthCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminInitiateAuth", {}).n("CognitoIdentityProviderClient", "AdminInitiateAuthCommand").f(AdminInitiateAuthRequestFilterSensitiveLog, AdminInitiateAuthResponseFilterSensitiveLog).ser(se_AdminInitiateAuthCommand).de(de_AdminInitiateAuthCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminLinkProviderForUserCommand.js
var AdminLinkProviderForUserCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminLinkProviderForUser", {}).n("CognitoIdentityProviderClient", "AdminLinkProviderForUserCommand").f(void 0, void 0).ser(se_AdminLinkProviderForUserCommand).de(de_AdminLinkProviderForUserCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminListDevicesCommand.js
var AdminListDevicesCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminListDevices", {}).n("CognitoIdentityProviderClient", "AdminListDevicesCommand").f(AdminListDevicesRequestFilterSensitiveLog, AdminListDevicesResponseFilterSensitiveLog).ser(se_AdminListDevicesCommand).de(de_AdminListDevicesCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminListGroupsForUserCommand.js
var AdminListGroupsForUserCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminListGroupsForUser", {}).n("CognitoIdentityProviderClient", "AdminListGroupsForUserCommand").f(AdminListGroupsForUserRequestFilterSensitiveLog, void 0).ser(se_AdminListGroupsForUserCommand).de(de_AdminListGroupsForUserCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminListUserAuthEventsCommand.js
var AdminListUserAuthEventsCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminListUserAuthEvents", {}).n("CognitoIdentityProviderClient", "AdminListUserAuthEventsCommand").f(AdminListUserAuthEventsRequestFilterSensitiveLog, void 0).ser(se_AdminListUserAuthEventsCommand).de(de_AdminListUserAuthEventsCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminRemoveUserFromGroupCommand.js
var AdminRemoveUserFromGroupCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminRemoveUserFromGroup", {}).n("CognitoIdentityProviderClient", "AdminRemoveUserFromGroupCommand").f(AdminRemoveUserFromGroupRequestFilterSensitiveLog, void 0).ser(se_AdminRemoveUserFromGroupCommand).de(de_AdminRemoveUserFromGroupCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminResetUserPasswordCommand.js
var AdminResetUserPasswordCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminResetUserPassword", {}).n("CognitoIdentityProviderClient", "AdminResetUserPasswordCommand").f(AdminResetUserPasswordRequestFilterSensitiveLog, void 0).ser(se_AdminResetUserPasswordCommand).de(de_AdminResetUserPasswordCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminRespondToAuthChallengeCommand.js
var AdminRespondToAuthChallengeCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminRespondToAuthChallenge", {}).n("CognitoIdentityProviderClient", "AdminRespondToAuthChallengeCommand").f(AdminRespondToAuthChallengeRequestFilterSensitiveLog, AdminRespondToAuthChallengeResponseFilterSensitiveLog).ser(se_AdminRespondToAuthChallengeCommand).de(de_AdminRespondToAuthChallengeCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminSetUserMFAPreferenceCommand.js
var AdminSetUserMFAPreferenceCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminSetUserMFAPreference", {}).n("CognitoIdentityProviderClient", "AdminSetUserMFAPreferenceCommand").f(AdminSetUserMFAPreferenceRequestFilterSensitiveLog, void 0).ser(se_AdminSetUserMFAPreferenceCommand).de(de_AdminSetUserMFAPreferenceCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminSetUserPasswordCommand.js
var AdminSetUserPasswordCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminSetUserPassword", {}).n("CognitoIdentityProviderClient", "AdminSetUserPasswordCommand").f(AdminSetUserPasswordRequestFilterSensitiveLog, void 0).ser(se_AdminSetUserPasswordCommand).de(de_AdminSetUserPasswordCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminSetUserSettingsCommand.js
var AdminSetUserSettingsCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminSetUserSettings", {}).n("CognitoIdentityProviderClient", "AdminSetUserSettingsCommand").f(AdminSetUserSettingsRequestFilterSensitiveLog, void 0).ser(se_AdminSetUserSettingsCommand).de(de_AdminSetUserSettingsCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminUpdateAuthEventFeedbackCommand.js
var AdminUpdateAuthEventFeedbackCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminUpdateAuthEventFeedback", {}).n("CognitoIdentityProviderClient", "AdminUpdateAuthEventFeedbackCommand").f(AdminUpdateAuthEventFeedbackRequestFilterSensitiveLog, void 0).ser(se_AdminUpdateAuthEventFeedbackCommand).de(de_AdminUpdateAuthEventFeedbackCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminUpdateDeviceStatusCommand.js
var AdminUpdateDeviceStatusCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminUpdateDeviceStatus", {}).n("CognitoIdentityProviderClient", "AdminUpdateDeviceStatusCommand").f(AdminUpdateDeviceStatusRequestFilterSensitiveLog, void 0).ser(se_AdminUpdateDeviceStatusCommand).de(de_AdminUpdateDeviceStatusCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminUpdateUserAttributesCommand.js
var AdminUpdateUserAttributesCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminUpdateUserAttributes", {}).n("CognitoIdentityProviderClient", "AdminUpdateUserAttributesCommand").f(AdminUpdateUserAttributesRequestFilterSensitiveLog, void 0).ser(se_AdminUpdateUserAttributesCommand).de(de_AdminUpdateUserAttributesCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AdminUserGlobalSignOutCommand.js
var AdminUserGlobalSignOutCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AdminUserGlobalSignOut", {}).n("CognitoIdentityProviderClient", "AdminUserGlobalSignOutCommand").f(AdminUserGlobalSignOutRequestFilterSensitiveLog, void 0).ser(se_AdminUserGlobalSignOutCommand).de(de_AdminUserGlobalSignOutCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/AssociateSoftwareTokenCommand.js
var AssociateSoftwareTokenCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "AssociateSoftwareToken", {}).n("CognitoIdentityProviderClient", "AssociateSoftwareTokenCommand").f(AssociateSoftwareTokenRequestFilterSensitiveLog, AssociateSoftwareTokenResponseFilterSensitiveLog).ser(se_AssociateSoftwareTokenCommand).de(de_AssociateSoftwareTokenCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ChangePasswordCommand.js
var ChangePasswordCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ChangePassword", {}).n("CognitoIdentityProviderClient", "ChangePasswordCommand").f(ChangePasswordRequestFilterSensitiveLog, void 0).ser(se_ChangePasswordCommand).de(de_ChangePasswordCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ConfirmDeviceCommand.js
var ConfirmDeviceCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ConfirmDevice", {}).n("CognitoIdentityProviderClient", "ConfirmDeviceCommand").f(ConfirmDeviceRequestFilterSensitiveLog, void 0).ser(se_ConfirmDeviceCommand).de(de_ConfirmDeviceCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ConfirmForgotPasswordCommand.js
var ConfirmForgotPasswordCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ConfirmForgotPassword", {}).n("CognitoIdentityProviderClient", "ConfirmForgotPasswordCommand").f(ConfirmForgotPasswordRequestFilterSensitiveLog, void 0).ser(se_ConfirmForgotPasswordCommand).de(de_ConfirmForgotPasswordCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ConfirmSignUpCommand.js
var ConfirmSignUpCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ConfirmSignUp", {}).n("CognitoIdentityProviderClient", "ConfirmSignUpCommand").f(ConfirmSignUpRequestFilterSensitiveLog, void 0).ser(se_ConfirmSignUpCommand).de(de_ConfirmSignUpCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/CreateGroupCommand.js
var CreateGroupCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "CreateGroup", {}).n("CognitoIdentityProviderClient", "CreateGroupCommand").f(void 0, void 0).ser(se_CreateGroupCommand).de(de_CreateGroupCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/CreateIdentityProviderCommand.js
var CreateIdentityProviderCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "CreateIdentityProvider", {}).n("CognitoIdentityProviderClient", "CreateIdentityProviderCommand").f(void 0, void 0).ser(se_CreateIdentityProviderCommand).de(de_CreateIdentityProviderCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/CreateResourceServerCommand.js
var CreateResourceServerCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "CreateResourceServer", {}).n("CognitoIdentityProviderClient", "CreateResourceServerCommand").f(void 0, void 0).ser(se_CreateResourceServerCommand).de(de_CreateResourceServerCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/CreateUserImportJobCommand.js
var CreateUserImportJobCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "CreateUserImportJob", {}).n("CognitoIdentityProviderClient", "CreateUserImportJobCommand").f(void 0, void 0).ser(se_CreateUserImportJobCommand).de(de_CreateUserImportJobCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/CreateUserPoolClientCommand.js
var CreateUserPoolClientCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "CreateUserPoolClient", {}).n("CognitoIdentityProviderClient", "CreateUserPoolClientCommand").f(void 0, CreateUserPoolClientResponseFilterSensitiveLog).ser(se_CreateUserPoolClientCommand).de(de_CreateUserPoolClientCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/CreateUserPoolCommand.js
var CreateUserPoolCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "CreateUserPool", {}).n("CognitoIdentityProviderClient", "CreateUserPoolCommand").f(void 0, void 0).ser(se_CreateUserPoolCommand).de(de_CreateUserPoolCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/CreateUserPoolDomainCommand.js
var CreateUserPoolDomainCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "CreateUserPoolDomain", {}).n("CognitoIdentityProviderClient", "CreateUserPoolDomainCommand").f(void 0, void 0).ser(se_CreateUserPoolDomainCommand).de(de_CreateUserPoolDomainCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/DeleteGroupCommand.js
var DeleteGroupCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "DeleteGroup", {}).n("CognitoIdentityProviderClient", "DeleteGroupCommand").f(void 0, void 0).ser(se_DeleteGroupCommand).de(de_DeleteGroupCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/DeleteIdentityProviderCommand.js
var DeleteIdentityProviderCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "DeleteIdentityProvider", {}).n("CognitoIdentityProviderClient", "DeleteIdentityProviderCommand").f(void 0, void 0).ser(se_DeleteIdentityProviderCommand).de(de_DeleteIdentityProviderCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/DeleteResourceServerCommand.js
var DeleteResourceServerCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "DeleteResourceServer", {}).n("CognitoIdentityProviderClient", "DeleteResourceServerCommand").f(void 0, void 0).ser(se_DeleteResourceServerCommand).de(de_DeleteResourceServerCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/DeleteUserAttributesCommand.js
var DeleteUserAttributesCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "DeleteUserAttributes", {}).n("CognitoIdentityProviderClient", "DeleteUserAttributesCommand").f(DeleteUserAttributesRequestFilterSensitiveLog, void 0).ser(se_DeleteUserAttributesCommand).de(de_DeleteUserAttributesCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/DeleteUserCommand.js
var DeleteUserCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "DeleteUser", {}).n("CognitoIdentityProviderClient", "DeleteUserCommand").f(DeleteUserRequestFilterSensitiveLog, void 0).ser(se_DeleteUserCommand).de(de_DeleteUserCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/DeleteUserPoolClientCommand.js
var DeleteUserPoolClientCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "DeleteUserPoolClient", {}).n("CognitoIdentityProviderClient", "DeleteUserPoolClientCommand").f(DeleteUserPoolClientRequestFilterSensitiveLog, void 0).ser(se_DeleteUserPoolClientCommand).de(de_DeleteUserPoolClientCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/DeleteUserPoolCommand.js
var DeleteUserPoolCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "DeleteUserPool", {}).n("CognitoIdentityProviderClient", "DeleteUserPoolCommand").f(void 0, void 0).ser(se_DeleteUserPoolCommand).de(de_DeleteUserPoolCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/DeleteUserPoolDomainCommand.js
var DeleteUserPoolDomainCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "DeleteUserPoolDomain", {}).n("CognitoIdentityProviderClient", "DeleteUserPoolDomainCommand").f(void 0, void 0).ser(se_DeleteUserPoolDomainCommand).de(de_DeleteUserPoolDomainCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/DescribeIdentityProviderCommand.js
var DescribeIdentityProviderCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "DescribeIdentityProvider", {}).n("CognitoIdentityProviderClient", "DescribeIdentityProviderCommand").f(void 0, void 0).ser(se_DescribeIdentityProviderCommand).de(de_DescribeIdentityProviderCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/DescribeResourceServerCommand.js
var DescribeResourceServerCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "DescribeResourceServer", {}).n("CognitoIdentityProviderClient", "DescribeResourceServerCommand").f(void 0, void 0).ser(se_DescribeResourceServerCommand).de(de_DescribeResourceServerCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/DescribeRiskConfigurationCommand.js
var DescribeRiskConfigurationCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "DescribeRiskConfiguration", {}).n("CognitoIdentityProviderClient", "DescribeRiskConfigurationCommand").f(DescribeRiskConfigurationRequestFilterSensitiveLog, DescribeRiskConfigurationResponseFilterSensitiveLog).ser(se_DescribeRiskConfigurationCommand).de(de_DescribeRiskConfigurationCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/DescribeUserImportJobCommand.js
var DescribeUserImportJobCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "DescribeUserImportJob", {}).n("CognitoIdentityProviderClient", "DescribeUserImportJobCommand").f(void 0, void 0).ser(se_DescribeUserImportJobCommand).de(de_DescribeUserImportJobCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/DescribeUserPoolClientCommand.js
var DescribeUserPoolClientCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "DescribeUserPoolClient", {}).n("CognitoIdentityProviderClient", "DescribeUserPoolClientCommand").f(DescribeUserPoolClientRequestFilterSensitiveLog, DescribeUserPoolClientResponseFilterSensitiveLog).ser(se_DescribeUserPoolClientCommand).de(de_DescribeUserPoolClientCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/DescribeUserPoolCommand.js
var DescribeUserPoolCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "DescribeUserPool", {}).n("CognitoIdentityProviderClient", "DescribeUserPoolCommand").f(void 0, void 0).ser(se_DescribeUserPoolCommand).de(de_DescribeUserPoolCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/DescribeUserPoolDomainCommand.js
var DescribeUserPoolDomainCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "DescribeUserPoolDomain", {}).n("CognitoIdentityProviderClient", "DescribeUserPoolDomainCommand").f(void 0, void 0).ser(se_DescribeUserPoolDomainCommand).de(de_DescribeUserPoolDomainCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ForgetDeviceCommand.js
var ForgetDeviceCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ForgetDevice", {}).n("CognitoIdentityProviderClient", "ForgetDeviceCommand").f(ForgetDeviceRequestFilterSensitiveLog, void 0).ser(se_ForgetDeviceCommand).de(de_ForgetDeviceCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ForgotPasswordCommand.js
var ForgotPasswordCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ForgotPassword", {}).n("CognitoIdentityProviderClient", "ForgotPasswordCommand").f(ForgotPasswordRequestFilterSensitiveLog, void 0).ser(se_ForgotPasswordCommand).de(de_ForgotPasswordCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/GetCSVHeaderCommand.js
var GetCSVHeaderCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "GetCSVHeader", {}).n("CognitoIdentityProviderClient", "GetCSVHeaderCommand").f(void 0, void 0).ser(se_GetCSVHeaderCommand).de(de_GetCSVHeaderCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/GetDeviceCommand.js
var GetDeviceCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "GetDevice", {}).n("CognitoIdentityProviderClient", "GetDeviceCommand").f(GetDeviceRequestFilterSensitiveLog, GetDeviceResponseFilterSensitiveLog).ser(se_GetDeviceCommand).de(de_GetDeviceCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/GetGroupCommand.js
var GetGroupCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "GetGroup", {}).n("CognitoIdentityProviderClient", "GetGroupCommand").f(void 0, void 0).ser(se_GetGroupCommand).de(de_GetGroupCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/GetIdentityProviderByIdentifierCommand.js
var GetIdentityProviderByIdentifierCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "GetIdentityProviderByIdentifier", {}).n("CognitoIdentityProviderClient", "GetIdentityProviderByIdentifierCommand").f(void 0, void 0).ser(se_GetIdentityProviderByIdentifierCommand).de(de_GetIdentityProviderByIdentifierCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/GetLogDeliveryConfigurationCommand.js
var GetLogDeliveryConfigurationCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "GetLogDeliveryConfiguration", {}).n("CognitoIdentityProviderClient", "GetLogDeliveryConfigurationCommand").f(void 0, void 0).ser(se_GetLogDeliveryConfigurationCommand).de(de_GetLogDeliveryConfigurationCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/GetSigningCertificateCommand.js
var GetSigningCertificateCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "GetSigningCertificate", {}).n("CognitoIdentityProviderClient", "GetSigningCertificateCommand").f(void 0, void 0).ser(se_GetSigningCertificateCommand).de(de_GetSigningCertificateCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/GetUICustomizationCommand.js
var GetUICustomizationCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "GetUICustomization", {}).n("CognitoIdentityProviderClient", "GetUICustomizationCommand").f(GetUICustomizationRequestFilterSensitiveLog, GetUICustomizationResponseFilterSensitiveLog).ser(se_GetUICustomizationCommand).de(de_GetUICustomizationCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/GetUserAttributeVerificationCodeCommand.js
var GetUserAttributeVerificationCodeCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "GetUserAttributeVerificationCode", {}).n("CognitoIdentityProviderClient", "GetUserAttributeVerificationCodeCommand").f(GetUserAttributeVerificationCodeRequestFilterSensitiveLog, void 0).ser(se_GetUserAttributeVerificationCodeCommand).de(de_GetUserAttributeVerificationCodeCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/GetUserCommand.js
var GetUserCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "GetUser", {}).n("CognitoIdentityProviderClient", "GetUserCommand").f(GetUserRequestFilterSensitiveLog, GetUserResponseFilterSensitiveLog).ser(se_GetUserCommand).de(de_GetUserCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/GetUserPoolMfaConfigCommand.js
var GetUserPoolMfaConfigCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "GetUserPoolMfaConfig", {}).n("CognitoIdentityProviderClient", "GetUserPoolMfaConfigCommand").f(void 0, void 0).ser(se_GetUserPoolMfaConfigCommand).de(de_GetUserPoolMfaConfigCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/GlobalSignOutCommand.js
var GlobalSignOutCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "GlobalSignOut", {}).n("CognitoIdentityProviderClient", "GlobalSignOutCommand").f(GlobalSignOutRequestFilterSensitiveLog, void 0).ser(se_GlobalSignOutCommand).de(de_GlobalSignOutCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/InitiateAuthCommand.js
var InitiateAuthCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "InitiateAuth", {}).n("CognitoIdentityProviderClient", "InitiateAuthCommand").f(InitiateAuthRequestFilterSensitiveLog, InitiateAuthResponseFilterSensitiveLog).ser(se_InitiateAuthCommand).de(de_InitiateAuthCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ListDevicesCommand.js
var ListDevicesCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ListDevices", {}).n("CognitoIdentityProviderClient", "ListDevicesCommand").f(ListDevicesRequestFilterSensitiveLog, ListDevicesResponseFilterSensitiveLog).ser(se_ListDevicesCommand).de(de_ListDevicesCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ListGroupsCommand.js
var ListGroupsCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ListGroups", {}).n("CognitoIdentityProviderClient", "ListGroupsCommand").f(void 0, void 0).ser(se_ListGroupsCommand).de(de_ListGroupsCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ListIdentityProvidersCommand.js
var ListIdentityProvidersCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ListIdentityProviders", {}).n("CognitoIdentityProviderClient", "ListIdentityProvidersCommand").f(void 0, void 0).ser(se_ListIdentityProvidersCommand).de(de_ListIdentityProvidersCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ListResourceServersCommand.js
var ListResourceServersCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ListResourceServers", {}).n("CognitoIdentityProviderClient", "ListResourceServersCommand").f(void 0, void 0).ser(se_ListResourceServersCommand).de(de_ListResourceServersCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ListTagsForResourceCommand.js
var ListTagsForResourceCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ListTagsForResource", {}).n("CognitoIdentityProviderClient", "ListTagsForResourceCommand").f(void 0, void 0).ser(se_ListTagsForResourceCommand).de(de_ListTagsForResourceCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ListUserImportJobsCommand.js
var ListUserImportJobsCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ListUserImportJobs", {}).n("CognitoIdentityProviderClient", "ListUserImportJobsCommand").f(void 0, void 0).ser(se_ListUserImportJobsCommand).de(de_ListUserImportJobsCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ListUserPoolClientsCommand.js
var ListUserPoolClientsCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ListUserPoolClients", {}).n("CognitoIdentityProviderClient", "ListUserPoolClientsCommand").f(void 0, ListUserPoolClientsResponseFilterSensitiveLog).ser(se_ListUserPoolClientsCommand).de(de_ListUserPoolClientsCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ListUserPoolsCommand.js
var ListUserPoolsCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ListUserPools", {}).n("CognitoIdentityProviderClient", "ListUserPoolsCommand").f(void 0, void 0).ser(se_ListUserPoolsCommand).de(de_ListUserPoolsCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ListUsersCommand.js
var ListUsersCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ListUsers", {}).n("CognitoIdentityProviderClient", "ListUsersCommand").f(void 0, ListUsersResponseFilterSensitiveLog).ser(se_ListUsersCommand).de(de_ListUsersCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ListUsersInGroupCommand.js
var ListUsersInGroupCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ListUsersInGroup", {}).n("CognitoIdentityProviderClient", "ListUsersInGroupCommand").f(void 0, ListUsersInGroupResponseFilterSensitiveLog).ser(se_ListUsersInGroupCommand).de(de_ListUsersInGroupCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/ResendConfirmationCodeCommand.js
var ResendConfirmationCodeCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "ResendConfirmationCode", {}).n("CognitoIdentityProviderClient", "ResendConfirmationCodeCommand").f(ResendConfirmationCodeRequestFilterSensitiveLog, void 0).ser(se_ResendConfirmationCodeCommand).de(de_ResendConfirmationCodeCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/RespondToAuthChallengeCommand.js
var RespondToAuthChallengeCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "RespondToAuthChallenge", {}).n("CognitoIdentityProviderClient", "RespondToAuthChallengeCommand").f(RespondToAuthChallengeRequestFilterSensitiveLog, RespondToAuthChallengeResponseFilterSensitiveLog).ser(se_RespondToAuthChallengeCommand).de(de_RespondToAuthChallengeCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/RevokeTokenCommand.js
var RevokeTokenCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "RevokeToken", {}).n("CognitoIdentityProviderClient", "RevokeTokenCommand").f(RevokeTokenRequestFilterSensitiveLog, void 0).ser(se_RevokeTokenCommand).de(de_RevokeTokenCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/SetLogDeliveryConfigurationCommand.js
var SetLogDeliveryConfigurationCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "SetLogDeliveryConfiguration", {}).n("CognitoIdentityProviderClient", "SetLogDeliveryConfigurationCommand").f(void 0, void 0).ser(se_SetLogDeliveryConfigurationCommand).de(de_SetLogDeliveryConfigurationCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/SetRiskConfigurationCommand.js
var SetRiskConfigurationCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "SetRiskConfiguration", {}).n("CognitoIdentityProviderClient", "SetRiskConfigurationCommand").f(SetRiskConfigurationRequestFilterSensitiveLog, SetRiskConfigurationResponseFilterSensitiveLog).ser(se_SetRiskConfigurationCommand).de(de_SetRiskConfigurationCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/SetUICustomizationCommand.js
var SetUICustomizationCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "SetUICustomization", {}).n("CognitoIdentityProviderClient", "SetUICustomizationCommand").f(SetUICustomizationRequestFilterSensitiveLog, SetUICustomizationResponseFilterSensitiveLog).ser(se_SetUICustomizationCommand).de(de_SetUICustomizationCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/SetUserMFAPreferenceCommand.js
var SetUserMFAPreferenceCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "SetUserMFAPreference", {}).n("CognitoIdentityProviderClient", "SetUserMFAPreferenceCommand").f(SetUserMFAPreferenceRequestFilterSensitiveLog, void 0).ser(se_SetUserMFAPreferenceCommand).de(de_SetUserMFAPreferenceCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/SetUserPoolMfaConfigCommand.js
var SetUserPoolMfaConfigCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "SetUserPoolMfaConfig", {}).n("CognitoIdentityProviderClient", "SetUserPoolMfaConfigCommand").f(void 0, void 0).ser(se_SetUserPoolMfaConfigCommand).de(de_SetUserPoolMfaConfigCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/SetUserSettingsCommand.js
var SetUserSettingsCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "SetUserSettings", {}).n("CognitoIdentityProviderClient", "SetUserSettingsCommand").f(SetUserSettingsRequestFilterSensitiveLog, void 0).ser(se_SetUserSettingsCommand).de(de_SetUserSettingsCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/SignUpCommand.js
var SignUpCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "SignUp", {}).n("CognitoIdentityProviderClient", "SignUpCommand").f(SignUpRequestFilterSensitiveLog, void 0).ser(se_SignUpCommand).de(de_SignUpCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/StartUserImportJobCommand.js
var StartUserImportJobCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "StartUserImportJob", {}).n("CognitoIdentityProviderClient", "StartUserImportJobCommand").f(void 0, void 0).ser(se_StartUserImportJobCommand).de(de_StartUserImportJobCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/StopUserImportJobCommand.js
var StopUserImportJobCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "StopUserImportJob", {}).n("CognitoIdentityProviderClient", "StopUserImportJobCommand").f(void 0, void 0).ser(se_StopUserImportJobCommand).de(de_StopUserImportJobCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/TagResourceCommand.js
var TagResourceCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "TagResource", {}).n("CognitoIdentityProviderClient", "TagResourceCommand").f(void 0, void 0).ser(se_TagResourceCommand).de(de_TagResourceCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/UntagResourceCommand.js
var UntagResourceCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "UntagResource", {}).n("CognitoIdentityProviderClient", "UntagResourceCommand").f(void 0, void 0).ser(se_UntagResourceCommand).de(de_UntagResourceCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/UpdateAuthEventFeedbackCommand.js
var UpdateAuthEventFeedbackCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "UpdateAuthEventFeedback", {}).n("CognitoIdentityProviderClient", "UpdateAuthEventFeedbackCommand").f(UpdateAuthEventFeedbackRequestFilterSensitiveLog, void 0).ser(se_UpdateAuthEventFeedbackCommand).de(de_UpdateAuthEventFeedbackCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/UpdateDeviceStatusCommand.js
var UpdateDeviceStatusCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "UpdateDeviceStatus", {}).n("CognitoIdentityProviderClient", "UpdateDeviceStatusCommand").f(UpdateDeviceStatusRequestFilterSensitiveLog, void 0).ser(se_UpdateDeviceStatusCommand).de(de_UpdateDeviceStatusCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/UpdateGroupCommand.js
var UpdateGroupCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "UpdateGroup", {}).n("CognitoIdentityProviderClient", "UpdateGroupCommand").f(void 0, void 0).ser(se_UpdateGroupCommand).de(de_UpdateGroupCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/UpdateIdentityProviderCommand.js
var UpdateIdentityProviderCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "UpdateIdentityProvider", {}).n("CognitoIdentityProviderClient", "UpdateIdentityProviderCommand").f(void 0, void 0).ser(se_UpdateIdentityProviderCommand).de(de_UpdateIdentityProviderCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/UpdateResourceServerCommand.js
var UpdateResourceServerCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "UpdateResourceServer", {}).n("CognitoIdentityProviderClient", "UpdateResourceServerCommand").f(void 0, void 0).ser(se_UpdateResourceServerCommand).de(de_UpdateResourceServerCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/UpdateUserAttributesCommand.js
var UpdateUserAttributesCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "UpdateUserAttributes", {}).n("CognitoIdentityProviderClient", "UpdateUserAttributesCommand").f(UpdateUserAttributesRequestFilterSensitiveLog, void 0).ser(se_UpdateUserAttributesCommand).de(de_UpdateUserAttributesCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/UpdateUserPoolClientCommand.js
var UpdateUserPoolClientCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "UpdateUserPoolClient", {}).n("CognitoIdentityProviderClient", "UpdateUserPoolClientCommand").f(UpdateUserPoolClientRequestFilterSensitiveLog, UpdateUserPoolClientResponseFilterSensitiveLog).ser(se_UpdateUserPoolClientCommand).de(de_UpdateUserPoolClientCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/UpdateUserPoolCommand.js
var UpdateUserPoolCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "UpdateUserPool", {}).n("CognitoIdentityProviderClient", "UpdateUserPoolCommand").f(void 0, void 0).ser(se_UpdateUserPoolCommand).de(de_UpdateUserPoolCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/UpdateUserPoolDomainCommand.js
var UpdateUserPoolDomainCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "UpdateUserPoolDomain", {}).n("CognitoIdentityProviderClient", "UpdateUserPoolDomainCommand").f(void 0, void 0).ser(se_UpdateUserPoolDomainCommand).de(de_UpdateUserPoolDomainCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/VerifySoftwareTokenCommand.js
var VerifySoftwareTokenCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "VerifySoftwareToken", {}).n("CognitoIdentityProviderClient", "VerifySoftwareTokenCommand").f(VerifySoftwareTokenRequestFilterSensitiveLog, VerifySoftwareTokenResponseFilterSensitiveLog).ser(se_VerifySoftwareTokenCommand).de(de_VerifySoftwareTokenCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/commands/VerifyUserAttributeCommand.js
var VerifyUserAttributeCommand = class extends Command.classBuilder().ep(commonParams).m(function(Command2, cs, config, o2) {
  return [getSerdePlugin(config, this.serialize, this.deserialize), getEndpointPlugin(config, Command2.getEndpointParameterInstructions())];
}).s("AWSCognitoIdentityProviderService", "VerifyUserAttribute", {}).n("CognitoIdentityProviderClient", "VerifyUserAttributeCommand").f(VerifyUserAttributeRequestFilterSensitiveLog, void 0).ser(se_VerifyUserAttributeCommand).de(de_VerifyUserAttributeCommand).build() {
};

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/CognitoIdentityProvider.js
var commands = {
  AddCustomAttributesCommand,
  AdminAddUserToGroupCommand,
  AdminConfirmSignUpCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminDeleteUserAttributesCommand,
  AdminDisableProviderForUserCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminForgetDeviceCommand,
  AdminGetDeviceCommand,
  AdminGetUserCommand,
  AdminInitiateAuthCommand,
  AdminLinkProviderForUserCommand,
  AdminListDevicesCommand,
  AdminListGroupsForUserCommand,
  AdminListUserAuthEventsCommand,
  AdminRemoveUserFromGroupCommand,
  AdminResetUserPasswordCommand,
  AdminRespondToAuthChallengeCommand,
  AdminSetUserMFAPreferenceCommand,
  AdminSetUserPasswordCommand,
  AdminSetUserSettingsCommand,
  AdminUpdateAuthEventFeedbackCommand,
  AdminUpdateDeviceStatusCommand,
  AdminUpdateUserAttributesCommand,
  AdminUserGlobalSignOutCommand,
  AssociateSoftwareTokenCommand,
  ChangePasswordCommand,
  ConfirmDeviceCommand,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  CreateGroupCommand,
  CreateIdentityProviderCommand,
  CreateResourceServerCommand,
  CreateUserImportJobCommand,
  CreateUserPoolCommand,
  CreateUserPoolClientCommand,
  CreateUserPoolDomainCommand,
  DeleteGroupCommand,
  DeleteIdentityProviderCommand,
  DeleteResourceServerCommand,
  DeleteUserCommand,
  DeleteUserAttributesCommand,
  DeleteUserPoolCommand,
  DeleteUserPoolClientCommand,
  DeleteUserPoolDomainCommand,
  DescribeIdentityProviderCommand,
  DescribeResourceServerCommand,
  DescribeRiskConfigurationCommand,
  DescribeUserImportJobCommand,
  DescribeUserPoolCommand,
  DescribeUserPoolClientCommand,
  DescribeUserPoolDomainCommand,
  ForgetDeviceCommand,
  ForgotPasswordCommand,
  GetCSVHeaderCommand,
  GetDeviceCommand,
  GetGroupCommand,
  GetIdentityProviderByIdentifierCommand,
  GetLogDeliveryConfigurationCommand,
  GetSigningCertificateCommand,
  GetUICustomizationCommand,
  GetUserCommand,
  GetUserAttributeVerificationCodeCommand,
  GetUserPoolMfaConfigCommand,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  ListDevicesCommand,
  ListGroupsCommand,
  ListIdentityProvidersCommand,
  ListResourceServersCommand,
  ListTagsForResourceCommand,
  ListUserImportJobsCommand,
  ListUserPoolClientsCommand,
  ListUserPoolsCommand,
  ListUsersCommand,
  ListUsersInGroupCommand,
  ResendConfirmationCodeCommand,
  RespondToAuthChallengeCommand,
  RevokeTokenCommand,
  SetLogDeliveryConfigurationCommand,
  SetRiskConfigurationCommand,
  SetUICustomizationCommand,
  SetUserMFAPreferenceCommand,
  SetUserPoolMfaConfigCommand,
  SetUserSettingsCommand,
  SignUpCommand,
  StartUserImportJobCommand,
  StopUserImportJobCommand,
  TagResourceCommand,
  UntagResourceCommand,
  UpdateAuthEventFeedbackCommand,
  UpdateDeviceStatusCommand,
  UpdateGroupCommand,
  UpdateIdentityProviderCommand,
  UpdateResourceServerCommand,
  UpdateUserAttributesCommand,
  UpdateUserPoolCommand,
  UpdateUserPoolClientCommand,
  UpdateUserPoolDomainCommand,
  VerifySoftwareTokenCommand,
  VerifyUserAttributeCommand
};
var CognitoIdentityProvider = class extends CognitoIdentityProviderClient {
};
createAggregatedClient(commands, CognitoIdentityProvider);

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/pagination/AdminListGroupsForUserPaginator.js
var paginateAdminListGroupsForUser = createPaginator(CognitoIdentityProviderClient, AdminListGroupsForUserCommand, "NextToken", "NextToken", "Limit");

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/pagination/AdminListUserAuthEventsPaginator.js
var paginateAdminListUserAuthEvents = createPaginator(CognitoIdentityProviderClient, AdminListUserAuthEventsCommand, "NextToken", "NextToken", "MaxResults");

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/pagination/ListGroupsPaginator.js
var paginateListGroups = createPaginator(CognitoIdentityProviderClient, ListGroupsCommand, "NextToken", "NextToken", "Limit");

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/pagination/ListIdentityProvidersPaginator.js
var paginateListIdentityProviders = createPaginator(CognitoIdentityProviderClient, ListIdentityProvidersCommand, "NextToken", "NextToken", "MaxResults");

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/pagination/ListResourceServersPaginator.js
var paginateListResourceServers = createPaginator(CognitoIdentityProviderClient, ListResourceServersCommand, "NextToken", "NextToken", "MaxResults");

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/pagination/ListUserPoolClientsPaginator.js
var paginateListUserPoolClients = createPaginator(CognitoIdentityProviderClient, ListUserPoolClientsCommand, "NextToken", "NextToken", "MaxResults");

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/pagination/ListUserPoolsPaginator.js
var paginateListUserPools = createPaginator(CognitoIdentityProviderClient, ListUserPoolsCommand, "NextToken", "NextToken", "MaxResults");

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/pagination/ListUsersInGroupPaginator.js
var paginateListUsersInGroup = createPaginator(CognitoIdentityProviderClient, ListUsersInGroupCommand, "NextToken", "NextToken", "Limit");

// ../../node_modules/@aws-sdk/client-cognito-identity-provider/dist-es/pagination/ListUsersPaginator.js
var paginateListUsers = createPaginator(CognitoIdentityProviderClient, ListUsersCommand, "PaginationToken", "PaginationToken", "Limit");
export {
  Command as $Command,
  AccountTakeoverEventActionType,
  AddCustomAttributesCommand,
  AdminAddUserToGroupCommand,
  AdminAddUserToGroupRequestFilterSensitiveLog,
  AdminConfirmSignUpCommand,
  AdminConfirmSignUpRequestFilterSensitiveLog,
  AdminCreateUserCommand,
  AdminCreateUserRequestFilterSensitiveLog,
  AdminCreateUserResponseFilterSensitiveLog,
  AdminDeleteUserAttributesCommand,
  AdminDeleteUserAttributesRequestFilterSensitiveLog,
  AdminDeleteUserCommand,
  AdminDeleteUserRequestFilterSensitiveLog,
  AdminDisableProviderForUserCommand,
  AdminDisableUserCommand,
  AdminDisableUserRequestFilterSensitiveLog,
  AdminEnableUserCommand,
  AdminEnableUserRequestFilterSensitiveLog,
  AdminForgetDeviceCommand,
  AdminForgetDeviceRequestFilterSensitiveLog,
  AdminGetDeviceCommand,
  AdminGetDeviceRequestFilterSensitiveLog,
  AdminGetDeviceResponseFilterSensitiveLog,
  AdminGetUserCommand,
  AdminGetUserRequestFilterSensitiveLog,
  AdminGetUserResponseFilterSensitiveLog,
  AdminInitiateAuthCommand,
  AdminInitiateAuthRequestFilterSensitiveLog,
  AdminInitiateAuthResponseFilterSensitiveLog,
  AdminLinkProviderForUserCommand,
  AdminListDevicesCommand,
  AdminListDevicesRequestFilterSensitiveLog,
  AdminListDevicesResponseFilterSensitiveLog,
  AdminListGroupsForUserCommand,
  AdminListGroupsForUserRequestFilterSensitiveLog,
  AdminListUserAuthEventsCommand,
  AdminListUserAuthEventsRequestFilterSensitiveLog,
  AdminRemoveUserFromGroupCommand,
  AdminRemoveUserFromGroupRequestFilterSensitiveLog,
  AdminResetUserPasswordCommand,
  AdminResetUserPasswordRequestFilterSensitiveLog,
  AdminRespondToAuthChallengeCommand,
  AdminRespondToAuthChallengeRequestFilterSensitiveLog,
  AdminRespondToAuthChallengeResponseFilterSensitiveLog,
  AdminSetUserMFAPreferenceCommand,
  AdminSetUserMFAPreferenceRequestFilterSensitiveLog,
  AdminSetUserPasswordCommand,
  AdminSetUserPasswordRequestFilterSensitiveLog,
  AdminSetUserSettingsCommand,
  AdminSetUserSettingsRequestFilterSensitiveLog,
  AdminUpdateAuthEventFeedbackCommand,
  AdminUpdateAuthEventFeedbackRequestFilterSensitiveLog,
  AdminUpdateDeviceStatusCommand,
  AdminUpdateDeviceStatusRequestFilterSensitiveLog,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesRequestFilterSensitiveLog,
  AdminUserGlobalSignOutCommand,
  AdminUserGlobalSignOutRequestFilterSensitiveLog,
  AdvancedSecurityEnabledModeType,
  AdvancedSecurityModeType,
  AliasAttributeType,
  AliasExistsException,
  AssociateSoftwareTokenCommand,
  AssociateSoftwareTokenRequestFilterSensitiveLog,
  AssociateSoftwareTokenResponseFilterSensitiveLog,
  AttributeDataType,
  AttributeTypeFilterSensitiveLog,
  AuthFlowType,
  AuthenticationResultTypeFilterSensitiveLog,
  ChallengeName,
  ChallengeNameType,
  ChallengeResponse,
  ChangePasswordCommand,
  ChangePasswordRequestFilterSensitiveLog,
  CodeDeliveryFailureException,
  CodeMismatchException,
  CognitoIdentityProvider,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderServiceException,
  CompromisedCredentialsEventActionType,
  ConcurrentModificationException,
  ConfirmDeviceCommand,
  ConfirmDeviceRequestFilterSensitiveLog,
  ConfirmForgotPasswordCommand,
  ConfirmForgotPasswordRequestFilterSensitiveLog,
  ConfirmSignUpCommand,
  ConfirmSignUpRequestFilterSensitiveLog,
  CreateGroupCommand,
  CreateIdentityProviderCommand,
  CreateResourceServerCommand,
  CreateUserImportJobCommand,
  CreateUserPoolClientCommand,
  CreateUserPoolClientResponseFilterSensitiveLog,
  CreateUserPoolCommand,
  CreateUserPoolDomainCommand,
  CustomEmailSenderLambdaVersionType,
  CustomSMSSenderLambdaVersionType,
  DefaultEmailOptionType,
  DeleteGroupCommand,
  DeleteIdentityProviderCommand,
  DeleteResourceServerCommand,
  DeleteUserAttributesCommand,
  DeleteUserAttributesRequestFilterSensitiveLog,
  DeleteUserCommand,
  DeleteUserPoolClientCommand,
  DeleteUserPoolClientRequestFilterSensitiveLog,
  DeleteUserPoolCommand,
  DeleteUserPoolDomainCommand,
  DeleteUserRequestFilterSensitiveLog,
  DeletionProtectionType,
  DeliveryMediumType,
  DescribeIdentityProviderCommand,
  DescribeResourceServerCommand,
  DescribeRiskConfigurationCommand,
  DescribeRiskConfigurationRequestFilterSensitiveLog,
  DescribeRiskConfigurationResponseFilterSensitiveLog,
  DescribeUserImportJobCommand,
  DescribeUserPoolClientCommand,
  DescribeUserPoolClientRequestFilterSensitiveLog,
  DescribeUserPoolClientResponseFilterSensitiveLog,
  DescribeUserPoolCommand,
  DescribeUserPoolDomainCommand,
  DeviceRememberedStatusType,
  DeviceTypeFilterSensitiveLog,
  DomainStatusType,
  DuplicateProviderException,
  EmailSendingAccountType,
  EnableSoftwareTokenMFAException,
  EventFilterType,
  EventResponseType,
  EventSourceName,
  EventType,
  ExpiredCodeException,
  ExplicitAuthFlowsType,
  FeedbackValueType,
  ForbiddenException,
  ForgetDeviceCommand,
  ForgetDeviceRequestFilterSensitiveLog,
  ForgotPasswordCommand,
  ForgotPasswordRequestFilterSensitiveLog,
  GetCSVHeaderCommand,
  GetDeviceCommand,
  GetDeviceRequestFilterSensitiveLog,
  GetDeviceResponseFilterSensitiveLog,
  GetGroupCommand,
  GetIdentityProviderByIdentifierCommand,
  GetLogDeliveryConfigurationCommand,
  GetSigningCertificateCommand,
  GetUICustomizationCommand,
  GetUICustomizationRequestFilterSensitiveLog,
  GetUICustomizationResponseFilterSensitiveLog,
  GetUserAttributeVerificationCodeCommand,
  GetUserAttributeVerificationCodeRequestFilterSensitiveLog,
  GetUserCommand,
  GetUserPoolMfaConfigCommand,
  GetUserRequestFilterSensitiveLog,
  GetUserResponseFilterSensitiveLog,
  GlobalSignOutCommand,
  GlobalSignOutRequestFilterSensitiveLog,
  GroupExistsException,
  IdentityProviderTypeType,
  InitiateAuthCommand,
  InitiateAuthRequestFilterSensitiveLog,
  InitiateAuthResponseFilterSensitiveLog,
  InternalErrorException,
  InvalidEmailRoleAccessPolicyException,
  InvalidLambdaResponseException,
  InvalidOAuthFlowException,
  InvalidParameterException,
  InvalidPasswordException,
  InvalidSmsRoleAccessPolicyException,
  InvalidSmsRoleTrustRelationshipException,
  InvalidUserPoolConfigurationException,
  LimitExceededException,
  ListDevicesCommand,
  ListDevicesRequestFilterSensitiveLog,
  ListDevicesResponseFilterSensitiveLog,
  ListGroupsCommand,
  ListIdentityProvidersCommand,
  ListResourceServersCommand,
  ListTagsForResourceCommand,
  ListUserImportJobsCommand,
  ListUserPoolClientsCommand,
  ListUserPoolClientsResponseFilterSensitiveLog,
  ListUserPoolsCommand,
  ListUsersCommand,
  ListUsersInGroupCommand,
  ListUsersInGroupResponseFilterSensitiveLog,
  ListUsersResponseFilterSensitiveLog,
  LogLevel,
  MFAMethodNotFoundException,
  MessageActionType,
  NotAuthorizedException,
  OAuthFlowType,
  PasswordHistoryPolicyViolationException,
  PasswordResetRequiredException,
  PreTokenGenerationLambdaVersionType,
  PreconditionNotMetException,
  PreventUserExistenceErrorTypes,
  RecoveryOptionNameType,
  ResendConfirmationCodeCommand,
  ResendConfirmationCodeRequestFilterSensitiveLog,
  ResourceNotFoundException,
  RespondToAuthChallengeCommand,
  RespondToAuthChallengeRequestFilterSensitiveLog,
  RespondToAuthChallengeResponseFilterSensitiveLog,
  RevokeTokenCommand,
  RevokeTokenRequestFilterSensitiveLog,
  RiskConfigurationTypeFilterSensitiveLog,
  RiskDecisionType,
  RiskLevelType,
  ScopeDoesNotExistException,
  SetLogDeliveryConfigurationCommand,
  SetRiskConfigurationCommand,
  SetRiskConfigurationRequestFilterSensitiveLog,
  SetRiskConfigurationResponseFilterSensitiveLog,
  SetUICustomizationCommand,
  SetUICustomizationRequestFilterSensitiveLog,
  SetUICustomizationResponseFilterSensitiveLog,
  SetUserMFAPreferenceCommand,
  SetUserMFAPreferenceRequestFilterSensitiveLog,
  SetUserPoolMfaConfigCommand,
  SetUserSettingsCommand,
  SetUserSettingsRequestFilterSensitiveLog,
  SignUpCommand,
  SignUpRequestFilterSensitiveLog,
  SoftwareTokenMFANotFoundException,
  StartUserImportJobCommand,
  StatusType,
  StopUserImportJobCommand,
  TagResourceCommand,
  TimeUnitsType,
  TooManyFailedAttemptsException,
  TooManyRequestsException,
  UICustomizationTypeFilterSensitiveLog,
  UnauthorizedException,
  UnexpectedLambdaException,
  UnsupportedIdentityProviderException,
  UnsupportedOperationException,
  UnsupportedTokenTypeException,
  UnsupportedUserStateException,
  UntagResourceCommand,
  UpdateAuthEventFeedbackCommand,
  UpdateAuthEventFeedbackRequestFilterSensitiveLog,
  UpdateDeviceStatusCommand,
  UpdateDeviceStatusRequestFilterSensitiveLog,
  UpdateGroupCommand,
  UpdateIdentityProviderCommand,
  UpdateResourceServerCommand,
  UpdateUserAttributesCommand,
  UpdateUserAttributesRequestFilterSensitiveLog,
  UpdateUserPoolClientCommand,
  UpdateUserPoolClientRequestFilterSensitiveLog,
  UpdateUserPoolClientResponseFilterSensitiveLog,
  UpdateUserPoolCommand,
  UpdateUserPoolDomainCommand,
  UserContextDataTypeFilterSensitiveLog,
  UserImportInProgressException,
  UserImportJobStatusType,
  UserLambdaValidationException,
  UserNotConfirmedException,
  UserNotFoundException,
  UserPoolAddOnNotEnabledException,
  UserPoolClientDescriptionFilterSensitiveLog,
  UserPoolClientTypeFilterSensitiveLog,
  UserPoolMfaType,
  UserPoolTaggingException,
  UserStatusType,
  UserTypeFilterSensitiveLog,
  UsernameAttributeType,
  UsernameExistsException,
  VerifiedAttributeType,
  VerifySoftwareTokenCommand,
  VerifySoftwareTokenRequestFilterSensitiveLog,
  VerifySoftwareTokenResponseFilterSensitiveLog,
  VerifySoftwareTokenResponseType,
  VerifyUserAttributeCommand,
  VerifyUserAttributeRequestFilterSensitiveLog,
  Client as __Client,
  paginateAdminListGroupsForUser,
  paginateAdminListUserAuthEvents,
  paginateListGroups,
  paginateListIdentityProviders,
  paginateListResourceServers,
  paginateListUserPoolClients,
  paginateListUserPools,
  paginateListUsers,
  paginateListUsersInGroup
};
/*! Bundled license information:

bowser/src/bowser.js:
  (*!
   * Bowser - a browser detector
   * https://github.com/lancedikson/bowser
   * MIT License | (c) Dustin Diaz 2012-2015
   * MIT License | (c) Denis Demchenko 2015-2019
   *)
*/
//# sourceMappingURL=@aws-sdk_client-cognito-identity-provider.js.map
