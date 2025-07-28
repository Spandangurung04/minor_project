const defaultProfile = '../photos/profile.jpeg';
const doctors = [
  { id: 1, name: 'Dr. Spandan Gurung', specialty: 'Orthodontist', experience: '8 years', email: 'spandan.gurung@hamrodental.com', image: defaultProfile },
  { id: 2, name: 'Dr. Anisha Rai', specialty: 'Pediatric Dentist', experience: '5 years', email: 'anisha.rai@hamrodental.com', image: defaultProfile },
  { id: 3, name: 'Dr. Prakash Thapa', specialty: 'Prosthodontist', experience: '10 years', email: 'prakash.thapa@hamrodental.com', image: defaultProfile }
];
const slots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM'
];

const doctorList = document.getElementById('doctor-list');
const slotsSection = document.getElementById('slots-section');
const doctorName = document.getElementById('doctor-name');
const slotsList = document.getElementById('slots-list');
const backBtn = document.getElementById('back-btn');

const user = JSON.parse(localStorage.getItem('hamroUser'));
if (!user) {
  alert('You must be logged in to book an appointment.');
  window.location.href = 'login.html';
}

window.addEventListener('DOMContentLoaded', () => {
  let userDiv = document.createElement('div');
  userDiv.style.textAlign = 'right';
  userDiv.style.marginBottom = '1rem';
  userDiv.innerHTML = `<b>Logged in as:</b> ${user.name} (${user.email})`;
  document.querySelector('.container').prepend(userDiv);
});

function getBookedSlots(doctorId) {
  const booked = JSON.parse(localStorage.getItem('bookedSlots') || '{}');
  return booked[doctorId] || [];
}
function getBookedSlotOwners(doctorId) {
  const owners = JSON.parse(localStorage.getItem('bookedSlotOwners') || '{}');
  return owners[doctorId] || {};
}
function setBookedSlot(doctorId, slot, userEmail) {
  const booked = JSON.parse(localStorage.getItem('bookedSlots') || '{}');
  if (!booked[doctorId]) booked[doctorId] = [];
  booked[doctorId].push(slot);
  localStorage.setItem('bookedSlots', JSON.stringify(booked));
  const owners = JSON.parse(localStorage.getItem('bookedSlotOwners') || '{}');
  if (!owners[doctorId]) owners[doctorId] = {};
  owners[doctorId][slot] = userEmail;
  localStorage.setItem('bookedSlotOwners', JSON.stringify(owners));
}
function cancelBookedSlot(doctorId, slot) {
  const booked = JSON.parse(localStorage.getItem('bookedSlots') || '{}');
  if (booked[doctorId]) {
    booked[doctorId] = booked[doctorId].filter(s => s !== slot);
    localStorage.setItem('bookedSlots', JSON.stringify(booked));
  }
  const owners = JSON.parse(localStorage.getItem('bookedSlotOwners') || '{}');
  if (owners[doctorId]) {
    delete owners[doctorId][slot];
    localStorage.setItem('bookedSlotOwners', JSON.stringify(owners));
  }
}
function getUserActiveBooking(userEmail) {
  const owners = JSON.parse(localStorage.getItem('bookedSlotOwners') || '{}');
  for (const docId in owners) {
    for (const slot in owners[docId]) {
      if (owners[docId][slot] === userEmail) {
        return { docId, slot };
      }
    }
  }
  return null;
}
function showDoctors() {
  doctorList.innerHTML = '';
  doctors.forEach(doc => {
    const box = document.createElement('div');
    box.className = 'doctor-box';
    box.onclick = () => showSlots(doc);
    box.innerHTML = `
      <img src="${doc.image}" alt="Profile" class="doctor-profile-img" />
      <h3>${doc.name}</h3>
      <p><b>Specialty:</b> ${doc.specialty}</p>
      <p><b>Experience:</b> ${doc.experience}</p>
      <p><b>Email:</b> ${doc.email}</p>
      <button class="select-doctor-btn">Select</button>
    `;
    doctorList.appendChild(box);
  });
  doctorList.style.display = 'block';
  slotsSection.style.display = 'none';
}
function showSlots(doc) {
  doctorList.style.display = 'none';
  slotsSection.style.display = 'block';
  doctorName.textContent = doc.name;
  slotsList.innerHTML = '';
  const booked = getBookedSlots(doc.id);
  const owners = getBookedSlotOwners(doc.id);
  const userBooking = getUserActiveBooking(user.email);
  slots.forEach(slot => {
    const slotDiv = document.createElement('div');
    slotDiv.style.display = 'inline-block';
    slotDiv.style.margin = '0.3rem';
    if (booked.includes(slot)) {
      const isMine = owners[slot] === user.email;
      const btn = document.createElement('button');
      btn.textContent = slot + ' (Booked)';
      btn.className = 'slot-btn booked';
      btn.disabled = true;
      slotDiv.appendChild(btn);
      if (isMine) {
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'slot-btn cancel-btn';
        cancelBtn.style.marginLeft = '0.5rem';
        cancelBtn.disabled = false;
        cancelBtn.onclick = () => {
          cancelBookedSlot(doc.id, slot);
          alert('Booking cancelled for ' + slot + ' with ' + doc.name);
          showSlots(doc);
        };
        slotDiv.appendChild(cancelBtn);
      }
    } else {
      const btn = document.createElement('button');
      btn.textContent = slot;
      btn.className = 'slot-btn';
      btn.onclick = () => {
        if (userBooking) {
          alert('You can only book one time slot at a time. Please cancel your existing booking first.');
          return;
        }
        setBookedSlot(doc.id, slot, user.email);
        alert('Appointment booked for ' + slot + ' with ' + doc.name);
        showSlots(doc);
      };
      slotDiv.appendChild(btn);
    }
    slotsList.appendChild(slotDiv);
  });
}
backBtn.onclick = showDoctors;
showDoctors(); 