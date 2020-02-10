module.exports = {

  confirm: username => ({
    subject: 'Emozionalmente Confirmation',
    html: `
      <div style="color: #344955; text-align: center; height: 256px">
        <h1>Welcome to Emozionalmente, ${username}!</h1>
        <p>Click on the button to verify your account</p>
        <div style="height: 40px"></div>
        <a href="https://i3lab.elet.polimi.it/emozionalmente/confirm/${username}" 
          style="cursor: pointer; border: none; margin-top: 48px; text-align: center; padding: 16px 40px; text-decoration: none; color: white; background-color: #0c6291; border-radius: 8px;">
          VERIFY
        </a>
      </div>
    `,      
    text: `Copy and paste this link: i3lab.elet.polimi.it/emozionalmente/confirm/${username}`
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