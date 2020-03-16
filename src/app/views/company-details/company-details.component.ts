import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Company } from 'src/app/models/Company';
import { Income } from 'src/app/models/Income';
import { CacheKeys } from 'src/app/models/cache-keys';
import { HelpersService } from 'src/app/services/helpers.service';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
	selector: 'app-company-details',
	templateUrl: './company-details.component.html',
	styleUrls: ['./company-details.component.css'],

})

export class CompanyDetailsComponent implements OnInit, OnDestroy {

	constructor(
		private route: ActivatedRoute,
		private _companyService: CompanyService,
		private _helersService: HelpersService
	) { }

	private _destroy = new Subject<void>();
	private _company: Company;
	private _income: Income;
	private _incomes: any;
	private _maxDate: Date;
	private _minDate: Date;
	private _filteredIncomes;
	private _id: number;
	range: FormControl;

	get company() {
		return this._company;
	}
	get income() {
		return this._income;
	}
	get minDate() {
		return this._minDate
	}
	get maxDate() {
		return this._maxDate
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
				data => {
					console.log('observable');
					this._income = data
					this._incomes = this._income.incomes.sort(this._helersService.compareValues('date', 'desc'));
					this._filteredIncomes = this._incomes;
					this._maxDate = new Date(this.incomes[0].date);
					this._minDate = new Date(this.incomes[this.incomes.length - 1].date)
					this.range.setValue({ begin: this._minDate, end: this._maxDate });
				}
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
		return this._incomes;
	}

	get filteredIncomes() {
		return this._filteredIncomes ? this._filteredIncomes : [];
	}

	get chartData() {
		let chartData = [];
		if (this._filteredIncomes) {
			this._filteredIncomes.forEach(el => {
				const date = new Date(el.date);
				const dateString = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
				chartData.push([dateString, parseInt(el.value)])
			})
		}		
		return chartData;
	}

	ngOnDestroy() {
		this._destroy.unsubscribe();
	}

	addEvent(type: string, event) {
		const startDate = new Date(event.value.begin);
		const endDate = new Date(event.value.end);
		this._filteredIncomes = this.incomes.filter(el => {
			return new Date(el.date) >= startDate && new Date(el.date) <= endDate
		})

		console.log(type);
		console.log(this._filteredIncomes);
	}
}