const axios = require('axios');
const xml2js = require('xml2js');
const express = require('express');
const router = express.Router();

router.use('/', preCheck);
router.post('/query', query);
router.get('/query/:id', fetchById);

async function preCheck(req, res, next) {

    // check if json web token is valid...

    // #TODO: Implement check of Javascript Web Token here. User must be logged in.
    if (true) {
        next();
    } else {
        res.status(400).send({ error: "Error in JSON Web Token" });
    }
}

async function query(req, res, next) {
    // STRING FILTERS: EQUALS, NOT_EQUALS, STARTS_WITH, ENDS_WITH, CONTAINS, IS_NOT_NULL, IS_NULL
    // DATE FILTERS: EQUALS, NOT_EQUALS, IS_NOT_NULL, IS_NULL, BETWEEN
    // NUMBER FILTERS: UNKNOWN

    // Manage filters
    const filterData = req.body.filter;

    const filterXML = Object.keys(filterData).map(key => {
        return `<fieldValue><fieldId>${key}</fieldId><operator>${filterData[key].operator}</operator><value>${filterData[key].value}</value></fieldValue>`;
    })

    // Manage sort fields
    const sortData = req.body.sort;
    const sortXML = Object.keys(sortData).map(key => {
        return `<sortField><fieldId>${key}</fieldId><direction>${sortData[key].value}</direction></sortField>`
    })

    // Manage selection fields
    const fieldsData = req.body.view;
    const fieldsXML = fieldsData.map(key => {
        return `<fieldId>${key}</fieldId>`;
    });

    // construct payload
    const body = `<RecordQueryRequest limit="${req.body.maxRecords || 100}">
    <view>${fieldsXML}</view>
    <sort>${sortXML}</sort>
    <filter>${filterXML}</filter>
</RecordQueryRequest>`;

    const host = process.env.MDH_HOST;
    const username = process.env.MDH_USER;
    const universeId = process.env.MDH_UNIVERSE_ID;
    const mdhApiKey = process.env.MDH_KEY;
    const requestOptions = { auth: { username: username, password: mdhApiKey } };

    const url = `https://${host}/mdm/universes/${universeId}/records/query`;

    // Call API
    const data = await axios.post(url, body, requestOptions).then(response => {
        return response.data;
    }).catch(err => {
        console.error(err);
        return res.status(400).send({ "error": err });
    });

    // transform XML response to JSON
    const parsedData = await xml2js.parseStringPromise(data, { explicitArray: false }).then(result => {
        return result;
    }).catch(err => {
        console.error(err.data);
        return res.status(400).send(err);
    });

    parsedData.RecordQueryResponse.$.origin = "GoldenRecord";

    // Send Response
    res.send(parsedData);
}

async function fetchById(req, res, next) {
    const id = req.params.id;

    const host = process.env.MDH_HOST;
    const username = process.env.MDH_USER;
    const universeId = process.env.MDH_UNIVERSE_ID;
    const mdhApiKey = process.env.MDH_KEY;
    const requestOptions = { auth: { username: username, password: mdhApiKey } };

    const url = `https://${host}/mdm/universes/${universeId}/records/${id}`;

    // Call API
    const data = await axios.get(url, requestOptions).then(response => {
        return response.data;
    }).catch(err => {
        console.error(err);
        return res.status(400).send({ "error": err });
    });

    // transform XML response to JSON
    const parsedData = await xml2js.parseStringPromise(data, { explicitArray: false }).then(result => {
        return result;
    }).catch(err => {
        console.error(err.data);
        return res.status(400).send(err);
    });

    // Send Response
    res.send(parsedData);

}

module.exports = router;