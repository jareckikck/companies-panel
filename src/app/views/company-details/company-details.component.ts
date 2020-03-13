import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Company } from 'src/app/models/Company';
import { Income } from 'src/app/models/Income';

@Component({
	selector: 'app-company-details',
	templateUrl: './company-details.component.html',
	styleUrls: ['./company-details.component.css'],

})
export class CompanyDetailsComponent implements OnInit {

	constructor(private route: ActivatedRoute, private _companyService: CompanyService) { }
	private _destroy = new Subject<void>();
	private _company: Company;
	private _income;
	ngOnInit() {
		this.route.paramMap.subscribe(
			params => {
				let id = params.get('id')
				console.log(id);	
				this.getIncomes(id)			
			}
		);
	}
	getIncomes(id){
		this._companyService.getCompanyIncome(id).pipe(takeUntil(this._destroy)).subscribe(data=>{
			this._income = data;
			console.log(this._income.incomes);
		})
	}
	/*
	 * TO DO GET PASSED INFO FROM COMPONENT 
	 * GET INCOMES
	 *
	 */
}
