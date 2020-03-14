import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap, filter } from 'rxjs/operators';
import { Income } from '../models/Income';
import { Company } from '../models/Company';

// id, name, city and total income
@Injectable({
	providedIn: 'root'
})
export class CompanyService {
	private _endpoint = 'https://recruitment.hal.skygate.io/';

	private extractData(res: Response) {
		let body = res;
		return body || {};
	}
	constructor(private http: HttpClient) { }

	getAll(): Observable<any> {
		return this.http.get(this._endpoint + 'companies').pipe(
			map(this.extractData));
	}

	getCompanyIncome(id): Observable<Income> {
		return this.http.get<Income>(this._endpoint + 'incomes/' + id);
	}
	
	getTotalIncome(id): Observable<any> {
		return this.http.get<any>(this._endpoint + 'incomes/' + id).pipe(
			map(res => {
				let total = 0;
				res.incomes.forEach(el => {
					total += parseInt(el.value)
				});
				return total
			})
		)
	}

	getCompany(id) {
		return this.http.get<Company[]>(this._endpoint + 'companies').pipe(
			map(res => {
				let test = res.filter(res => res.id == id)
				return test[0]
			}))

	}
}

