import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPayAuthPage } from './request-pay-auth.page';

describe('RequestPayAuthComponent', () => {
    let component: RequestPayAuthPage;
    let fixture: ComponentFixture<RequestPayAuthPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RequestPayAuthPage]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RequestPayAuthPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
