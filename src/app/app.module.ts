import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ViewsModule } from './views/views.module';

@NgModule({
	declarations: [
		AppComponent,		
	],
	imports: [
		ViewsModule,
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		BrowserAnimationsModule,
		
	],
	providers: [

	],
	bootstrap: [AppComponent]
})
export class AppModule { }
