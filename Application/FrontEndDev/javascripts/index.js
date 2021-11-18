
// Starter function for login
// Uses a hard coded credentials (bad practice but used to have a flow)
	let usrdb =`[
		{
			"username": "Somali",
			"password": "~D'u(L8pJj&IP2Pj"
		},
		{
			"username": "avowspeeding",
			"password": "A,NQ\>Pu-W^pW_W&"
		},
		{
			"username": "Gewürztraminer",
			"password": "H/bafk4_Vbfk$u"
		},
		{
			"username": "Faginsawdustsconsole",
			"password": "4M@LM$.\LO@dtf/M"
		},

		{   "username": "admin",
			"password": "admin"
		}
		
	]`;

	userdb = JSON.parse(usrdb);

$(".submit").on("click" , () => 
{   
    // Get the value of the fields
    let username = $(".un").val();
    let password = $(".pass").val();
    console.log(username + "" + password);
    //Check the values against a dumb input 
	for (i =0; i < userdb.length; i++){
		console.log(i);
		if (username == userdb[i].username && password == userdb[i].password){
			console.log(username, password);        
			window.location.href = ("../views/customers.html");
			console.log("Redirect");
	}   if (i == userdb.length-1){
		alert("You have entered the wrong username or password");
		$(".un").val("");
		$(".pass").val("");
		}}
});