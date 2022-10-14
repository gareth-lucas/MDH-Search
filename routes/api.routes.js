const axios = require('axios');
const xml2js = require('xml2js');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.use('/', preCheck);
router.post('/query', query);
router.get('/query/:id', fetchById);
router.post('/quarantine/duplicates', fetchPotentialDuplicates);

async function preCheck(req, res, next) {

    // check if json web token is valid...
    var token = req.body.token || req.query.token || req.headers.authorization;

    if (!token) {
        return res.status(403).send({ message: `Per accedere alle API si richiede un token. Effettua il login di nuovo` });
    }

    if (token.substr(0, 6).toUpperCase() === 'BEARER') token = token.substr(7);

    // Check of Javascript Web Token here. User must be logged in.
    try {
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(400).send({ error: "Error in JSON Web Token" });
    }

    next();

}

async function query(req, res, next) {
    const filterData = req.body.filter;

    var GR;
    var Q;
    var normalGR = [];
    var normalQ = [];
    var totalRecords = 0;

    if (filterData.GOLDEN.value === 'Y') {
        GR = await queryGR(req, res, next);
    }

    if (filterData.QUARANTINE.value === 'Y') {
        Q = await queryQ(req, res, next);
    }

    if (GR) {
        GR = GR.RecordQueryResponse;
        if (!Array.isArray(GR.Record)) {
            GR.Record = [GR.Record];
        }
        totalRecords += parseInt(GR.$.totalCount);

        if (!!GR.Record[0]) {
            normalGR = GR.Record.map(r => {
                const fields = r.Fields.bupa;
                return {
                    name1: fields.name1,
                    name2: fields.name2,
                    sap_id: fields.sap_id,
                    addresses: fields.addresses ? fields.addresses : [fields.address],
                    recordId: r.$.recordId,
                    origin: 'GR',
                    createdDate: r.$.createdDate,
                    updatedDate: r.$.updatedDate
                }
            });
        }
    }

    if (Q) {
        Q = Q.QuarantineQueryResponse;
        if (!Array.isArray(Q.QuarantineEntry)) {
            Q.QuarantineEntry = [Q.QuarantineEntry];
        }
        totalRecords += parseInt(Q.$.totalCount);
        if (!!Q.QuarantineEntry[0]) {
            normalQ = Q.QuarantineEntry.map(r => {
                const fields = r.entity.bupa;
                return {
                    name1: fields.name1,
                    name2: fields.name2,
                    sap_id: fields.sap_id,
                    addresses: fields.addresses ? fields.addresses : [fields.address],
                    recordId: r.$.transactionId,
                    origin: 'Q',
                    createdDate: r.$.createdDate,
                    updatedDate: r.$.updatedDate,
                    cause: r.cause,
                    reason: r.reason,
                    resolution: r.resolution
                }
            });
        }
    }

    const dataResponse = normalGR.concat(normalQ).sort((a, b) => (a.name2 > b.name2 || a.name1 > b.name1 ? 1 : -1));

    const totalResponse = {
        totalRecords: totalRecords,
        totalResults: dataResponse.length,
        records: dataResponse
    }

    res.send(totalResponse);

}

async function queryGR(req, res, next) {
    // STRING FILTERS: EQUALS, NOT_EQUALS, STARTS_WITH, ENDS_WITH, CONTAINS, IS_NOT_NULL, IS_NULL
    // DATE FILTERS: EQUALS, NOT_EQUALS, IS_NOT_NULL, IS_NULL, BETWEEN
    // NUMBER FILTERS: UNKNOWN

    // Manage filters
    const filterData = req.body.filter;

    const filterXML = Object.keys(filterData).filter(k => {
        return k !== 'GOLDEN' && k !== 'QUARANTINE'
    }).map(key => {
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
    return (parsedData);
}

async function queryQ(req, res, next) {
    // Manage filters
    const filterData = req.body.filter;

    const filterXML = Object.keys(filterData).filter(k => {
        return k !== 'GOLDEN' && k !== 'QUARANTINE'
    }).map(key => {
        return `<field name="${key}" value="${filterData[key].value}" />`
    });

    const body = `<QuarantineQueryRequest limit="100" includeData="true" type="ALL"><filter>${filterXML.join('')}</filter></QuarantineQueryRequest>`;

    const host = process.env.MDH_HOST;
    const username = process.env.MDH_USER;
    const universeId = process.env.MDH_UNIVERSE_ID;
    const mdhApiKey = process.env.MDH_KEY;
    const requestOptions = { auth: { username: username, password: mdhApiKey } };

    const url = `https://${host}/mdm/universes/${universeId}/quarantine/query`;

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

    parsedData.QuarantineQueryResponse.$.origin = "Quarantine";

    // Send Response
    return (parsedData);
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

async function fetchPotentialDuplicates(req, res, next) {

    const host = process.env.MDH_HOST;
    const username = process.env.MDH_USER;
    const universeId = process.env.MDH_UNIVERSE_ID;
    const mdhApiKey = process.env.MDH_KEY;
    const requestOptions = { auth: { username: username, password: mdhApiKey } };

    req.body.id = req.body.recordId;

    const createFields = Object.keys(req.body).filter(k => (['name1', 'name2', 'id', 'sap_id'].includes(k))).map(k => {
        return `<${k}>${req.body[k]}</${k}>`;
    })

    var addressTag = '';
    if (req.body.addresses[0]) {
        const addressFields = Object.keys(req.body.addresses[0]).map(k => {
            return `<${k}>${req.body.addresses[0][k]}</${k}>`;
        })
        addressTag = `<address>${addressFields.join('')}</address>`
    }

    const url = `https://${host}/mdm/universes/${universeId}/match`;

    const request = `<batch src="BP_CSV">
    <bupa>
    ${createFields.join('')}
    ${addressTag}
    </bupa>
</batch>`

    // Call API
    const data = await axios.post(url, request, requestOptions).then(response => {
        return response.data;
    }).catch(err => {
        console.error(err.response.data);
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
    res.send(parsedData.MatchEntitiesResponse);


}

module.exports = router;