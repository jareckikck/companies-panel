import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Company } from 'src/app/models/Company';
@Component({
	selector: 'app-companies-list',
	templateUrl: './companies-list.component.html',
	styleUrls: ['./companies-list.component.css']
})
export class CompaniesListComponent implements OnInit, OnDestroy {
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(private _companyService: CompanyService) { }
	private _destroy = new Subject<void>();
	private _dataSource: MatTableDataSource<Company>;
	private _companies: Company[];
	private _companiesLength: number
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
			this._companies.sort(this.compareValues('totalIncome', 'desc'));
			this.dataSource = new MatTableDataSource(this._companies);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
			console.log('done')
		}
	}

	ngOnInit() {
		this.getCompanies();

	}

	compareValues(key, order = 'asc') {
		return function innerSort(a, b) {
			if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
				return 0;
			}

			const varA = (typeof a[key] === 'string')
				? a[key].toUpperCase() : a[key];
			const varB = (typeof b[key] === 'string')
				? b[key].toUpperCase() : b[key];

			let comparison = 0;
			if (varA > varB) {
				comparison = 1;
			} else if (varA < varB) {
				comparison = -1;
			}
			return (
				(order === 'desc') ? (comparison * -1) : comparison
			);
		};
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
}
