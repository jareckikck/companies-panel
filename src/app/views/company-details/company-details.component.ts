import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Company } from 'src/app/models/Company';
import { Income } from 'src/app/models/Income';
import { SessionService } from 'src/app/services/session.service';

const CURRENT_COMPANY_KEY = 'currentCompany'
const CURRENT_COMPANY_KEY_ID = 'currentCompanyId'
@Component({
	selector: 'app-company-details',
	templateUrl: './company-details.component.html',
	styleUrls: ['./company-details.component.css'],

})

export class CompanyDetailsComponent implements OnInit {

	constructor(private route: ActivatedRoute, private _companyService: CompanyService, private _sessionService: SessionService) {
	}
	private _destroy = new Subject<void>();
	private _company: Company;
	private _income;
	private _id;
	get company() {
		return this._company;
	}
	get income() {
		return this._income;
	}
	
	ngOnInit() {
		this.route.paramMap.subscribe(
			params => {
				this._id = params.get('id')
				console.log(this._id);
				this.getIncomes(this._id)
				this.setCompany();
			}
		);

	}
	getIncomes(id) {
		this._companyService.getCompanyIncome(id).pipe(takeUntil(this._destroy)).subscribe(data => {
			this._income = data;

		})
	}
	setCompany() {
		if (this.isCompanyCached()) {
			this._company = JSON.parse(localStorage[CURRENT_COMPANY_KEY])
		} else {
			this._companyService.getCompany(this._id).subscribe(
				res => {
					this._company = res
					localStorage[CURRENT_COMPANY_KEY] = JSON.stringify(this._company);
					this.setTotalIncome(this._company);
				}
			)

		}
	}
	setTotalIncome(company: Company) {
		return this._companyService.getTotalIncome(company.id).subscribe(
			data => {
				company.totalIncome = data;
			},
		)
	}
	isCompanyCached() {
		return (
			localStorage.getItem(CURRENT_COMPANY_KEY) !== null
			&& localStorage.getItem(CURRENT_COMPANY_KEY_ID) !== null
			&& JSON.parse(localStorage[CURRENT_COMPANY_KEY_ID]) == this._id)
	}
	/*
	 * TO DO GET PASSED INFO FROM COMPONENT 
	 * GET INCOMES
	 *
	 */
}
