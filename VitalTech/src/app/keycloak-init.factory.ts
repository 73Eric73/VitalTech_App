import { KeycloakService } from 'keycloak-angular';

export function initKeycloak (keycloak: KeycloakService){
    return () =>
        keycloak.init({
            config: {
                url:'https://login.oscarrovira.com/',
                realm: 'Dream Team',
                clientId: 'Vitaltech',
            },
            initOptions: {
                onLoad: 'check-sso',
                checkLoginIframe: false
            },
            enableBearerInterceptor: true,
            loadUserProfileAtStartUp: true,
            bearerPrefix: 'Bearer',
        });
}