let url = "http://tjx-tracker-dev.azurewebsites.net/csr/login";



$(".submit").on("click" , () => 
{   
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    axios.post(`${url}`, { email: `${username}`, rep_password: `${password}` }) .then(function (response) { 
        console.log(response.data); 
        window.localStorage.setItem('sessionToken', response.data.sessionToken);
        if (response.data.sessionToken){
            window.location.href = ("../views/customers.html");
        }
    }) 
        .catch(function (error) { 
            console.log(error); 
            window.alert("Wrong credentials. Please try again!");
        });


});