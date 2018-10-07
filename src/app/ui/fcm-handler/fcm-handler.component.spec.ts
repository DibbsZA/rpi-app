import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FcmHandlerComponent } from './fcm-handler.component';

describe('FcmHandlerComponent', () => {
  let component: FcmHandlerComponent;
  let fixture: ComponentFixture<FcmHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FcmHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FcmHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
