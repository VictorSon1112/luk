import { WebPlugin } from '@capacitor/core';
export class FacebookLoginWeb extends WebPlugin {
    constructor() {
        super({
            name: 'FacebookLogin',
            platforms: ['web'],
        });
    }
    async login(options) {
        console.log('FacebookLoginWeb.login', options);
        return new Promise((resolve, reject) => {
            FB.login(response => {
                console.debug('FB.login', response);
                if (response.status === 'connected') {
                    resolve({
                        accessToken: {
                            token: response.authResponse.accessToken,
                        },
                    });
                }
                else {
                    reject({
                        accessToken: {
                            token: null,
                        },
                    });
                }
            }, { scope: options.permissions.join(',') });
        });
    }
    async logout() {
        return new Promise(resolve => {
            FB.logout(() => resolve());
        });
    }
    async getCurrentAccessToken() {
        return new Promise((resolve, reject) => {
            FB.getLoginStatus(response => {
                if (response.status === 'connected') {
                    const result = {
                        accessToken: {
                            applicationId: undefined,
                            declinedPermissions: [],
                            expires: undefined,
                            isExpired: undefined,
                            lastRefresh: undefined,
                            permissions: [],
                            token: response.authResponse.accessToken,
                            userId: response.authResponse.userID,
                        },
                    };
                    resolve(result);
                }
                else {
                    reject({
                        accessToken: {
                            token: null,
                        },
                    });
                }
            });
        });
    }
    async getProfile(options) {
        const fields = options.fields.join(',');
        return new Promise((resolve, reject) => {
            FB.api('/me', { fields }, response => {
                if (response.error) {
                    reject(response.error.message);
                    return;
                }
                resolve(response);
            });
        });
    }
}
//# sourceMappingURL=web.js.map