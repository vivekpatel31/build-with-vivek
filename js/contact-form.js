// The contact form: posts the message to the shared contact endpoint, which stores it and
// emails the site's own inbox (set per site on the server). The address is public
// (it is only a URL); the endpoint checks the site, limits how often it can be used, and
// ignores bots that fill in the hidden "website" field.
var ENDPOINT = 'https://wuqkxv42gxt324nrm4uvuabfye0wouiu.lambda-url.ap-south-1.on.aws/contact'

var MESSAGES = {
  400: 'Please check your name, email and message, then try again.',
  429: 'That was a lot of messages in a short time. Please try again later.',
}

function initContactForm(form) {
  var status = form.querySelector('.contact-status')
  var button = form.querySelector('button[type="submit"]')
  var label = button.textContent

  function say(text, isError) {
    status.textContent = text
    status.classList.toggle('is-error', !!isError)
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault()
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    // A bot filled the hidden field: look like a success, send nothing.
    if (form.elements.website.value) {
      form.classList.add('is-sent')
      return
    }

    button.disabled = true
    button.textContent = 'Sending…'
    say('')

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        subject: form.elements.subject.value.trim(),
        message: form.elements.message.value.trim(),
      }),
    })
      .then(function (response) {
        if (!response.ok) {
          var error = new Error('status ' + response.status)
          error.status = response.status
          throw error
        }
        form.reset()
        form.classList.add('is-sent')
      })
      .catch(function (error) {
        say(MESSAGES[error.status] || 'Sorry, that didn’t go through. Please try again, or email us directly.', true)
        button.disabled = false
        button.textContent = label
      })
  })
}

document.querySelectorAll('form[data-contact-form]').forEach(initContactForm)
