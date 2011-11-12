(function () {

  var syntax = {
    token: /^([a-zA-Z]+)/,
    number: /^(\d*\.?\d+)+/,
    string: /^("(.*?)")|('(.*?)')/,
    operation: /^(<=|>=|>|<|==|!=|\|\||\&\&)+/,
    regex: /^(\/(.+)\/\w?)/,
    comments: /^(\/\/(.+))/
  };

  var KEYWORDS = {
    keywords: ["const", "undefined", "var", "void", "yield", "delete", "new", "in", "instanceof", "let", "typeof", "this", "prototype", "function", "null", "true", "false", "return"],
    flow: ["if", "else", "do", "while", "for", "break", "continue", "switch", "case", "default"],
    exceptions: ["try", "catch", "throw", "with", "finally"],
    globals: ["Array", "Boolean", "Date", "Function", "Infinity", "JavaArray", "JavaClass", "JavaObject", "JavaPackage", "kind", "Math", "Number", "NaN", "Object", "Packages", "RegExp", "String", "Undefined", "java", "netscape", "sun"],
    errors: ["Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"],
    future: ["abstract", "enum", "int", "short", "boolean", "export", "interface", "static", "byte", "extends", "long", "super", "char", "final", "native", "synchronized", "class", "float", "package", "throws", "goto", "private", "transient", "debugger", "implements", "protected", "volatile", "double", "import", "public"],
    htmlevents: ["onblur", "onclick", "oncontextmenu", "ondblclick", "onfocus", "onkeydown", "onkeypress", "onkeyup", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onresize"]
  };

  var Tokens = function () {
    this.tokens = [];
  };
  Tokens.prototype.add = function (className, str) {
    if (className) {
      this.tokens.push("<span class='" + className + "'>" + str + "</span>");
    } else {
      this.tokens.push(str);
    }
  };
  Tokens.prototype.get = function () {
    return this.tokens.join("");
  };

  function lex(code, token) {
    // Cleanup code by removing extra space
    code.trim();

    // pointer
    var i = 0;

    // the item which we found
    var item = "";

    // current chunk of code
    var chunk = "";

    // scan each character until we find something to parse
    while (i < code.length) {
      // grabs the remaining chunk of code
      chunk = code.substr(i, code.length);

      // matches tokens
      if (syntax.token.test(chunk)) {
        item = syntax.token.exec(chunk)[1];

        // is a keyword
        if (KEYWORDS.keywords.indexOf(item) !== -1) {
          token.add("keywords keyword " + item, item);

        } else if (KEYWORDS.flow.indexOf(item) !== -1) {
          token.add("keywords conditional " + item, item);
        } else if (KEYWORDS.exceptions.indexOf(item) !== -1) {
          token.add("keywords exception " + item, item);
        } else if (KEYWORDS.globals.indexOf(item) !== -1) {
          token.add("keywords global " + item, item);
        } else if (KEYWORDS.errors.indexOf(item) !== -1) {
          token.add("keywords error " + item, item);
        } else if (KEYWORDS.future.indexOf(item) !== -1) {
          token.add("keywords future " + item, item);
        } else if (KEYWORDS.htmlevents.indexOf(item) !== -1) {
          token.add("keywords htmlevent " + item, item);

        // is an identifier
        } else {
          token.add("identifier", item);
        }

        i += item.length;

      // matches numbers
      } else if (syntax.number.test(chunk)) {
        item = syntax.number.exec(chunk)[1];
        token.add("number", item);
        i += item.length;

      // matches strings
      } else if (syntax.string.test(chunk)) {
        item = syntax.string.exec(chunk)[1];
        token.add("string", item);
        i += item.length;

      } else if (syntax.regex.test(chunk)) {
        item = syntax.regex.exec(chunk)[1];
        token.add("regex", item);
        i += item.length;

      // operations
      } else if (syntax.operation.test(chunk)) {
        item = syntax.operation.exec(chunk)[1];
        token.add("operation", item);
        i += item.length;

      } else if (syntax.comments.test(chunk)) {
        item = syntax.comments.exec(chunk)[1];
        token.add("comment", item);
        i += item.length;

      } else {
        token.add(null, chunk[0]);
        i += 1;
      }
    }
  };

  var forEach = Array.prototype.forEach;
  var codes = document.querySelectorAll("code");

  forEach.call(codes, function (code) {
    if (code.className === "mangojs") {
      return;
    }

    var src = code.innerText;
    var tokens = new Tokens();
    lex(src, tokens);
    code.innerHTML = tokens.get();
    code.className = "mangojs";
  });

}());
