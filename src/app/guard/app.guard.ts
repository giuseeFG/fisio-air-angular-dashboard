import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable()
export class AppGuard implements CanActivate {
    constructor(
        private router: Router
    ) {
    }

    canActivate() {
        const user = localStorage.getItem('fisio_air_user');
        if (!user) {
            this.router.navigate(['login']);
        }
        return !!user;
    }
}
