import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupChartLineComponent } from './popup-chart-line.component';

describe('PopupChartLineComponent', () => {
  let component: PopupChartLineComponent;
  let fixture: ComponentFixture<PopupChartLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupChartLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupChartLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
