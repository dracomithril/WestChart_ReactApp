/**
 * Created by XKTR67 on 4/19/2017.
 */

'use strict';
const chai = require('chai'),
    sinon = require('sinon'),
    rewire = require('rewire'),
    assert = sinon.assert,
    expect = chai.expect;
chai.should();

describe('[filters]',  () =>{
    let filters;
    beforeAll(() =>{
        filters = require('./../src/filters');
    });
    afterAll(() =>{
    });
    beforeEach(() =>{
    });
    afterEach(() =>{
    });
    it("subtractDaysFromDate", () =>{
        let date = new Date('3/29/2017');
        let since =filters.default.subtractDaysFromDate(date,4);
        expect(since.toLocaleDateString()).to.eql("3/25/2017");
    });
});