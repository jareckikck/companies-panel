import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Company } from 'src/app/models/Company';
import { Income } from 'src/app/models/Income';
import { CacheKeys } from 'src/app/models/cache-keys';

@Component({
	selector: 'app-company-details',
	templateUrl: './company-details.component.html',
	styleUrls: ['./company-details.component.css'],

})

export class CompanyDetailsComponent implements OnInit {

	constructor(
		private route: ActivatedRoute,
		private _companyService: CompanyService,
	) { }

	private _destroy = new Subject<void>();
	private _company: Company;
	private _income: Income;
	private _id: number;

	get company() {
		return this._company;
	}
	get income() {
		return this._income;
	}

	ngOnInit() {
		this.route.paramMap.subscribe(
			params => {
				this._id = parseInt(params.get('id'));
				this.getIncomes(this._id)
				this.setCompany();
			}
		);

	}

	getIncomes(id) {
		this._companyService.getCompanyIncome(id)
			.pipe(takeUntil(this._destroy)).subscribe(
				data => this._income = data
			)
	}

	setCompany() {
		if (this.isCompanyCached()) {
			this._company = JSON.parse(localStorage[CacheKeys.CURRENT_COMPANY])
		} else {
			this._companyService.getCompany(this._id).subscribe(
				res => {
					this._company = res
					localStorage[CacheKeys.CURRENT_COMPANY] = JSON.stringify(this._company);
					this.setTotalIncome(this._company);
				}
			)

		}
	}

	isCompanyCached() {
		return (
			localStorage.getItem(CacheKeys.CURRENT_COMPANY) !== null
			&& localStorage.getItem(CacheKeys.CURRENT_COMPANY_ID) !== null
			&& JSON.parse(localStorage[CacheKeys.CURRENT_COMPANY_ID]) == this._id)
	}

	setTotalIncome(company: Company) {
		return this._companyService.getTotalIncome(company.id).subscribe(
			data => {
				company.totalIncome = data;
			},
		)
	}

}
