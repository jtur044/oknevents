#!/usr/bin/env node

/* OKNEVENTS Generate a file containing the sensor times corresponding to events 

Example :

  
  oknevents 
          

*/


/* sweep */

const fs = require('fs');
const program  = require ("commander");
const csv = require('csv-parser')

/* program */


program
  .option('-i, --input <name>', 'get a view', __dirname + '/example/gaze.csv')
program.parse(process.argv);
const options = program.opts();


let fields = [ "record_timestamp", "sensor_timestamp" ];

// load the CSV file into results 

const results = [];

let line = 0;

fs.createReadStream(options.input)
  .pipe(csv())
  .on('data', (data) => {


        line++;

        // get a non-zero events string 

        if (data.is_event) {

            let event;
            let str = data.event_string.trim();          
            //console.error (`string="${str}"`)
            if (str) { 
                try {
                  
                  event = JSON.parse(data.event_string);
                  // add extra fields to event
                  fields.forEach ((elem) => {
                      event[elem] = Number(data[elem]);
                  });

                  // send it out!
                  console.log (event);


                } catch (err) {
                  console.error (`Warning. Line ${line}:"${str}" was ignored.`);                  
                }
            }

        };


        // add the timestamp record and the sensor-timestamp 


      }

    )
  .on('end', () => {


      // loaded 
      console.error ('done.');

      //results.forEach (elem) => {}



  });
