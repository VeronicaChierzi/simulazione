var ass1 = {
    "taskID": "ISW2",
    "assignmentID": 3,
    "workerID": "180700",
    "assRes": { 1: 'B', 2: 'A' }
}


var ass2 = {
    "taskID": "ISW2",
    "assignmentID": 6,
    "workerID": "179250",
    "assRes": { 1: 'B', 2: 'A' }
}


var consegne = [];


function getIndexConsegna(assID) {
    for (var i = 0; i < consegne.length; i++) {
        if (consegne[i].assignmentID && consegne[i].assignmentID == assID) {
            return i;
        }
    }
    return -1;
}

//test di getIndexConsegna con Loop Coverage

test('Test di getIndexConsegna con Loop Coverage. Iterazioni: 0', () => {
    expect(getIndexConsegna(3)).toBe(-1);
});
var consegne = [ass1];


test('Test di getIndexConsegna con Loop Coverage. Iterazioni: 1', () => {
    expect(getIndexConsegna(3)).toBe(0);
});


var consegne = [ass1, ass2];


test('Test di getIndexConsegna con Loop Coverage. Iterazioni: n', () => {
    expect(getIndexConsegna(6)).toBe(1);
});



function rimuoviDaArray(array, index) {
    if (index !== -1) {
        array.splice(index, 1);
    }
}


var consegna = [ass1, ass2];

function testRimuoviDaArray() {
    rimuoviDaArray(consegna, 1);
    return consegna;
}

test('Test di rimuoviDaArray', () => {
    expect(testRimuoviDaArray().length).toBe(1);
});


/// SYSTEM TEST *****************************************************************************************

var fetch = require("node-fetch");
var fetchJson = require("node-fetch-json");

function testGETApi(url) {
    return fetchJson(url, {
        method: "GET"
    });
}

function testDELETEApi(url) {
    return fetchJson(url, {
        method: "DELETE"
    });
}

function testPOSTApi(url, dati) {
    return fetchJson(url, {
        method: "POST",
        body: dati
    });
}

function testPUTApi(url, dati) {
    return fetchJson(url, {
        method: "PUT",
        body: dati
    });
}

var ass = {
    "taskID": "ISW2",
    "workerID": "180700",
    "assRes": { 1: 'B', 2: 'A' }
}

var assB = {
    "taskID": "ISW2",
    "workerID": "179250",
    "assRes": { 1: 'B', 2: 'A' }
}

var ID;
describe('test /assignment POST api with a new Assignment', () => {
    it('should add the assignent and return its ID value', () => {
        return testPOSTApi("http://localhost:8080/api/v1/assignment", ass)
            .then(data => {
            	console.log(data);
                expect(data).toBeDefined();
                expect(parseInt(data.ID)).toBeGreaterThanOrEqual(0);
                ID = data.ID;
            })
    })
})
describe('test /assignment GET api', () => {
    it('should return at least one assignment, the last inserted', () => {
        return testGETApi("http://localhost:8080/api/v1/assignment")
            .then(data => {
            	console.log(data);
                expect(data).toBeDefined();
                expect(data.length).toBe(1);
                expect(data[0].assignmentID).toBe(1);
            })
    })
})

describe('test /assignment PUT api with an edited Assignment', () => {
    it('should edit the assignment and return its ID value', () => {
        return testPUTApi("http://localhost:8080/api/v1/assignment/"+ID, assB)
            .then(data => {
            	console.log("http://localhost:8080/api/v1/assignment/"+ID);
            	console.log(data);
                expect(data).toBeDefined();
                expect(parseInt(data.ID)).toBeGreaterThanOrEqual(0);
            })
    })
})
describe('test /assignment GET api', () => {
    it('should return at least one assignment, the last edited', () => {
        return testGETApi("http://localhost:8080/api/v1/assignment/")
            .then(data => {
            	console.log(data);
                expect(data).toBeDefined();
                expect(data.length).toBeGreaterThanOrEqual(1);
                expect(data[0].workerID).toBe("179250");
            })
    })
})

describe('test /assignment DELETE api', () => {
    it('should return at least one assignment, the last inserted', () => {
        return testDELETEApi("http://localhost:8080/api/v1/assignment/"+ID)
            .then(data => {
            	console.log(data);
                expect(data).toBeDefined();
                expect(data.successo).toBe("Assignment rimosso correttamente.");
            })
    })
})