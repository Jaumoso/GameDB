import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../shared/user';
import { baseURL } from '../shared/baseurl';
import { Observable, map } from 'rxjs';
import { Game } from '../shared/game';

@Injectable({
    providedIn: 'root'
  })
  export class GameService {
    constructor(private http: HttpClient) { }

    getGames(): Observable<Game[]> {
        return this.http.get<{gameData: Game[]}>(baseURL + 'game')
        .pipe(map(games => games.gameData));
    }

    async getGame(gameId: string): Promise<Game> {
        return new Promise((resolve, reject) => {
            this.http.get<{gameData: Game}>(baseURL + 'game/' + gameId)
            .subscribe(game => {
            resolve(game.gameData);
            }, err => {
            reject(err);
            });
        });
    }

    async createGame(game: Game): Promise<Game> {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          })
        };
        return new Promise((resolve, reject) => {
          this.http.post<{newGame: Game}>(baseURL + 'game/new/', game, httpOptions)
          .subscribe(game => {
            resolve(game.newGame);
          }, err => {
            reject(err);
          });
        });
    }

    updateGame(game: Game): Observable<Game> {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          })
        };
        return this.http.put<{gameData: Game}>(baseURL + 'game/update/' + game._id, game, httpOptions)
        .pipe(map(game => game.gameData));
    }

    deleteGame(gameId: string): Observable<Game> {
        return this.http.delete<{gameData: Game}>(baseURL + 'game/delete/' + gameId)
        .pipe(map(game => game.gameData));
    }
  
    async deleteGames(userId: string): Promise<Game[]> {
        return new Promise((resolve, reject) => {
          this.http.delete<{gameData: Game[]}>(baseURL + 'game/deleteall/' + userId)
          .subscribe(games => {
            resolve(games.gameData);
          }, err => {
            reject(err);
          });
        });
    }

}