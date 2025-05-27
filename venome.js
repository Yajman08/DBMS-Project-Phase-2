// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const staffDashboard = document.getElementById('staffDashboard');
const userDashboard = document.getElementById('userDashboard');
const mainContent = document.getElementById('mainContent');

// Room data
const rooms = [
  {
    id: 1,
    name: 'Deluxe Ocean View',
    type: 'deluxe',
    price: 299,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800',
    description: 'Luxurious room with panoramic ocean views and private balcony',
    capacity: 2,
    status: 'available'
  },
  {
    id: 2,
    name: 'Executive Suite',
    type: 'executive',
    price: 499,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800',
    description: 'Spacious suite with separate living area and premium amenities',
    capacity: 2,
    status: 'occupied'
  },
  // Add more rooms...
];

// Booking data (simulated database)
let bookings = [];

// Login functionality
function showLoginModal() {
  loginModal.style.display = 'block';
}

function showLoginForm(type) {
  const buttons = document.querySelectorAll('.login-options button');
  buttons.forEach(button => button.classList.remove('active'));
  event.target.classList.add('active');
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  // Simulate authentication
  if (email === 'staff@hotel.com' && password === 'staff123') {
    loginModal.style.display = 'none';
    showStaffDashboard();
  } else if (email === 'user@example.com' && password === 'user123') {
    loginModal.style.display = 'none';
    showUserDashboard();
  } else {
    alert('Invalid credentials');
  }
});

function showStaffDashboard() {
  staffDashboard.classList.remove('hidden');
  userDashboard.classList.add('hidden');
  mainContent.classList.add('hidden');
  updateDashboard();
}

function showUserDashboard() {
  userDashboard.classList.remove('hidden');
  staffDashboard.classList.add('hidden');
  mainContent.classList.add('hidden');
  updateUserBookings();
}

// Dashboard updates
function updateDashboard() {
  updateNewBookings();
  updateCheckIns();
  updateCheckOuts();
  updateRoomStatus();
}

function updateNewBookings() {
  const newBookings = document.getElementById('newBookings');
  newBookings.innerHTML = bookings
    .filter(booking => booking.status === 'pending')
    .map(booking => createBookingElement(booking))
    .join('');
}

function updateCheckIns() {
  const checkIns = document.getElementById('checkIns');
  const today = new Date().toISOString().split('T')[0];
  checkIns.innerHTML = bookings
    .filter(booking => booking.checkIn === today)
    .map(booking => createBookingElement(booking))
    .join('');
}

function updateCheckOuts() {
  const checkOuts = document.getElementById('checkOuts');
  const today = new Date().toISOString().split('T')[0];
  checkOuts.innerHTML = bookings
    .filter(booking => booking.checkOut === today)
    .map(booking => createBookingElement(booking))
    .join('');
}

function updateRoomStatus() {
  const roomStatus = document.getElementById('roomStatus');
  roomStatus.innerHTML = rooms
    .map(room => `
      <div class="room-status-item ${room.status}">
        <div class="room-number">Room ${room.id}</div>
        <div class="status">${room.status}</div>
      </div>
    `)
    .join('');
}

function createBookingElement(booking) {
  return `
    <div class="booking-item">
      <div class="guest-name">${booking.name}</div>
      <div class="booking-dates">
        ${booking.checkIn} - ${booking.checkOut}
      </div>
      <div class="room-type">${booking.roomType}</div>
      <div class="status">${booking.status}</div>
    </div>
  `;
}

// Booking form handling
const bookingForm = document.getElementById('bookingForm');
const offlineBookingForm = document.getElementById('offlineBookingForm');

bookingForm.addEventListener('submit', handleBooking);
offlineBookingForm.addEventListener('submit', handleOfflineBooking);

function handleBooking(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = {
    full_name: formData.get('name'),
    email: formData.get('email'),
    phone_number: formData.get('phone'),
    address: formData.get('address'),
    check_in_date: formData.get('checkIn'),
    check_out_date: formData.get('checkOut'),
    room_type: formData.get('roomType'),
    total_visits: formData.get('total_visit'),
    payment_method: formData.get('paymentMethod'),
    total_amount: formData.get('totalAmount')
    
  };

  fetch('http://localhost:3000/api/book', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      e.target.reset();
    })
    .catch(err => console.error('Booking failed:', err));
}

function searchGuestByPhone() {
  const phone = document.getElementById('searchGuestPhone').value.trim();
  const resultSpan = document.getElementById('guestVisitResult');
  if (!phone) {
    resultSpan.textContent = "Please enter a phone number.";
    return;
  }
  resultSpan.textContent = "Searching...";

  fetch(`http://localhost:3000/api/guest/total-visits?phone=${encodeURIComponent(phone)}`)
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => {
      if (data && data.name) {
        resultSpan.textContent = `Name: ${data.name} | Total Visits: ${data.totalVisits}`;
      } else {
        resultSpan.textContent = "Guest not found.";
      }
    })
    .catch(() => {
      resultSpan.textContent = "Error fetching guest info.";
    });
}

document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      body.classList.toggle('dark-mode');
      // Change icon
      if (body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i data-lucide="sun"></i>';
      } else {
        themeToggle.innerHTML = '<i data-lucide="moon"></i>';
      }
      if (window.lucide) lucide.createIcons();
    });
  }
});
