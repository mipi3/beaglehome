/* global describe, beforeEach, it, expect */

'use strict';

var IndexPage = require('./pages/index_page');

describe('The dashboard app', function() {

    var todoPage;

    beforeEach(function() {
        todoPage = new IndexPage();
        todoPage.open();
    });

    it('should list several switch buttons', function() {
        expect(todoPage.switchButton(0).getText()).toEqual('Kitchen-lamp1');
        expect(todoPage.switchButton(1).getText()).toEqual('Kitchen-lamp2');
    });
});
