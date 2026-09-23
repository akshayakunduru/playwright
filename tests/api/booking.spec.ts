import { test, expect } from '@playwright/test';
import { envConfig } from '../../config/env.config';
import {
  generateBookingPayload,
  bookingData,
} from '../../test-data/bookingData';

test.describe('Restful-Booker', () => {
  test('auth returns a token', async ({ request }) => {
    const response = await request.post('/auth', {
      data: {
        username: envConfig.bookerUsername,
        password: envConfig.bookerPassword,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('bad credentials', async ({ request }) => {
    const response = await request.post('/auth', {
      data: bookingData.invalidAuthCredentials,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
  });

  test('create a booking', async ({ request }) => {
    const payload = generateBookingPayload();

    const response = await request.post('/booking', { data: payload });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.bookingid).toBeGreaterThan(0);
    expect(body.booking.firstname).toBe(payload.firstname);
    expect(body.booking.lastname).toBe(payload.lastname);
    expect(body.booking.totalprice).toBe(payload.totalprice);
    expect(body.booking.depositpaid).toBe(payload.depositpaid);
    expect(body.booking.bookingdates.checkin).toBe(payload.bookingdates.checkin);
  });

  test('create booking with a half-filled payload', async ({ request }) => {
    const response = await request.post('/booking', {
      data: bookingData.invalidPayloadMissingFields,
    });

    // this API answers 500 for a missing body, not 400
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('get a booking that was just created', async ({ request }) => {
    const payload = generateBookingPayload();
    const createRes = await request.post('/booking', { data: payload });
    const { bookingid } = await createRes.json();

    const getRes = await request.get(`/booking/${bookingid}`);
    expect(getRes.status()).toBe(200);

    const body = await getRes.json();
    expect(body.firstname).toBe(payload.firstname);
    expect(body.lastname).toBe(payload.lastname);
    expect(body.totalprice).toBe(payload.totalprice);
  });

  test('unknown booking id is 404', async ({ request }) => {
    const nonExistentId = 99999999;
    const response = await request.get(`/booking/${nonExistentId}`);
    expect(response.status()).toBe(404);
  });

  test('put without a token is 403', async ({ request }) => {
    const payload = generateBookingPayload();
    const createRes = await request.post('/booking', { data: payload });
    const { bookingid } = await createRes.json();

    const putRes = await request.put(`/booking/${bookingid}`, {
      data: bookingData.fullUpdatePayload,
    });

    expect(putRes.status()).toBe(403);
  });

  test('delete without a token is 403', async ({ request }) => {
    const payload = generateBookingPayload();
    const createRes = await request.post('/booking', { data: payload });
    const { bookingid } = await createRes.json();

    const deleteRes = await request.delete(`/booking/${bookingid}`);
    expect(deleteRes.status()).toBe(403);
  });

  test('create, update, and delete a booking', async ({
    request,
  }) => {
    const authRes = await request.post('/auth', {
      data: {
        username: envConfig.bookerUsername,
        password: envConfig.bookerPassword,
      },
    });
    expect(authRes.status()).toBe(200);
    const { token } = await authRes.json();
    expect(token).toBeTruthy();

    const authHeaders = {
      Cookie: `token=${token}`,
    };

    const initialPayload = generateBookingPayload();
    const createRes = await request.post('/booking', { data: initialPayload });
    expect(createRes.status()).toBe(200);
    const { bookingid } = await createRes.json();
    expect(bookingid).toBeGreaterThan(0);

    const getRes1 = await request.get(`/booking/${bookingid}`);
    expect(getRes1.status()).toBe(200);
    const retrievedBody = await getRes1.json();
    expect(retrievedBody.firstname).toBe(initialPayload.firstname);
    expect(retrievedBody.totalprice).toBe(initialPayload.totalprice);

    const patchPayload = bookingData.partialUpdatePayload;
    const patchRes = await request.patch(`/booking/${bookingid}`, {
      headers: authHeaders,
      data: patchPayload,
    });
    expect(patchRes.status()).toBe(200);
    const patchBody = await patchRes.json();
    expect(patchBody.firstname).toBe(patchPayload.firstname);
    expect(patchBody.totalprice).toBe(patchPayload.totalprice);
    expect(patchBody.lastname).toBe(initialPayload.lastname);

    const putPayload = bookingData.fullUpdatePayload;
    const putRes = await request.put(`/booking/${bookingid}`, {
      headers: authHeaders,
      data: putPayload,
    });
    expect(putRes.status()).toBe(200);
    const putBody = await putRes.json();
    expect(putBody.firstname).toBe(putPayload.firstname);
    expect(putBody.lastname).toBe(putPayload.lastname);
    expect(putBody.totalprice).toBe(putPayload.totalprice);
    expect(putBody.depositpaid).toBe(putPayload.depositpaid);

    const getRes2 = await request.get(`/booking/${bookingid}`);
    expect(getRes2.status()).toBe(200);
    const verifiedBody = await getRes2.json();
    expect(verifiedBody.firstname).toBe(putPayload.firstname);

    const deleteRes = await request.delete(`/booking/${bookingid}`, {
      headers: authHeaders,
    });
    expect(deleteRes.status()).toBe(201);

    const getResAfterDelete = await request.get(`/booking/${bookingid}`);
    expect(getResAfterDelete.status()).toBe(404);
  });
});
