/* global describe, it, before */

import chai from 'chai';
import * as Http from '../lib/shield-http';

chai.expect();

const expect = chai.expect;

let lib;

describe('Given an instance of my HttpExt library', () => {
  before(() => {
    console.log(Http.HttpExt)
    lib = new Http.HttpExt();
  });
  describe('when I need the name', () => {
    it('should return the name', () => {
      expect(lib.options.timeout).to.be.equal('100000');
    });
  });
});
