import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrequestAuthPage } from './payrequest-auth.page';

describe('PayrequestAuthPage', () => {
  let component: PayrequestAuthPage;
  let fixture: ComponentFixture<PayrequestAuthPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrequestAuthPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrequestAuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
