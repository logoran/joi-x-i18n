# joi-i18n-x

[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![Dependency Status][david-badge]][david-url]

i18n error messages extension for Joi [Joi](https://github.com/hapijs/joi)

###  Getting Started
For using joi-i18n-x is very simple:
```javascript
'use strict';
const Joi = require('joi-i18n-x')(require('joi'), __dirname + '/locales');
```
You must send to joi-i18n-x an intance of Joi and the directory of the translation files.

After, initializing the module, you have the instance of Joi, and you can use that like you use Joi.

You can translate your messages, simple adding an extra option in your validate function.

```javascript
let schema = {
  name: Joi.string().required()
};

let value = {};

Joi.validate(value, schema, {i18n: 'zh_CN'}, function (err, data) {
  console.log(err, data);
});
// output
/*
{ [ValidationError: 成员"name"失败因为:["name" 是必须的]]
  isJoi: true,
  name: 'ValidationError',
  details: 
   [ { message: '"name" 是必须的',
       path: 'name',
       type: 'any.required',
       context: [Object] } ],
  _object: {},
  annotate: [Function] } {}
*/
```

For more information about how translate the tokens, you can see the `zh_CN` translation inside the `locales` directory in this project.

**NOTE:** If you specify an invalid path to your folders we just use the default english version for the errors or the translations default in the `i18n` directory in this project.

After all, you just have a Joi instance, you can use that like you use Joi in your project, no incompatibilities with an existing implementation.

### Contribute

To contribute you can try to find an [issue or enchancment][0] and try to
implement it. Fork the project, implement the code, make tests and send the PR to the master branch.

### Testing

For testing you just need run `npm install && npm test` inside root folder of this project. 

### License

(The MIT License)

Copyright (c) 2018 Logoran contributors

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[0]: https://github.com/logoran/joi-i18n-x/issues?q=is%3Aopen+is%3Aenchancement+is%3Abug

[travis-badge]: https://api.travis-ci.org/logoran/joi-i18n-x.svg?branch=master
[travis-url]: https://travis-ci.org/logoran/joi-i18n-x
[coveralls-badge]:https://coveralls.io/repos/logoran/joi-i18n-x/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/logoran/joi-i18n-x?branch=master
[david-badge]: https://david-dm.org/logoran/joi-i18n-x.svg
[david-url]: https://david-dm.org/logoran/joi-i18n-x

