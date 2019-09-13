

//execute javascript when the window has loaded
window.addEventListener("load", () => {

    function postData(form) {
        console.log("postDataCalled");

        //Convert the form -> formData
        let formData = new FormData(form);

        //Now generate an XHR request
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("load", (event) => {
            console.log(xhr.response);
            document.location.href = xhr.response;
        });

        xhr.addEventListener("error", (event) => {
            console.log("SOmething went wrong");
        });

        xhr.open("put", "/");
        xhr.send(formData);
    }


    //Get a hold of the form
    let form = document.querySelector("#target_form");
    

    //Grab a hold of the submit function
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        postData(form);
    });

});