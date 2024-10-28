import { TestBed } from '@angular/core/testing';
import {GameManagementClientService} from "../../../../app/engine/service/game-management/game-management-client.service";
import {HttpClient, provideHttpClient, withFetch} from "@angular/common/http";
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";



describe('GameManagementClientService', () => {
  let gameManagementClientService: GameManagementClientService;
    let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withFetch(),
        ),
        provideHttpClientTesting(),
      ],
    });
    gameManagementClientService = TestBed.inject(GameManagementClientService);
        httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(gameManagementClientService).toBeTruthy();
  });
});
