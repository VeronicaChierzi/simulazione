/*globals require, console, process */

var express = require('express');
var bodyParser = require('body-parser');

// instantiate express
const app = express();


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port = process.env.PORT || 8080;


// get an instance of the express Router
var router = express.Router();

var consegne = [];
var nextAID = 1;

function creaAssignment(tID, aID, wID, aRes) {
    return {
        taskID: tID,
        assignmentID: aID,
        workerID: wID,
        assignmentResult: aRes
    }
}

function getIndexConsegna(assID) {
    for (var i = 0; i < consegne.length; i++) {
        if (consegne[i].assignmentID && parseInt(consegne[i].assignmentID) == parseInt(assID)) {
            console.log("VALORE " + consegne[i].assignmentID)
            return i;
        }
    }
    return -1;
}

function rimuoviDaArray(array, index) {
    if (index !== -1) {
        array.splice(index, 1);
    }
}


// test route to make sure everything is working
router.get('/', function(req, res) {
    //res.json({ message: 'welcome to our api!' });

    var risposta = {
        mess: "funzia"
    }

    res.json(risposta);

});

router.route('/assignment')
    .get(
        function(req, res) {
            console.log("GET ALL");
            res.json(consegne);
        })

    .post(
        function(req, res) {
            console.log("POST " + nextAID)
            var aID = nextAID;
            
            var tID = req.body.taskID;
            var wID = req.body.workerID;
            var aRes = req.body.assRes;

            console.log(tID);
            console.log(wID);
            console.log(aRes);


            if (tID && wID && aRes) {
                nextAID++;
                consegne.push(creaAssignment(tID, aID, wID, aRes));
                res.json({
                    successo: "Assignment consegnato correttamente. Annota il tuo id per successive modifiche.",
                    ID: aID
                })
            } else {
                res.json({
                    errore: "Assignment non inserito."
                })
            }



        })

router.route('/assignment/:a_id')
    .get(
        function(req, res) {
            console.log("GET " + req.params.a_id)
            var indice = getIndexConsegna(req.params.a_id);
            if (indice == -1) {
                res.status(404);
                res.json({
                    errore: "Nessun assignment con quell'ID."
                });
            } else {
                res.json(consegne[indice]);
            }

        })

    .put(function(req, res) {
        console.log("PUT " + req.params.a_id)
        var aID = req.params.a_id;
        var tID = req.body.taskID;
        var wID = req.body.workerID;
        var aRes = req.body.assRes;

        if (aID && tID && wID && aRes) {
            var indice = getIndexConsegna(aID);
            if (indice != -1) {
                consegne[indice].taskID = tID;
                consegne[indice].assignmentID = aID;
                consegne[indice].workerID = wID;
                consegne[indice].assignmentResult = aRes;

                res.json({
                    successo: "Assignment modificato correttamente. Annota il tuo id per successive modifiche.",
                    ID: aID
                })
            } else {
                res.status(404);
                res.json({
                    errore: "Assignment non modificato perchè non c'era il num: " + aID + "."
                })
            }

        } else {
            res.status(404);
            res.json({
                errore: "Assignment non modificato."
            })
        }



    })
    .delete(
        function(req, res) {
            console.log("DELETE " + req.params.a_id)
            var indice = getIndexConsegna(req.params.a_id);
            if (indice == -1) {
                res.status(404);
                res.json({
                    errore: "Nessun assignment con quell'ID."
                });
            } else {
                rimuoviDaArray(consegne, indice);
                res.json({successo: "Assignment rimosso correttamente."});
            }

        })



// middleware route to support CORS and preflighted requests
app.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});

// register our router on /api
app.use('/api/v1', router);

// handle invalid requests and internal error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});


app.listen(port);
console.log('Magic happens on port ' + port);