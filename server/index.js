const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const doctorData = require('../doctorData.json');
const appointmentData = require('../appointmentData.json');
const inMemoryDoctors = doctorData.slice();
const inMemoryAppointments = appointmentData.slice();

// Gets the next available appointment Id
const getNextApptId = () => {
  return inMemoryAppointments[inMemoryAppointments.length - 1].id + 1;
};

app.use(bodyParser());
app.use(express.static('dist'));

//Sends all doctors
app.get('/doctors', (req, res) => {
  res.send(inMemoryDoctors);
})

//Sends all appointments for a particular doctor on a particular date
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

//Deletes an appointment for a particular doctor
app.delete('/appointments/:doctorId/:apptId', (req, res) => {
  let doctorId = req.params.doctorId;
  let apptId = req.params.apptId;
  let doctorFirst;
  let doctorLast;
  let flag = false;

  //Finds Doctor first and last name based on doctor id
  for (let i = 0; i < inMemoryDoctors.length; i++) {
    if (parseInt(doctorId) === inMemoryDoctors[i].id) {
      doctorFirst = inMemoryDoctors[i].firstName;
      doctorLast = inMemoryDoctors[i].lastName;
      break;
    }
  }

  //Finds appointment based on appointment id and doctor name
  //This check is added in case someone includes an incorrect appointment id, so that it does not delete an appointment for another doctor on accident
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

//Creates a new appointment
app.post('/appointments', (req, res) => {
  //Checks if the appointment time is valid
  let validTime = req.body.time.slice(3,5);
  if (validTime !== '00' && validTime !== '15' && validTime !== '30' && validTime !== '45') {
    return res.send('Appointments are only available every 15 minutes. Please reschedule your appointment to an appropriate time')
  }

  let counterAtTime = 0;

  //Finds how many appointments are already scheduled for this doctor at this time
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