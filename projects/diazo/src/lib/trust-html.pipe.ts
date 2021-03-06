import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * @internal
 * @hidden
 */
@Pipe({
    name: 'trustHtml'
})
export class TrustHtmlPipe {
    constructor(
        private sanitizer : DomSanitizer
    ) {

    }
    
    transform(value) {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
}