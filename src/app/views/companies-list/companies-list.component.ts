import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { Subject } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Company } from 'src/app/models/Company';
import { HelpersService } from 'src/app/services/helpers.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { CacheKeys } from 'src/app/models/cache-keys';


@Component({
	selector: 'app-companies-list',
	templateUrl: './companies-list.component.html',
	styleUrls: ['./companies-list.component.css']
})
export class CompaniesListComponent implements OnInit, OnDestroy {
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	private _destroy = new Subject<void>();
	private _dataSource: MatTableDataSource<Company>;
	private _companies: Company[];
	private _companiesLength: number;

	private _tableConfig = {
		pagination: {
			length: 100,
			pageSize: 5,
			pageSizeOptions: [1, 5, 10, 25, 50, 100]
		},
		displayedColumns: [
			'lp',
			'name',
			'city',
			'totalIncome',			
		]
	};

	constructor(
		private _companyService: CompanyService,
		private _helpers: HelpersService,
		private _router: Router,
		private _sessionService: SessionService
	) {

	}

	get dataSource() {
		return this._dataSource;
	}
	set dataSource(data) {
		this._dataSource = data;
	}
	get tableConfig() {
		return this._tableConfig;
	}

	ngOnInit() {
		this.fetchCompanies();
		this.checkCache();
	}
	fetchCompanies() {
		this._companyService.getAll().subscribe(next => {
			localStorage[CacheKeys.COMPANIES] = JSON.stringify(next);
			this._companies = next
		})
	}

	checkCache() {
		if (!this.isCompaniesSortedListCached()) {
			this.waitForStorageToLoad()
		} else {
			this.useCachedData()
		}
	}

	isCompaniesSortedListCached() {
		return localStorage.getItem(CacheKeys.SORTED_COMPANIES) !== null
	}
	isComapniesListCached() {
		return localStorage.getItem(CacheKeys.COMPANIES) !== null
	}

	useCachedData() {
		this._companies = JSON.parse(localStorage[CacheKeys.SORTED_COMPANIES])
		this.setDataSource(this._companies);
	}

	waitForStorageToLoad() {
		let interval = setInterval(() => {
			if (this.isComapniesListCached()) {
				this.addTotalIncomeToCompanies();
				clearInterval(interval)
			}
		}, 1000)
	}

	addTotalIncomeToCompanies() {
		this._companies = JSON.parse(localStorage[CacheKeys.COMPANIES])
		this._companies.forEach(item => {
			this.setTotalIncome(item)
		})
		this._companiesLength = this._companies.length;
	}

	setTotalIncome(company: Company) {
		return this._companyService.getTotalIncome(company.id).subscribe(
			data => {
				company.totalIncome = data;
			},
			error => {
				console.log(error)
			},
			() => this.onSetTotalIncomeComplete()
		)
	}

	onSetTotalIncomeComplete() {
		this._companiesLength--;
		if (this._companiesLength !== 0) return
		this.cacheCompaniesSortedList();
		this.setDataSource(this._companies);
	}
	
	cacheCompaniesSortedList() {
		this._companies.sort(this._helpers.compareValues('totalIncome', 'desc'));
		localStorage[CacheKeys.SORTED_COMPANIES] = JSON.stringify(this._companies);
	}

	setDataSource(item) {
		this.dataSource = new MatTableDataSource(item);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	ngOnDestroy() {
		this._destroy.unsubscribe();
	}

	navigateTo(company) {		
		localStorage[CacheKeys.CURRENT_COMPANY] = JSON.stringify(company);
		localStorage[CacheKeys.CURRENT_COMPANY_ID] = JSON.stringify(company.id);
		this._sessionService.currentCompany = company;
		this._router.navigate(['/company', company.id]);
	}
}
