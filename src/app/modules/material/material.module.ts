import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatSortModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const material = [
	CommonModule,
	MatTableModule,
	MatPaginatorModule,
	MatSortModule,
	MatFormFieldModule,
	MatInputModule,
	MatCardModule,
	MatDatepickerModule,
	MatNativeDateModule,
	SatDatepickerModule,
	SatNativeDateModule,
	FormsModule,
	ReactiveFormsModule,
]
@NgModule({
	imports: [material],
	exports: [material]
})
export class MaterialModule { }
