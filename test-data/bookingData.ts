export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export function generateBookingPayload(overrides?: Partial<BookingPayload>): BookingPayload {
  const uniqueId = Math.floor(Math.random() * 10000);
  return {
    firstname: `Guest${uniqueId}`,
    lastname: `Tester${uniqueId}`,
    totalprice: 275,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-06-01',
      checkout: '2026-06-10',
    },
    additionalneeds: 'Late Checkout & High Floor',
    ...overrides,
  };
}

export const bookingData = {
  fullUpdatePayload: {
    firstname: 'UpdatedFirstName',
    lastname: 'UpdatedLastName',
    totalprice: 499,
    depositpaid: false,
    bookingdates: {
      checkin: '2026-07-01',
      checkout: '2026-07-15',
    },
    additionalneeds: 'Airport Shuttle & Champagne',
  },

  partialUpdatePayload: {
    firstname: 'PatchedFirstName',
    totalprice: 320,
  },

  invalidPayloadMissingFields: {
    firstname: 'OnlyFirstName',
  },

  invalidAuthCredentials: {
    username: 'invalidUser',
    password: 'wrongPassword999',
  },
};
