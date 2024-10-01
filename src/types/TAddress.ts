export interface TAddress {
  address: TAddresses[];
}
export interface TAddresses {
  _id: string;
  name: string;
  contactName: string;
  address: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  pincode: number;
  __v: number;
}
