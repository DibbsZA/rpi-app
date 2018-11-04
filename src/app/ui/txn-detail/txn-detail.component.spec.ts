import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxnDetailComponent } from './txn-detail.component';

describe('TxnDetailComponent', () => {
  let component: TxnDetailComponent;
  let fixture: ComponentFixture<TxnDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TxnDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxnDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
