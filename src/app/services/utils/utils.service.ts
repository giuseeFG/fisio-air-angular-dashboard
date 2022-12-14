import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {ToastPosition} from '../../extras/toast-position.enum';
import moment from 'moment';
import {environment} from '../../../environments/environment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

declare var require;
const Swal = require('sweetalert2');

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    defaultPause = 270;

    quality = {
        1: 'pessimo',
        2: 'male',
        3: 'medio',
        4: 'bene',
        5: 'ottimo'
    };

    constructor(
        private toastr: ToastrService,
        private location: Location
    ) {
    }

    loaderActive = false;

    static trimAllFields(object) {
        if (!object) {
            return object;
        }
        const data = {...object};
        for (const key in data) {
            if (typeof data[key] === 'string') {
                data[key] = data[key].trim();
            }
        }
        return data;
    }

    async showError(key = 'C\'è stato un errore') {
        this.toastr.error(
            key,
            'Errore',
            {
                closeButton: true,
                positionClass: ToastPosition.topCenter,
                timeOut: 4000,
                progressBar: true,
                tapToDismiss: true
            }
        );
    }

    async showMessage(message, title = 'OK', timeOut = 4000) {
        this.toastr.success(
            message,
            title,
            {
                closeButton: true,
                positionClass: ToastPosition.topCenter,
                timeOut,
                progressBar: true,
                tapToDismiss: true
            }
        );
    }

    async showInfo(message, title) {
        this.toastr.info(
            message, title,
            {
                closeButton: true,
                positionClass: ToastPosition.topCenter,
                timeOut: 4000,
                progressBar: false,
                tapToDismiss: true
            }
        );
    }

    showCheckNewOrder(openOrders) {
        const options = {
            closeButton: true,
            positionClass: ToastPosition.topCenter,
            timeOut: 4000,
            progressBar: false,
            tapToDismiss: true
        };
        const title = 'Controllo nuovi ordini...';
        let message = 'Ci sono ' + openOrders + ' ordini aperti';
        if (openOrders === 1) {
            message = 'C\'è un ordine da evadere';
        }
        if (openOrders === 0) {
            this.toastr.success(
                'Nessun ordine da evadere',
                title,
                options
            );
        } else {
            this.toastr.warning(
                message,
                title,
                options
            );
        }
    }

    getCDNPath(data) {
        // if (!data) {
        //     return null;
        // }
        // if (data.includes('platform-lookaside') ||
        //     data.includes('firebasestorage') ||
        //     data.includes('user_placeholder') ||
        //     data.includes('googleusercontent')) {
        //     return data;
        // }
        // return environment.basePathCDN + '/' + data //+ '?response-content-type=image/png';
        return data;
    }

    numberOnlyValidation(event) {
        const pattern1 = /[0-9.,]/;
        const inputChar = String.fromCharCode(event.charCode);
        if (inputChar === ' ') {
            event.preventDefault();
        } else if (!pattern1.test(inputChar)) {
            event.preventDefault();
        }
    }

    noWhiteSpacesValidation(event) {
        const inputChar = String.fromCharCode(event.charCode);
        if (inputChar === ' ') {
            event.preventDefault();
        }
    }

    noWhiteSpacesAndNumberValidation(event) {
        const inputChar = String.fromCharCode(event.charCode);
        if (inputChar === ' ') {
            event.preventDefault();
        }
        const pattern1 = /[0-9.,]/;
        if (inputChar === ' ') {
            event.preventDefault();
        } else if (!pattern1.test(inputChar)) {
            event.preventDefault();
        }
    }

    parseDate(date, format?) {
        if (date) {
            return moment(date).format(format ? format : 'lll');
        }
    }

    searchFunction(arr, searchKey) {
        searchKey = searchKey.trim().toLowerCase();
        return arr.filter(function (obj) {
            return Object.keys(obj).some(function (key) {
                if (!key) {
                    return false;
                }
                if (obj.first_name && obj.last_name) {
                    if (
                        (obj.first_name + ' ' + obj.last_name).toLowerCase().trim().includes(searchKey) ||
                        (obj.last_name + ' ' + obj.first_name).toLowerCase().trim().includes(searchKey)
                    ) {
                        return true;
                    }
                }
                if (typeof obj[key] === 'string') {
                    return obj[key].toLowerCase().includes(searchKey);
                }
                if (typeof obj[key] === 'object') {
                    return JSON.stringify(obj[key]).toLowerCase().includes(searchKey);
                }
            });
        });
    }

    normalizeFileName(item) {
        try {
            const extension = item.file.name.split('.').pop();
            let fileName = item.file.name.substring(0, item.file.name.lastIndexOf('.'));
            fileName = fileName + '.' + extension.toLowerCase();
            return fileName.replace(/  +/g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        } catch (e) {
            return item.file.name;
        }
    }

    onWhenAddingFileFailed(item, filter, maxFileSize, queueLimit) {
        switch (filter.name) {
            case 'fileType':
            case 'mimeType':
                return `Il tipo ${item.type} non è ammesso.`;
            case 'queueLimit':
                if (!queueLimit) {
                    return `Errore sconosciuto (${filter.name}).`;
                }
                if (queueLimit > 1) {
                    return `Sono ammessi al massimo ${queueLimit} documenti in coda.`;
                }
                return `È ammesso solo un documento in coda.`;
            case 'fileSize':
                return `Il file supera la grandezza massima di ${maxFileSize}.`;
            default:
                return `Errore sconosciuto (${filter.name}).`;
        }
    }

    convertToSlug(name, extension) {
        if (name) {
            return name
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '') + '.' + extension;
            // Ho aggiuto extension poiché non veniva passata e la stringa del filename veniva importata male
        }
        return null;
    }

    convertToSlug2(text) {
        const from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;';
        const to = 'aaaaaeeeeeiiiiooooouuuunc______';

        const newText = text.trim().split('').map(
            (letter, i) => letter.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i)));

        return newText
            .toString()                     // Cast to string
            .toLowerCase()                  // Convert the string to lowercase letters
            .trim()                         // Remove whitespace from both sides of a string
            .replace(/\s+/g, '_')           // Replace spaces with -
            // .replace(/&/g, '-y-')           // Replace & with 'and'
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '_');        // Replace multiple - with single -

    }

    async exportTotalPDF(pages, filename) {
        const pdf = new jsPDF('p', 'mm', 'a4');
        // tslint:disable-next-line:forin
        for (const index in pages) {
            const page = pages[index];
            pdf.addImage(page, 'PNG', 0, 0, 210, 297, '', 'SLOW');
            if (Number(index) !== pages.length - 1) {
                pdf.addPage();
            }
        }
        // pdf.save(filename + '.pdf');

        return pdf.output();
    }

    async exportSinglePage(data: HTMLElement) {
        return await html2canvas(data, {
            scale: 3
        }).then(canvas => {
            return canvas.toDataURL('image/png');
        });
    }

    getWorkingTime(item, toView = false) {
        if (!item.started_at || !item.ended_at) {
            return null;
        }
        const momentStart = moment(item.started_at).startOf('minute').startOf('seconds');
        const momentEnd = moment(item.ended_at).startOf('minute').startOf('seconds');
        let minutes;
        if (Math.abs(momentStart.diff(momentEnd, 'minutes')) - (item.pause || 30) >= this.defaultPause) {
            minutes = Math.abs(momentStart.diff(momentEnd, 'minutes')) - (item.pause || 30);
        } else {
            minutes = Math.abs(momentStart.diff(momentEnd, 'minutes'));
        }
        if (toView) {
            return this.getTimeFromMins(minutes);
        }
        return minutes;
    }

    // getPause(start, end, pause = 30) {
    //     if (!start || !end) {
    //         return '';
    //     }
    //     if (this.getWorkingTime(start, end, pause) >= 270) {
    //         return this.getTimeFromMins(pause);
    //     } else {
    //         return '';
    //     }
    // }

    getTimeFromMins(mins) {
        const h = mins / 60 | 0;
        const m = mins % 60 | 0;
        return h + 'h ' + m + 'm';
    }

    getPause(item) {
        if (item.started_at && item.ended_at) {
            if (Math.abs(moment(item.started_at).diff(moment(item.ended_at), 'minutes')) >= this.defaultPause) {
                return item.pause || 30 + 'min';
            } else {
                return '-';
            }
        } else {
            return '-';
        }
    }

    calculateDifference(item) {
        if (item.session && item.session.started_at && item.session.ended_at) {
            let pause = 30;
            if (item.session.pause) {
                pause = parseInt(item.session.pause, 10);
            }
            if (Math.abs(moment(item.session.started_at).diff(moment(item.session.ended_at), 'minutes')) > pause) {
                const minutes = Math.abs(moment(item.session.started_at).diff(moment(item.session.ended_at).subtract(pause, 'minutes'), 'minutes'));
                return this.getTimeFromMins(minutes);
            } else {
                const minutes = Math.abs(moment(item.session.started_at).diff(moment(item.session.ended_at), 'minutes'));
                return this.getTimeFromMins(minutes);
            }
        } else {
            return '-';
        }
    }

    parseProductType(type) {
        if (!type) {
            return '';
        }
        switch (type) {
            case 'mystery':
                return 'Mystery Box';
            case 'all-in':
                return 'All-IN Box';
            default:
                return 'Prodotto singolo';
        }
    }

    getTimeFromNow(date) {
        if (!date) {
            return null;
        }
        return moment(date).fromNow();
    }

    goBack() {
        this.location.back();
    }

    openBrowser(url) {
        window.open(url, '_blank');
    }

    showSwalMessage(title, message, type = 'success') {
        Swal.fire(
            title,
            message,
            type
        );
    }
}
