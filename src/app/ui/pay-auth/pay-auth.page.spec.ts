import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayAuthPage } from './pay-auth.page';

describe('PayrequestAuthPage', () => {
    let component: PayAuthPage;
    let fixture: ComponentFixture<PayAuthPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PayAuthPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PayAuthPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
