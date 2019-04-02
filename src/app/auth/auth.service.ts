import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';



@Injectable({ providedIn: 'root' })
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private userID: string;
    private logoutTimer: NodeJS.Timer;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    private saveAuthData(token: string, expirationDate: Date, userID: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userID', userID);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userID');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userID = localStorage.getItem('userID');
        if (!token || !expirationDate) {
            return;
        }
        return { token, expirationDate: new Date(expirationDate), userID };
    }

    private setAuthTimer(duration: number) {
        this.logoutTimer = setTimeout(() => {
            this.logoutUser();
        }, duration * 1000);
    }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getUserID() {
        return this.userID;
    }

    createUser(email: string, password: string) {
        const authData: AuthData = { email, password };
        this.http.post('http://localhost:3000/api/user/signup', authData)
            .subscribe(() => {
                this.router.navigate(['/']);
            }, () => {
                this.authStatusListener.next(false);
            });
    }

    loginUser(email: string, password: string) {
        const authData: AuthData = { email, password };
        this.http.post<{ token: string, expiresIn: number, userID: string }>('http://localhost:3000/api/user/login', authData)
            .subscribe(response => {
                this.token = response.token;
                if (this.token) {
                    this.userID = response.userID;
                    const expiresIn = response.expiresIn;
                    this.setAuthTimer(expiresIn);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresIn * 1000);
                    this.saveAuthData(this.token, expirationDate, this.userID );
                    this.router.navigate(['/']);
                }
            }, () => {
                this.authStatusListener.next(false);
            });
    }

    logoutUser() {
        this.token = null;
        this.userID = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.logoutTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    autoAuthUser() {
        const authData = this.getAuthData();
        if (!authData) {
            return;
        }
        const now = new Date();
        const expiresIn = authData.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authData.token;
            this.userID = authData.userID;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.setAuthTimer(expiresIn / 1000);
        }
    }
}
