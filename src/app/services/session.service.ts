import { Injectable } from '@angular/core';
import { Company } from '../models/Company';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }
  currentCompany : Company;
}
