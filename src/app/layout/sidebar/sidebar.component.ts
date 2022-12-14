import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Location} from '@angular/common';
import {AppConfig} from '../../app.config';
import {LoginService} from '../../services/login/login.service';
import {UtilsService} from '../../services/utils/utils.service';
// @ts-ignore
import {version} from '../../../../package.json';
import {environment} from '../../../environments/environment';
import {UserRole} from '../../services/user/user.service';
import firebase from "firebase";

declare let jQuery: any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.template.html'
})

export class SidebarComponent implements OnInit, AfterViewInit {
    $el: any;
    config: any;
    configFn: any;
    router: Router;
    location: Location;
    public version: string = version;

    constructor(
        config: AppConfig,
        el: ElementRef,
        router: Router,
        location: Location,
        public loginService: LoginService,
        private utilsService: UtilsService,
    ) {
        this.$el = jQuery(el.nativeElement);
        this.config = config.getConfig();
        this.configFn = config;
        this.router = router;
        this.location = location;
    }

    initSidebarScroll(): void {
        const $sidebarContent = this.$el.find('.js-sidebar-content');
        if (this.$el.find('.slimScrollDiv').length !== 0) {
            $sidebarContent.slimscroll({
                destroy: true
            });
        }
        $sidebarContent.slimscroll({
            height: window.innerHeight,
            size: '4px',
            color: '#e5e7f1',
        });
    }

    changeActiveNavigationItem(location): void {
        const $newActiveLink = this.$el.find('a[href="#' + location.path().split('?')[0] + '"]');

        // collapse .collapse only if new and old active links belong to different .collapse
        if (!$newActiveLink.is('.active > .collapse > li > a')) {
            this.$el.find('.active .active').closest('.collapse').collapse('hide');
        }

        // uncollapse parent
        $newActiveLink.closest('.collapse').addClass('in').css('height', '')
            .siblings('a[data-toggle=collapse]').removeClass('collapsed');
    }

    ngAfterViewInit(): void {
        this.changeActiveNavigationItem(this.location);
    }

    toggleSidebarOverflow($event) {
        jQuery('#sidebar').css('z-index', $event ? '2' : '0');
        jQuery('.js-sidebar-content, .slimScrollDiv').css('overflow', $event ? 'visible' : 'hidden');
    }

    async ngOnInit() {
        jQuery(window).on('sn:resize', this.initSidebarScroll.bind(this));
        this.initSidebarScroll();

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.changeActiveNavigationItem(this.location);
            }
        });
    }

    canSee(page) {
        switch (this.loginService.user?.role) {
            case UserRole.EDITOR:
                switch (page) {
                    case 'pages':
                    case 'menu':
                    case 'media':
                        return true;
                    default:
                        return false;
                }
            case UserRole.ADMIN:
                switch (page) {
                    case 'profile':
                        return false;
                    default:
                        return true;
                }
            case UserRole.BACKOFFICE:
                switch (page) {
                    case 'menu':
                    case 'pages':
                    case 'profile':
                    case 'media':
                        return false;
                }
                return true;
            case UserRole.AGENT:
                switch (page) {
                    case 'offers':
                    case 'profile':
                        return true;
                }
                return false;
        }
        return false;
    }
}
