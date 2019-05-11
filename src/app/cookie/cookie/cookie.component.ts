import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
@Component({
  selector: 'app-cookie',
  templateUrl: './cookie.component.html',
  styleUrls: ['./cookie.component.css']
})
export class CookieComponent implements OnInit {
  constructor() {}
  ngOnInit() {
    (() => {
      'use strict';
      $(document).ready(() => {
        /**
         * Set a cookie
         * @param {string} cookieName - name of the cookie
         * @param {string} cookieValue - value of the ame of the cookie
         * @param {string} exDays - expiration days of the cookie
         */
        function setCookie(cookieName, cookieValue, exDays) {
          const date = new Date();
          const daysCounter = exDays * 24 * 60 * 60 * 1000;

          date.setTime(date.getTime() + daysCounter);
          const expires = 'expires=' + date.toUTCString();
          document.cookie = cookieName + '=' + cookieValue + ';' + expires + ';path=/';
        }

        /**
         * Get cookie value by cookie name from browser
         * @param {string} cookieName - name of the cookie
         * @returns {string} name of the cookie or an empty string
         */
        function getCookie(cookieName) {
          const name = cookieName + '=';
          const decodedCookie = decodeURIComponent(document.cookie);
          const cookieArray = decodedCookie.split(';');
          for (const cookie of cookieArray) {
            let cookieItem = cookie;
            while (cookieItem.charAt(0) === ' ') {
              cookieItem = cookieItem.substring(1);
            }
            if (cookieItem.indexOf(name) === 0) {
              return cookieItem.substring(name.length, cookieItem.length);
            }
          }
          return '';
        }

        const cookiesAccepted = getCookie('cookies_accepted');
        if (cookiesAccepted === '') {
          $('.cookie-banner').show();
        }

        $('#accept-cookies').on('click', () => {
          setCookie('cookies_accepted', true, 365);
          $('.cookie-banner').hide();
        });
      });
    })();
  }
}
