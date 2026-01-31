// Reveal animation
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
},{threshold:0.15});

reveals.forEach(el => observer.observe(el));

// EmailJS init
(function(){
  emailjs.init("ue9At9kzDPwGjsre3");
})();

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", function(e){
  e.preventDefault();
  status.textContent = "Sending message...";

  emailjs.sendForm(
    "service_o4xxgd9",
    "template_ze4hfxd",
    this
  )
  .then(() => {
    status.textContent = "Message sent successfully ✔";
    form.reset();
  })
  .catch(() => {
    status.textContent = "Failed to send message. Please try again.";
  });
});