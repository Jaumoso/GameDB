import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { JwtService } from '../services/jwt.service';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { User } from '../shared/user';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  gameList: any[] = [];
  platforms: any[] = [];
  states: any[] = [];
  private user: User | undefined;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private gameService: GameService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('GameDB_token');

    if (this.jwtService.isTokenExpired(token!)) {
      this.router.navigateByUrl('/home');
      return;
    }

    const decodedToken = this.jwtService.decodeToken(token!);

      this.userService.getUser(decodedToken._id)
      .then((user) => {
        this.user = user;
        this.user.library?.forEach((libraryGame) => {
          this.gameService.getGame(libraryGame.gameId!)
          .then((game) => {

            // Save game in the game List
            this.gameList.push({
              gameId: game._id,
              title: game.title,
              image: game.image,
              genre: game.genre,
              own: libraryGame.own,
              platform: libraryGame.platform,
              rating: libraryGame.rating,
              state: libraryGame.state
            });

            // Save game in platform counter
            const platformIndex = this.platforms.findIndex(item => item.platform === libraryGame.platform);
            if (platformIndex !== -1) {
              this.platforms[platformIndex].counter++;
            } else {
              this.platforms.push({ platform: libraryGame.platform, counter: 1 });
            }

            // TODO: esto está raro
            // Save game in State counter
            const stateIndex = this.platforms.findIndex(item => item.state === libraryGame.state);
            if (stateIndex !== -1) {
              this.states[stateIndex].counter++;
            } else {
              this.states.push({ states: libraryGame.state, counter: 1 });
            }

          });
        })
      })
  }

  addGame() {
    
  }

}
