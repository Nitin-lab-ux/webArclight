document.getElementById('year').textContent = new Date().getFullYear();

function submitLead(e){
  e.preventDefault();
  document.getElementById('formMsg').textContent = 'Thanks! We will contact you within 24 hours.';
  e.target.reset();
  return false;
}
