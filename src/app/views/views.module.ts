import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../modules/material/material.module';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';

@NgModule({
	declarations: [
		CompaniesListComponent,
		CompanyDetailsComponent
	],
	imports: [
		CommonModule,
		MaterialModule,
	]
})
export class ViewsModule { }
