import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Company } from 'src/app/models/Company';
@Component({
	selector: 'app-companies-list',
	templateUrl: './companies-list.component.html',
	styleUrls: ['./companies-list.component.css']
})
export class CompaniesListComponent implements OnInit, OnDestroy {
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(private _rest: CompanyService) { }
	private _destroy = new Subject<void>();
	private _dataSource: MatTableDataSource<Company>;
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

	getPaginatorData($event) {
		const skip = this.paginator.pageSize * this.paginator.pageIndex;

		const currentItems = this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort)
			.filter((u, i) => i >= skip)
			.filter((u, i: number) => i < this.paginator.pageSize);

		console.log(this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort));
		currentItems.forEach(item => {
			this.setTotalIncome(item)
		})
		console.log(currentItems);
	}

	ngOnInit() {
		this.getCompanies();
	}

	getCompanies() {
		return this._rest.getAll().pipe(takeUntil(this._destroy)).subscribe(
			stream => {
				this.dataSource = new MatTableDataSource(stream);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			}, error => {
				console.log(error)
			})
	}
	setTotalIncome(company: Company) {
		return this._rest.getTotalIncome(company.id).subscribe(
			data => {
				company.totalIncome = data;
			}
		)
	}

	// companyIncomes(id: number) {
	// 	return this._rest.getCompanyIncome(id).subscribe(
	// 		data => console.log(data)
	// 	)
	// }

	ngOnDestroy() {
		this._destroy.unsubscribe();
	}
}
