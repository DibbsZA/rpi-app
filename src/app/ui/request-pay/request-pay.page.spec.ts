import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPayPage } from './request-pay.page';

describe('RequestPayPage', () => {
  let component: RequestPayPage;
  let fixture: ComponentFixture<RequestPayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
