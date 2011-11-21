(function () {

  var syntax = {
    token: /^([a-zA-Z]+)/,
    number: /^(\d*\.?\d+)+/,
    string: /^("(.*?)")|('(.*?)')/,
    operation: /^(<=|>=|>|<|==|!=|\|\||\&\&)+/,
    regex: /^(\/(.+)\/\w?)/,
    comments: /^(\/\/(.+))/
  };

  var keywords = {
    "const": true,
    "undefined": true,
    "var": true,
    "void": true,
    "yield": true,
    "delete": true,
    "new": true,
    "in": true,
    "instanceof": true,
    "let": true,
    "typeof": true,
    "this": true,
    "prototype": true,
    "function": true,
    "null": true,
    "true": true,
    "false": true,
    "return": true
  };

  var flow = {
    "if": true,
    "else": true,
    "do": true,
    "while": true,
    "for": true,
    "break": true,
    "continue": true,
    "switch": true,
    "case": true,
    "default": true
  };

  var exceptions = {
    "try": true,
    "catch": true,
    "throw": true,
    "with": true,
    "finally": true
  };

  var globals = {
    "Array": true,
    "Boolean": true,
    "Date": true,
    "Function": true,
    "Infinity": true,
    "JavaArray": true,
    "JavaClass": true,
    "JavaObject": true,
    "JavaPackage": true,
    "kind": true,
    "Math": true,
    "Number": true,
    "NaN": true,
    "Object": true,
    "Packages": true,
    "RegExp": true,
    "String": true,
    "Undefined": true,
    "java": true,
    "netscape": true,
    "sun": true
  };

  var errors = {
    "Error": true,
    "EvalError": true,
    "RangeError": true,
    "ReferenceError": true,
    "SyntaxError": true,
    "TypeError": true,
    "URIError": true
  };

  var future = {
    "abstract": true,
    "enum": true,
    "int": true,
    "short": true,
    "boolean": true,
    "export": true,
    "interface": true,
    "static": true,
    "byte": true,
    "extends": true,
    "long": true,
    "super": true,
    "char": true,
    "final": true,
    "native": true,
    "synchronized": true,
    "class": true,
    "float": true,
    "package": true,
    "throws": true,
    "goto": true,
    "private": true,
    "transient": true,
    "debugger": true,
    "implements": true,
    "protected": true,
    "volatile": true,
    "double": true,
    "import": true,
    "public": true
  };

  var htmlevents = {
    "onblur": true,
    "onclick": true,
    "oncontextmenu": true,
    "ondblclick": true,
    "onfocus": true,
    "onkeydown": true,
    "onkeypress": true,
    "onkeyup": true,
    "onmousedown": true,
    "onmousemove": true,
    "onmouseout": true,
    "onmouseover": true,
    "onmouseup": true,
    "onresize": true
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
        if (keywords[item]) {
          token.add("keywords keyword " + item, item);

        } else if (flow[item]) {
          token.add("keywords conditional " + item, item);

        } else if (exceptions[item]) {
          token.add("keywords exception " + item, item);

        } else if (globals[item]) {
          token.add("keywords global " + item, item);

        } else if (errors[item]) {
          token.add("keywords error " + item, item);

        } else if (future[item]) {
          token.add("keywords future " + item, item);

        } else if (htmlevents[item]) {
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
  }

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
