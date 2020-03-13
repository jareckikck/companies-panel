import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatSortModule } from '@angular/material';
import { MatPaginatorModule } from "@angular/material/paginator";

const material = [
	CommonModule,
	MatTableModule,
	MatPaginatorModule,
	MatSortModule
]
@NgModule({
	imports: [material],
	exports: [material]
})
export class MaterialModule { }
