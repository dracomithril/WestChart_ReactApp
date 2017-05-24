/**
 * Created by XKTR67 on 4/19/2017.
 */

describe('[filters]',  () =>{
    let filters;
    beforeAll(() =>{
        filters = require('./../src/filters_def');
    });
    afterAll(() =>{
    });
    beforeEach(() =>{
    });
    afterEach(() =>{
    });
    it("subtractDaysFromDate", () =>{
        let date = new Date('3/29/2017');
        let since =filters.subtractDaysFromDate(date,4);
        expect(since.toLocaleDateString("en-EN")).toBe("3/25/2017");
    });
});