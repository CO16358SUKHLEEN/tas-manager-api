const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
    to: email,
    from: 'andrew@mead.io',
    subject: 'thanks for joining in',
    text: `Welcome to the app, ${name}`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
    to: email,
    from: 'andrew@mead.io',
    subject: 'leaving us',
    text: `we are sorry, ${name}. that you are no longer with us..please let us know what we did wrongg`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}