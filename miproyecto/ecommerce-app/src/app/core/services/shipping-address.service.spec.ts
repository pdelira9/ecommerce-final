import { TestBed } from '@angular/core/testing';

import { ShippingAddressService } from './shippingAddress/shipping-address.service';

describe('ShippingAddressService', () => {
  let service: ShippingAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippingAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
