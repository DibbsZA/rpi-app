import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxnDetailPage } from './txn-detail.page';

describe('TxnDetailPage', () => {
  let component: TxnDetailPage;
  let fixture: ComponentFixture<TxnDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TxnDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxnDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
