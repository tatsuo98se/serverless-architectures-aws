var userController = {
    data: {
        auth0Lock: null,
        config: null
    },
    uiElements: {
        loginButton: null,
        logoutButton: null,
        profileButton: null,
        profileNameLabel: null,
        profileImage: null,
        uploadButton: null
    },
    init: function (config) {
        var that = this;

        this.uiElements.loginButton = $('#auth0-login');
        this.uiElements.logoutButton = $('#auth0-logout');
        this.uiElements.profileButton = $('#user-profile');
        this.uiElements.profileNameLabel = $('#profilename');
        this.uiElements.profileImage = $('#profilepicture');
        this.uiElements.uploadButton = $('#upload-video-button');

        this.data.config = config;
        // v9
        // this.data.auth0Lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain);
        var option = {
            popup: true,
            auth: {
                responseType: 'token id_token',
                params: {
                    scope: 'openid email user_metadata picture'
                }
            }
        };
        this.data.auth0Lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain, option);
        this.data.auth0Lock.on('authenticated', function (authResult) {
            console.log("debug");

            localStorage.setItem('userToken', authResult.idToken);
            localStorage.setItem('accessToken', authResult.accessToken);
            that.configureAuthenticatedRequests();

            that.data.auth0Lock.getUserInfo(localStorage.getItem('accessToken'), function (err, userInfo) {
                if (!err) {
                    console.log("can get user info");
                    that.showUserAuthenticationDetails(userInfo);
                } else {
                    console.log("cannot get user info");
                }
            });
        });

        var accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            this.configureAuthenticatedRequests();
            this.data.auth0Lock.getUserInfo(accessToken, function (err, userInfo) {
                if (err) {
                    return alert('There was an error getting the profile: ' + err.message);
                }
                that.showUserAuthenticationDetails(userInfo);
            });
        }

        this.wireEvents();
    },
    configureAuthenticatedRequests: function () {
        $.ajaxSetup({
            'beforeSend': function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken')); // original code
            }
        });
    },
    showUserAuthenticationDetails: function (profile) {
        var showAuthenticationElements = !!profile;

        if (showAuthenticationElements) {
            // auth0 lock cannot get nickname profile pic when we run applications on localhost. https://auth0.com/docs/libraries/lock/v11/sending-authentication-parameters
            // auth0 lockでは、localhost実行の間は、ニックネームとユーザーアイコンの取得は404になる
            this.uiElements.profileNameLabel.text(profile.email);
            this.uiElements.profileImage.attr('src', profile.picture);
            this.uiElements.uploadButton.css('display', 'inline-block');
        }

        this.uiElements.loginButton.toggle(!showAuthenticationElements);
        this.uiElements.logoutButton.toggle(showAuthenticationElements);
        this.uiElements.profileButton.toggle(showAuthenticationElements);
    },
    wireEvents: function () {
        var that = this;

        this.uiElements.loginButton.click(function (e) {
            that.data.auth0Lock.show();
        });

        this.uiElements.logoutButton.click(function (e) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('accessToken');

            that.uiElements.logoutButton.hide();
            that.uiElements.profileButton.hide();
            that.uiElements.uploadButton.hide();
            that.uiElements.loginButton.show();
        });
        this.uiElements.profileButton.click(function (e) {
            var url = that.data.config.apiBaseUrl + '/user-profile?token=' + localStorage.getItem('accessToken');
//            var url = that.data.config.apiBaseUrl + '/user-profile';

            $.get(url, function (data, status) {
                $('#user-profile-raw-json').text(JSON.stringify(data, null, 2));
                $('#user-profile-modal').modal();
            })
        });
    }
}
