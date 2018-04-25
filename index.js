'use strict';

const fs = require('fs');
const join = require('path').join;
const hoek = require('hoek');

const internals = {};

module.exports = function (Joi, directory, defaultLocale, extensions) {
  if (!Joi) {
    throw new TypeError('Joi is required');
  }

  if (directory && typeof directory !== 'string') {
    const options = directory;
    directory = options.directory;
    defaultLocale = options.defaultLocale;
    extensions = options.extensions;
  }
  const locales = Joi.locales || {};

  const joi = Object.create(Joi.any());
  Object.assign(joi, Joi);

  directory = joi.originalValidate ? directory : directory || join(__dirname, 'locales');

  if (!internals.schemas) {
    const errorDescriptor = Joi.alternatives().try([
      Joi.string().allow(null),
      Joi.func(),
      Joi.object().pattern(/.+/, Joi.lazy(() => errorDescriptor).required())
    ]).label('descriptor');
    internals.schemas = {
      locale: Joi.string().allow(null).label('locale'),

      directory: Joi.string().label('directory'),

      extensions: Joi.array().items(Joi.string()).label('extensions'),

      language: Joi.object({
        root: Joi.string(),
        key: Joi.string(),
        messages: Joi.object({
          wrapArrays: Joi.boolean()
        })
      }).pattern(/.+/, Joi.object().pattern(/.+/, errorDescriptor.required())).required().label('language')
    };
  }
  const originalValidate = joi.originalValidate = joi.originalValidate || Joi.validate;

  Object.defineProperty(joi, 'locales', {
    value: locales,
    enumerable: false
  });

  Object.defineProperty(joi, 'getDefaultLocale', {
    value: function () {
      return defaultLocale;
    },
    enumerable: false
  });

  Object.defineProperty(joi, 'setDefaultLocale', {
    value: function (locale) {
      joi.assert(locale, internals.schemas.locale);
      if (locale === null) {
        // unset default locale
        defaultLocale = undefined;
      } else {
        // assert arguments
        if (locale in locales) {
          defaultLocale = locale;
        } else {
          console.warn(`locale ${locale} is not registered! This operation will be igrnored.`);
        }
      }
      return joi;
    },
    enumerable: false
  });

  Object.defineProperty(joi, 'loadDirectory', {
    value: function (directory, extensions = ['js', 'json']) {
      joi.assert(directory, internals.schemas.directory);
      joi.assert(extensions, internals.schemas.extensions);
      fs.readdirSync(directory)
      .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js' &&
        (new RegExp('\\.(' + extensions.join('|') + ')$', 'i').test(file)))
      .forEach((file) => {
        const key = file.substring(0, file.lastIndexOf('.'));
        const value = require(join(directory, file));
        joi.assert(value, internals.schemas.language);
        locales[key] = locales[key] ? hoek.merge(locales[key], value) : value;
      });
      return joi;
    },
    enumerable: false
  });

  Object.defineProperty(joi, 'validate', {
    value: function (value /*, [schema], [options], callback */) {
      const last = arguments[arguments.length - 1];
      const callback = typeof last === 'function' ? last : null;

      const count = arguments.length - (callback ? 1 : 0);
      if (count === 1) {
        return originalValidate(value, callback);
      }

      const options = count === 3 ? arguments[2] : {};

      if (options.i18n) {
        if (locales[options.i18n]) {
          options.language = locales[options.i18n];
        }
        delete options.i18n;
      }

      const schema = arguments[1];

      return originalValidate(value, schema, options, callback);
    },
    enumerable: false
  });

  if (directory) {
    joi.loadDirectory(directory, extensions || ['js', 'json']);
  }

  if (!defaultLocale && typeof process.env.LANG === 'string') {
    defaultLocale = process.env.LANG.split('.', 1).shift();
  }

  return joi;
};

