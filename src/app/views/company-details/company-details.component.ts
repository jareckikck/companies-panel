import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Company } from 'src/app/models/Company';
import { Income } from 'src/app/models/Income';
import { CacheKeys } from 'src/app/models/cache-keys';
import { HelpersService } from 'src/app/services/helpers.service';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-company-details',
	templateUrl: './company-details.component.html',
	styleUrls: ['./company-details.component.css'],

})

export class CompanyDetailsComponent implements OnInit {

	constructor(
		private route: ActivatedRoute,
		private _companyService: CompanyService,
		private _helersService: HelpersService
	) { }

	private _destroy = new Subject<void>();
	private _company: Company;
	private _income: Income;	
	private _id: number;
	range: FormControl;

	get company() {
		return this._company;
	}
	get income() {
		return this._income;
	}

	ngOnInit() {
		this.range = new FormControl({ value: '', disabled: false })
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

	// total income from current range
	get total(): number {
		let total = 0;
		this.filteredIncomes.forEach(el => {
			total += parseInt(el.value);
		})
		return total;
	}
	// avarage income from current range 
	get avarage() {
		let length = this.filteredIncomes.length
		return this.total / length;
	}

	get incomes() {
		return this._income !== undefined ? this._income.incomes.sort(this._helersService.compareValues('date', 'desc')) : [];
	}
	
	get maxDate() {
		return this.incomes[0] ? new Date(this.incomes[0].date) : new Date();
	}
	get minDate() {
		return this.incomes[this.incomes.length - 1] ? new Date(this.incomes[this.incomes.length - 1].date) : new Date('2000-01-19T05:25:37.412Z');
	}
	get startDate() {
		let start = this.range.value.begin ? this.range.value.begin : this.minDate
		return new Date(start)
	}
	get endDate() {
		let end = this.range.value.end ? this.range.value.end : this.maxDate;
		return new Date(end);
	}
	get filteredIncomes() {
		console.log('get filtered')
		return this.incomes.filter(el => {
			return new Date(el.date) >= this.startDate && new Date(el.date) <= this.endDate
		});
	}
	get chartData() {
		let chartData = [];
		this.filteredIncomes.forEach(el => {
			chartData.push([el.date, parseInt(el.value)])
		})
		console.log('get chartData')
		console.log(chartData)
		return chartData;
	}
}