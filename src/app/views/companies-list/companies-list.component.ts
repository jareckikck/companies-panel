import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Company } from 'src/app/models/Company';
import { HelpersService } from 'src/app/services/helpers.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

@Component({
	selector: 'app-companies-list',
	templateUrl: './companies-list.component.html',
	styleUrls: ['./companies-list.component.css']
})
export class CompaniesListComponent implements OnInit, OnDestroy {
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(
		private _companyService: CompanyService, 
		private _helpers: HelpersService, 
		private _router: Router,
		private _sessionService: SessionService
		) { }
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
			'details'
		]
	};

	get dataSource() {
		return this._dataSource;
	}
	set dataSource(data) {
		this._dataSource = data;
	}
	get tableConfig() {
		return this._tableConfig;
	}

	onSetTotalIncomeComplete() {
		this._companiesLength--;
		if (this._companiesLength == 0) {	
			this._companies.sort(this._helpers.compareValues('totalIncome', 'desc'));
			this.dataSource = new MatTableDataSource(this._companies);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		}
	}

	ngOnInit() {
		this.getCompanies();
	}

	getCompanies() {
		return this._companyService.getAll().pipe(takeUntil(this._destroy)).subscribe(
			stream => {
				
				this._companies = stream;
				this._companiesLength = stream.length;

				stream.forEach(item => {
					this.setTotalIncome(item)
				})
			}, error => {
				console.log(error)
			})
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

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	ngOnDestroy() {
		this._destroy.unsubscribe();
	}
	goTo(company){
		console.log(company)
		this._sessionService.currentCompany = company;
		this._router.navigate(['/company', company.id]);
	}
}
