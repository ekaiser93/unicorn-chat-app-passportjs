let user = document.querySelector("#user");

 let getUser = () => {
   axios.get(`https://calm-dawn-99540.herokuapp.com/protected`)
     .then(response => {
       console.log(response.data);
       user.innerHTML = "Welcome " + response.data.user.email + ", you are now logged in!";
     })
     .catch(e => {
       console.log(e);
     });
 }

 let pushMessage = (message) => {
   axios.post(`https://calm-dawn-99540.herokuapp.com/message`, {
     email: "erica@gmail.com",
     message: message
   });
 }

 let button = document.querySelector("#open");
 button.addEventListener("click", getUser);

 $("#message").keyup(() => {
    let message = $(this).val();
  });

 let submit = document.querySelector("#submit");
 submit.addEventListener("click", pushMessage(message));
