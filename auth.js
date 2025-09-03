function parseJwt(token) {
    const base64Url = token.split('.')[1]; // The payload is the 2nd part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
}

document.getElementById("mainUI").style.display = "block";
/*function handleCredentialResponse(response) {
    const userObject = parseJwt(response.credential);
    document.getElementById("buttonDiv").style.display = "none";
    document.getElementById("mainUI").style.display = "block";
    document.getElementById("status").innerText = `${userObject.name}`;
}

// Initialize Google Sign-In
google.accounts.id.initialize({
    client_id: "115396371783-sc29nt2eefmk5o10ev18d5092vgqmrj0.apps.googleusercontent.com",
    callback: handleCredentialResponse
});

// Render the sign-in button
google.accounts.id.renderButton(
    document.getElementById("buttonDiv"),
    { theme: "outline", size: "large" }
);
google.accounts.id.prompt(); */

// Create a single supabase client for interacting with your database


const client = supabase.createClient('https://zzypezedfkegupwpwsam.supabase.co', 'sb_publishable_pasDUaq9bzG0kQkFIvyaeQ_XdvKTBO_')


const {data:{session}} = await client.auth.getSession()

if(!session){
const { data, error } = await client.auth.signInWithOAuth({
  provider: 'google'
})
}
else {
    console.log("User logged in:", session.user)
    document.getElementById("buttonDiv").style.display = "none";
    document.getElementById("mainUI").style.display = "block";
    let username = session.user.user_metadata.full_name
    document.getElementById("status").innerText = `${username}`;
}


function qryID() {
  client
    .from('people')
    .select('person_id')
    .eq('email', session.user.user_metadata.email)
    .then(({ data, error }) => {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Data:', data);
        console.log(data[0].person_id);
        return data[0].person_id
      }
    });
}

qryID()

