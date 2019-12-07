const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const doctorData = require('../doctorData.json');
const appointmentData = require('../appointmentData.json');
const inMemoryDoctors = doctorData.slice();
const inMemoryAppointments = appointmentData.slice();


const getNextApptId = () => {
  return inMemoryAppointments[inMemoryAppointments.length - 1].id + 1;
};

app.use(bodyParser());
app.use(express.static('dist'));

app.get('/doctors', (req, res) => {
  res.send(inMemoryDoctors);
})

app.get('/appointments/:doctorId/:date', (req, res) => {
  let doctorId = req.params.doctorId;
  let date = req.params.date;
  let doctorFirst;
  let doctorLast;
  let appointments = [];
  for (let i = 0; i < inMemoryDoctors.length; i++) {
    if (parseInt(doctorId) === inMemoryDoctors[i].id) {
      doctorFirst = inMemoryDoctors[i].firstName;
      doctorLast = inMemoryDoctors[i].lastName;
      break;
    }
  }
  for (let i = 0; i < inMemoryAppointments.length; i++) {
    if (inMemoryAppointments[i].doctorFirst === doctorFirst && inMemoryAppointments[i].doctorLast === doctorLast) {
      if (inMemoryAppointments[i].date === date) {
        appointments.push(inMemoryAppointments[i]);
      }
    }
  }
  res.send(appointments);
});

app.delete('/appointments/:doctorId/:apptId', (req, res) => {
  let doctorId = req.params.doctorId;
  let apptId = req.params.apptId;
  let doctorFirst;
  let doctorLast;
  let flag = false;
  for (let i = 0; i < inMemoryDoctors.length; i++) {
    if (parseInt(doctorId) === inMemoryDoctors[i].id) {
      doctorFirst = inMemoryDoctors[i].firstName;
      doctorLast = inMemoryDoctors[i].lastName;
      break;
    }
  }
  for (let i = 0; i < inMemoryAppointments.length; i++) {
    if (inMemoryAppointments[i].doctorFirst === doctorFirst && inMemoryAppointments[i].doctorLast === doctorLast) {
      if (parseInt(apptId) === inMemoryAppointments[i].id) {
        delete inMemoryAppointments[i].id;
        flag = true;
        break;
      }
    }
  }
  if (flag) {
    res.send('appointment successfully deleted')
  } else {
    res.send('appointment does not exist')
  }
})

app.post('/appointments', (req, res) => {
  let counterAtTime = 0;
  for (let i = 0; i < inMemoryAppointments.length; i++) {
    if (inMemoryAppointments[i].doctorId === parseInt(req.body.doctorId)) {
      if (inMemoryAppointments[i].date === req.body.date && inMemoryAppointments[i].time === req.body.time) {
        counterAtTime++;
      }
    }
  }
  if (counterAtTime >= 3) {
    res.send('All appointment slots are booked for this time');
  } else {
    let newAppt = {};
    newAppt.id = getNextApptId();
    newAppt.patientFirst = req.body.patientFirst;
    newAppt.patientLast = req.body.patientLast;
    newAppt.date = req.body.date;
    newAppt.time = req.body.time;
    newAppt.kind = req.body.kind;
    newAppt.doctorFirst = req.body.doctorFirst;
    newAppt.doctorLast = req.body.doctorLast;
    inMemoryAppointments.push(newAppt);
    res.send('Appointment successfully booked')
  }
})

app.listen(3000, () => console.log('Listening on port 3000'));