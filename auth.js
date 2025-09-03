

document.getElementById("mainUI").style.display = "block";



const client = supabase.createClient('https://zzypezedfkegupwpwsam.supabase.co', 'sb_publishable_pasDUaq9bzG0kQkFIvyaeQ_XdvKTBO_')


const {data:{session}} = await client.auth.getSession()

if(!session){
const { data, error } = await client.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: window.location.href
  }
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

