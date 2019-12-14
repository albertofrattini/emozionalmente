module.exports = {

  confirm: id => ({
    subject: 'Emozionalmente Confirmation',
    html: `
      <div>
        <h1>Welcome to Emozionalmente!</h1>
        <p>In order to activate your account we ask you to copy and paste the following link into your browser:</p>
        <h4>localhost:3000/confirm/${id}</h4>
      </div>
    `,      
    text: `Copy and paste this link: localhost:3000/confirm/${id}`
  }),

  mycontact: element => ({
    subject: 'User Contact',
    html: `
    <div>
      <h1>Name: ${element.sender}</h1>
      <h3>Email: ${element.email}</h3>
      <p>Message: ${element.content}</p>
    </div>
    `,
    text: 'Some text...'
  }),

  contact: () => ({
    subject: 'Emozionalmente Contacted',
    html: `
    <div>
      Thank you for getting in touch with us. We will answer asap.
    </div>
    `,
    text: 'Some text...'
  }),

  mycontribute: element => ({
    subject: 'User Contribution',
    html: `
    <div>
      <h1>Name: ${element.sender}</h1>
      <h3>Email: ${element.email}</h3>
      <p>Message: ${element.content}</p>
    </div>
    `,
    text: 'Some text...'
  }),

  contribute: () => ({
    subject: 'Emozionalmente Contributed',
    html: `
    <div>
      Thank you for contributing. We will answer asap.
    </div>
    `,
    text: 'Some text...'
  }),

  
}