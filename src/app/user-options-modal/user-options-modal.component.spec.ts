import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOptionsModalComponent } from './user-options-modal.component';

describe('UserOptionsModalComponent', () => {
  let component: UserOptionsModalComponent;
  let fixture: ComponentFixture<UserOptionsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserOptionsModalComponent]
    });
    fixture = TestBed.createComponent(UserOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
