'use strict';

const Lab = require('lab');
const { describe, it, expect } = exports.lab = Lab.script();
const joi = require('joi');

describe('Initialize joi-x-i18n', () => {
  it('throws an error if no Joi instance sended in constructor', () => {
    expect(require('../index')).to.throw(TypeError, 'Joi is required');
  });

  it('return a Joi instance if an instance of Joi is sended', () => {
    expect(require('../index')(joi)).to.include({isJoi: true});
  });
});

describe('DefaultLocale joi-x-i18n', () => {
  let Joi = require('../index')(joi);

  it('return default locale seted', () => {
    Joi.setDefaultLocale('zh_CN');
    expect(Joi.getDefaultLocale()).to.equal('zh_CN');
  });

  it('return default locale seted null', () => {
    Joi.setDefaultLocale(null);
    expect(Joi.getDefaultLocale()).to.equal(undefined);
  });

  it('return default locale seted unknown', () => {
    Joi.setDefaultLocale('unknown');
    expect(Joi.getDefaultLocale()).to.equal(undefined);
  });
});

describe('loadDirectory joi-x-i18n', () => {
  let Joi = require('../index')(joi);

  it('loadDirectory return the same instance sended', () => {
    expect(Joi.loadDirectory(__dirname + '/tempdir', ['js'])).to.shallow.equal(Joi);
  });
});

describe('Validate Schemas', () => {
  let Joi = require('../index')(joi);
  const schema = {
    name: Joi.string().required(),
    isPlayer: Joi.boolean().optional()
  };

  let value = {
    name: 'Marcos',
    isPlayer: true
  };

  it('when no i18n option is sended (default Joi behavior)', () => {
    Joi.validate(value, schema, (err, data) => {
      expect(err).to.be.null();
      expect(data).to.include(value);
    });
  });

  it('when no i18n option is sended (default Joi behavior sync version)', () => {
    let result = Joi.validate(value, schema);
    expect(result.error).to.be.null();
    expect(result.value).to.include(value);
  });

  it('when no i18n option is send, and just the value is send (default Joi behavior)', () => {
    Joi.validate(value, (err, data) => {
      expect(err).to.be.null();
      expect(data).to.include(value);
    });
  });

  it('when a i18n options is sended, but no file match `file`', () => {
    Joi.validate({}, schema, {i18n: 'unknown'}, (err, data) => {
      expect(err).to.include({isJoi: true, name: 'ValidationError'});
      expect(err.details).to.part.include([{message: '"name" is required'}]);
    });
  });

  it('when a i18n option is sended and a correct directory haven`t the translation `file`', () => {
    Joi = require('../index')(joi, __dirname + '/../locales');
    Joi.validate({}, schema, {i18n: 'es'}, (err, data) => {
      expect(err).to.include({isJoi: true, name: 'ValidationError'});
      expect(err.details).to.part.include([{message: '"name" is required'}]);
    });
  });

  it('when a i18n option is sended and a correct directory have the translation `file`', () => {
    Joi = require('../index')(joi, __dirname + '/../locales');
    Joi.validate({}, schema, {i18n: 'zh_CN'}, (err, data) => {
      expect(err).to.include({isJoi: true, name: 'ValidationError'});
      expect(err.details).to.part.include([{message: '"name" 是必须的'}]);
    });
  });

  it('when a i18n option is sended and a correct directory have the translation `file`', () => {
    Joi = require('../index')(Joi);
    Joi.validate({}, schema, {i18n: 'en_US'}, (err, data) => {
      expect(err).to.include({isJoi: true, name: 'ValidationError'});
      expect(err.details).to.part.include([{message: '"name" is required'}]);
    });
  });

  it('when a i18n option is sended and a correct directory have the translation `file`', () => {
    Joi = require('../index')(Joi, {directory: __dirname + '/../locales', defaultLocale: 'zh_CN', extensions: ['json']});
    Joi.validate({}, schema, {i18n: 'zh_CN'}, (err, data) => {
      expect(err).to.include({isJoi: true, name: 'ValidationError'});
      expect(err.details).to.part.include([{message: '"name" 是必须的'}]);
    });
  });
});
