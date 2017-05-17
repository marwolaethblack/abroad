import FbConfig from '../../../../auth/config/fb';


export const fbPromises = {
    init: () => {
        return new Promise((resolve, reject) => {
            if (typeof window.FB !== 'undefined') {
                resolve();
            } else {
                window.fbAsyncInit = () => {
                    window.FB.init({
                        appId      : FbConfig.appID,
                        cookie     : true, 
                        xfbml      : true,  
                        version    : 'v2.5'
                    });
                    resolve();
                };
                (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s); js.id = id;
                    js.src = "//connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            }
        });
    },
    checkLoginState: () => {
        return new Promise((resolve, reject) => {
            window.FB.getLoginStatus((response) => {
                response.status === 'connected' ? resolve(response) : reject(response);
            });
        });
    },
    login: () => {
        return new Promise((resolve, reject) => {
            window.FB.login((response) => {
                response.status === 'connected' ? resolve(response) : reject(response);
            });
        });
    },
    logout: () => {
        return new Promise((resolve, reject) => {
            window.FB.logout((response) => {
                response.authResponse ? resolve(response) : reject(response);
            });
        });
    },
    fetch: () => {
        return new Promise((resolve, reject) => {
            window.FB.api(
                '/me', 
                {fields: 'first_name, last_name, gender'},
                response => response.error ? reject(response) : resolve(response)
            );
        });
    }
}