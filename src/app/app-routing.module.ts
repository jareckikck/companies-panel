import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompaniesListComponent } from './views/companies-list/companies-list.component';
import { CompanyDetailsComponent } from './views/company-details/company-details.component';


const routes: Routes = [
	{ path: '', component: CompaniesListComponent },
	{ path: 'company/:id', component: CompanyDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
