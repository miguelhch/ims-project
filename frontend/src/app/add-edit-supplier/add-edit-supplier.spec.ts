import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSupplier } from './add-edit-supplier';

describe('AddEditSupplier', () => {
  let component: AddEditSupplier;
  let fixture: ComponentFixture<AddEditSupplier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditSupplier]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSupplier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
