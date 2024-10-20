import { TestBed } from '@angular/core/testing';

import { AuthService } from '../../../../app/engine/service/auth/auth.service';
import {
  CognitoClientService,
  CognitoJwtPayload,
} from '../../../../app/engine/service/auth/cognito-client.service';
import { LocalStorageService } from '../../../../app/engine/service/local-storage.service';
import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';
import { LocalStorageKey } from '../../../../app/engine/constant/local-storage';
import { PlayerAuthData } from '../../../../app/engine/model/player.model';

describe('LoginService', () => {
  let authService: AuthService;
  let mockCognitoClientService: jasmine.SpyObj<CognitoClientService>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let testAuthResultType: AuthenticationResultType;
  let testJwt: CognitoJwtPayload;
  let testPlayerAuthData: PlayerAuthData;

  beforeEach(() => {
    mockCognitoClientService = jasmine.createSpyObj('CognitoClientService', [
      'decodeJwtToken',
      'login',
    ]);
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', [
      'setStorageKey',
      'deletedStorageKey',
      'getStorageKey',
    ]);

    testAuthResultType = {
      AccessToken:
        'eyJraWQiOiJ1MDJOR1JDcjd5Qlh2emRZTFY4MFFRSitlWUVcL0ZvSmxjWjhUa2txNjJ3MD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0MTBiOTUyMC1kMDkxLTcwZTYtYmU3OS1lNjQ2MDJlNTc2NTkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9YQ0h1OVdQNGQiLCJjbGllbnRfaWQiOiIzODFpdGYybDNndmRtdGRwcW5ybGRvcWhqbiIsIm9yaWdpbl9qdGkiOiIwNTRkZjg3OS03ZjgwLTQ3ZTgtYjAxNi1mOWMyOTA1MmY2ZWYiLCJldmVudF9pZCI6ImZlOWYwZDc3LWM0N2EtNGMwNS05OThlLTFmMWVjMjhhYTk0NCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MjkzNjM3NDYsImV4cCI6MTcyOTM2NzM0NiwiaWF0IjoxNzI5MzYzNzQ2LCJqdGkiOiIzMzRkOTYwMy1hZjY3LTRmZTQtODQyNS1jNjEzMGE1ZjMzMzYiLCJ1c2VybmFtZSI6ImpqazMifQ.MopqGTrcAhMh7j39BHMaiTp7IITOIqDRZE_D4vmD-aCBbASDBfy8LDErwbTwo9IalPXJv4lD_6IB165zGZIjQPJxXP55qCiWZa6M1AlEvUY0GF7U3vz_SPS8fQcRW8PWGMRTc-qGhd3OoOyKAYXiiul8sD1yR9KoXOFIyQFdiyeIO78DaZsb5yhZqjBzkez83dJrTiNZVCfikUR3kAA9V6HKZU-FQcO0beLG7Ai9cmuxlDiOlNr-nWIIkftWtJp20mF_FU7duuRM7h2EXy-e23TJS04OiVy1QCl8W7N70yGMhr4kcq_1gueiTIYNw2Tk6VQeoEUfiXANS1p1MFXHqA',
      ExpiresIn: 3600,
      IdToken:
        'eyJraWQiOiJkS01kT0xqS21KVUVab3h5M2lubUFjaG9zcmQybm9IYUU5SkdoS2xsejI4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0MTBiOTUyMC1kMDkxLTcwZTYtYmU3OS1lNjQ2MDJlNTc2NTkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfWENIdTlXUDRkIiwiY29nbml0bzp1c2VybmFtZSI6ImpqazMiLCJvcmlnaW5fanRpIjoiMDU0ZGY4NzktN2Y4MC00N2U4LWIwMTYtZjljMjkwNTJmNmVmIiwiYXVkIjoiMzgxaXRmMmwzZ3ZkbXRkcHFucmxkb3Foam4iLCJldmVudF9pZCI6ImZlOWYwZDc3LWM0N2EtNGMwNS05OThlLTFmMWVjMjhhYTk0NCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzI5MzYzNzQ2LCJleHAiOjE3MjkzNjczNDYsImlhdCI6MTcyOTM2Mzc0NiwianRpIjoiYjY4OWQ1YWMtZDgxMC00MGNlLTgzOWYtZDU1MDVmNjUzNGQ1IiwiZW1haWwiOiJqb2VAamprMy5jb20ifQ.rW912-vadbB7x1kxEd2J_IEnWR7szROdT7W3rksBw7iaxRW7QAu7U_XC3HeIBDhesoNe35FaJlLyxVuYI-JQdmZCojrcd3RzWDjtyqb8gnzXtkxFcuKq967RW5THuRKEKFPa0FzY-pz1pP4Boauf06pfiiRk2Xb2i6bArG8u2457kWyOufeJImLXX9U3qCbi5XrpmaIWj9vAgQKhcJ_DXg2_tQ77F6gsRZHrCNttmi8Avab_KcZIc6-eBJSdlwOfMxCR3JCdjsasAdMICQ0dBIQ15gtflC8D4HMfge7G4UOp_RhVYQmX1cIyTec-hGTCBOOZVvegdNzuNCpRRo0Itg',
      RefreshToken:
        'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.0oXUqBmBnoDqsm1PiAQ4fYtoGhhUoGDyoAISq8BdBRG5Zh6v3g65XSLS51_PaIGt0XMoJsvp9kuh7h7WvaqHmHZ97i30CNFL3xjD99V1v8vvny8Msb-S9n1RDSo5_66SaOOGfYxvGpfWOSYSVPnLcq5kAT0SRySklssxEuZaXJ6-QPxej2iXcJKOKZ4YstXSCiJCuvL8V3bOebguEnzFMeKdT4k1jUCe5midJNkz-NUYR8acoZZSX5Lm7gPu-O-LLFTEBIMof0XVw10-sHkkgYq4S3K-rjZcUe6qG7fXbP1u0UZ37SUgkm3YNNJEC2UhepXzneOMHbC6dXU3Did_Eg.TF6RiamWrdwARsdT.Z2DWMoEvTKjmzyjAxoMkl5kCpsugRBPYt6I1Qrp6jRd8gV4Jhtt3okTCb7fDcaKphWQ8YMZeFKtLkwDLA60wc5NLtgYHmRnHHuhMlpWKVBUGBV3c0WSXeG9Er51Gt6wDwCN_5_Rb3zz_0DIJaZk9ubjdDYLdaoICGvM4vhs3euHgv5-_qupDcg4iZrwBTsTnhplPIEF2216IikABBv7qfgJ1mLMtGNbBD-sKSaM-pfqyYXL9PMVWZ6y64neWVXBELUwOE0LEn8SKAMg477yK0Iz8qb4biIsutDx8-gc58OZuCILa3HYJTv5AUuLsNMkMw91NIHwE3bvDKMrn6aoIAVclBeWbB1VMGFCtiNWwZq8N_U1N63CmQv4QU5xqi9c5mnQbVI_hTrXBLGwwbDkR8Q1teXJnA4exaI2hoILaSW4e9bmzOO82GldMIxAlhD8dO48pj-mOtYL4cPIPlnc7_O4f-eaChRjxehDe1_KIVw4vLnzdYIy4V9DBWF0AzSN_XLIQYWpLlJBFquO7to67O20_OCkhxRkXL-xX9eJW4vFD3D6rzHVCVPagGPNNQoY8qHf98dtBM4vWV4Q4SXHZq1fVL70JdJrphShD9mOiNS1sm1yJNUycNT18nmEMav4deajJbZmFUhpiLz6nHzOIWIJKGUi0gdF5aftmqiWA9OGX4yagHMb7LGJFiL-e7RevOrJbhC7_lBFUhOoRogPdUtQ8tPOsezg5N6fwGWHr2JejoqMtgb64ZgOzcXv5bHLZxOewHpRxFwpHGujs9ofbeHpp2o0bgtetW3Yd7-1l3g0D88W50-_pGhcHSP-_wBuWnDaJY5AzaCzAQRwZ3cDxIZOmKJM0eE_hoVwmYgm_LAW5NojF6MYaQppuKgXesT_Cu3JOPkNgO7ZgUJOU9VzZe9WOTUcbuEZkcff1AWf4ZbN6ByWp7oDfeDBOCyRQ7CFb4SfM6B2ne8Xxdqb3Hka8X6O5uEIM3ijzGYyXVjp9bnEJzoM3fJi32ebZIchRjEdVs2ULru6SXp2Fe58OJsi6FFGUQ9VNa_0VWjmIQ0Z5E8WxwrNRsfWtUp1CPayYRxsHvU3mk6Me-we8E-dS3Eq7VJgt_qc2riXIKkfaERDn8HNf3uzKLIh5OOe0aIVtIGdc3_zYhPdDMAzY6mWpoYAFPb9V5YW759_MRVq0SPsWYu-dQy3Zsd9tP7fjQ47SaUekWxGzT5MYWYMewFHMrnSsm9nTjCV_iwVL9MiNU_I2-2R2GGHE7I1nfqoEJnsYj3r7nw.w_NfUX74p577KXwVpRLG6g',
      TokenType: 'Bearer',
    };
    testJwt = {
      sub: '410b9520-d091-70e6-be79-e64602e57659',
      iss: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_XCHu9WP4d',
      client_id: '381itf2l3gvdmtdpqnrldoqhjn',
      origin_jti: '054df879-7f80-47e8-b016-f9c29052f6ef',
      event_id: 'fe9f0d77-c47a-4c05-998e-1f1ec28aa944',
      token_use: 'access',
      scope: 'aws.cognito.signin.user.admin',
      auth_time: 1729363746,
      exp: 1729367346,
      iat: 1729363746,
      jti: '334d9603-af67-4fe4-8425-c6130a5f3336',
      username: 'jjk3',
    };
    testPlayerAuthData = {
      id: 'jjk3',
      accessToken:
        'eyJraWQiOiJ1MDJOR1JDcjd5Qlh2emRZTFY4MFFRSitlWUVcL0ZvSmxjWjhUa2txNjJ3MD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0MTBiOTUyMC1kMDkxLTcwZTYtYmU3OS1lNjQ2MDJlNTc2NTkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9YQ0h1OVdQNGQiLCJjbGllbnRfaWQiOiIzODFpdGYybDNndmRtdGRwcW5ybGRvcWhqbiIsIm9yaWdpbl9qdGkiOiIwNTRkZjg3OS03ZjgwLTQ3ZTgtYjAxNi1mOWMyOTA1MmY2ZWYiLCJldmVudF9pZCI6ImZlOWYwZDc3LWM0N2EtNGMwNS05OThlLTFmMWVjMjhhYTk0NCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MjkzNjM3NDYsImV4cCI6MTcyOTM2NzM0NiwiaWF0IjoxNzI5MzYzNzQ2LCJqdGkiOiIzMzRkOTYwMy1hZjY3LTRmZTQtODQyNS1jNjEzMGE1ZjMzMzYiLCJ1c2VybmFtZSI6ImpqazMifQ.MopqGTrcAhMh7j39BHMaiTp7IITOIqDRZE_D4vmD-aCBbASDBfy8LDErwbTwo9IalPXJv4lD_6IB165zGZIjQPJxXP55qCiWZa6M1AlEvUY0GF7U3vz_SPS8fQcRW8PWGMRTc-qGhd3OoOyKAYXiiul8sD1yR9KoXOFIyQFdiyeIO78DaZsb5yhZqjBzkez83dJrTiNZVCfikUR3kAA9V6HKZU-FQcO0beLG7Ai9cmuxlDiOlNr-nWIIkftWtJp20mF_FU7duuRM7h2EXy-e23TJS04OiVy1QCl8W7N70yGMhr4kcq_1gueiTIYNw2Tk6VQeoEUfiXANS1p1MFXHqA',
      accessTokenExpire: 1729367346,
      refreshToken:
        'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.0oXUqBmBnoDqsm1PiAQ4fYtoGhhUoGDyoAISq8BdBRG5Zh6v3g65XSLS51_PaIGt0XMoJsvp9kuh7h7WvaqHmHZ97i30CNFL3xjD99V1v8vvny8Msb-S9n1RDSo5_66SaOOGfYxvGpfWOSYSVPnLcq5kAT0SRySklssxEuZaXJ6-QPxej2iXcJKOKZ4YstXSCiJCuvL8V3bOebguEnzFMeKdT4k1jUCe5midJNkz-NUYR8acoZZSX5Lm7gPu-O-LLFTEBIMof0XVw10-sHkkgYq4S3K-rjZcUe6qG7fXbP1u0UZ37SUgkm3YNNJEC2UhepXzneOMHbC6dXU3Did_Eg.TF6RiamWrdwARsdT.Z2DWMoEvTKjmzyjAxoMkl5kCpsugRBPYt6I1Qrp6jRd8gV4Jhtt3okTCb7fDcaKphWQ8YMZeFKtLkwDLA60wc5NLtgYHmRnHHuhMlpWKVBUGBV3c0WSXeG9Er51Gt6wDwCN_5_Rb3zz_0DIJaZk9ubjdDYLdaoICGvM4vhs3euHgv5-_qupDcg4iZrwBTsTnhplPIEF2216IikABBv7qfgJ1mLMtGNbBD-sKSaM-pfqyYXL9PMVWZ6y64neWVXBELUwOE0LEn8SKAMg477yK0Iz8qb4biIsutDx8-gc58OZuCILa3HYJTv5AUuLsNMkMw91NIHwE3bvDKMrn6aoIAVclBeWbB1VMGFCtiNWwZq8N_U1N63CmQv4QU5xqi9c5mnQbVI_hTrXBLGwwbDkR8Q1teXJnA4exaI2hoILaSW4e9bmzOO82GldMIxAlhD8dO48pj-mOtYL4cPIPlnc7_O4f-eaChRjxehDe1_KIVw4vLnzdYIy4V9DBWF0AzSN_XLIQYWpLlJBFquO7to67O20_OCkhxRkXL-xX9eJW4vFD3D6rzHVCVPagGPNNQoY8qHf98dtBM4vWV4Q4SXHZq1fVL70JdJrphShD9mOiNS1sm1yJNUycNT18nmEMav4deajJbZmFUhpiLz6nHzOIWIJKGUi0gdF5aftmqiWA9OGX4yagHMb7LGJFiL-e7RevOrJbhC7_lBFUhOoRogPdUtQ8tPOsezg5N6fwGWHr2JejoqMtgb64ZgOzcXv5bHLZxOewHpRxFwpHGujs9ofbeHpp2o0bgtetW3Yd7-1l3g0D88W50-_pGhcHSP-_wBuWnDaJY5AzaCzAQRwZ3cDxIZOmKJM0eE_hoVwmYgm_LAW5NojF6MYaQppuKgXesT_Cu3JOPkNgO7ZgUJOU9VzZe9WOTUcbuEZkcff1AWf4ZbN6ByWp7oDfeDBOCyRQ7CFb4SfM6B2ne8Xxdqb3Hka8X6O5uEIM3ijzGYyXVjp9bnEJzoM3fJi32ebZIchRjEdVs2ULru6SXp2Fe58OJsi6FFGUQ9VNa_0VWjmIQ0Z5E8WxwrNRsfWtUp1CPayYRxsHvU3mk6Me-we8E-dS3Eq7VJgt_qc2riXIKkfaERDn8HNf3uzKLIh5OOe0aIVtIGdc3_zYhPdDMAzY6mWpoYAFPb9V5YW759_MRVq0SPsWYu-dQy3Zsd9tP7fjQ47SaUekWxGzT5MYWYMewFHMrnSsm9nTjCV_iwVL9MiNU_I2-2R2GGHE7I1nfqoEJnsYj3r7nw.w_NfUX74p577KXwVpRLG6g',
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: CognitoClientService, useValue: mockCognitoClientService },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
      ],
    });
    authService = TestBed.inject(AuthService);
  });

  describe('login', () => {
    it('should return true when auth successful', async () => {
      mockCognitoClientService.login.and.returnValue(Promise.resolve(testAuthResultType));
      mockCognitoClientService.decodeJwtToken.and.returnValue(testJwt);

      const result = await authService.login('username', 'password');
      expect(result).toBeTrue();
    });
    it('should write to local storage when auth successful', async () => {
      mockCognitoClientService.login.and.returnValue(Promise.resolve(testAuthResultType));
      mockCognitoClientService.decodeJwtToken.and.returnValue(testJwt);

      void (await authService.login('username', 'password'));
      expect(mockLocalStorageService.setStorageKey).toHaveBeenCalledWith(
        LocalStorageKey.PLAYER_AUTH_DATA,
        JSON.stringify(testPlayerAuthData),
      );
    });
    it('should return false when auth failed', async () => {
      mockCognitoClientService.login.and.returnValue(Promise.resolve(null));
      const result = await authService.login('username', 'password');
      expect(result).toBeFalse();
    });
    it('should not write to local storage when auth failed', async () => {
      mockCognitoClientService.login.and.returnValue(Promise.resolve(null));

      void (await authService.login('username', 'password'));
      expect(mockLocalStorageService.setStorageKey).not.toHaveBeenCalled();
    });
  });
  describe('isLoggedIn', () => {
    it('should return true when valid auth in local storage', () => {
      mockLocalStorageService.getStorageKey.and.returnValue(JSON.stringify(testPlayerAuthData));
      spyOn(Date, 'now').and.returnValue(1729367000000);
      expect(authService.isLoggedIn).toBeTrue();
    });
    it('should return true when auth not in local storage', () => {
      mockLocalStorageService.getStorageKey.and.returnValue(null);
      expect(authService.isLoggedIn).toBeFalse();
    });
    it('should return true when auth expired', () => {
      mockLocalStorageService.getStorageKey.and.returnValue(JSON.stringify(testPlayerAuthData));
      spyOn(Date, 'now').and.returnValue(1729368000000);
      expect(authService.isLoggedIn).toBeFalse();
    });
  });
});
