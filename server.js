const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const sierraEcg = require('sierraecg');
// const stream = require("fs")
var fs = require('fs');
const { json } = require('express');


const app = express();

app.use(cors())

app.use(fileUpload());

// Upload Endpoint
app.post('/upload', (req, res) => {


  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  
  const file = req.files.file;

  // console.log(JSON.stringify(req.files.file));

  file.mv(`${__dirname}/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    const dummy = []

    sierraEcg.readFile(`${__dirname}/uploads/${file.name}`, function async (err, ecg) {
      if (err) {
        console.error(err);
      }
      else {
        ecg.leads
          .filter(function (lead) {
            return lead.enabled;
          }).forEach(function (lead) {
            dummy.push(lead)
          });
      }
     
      res.json({ result: dummy, samplingRate: ecg.originalXml.restingecgdata.dataacquisition[0].signalcharacteristics[0].samplingrate[0]});
    });

  });
});

app.listen(8000, () => console.log('Server Started...'));
