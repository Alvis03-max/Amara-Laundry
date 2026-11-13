// Mobile menu
const nav = document.getElementById('nav');
document.getElementById('menuBtn').addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Active nav link on scroll
const links = document.querySelectorAll('nav a');
const sections = [...links].map(l => document.querySelector(l.getAttribute('href')));
window.addEventListener('scroll', () => {
  const y = window.scrollY + 120;
  sections.forEach((s, i) => {
    if (s && s.offsetTop <= y && s.offsetTop + s.offsetHeight > y) {
      links.forEach(l => l.classList.remove('active'));
      links[i].classList.add('active');
    }
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

// Booking
const form = document.getElementById('bookingForm');
const dateInput = document.getElementById('date');
const todayStr = new Date().toISOString().split('T')[0];
dateInput.min = todayStr;

function setInvalid(id, bad) {
  document.getElementById(id).closest('.field').classList.toggle('invalid', bad);
  return bad;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const v = id => document.getElementById(id).value.trim();
  const phoneOk = /^(\+?254|0)?[17]\d{8}$/.test(v('phone').replace(/\s+/g, ''));
  const errors = [
    setInvalid('name', v('name').length < 2),
    setInvalid('phone', !phoneOk),
    setInvalid('service', !v('service')),
    setInvalid('date', !v('date') || v('date') < todayStr),
    setInvalid('time', !v('time')),
    setInvalid('address', v('address').length < 3)
  ];
  if (errors.some(Boolean)) return;

  const booking = {
    ref: 'AMR-' + Date.now().toString().slice(-6),
    name: v('name'), phone: v('phone'), email: v('email'),
    service: v('service'), date: v('date'), time: v('time'),
    items: v('items'), delivery: v('delivery'),
    address: v('address'), notes: v('notes')
  };

  // Save locally (replace with a backend call to store bookings permanently)
  try {
    const all = JSON.parse(localStorage.getItem('amaraBookings') || '[]');
    all.push(booking);
    localStorage.setItem('amaraBookings', JSON.stringify(all));
  } catch (err) { console.warn('Storage unavailable', err); }

  const msg = `Hello Amara Laundry, I have booked a service.%0A` +
    `Ref: ${booking.ref}%0AName: ${booking.name}%0APhone: ${booking.phone}%0A` +
    `Service: ${booking.service}%0ADate: ${booking.date}%0ATime: ${booking.time}%0A` +
    `Items/Kgs: ${booking.items}%0ADelivery: ${booking.delivery}%0AAddress: ${booking.address}` +
    (booking.notes ? `%0ANotes: ${booking.notes}` : '');

  const box = document.getElementById('success');
  box.innerHTML = `<strong>Thank you, ${booking.name.replace(/</g, '&lt;')}!</strong> Your booking <strong>${booking.ref}</strong> for ` +
    `${booking.service} on ${booking.date} (${booking.time}) has been received. ` +
    `<br><a href="https://wa.me/254768466340?text=${msg}" target="_blank" rel="noopener">` +
    `<i class="fa-brands fa-whatsapp"></i> Send details via WhatsApp to confirm faster</a>`;
  box.classList.add('show');
  form.reset();
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
