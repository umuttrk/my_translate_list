const register_button = document.querySelector("#container").querySelector(".register");
const login_button = document.querySelector("#container").querySelector(".login");
register_button.addEventListener('mouseover', () => {
    register_button.style.backgroundColor = 'black';
    register_button.style.color = 'white';
    register_button.style.transform = 'scale(1.3)';

    document.querySelector('form').style.backgroundColor = '#d3f674';

    document.querySelectorAll('input').forEach(input => {
        input.style.backgroundColor = 'black';
        input.style.color = 'white';
        input.style.transform = 'scale(0.7)';
    });
});

register_button.addEventListener('mouseleave', () => {
    register_button.style.backgroundColor = '#f5c2e0';
    register_button.style.color = 'black';
    register_button.style.transform = 'scale(1)';

    document.querySelector('form').style.backgroundColor = '#fcee54';

    document.querySelector('#email').classList.remove('white_placeholder');
    document.querySelector('#password').classList.remove('white_placeholder');

    document.querySelectorAll('input').forEach(input => {
        input.style.backgroundColor = 'white';
        input.style.color = 'black';
        input.style.transform = 'scale(1)';
    });
});
login_button.addEventListener('mouseover', () => {
    login_button.style.backgroundColor = 'black';
    login_button.style.color = 'white';
    login_button.style.transform = 'scale(1.3)';

    document.querySelector('form').style.backgroundColor = '#d3f674';

    document.querySelectorAll('input').forEach(input => {
        input.style.backgroundColor = 'black';
        input.style.color = 'white';
        input.style.transform = 'scale(0.7)';
    });
});

login_button.addEventListener('mouseleave', () => {
    login_button.style.backgroundColor = '#f5c2e0';
    login_button.style.color = 'black';
    login_button.style.transform = 'scale(1)';

    document.querySelector('form').style.backgroundColor = '#fcee54';

    document.querySelector('#email').classList.remove('white_placeholder');
    document.querySelector('#password').classList.remove('white_placeholder');

    document.querySelectorAll('input').forEach(input => {
        input.style.backgroundColor = 'white';
        input.style.color = 'black';
        input.style.transform = 'scale(1)';
    });
});

document.querySelector('#container').querySelector(".login").addEventListener('click', event => {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const pass = document.querySelector('#password').value;

    if (email && pass) {

        chrome.runtime.sendMessage({ message: "login", payload: { email, pass } }, function (response) {
            console.log('girdi');
            console.log(response);
            if (response === "success") {
                console.log('sign in  success');
               window.location.replace('./popup-sign-out.html')
            }
        });
    } else {
        document.querySelector('#email').placeholder = "Enter an email.";
        document.querySelector('#password').placeholder = "Enter a password.";
        document.querySelector('#email').style.backgroundColor = 'red';
        document.querySelector('#password').style.backgroundColor = 'red';
        document.querySelector('#email').classList.add('white_placeholder');
        document.querySelector('#password').classList.add('white_placeholder');
    }
});

document.querySelector('#container').querySelector(".register").addEventListener('click',function () {
    window.location.replace('./popup-register.html')
})