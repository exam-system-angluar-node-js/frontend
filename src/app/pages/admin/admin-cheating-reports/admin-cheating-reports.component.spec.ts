import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCheatingReportsComponent } from './admin-cheating-reports.component';

describe('AdminCheatingReportsComponent', () => {
  let component: AdminCheatingReportsComponent;
  let fixture: ComponentFixture<AdminCheatingReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCheatingReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCheatingReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
