import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ShippingAddressService } from '../../../core/services/shippingAddress/shipping-address.service';
import { ShippingAddress } from '../../../core/types/ShippingAddress';

@Component({
  selector: 'app-shipping-address',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './shipping-address.component.html',
})
export class ShippingAddressComponent implements OnInit {
  showForm = false;
  selectedId = '';

  addresses: ShippingAddress[] = [];
  form: FormGroup;

  constructor(private fb: FormBuilder, private addressService: ShippingAddressService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['México'],
      phone: ['', Validators.required],
      isDefault: [true],
      addressType: ['home'],
    });
  }

  ngOnInit(): void {
    this.addressService.getAll().subscribe((list) => {
      this.addresses = list;
      const def = list.find(a => a.isDefault) ?? list[0];
      this.selectedId = def?._id ?? '';
    });
  }

  save() {
    if (this.form.invalid) return;

    this.addressService.create(this.form.value).subscribe((created) => {
      this.addresses = [created, ...this.addresses];
      this.selectedId = created._id;
      this.showForm = false;

      this.form.reset({
        country: 'México',
        isDefault: true,
        addressType: 'home',
      });
    });
  }
}
