import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {LoginService} from './services/login/login.service';
import {UtilsService} from './services/utils/utils.service';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

    constructor(
        private loginService: LoginService,
        private utilsService: UtilsService,
        private router: Router
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // req = req.clone({url: this.config.baseURLApi + req.url});
        if (!req.url.includes('vimeo')) {
            if (req.url.indexOf('/auth/register') > -1) {
                console.log('register');
                req = req.clone({
                    headers: req.headers.set('x-registration-key', 'asidw27ha1!')
                });
            }
            req = req.clone({
                headers: req.headers.set('x-hasura-admin-secret', 'ypxo8CN93eqe013kjTIisoG5t928BnvAes4Xi4ijpgumKA7be2mUhZD3KfiFp2ia')
            });
        }
        return next.handle(req).pipe(tap(() => {
                },
                async (event: any) => {
                    this.utilsService.loaderActive = false;
                    if (event instanceof HttpErrorResponse) {
                        switch (event.status) {
                            case 401:
                            case 499:
                                localStorage.clear();
                                this.utilsService.showError('Sessione scaduta, riloggarsi.');
                                this.router.navigateByUrl('login');
                                break;
                        }
                    }
                })
        );
    }
}
