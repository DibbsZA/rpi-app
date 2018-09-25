import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowQrPage } from './show-qr.page';

describe('ShowQrPage', () => {
  let component: ShowQrPage;
  let fixture: ComponentFixture<ShowQrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowQrPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowQrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
