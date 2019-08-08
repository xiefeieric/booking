import {Subject} from 'rxjs';
import {HeaderActionEnum} from '../enums/header-action.enum';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class HeaderService {
  private headerEventSubject: Subject<HeaderActionEnum> = new Subject<HeaderActionEnum>();


  get headerEvent(): Subject<HeaderActionEnum> {
    return this.headerEventSubject;
  }
}
