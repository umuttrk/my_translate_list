let user_signed_in = false;
function change_user_status(signIn, userInfo) {
    if (signIn) {
        //fetch the localhost:300/login
        return fetch('http://localhost:3000/login', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(`${userInfo.email}:${userInfo.pass}`)
            },
        }).then(res => {
            return new Promise(resolve => {
                if (res !== 200) resolve('fail');
                chrome.storage.local.set({ userStatus: signIn, userInfo }, function (response) {
                    if (chrome.runtime.lastError) resolve('fail');
                    user_signed_in = true;
                    resolve('success');
                });
            });
        }).catch(err => console.log(err));
    } else {  
        //fetch the local host:300/logout
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "login") {
        change_user_status(true, request.payload)
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
        return true;
    } else if (request.message === "logout") {

    } else if (request.message === "userStatus") {

    }
});