import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupChartBarComponent } from './popup-chart-bar.component';

describe('PopupChartBarComponent', () => {
  let component: PopupChartBarComponent;
  let fixture: ComponentFixture<PopupChartBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupChartBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupChartBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
