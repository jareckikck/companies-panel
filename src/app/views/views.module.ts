import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../modules/material/material.module';
import { CompaniesListComponent } from './companies-list/companies-list.component';

@NgModule({
	declarations: [
		CompaniesListComponent
	],
	imports: [
		CommonModule,
		MaterialModule,
	]
})
export class ViewsModule { }
