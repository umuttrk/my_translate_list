const button = document.querySelector('button');

button.addEventListener('mouseover', () => {
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
    button.style.transform = 'scale(1.3)';

    document.querySelector('form').style.backgroundColor = '#d3f674';

    document.querySelectorAll('input').forEach(input => {
        input.style.backgroundColor = 'black';
        input.style.color = 'white';
        input.style.transform = 'scale(0.7)';
    });
});

button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = '#f5c2e0';
    button.style.color = 'black';
    button.style.transform = 'scale(1)';

    document.querySelector('form').style.backgroundColor = '#fcee54';

    document.querySelector('#email').classList.remove('white_placeholder');
    document.querySelector('#password').classList.remove('white_placeholder');
    document.querySelector('#first_name').classList.remove('white_placeholder');
    document.querySelector('#last_name').classList.remove('white_placeholder');

    document.querySelectorAll('input').forEach(input => {
        input.style.backgroundColor = 'white';
        input.style.color = 'black';
        input.style.transform = 'scale(1)';
    });
});


document.querySelector('form').addEventListener('submit', event => {
    console.log('tiklama algilandi');
    event.preventDefault();
    const first_name = document.querySelector('#first_name').value;
    const last_name = document.querySelector('#last_name').value;
    const email = document.querySelector('#email').value;
    const pass = document.querySelector('#password').value;
    if (first_name && last_name && email && pass) {
        chrome.runtime.sendMessage(
            {
                message: 'register',
                payload:{first_name,last_name,email,pass}
            },
            function(response){
                console.log(response);
                if (response==="success") {
                  //  alert('registered')
                    setTimeout(function() { alert("registered"); }, 1000);
                    window.location.replace('./popup-sign-out.html')
                }else if(response==="duplicate_mail"){
                    console.log('salak');
                    alert('please enter different mail')
                    document.querySelector('#email').value=" ";
                }
            }
            )
    } else {
        document.querySelector('#container').querySelector('#email').placeholder = "Enter an email.";
        document.querySelector('#container').querySelector('#password').placeholder = "Enter a password.";
        document.querySelector('#container').querySelector('#email').style.backgroundColor = 'red';
        document.querySelector('#container').querySelector('#password').style.backgroundColor = 'red';
        document.querySelector('#container').querySelector('#email').classList.add('white_placeholder');
        document.querySelector('#container').querySelector('#password').classList.add('white_placeholder');
        document.querySelector('#container').querySelector('#first_name').placeholder = "Enter an name.";
        document.querySelector('#container').querySelector('#last_name').placeholder = "Enter a last name.";
        document.querySelector('#container').querySelector('#first_name').style.backgroundColor = 'red';
        document.querySelector('#container').querySelector('#last_name').style.backgroundColor = 'red';
        document.querySelector('#container').querySelector('#first_name').classList.add('white_placeholder');
        document.querySelector('#container').querySelector('#last_name').classList.add('white_placeholder');
    }
})