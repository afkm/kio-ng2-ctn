import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtnImageComponent } from './ctn-image.component';

describe('CtnImageComponent', () => {
  let component: CtnImageComponent;
  let fixture: ComponentFixture<CtnImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtnImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtnImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
