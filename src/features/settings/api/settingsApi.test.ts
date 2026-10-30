import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';

import { mockServer } from '@/test/mockServer';

import { settingsApi } from './settingsApi';

const securityResponse = {
  passwordChangedAt: '2026-10-01T10:00:00.000Z',
  sessions: [
    {
      browser: 'Chrome',
      current: true,
      device: 'Windows',
      id: 'session-1',
      ipAddress: '192.0.2.1',
      lastActiveAt: '2026-10-30T08:30:00.000Z',
      location: 'Tehran',
    },
  ],
  twoFactorEnabled: false,
};

describe('settingsApi contract boundary', () => {
  it('validates profile/preferences and keeps immutable profile fields out of updates', async () => {
    let profileBody: unknown;
    let preferencesBody: unknown;
    mockServer.use(
      http.get('/api/account/profile', () =>
        HttpResponse.json({
          avatarUrl: null,
          email: 'hamed@nexora.dev',
          name: 'Hamed',
          phone: '+989121234567',
        })
      ),
      http.patch('/api/account/profile', async ({ request }) => {
        profileBody = await request.json();
        return HttpResponse.json({
          avatarUrl: null,
          email: 'hamed@nexora.dev',
          name: 'Hamed Akbarzadeh',
          phone: '+989121234567',
        });
      }),
      http.get('/api/account/preferences', () =>
        HttpResponse.json({
          colorMode: 'dark',
          language: 'fa',
          priceAlerts: true,
          tradingNotifications: false,
        })
      ),
      http.put('/api/account/preferences', async ({ request }) => {
        preferencesBody = await request.json();
        return HttpResponse.json({
          colorMode: 'dark',
          language: 'fa',
          priceAlerts: true,
          tradingNotifications: false,
        });
      })
    );

    await expect(settingsApi.getProfile()).resolves.toMatchObject({ name: 'Hamed' });
    await settingsApi.updateProfile({
      email: 'attempted-change@example.com',
      name: 'Hamed Akbarzadeh',
      phone: '+989121234567',
    });
    const preferences = await settingsApi.getPreferences();
    await settingsApi.updatePreferences(preferences);

    expect(profileBody).toEqual({ name: 'Hamed Akbarzadeh', phone: '+989121234567' });
    expect(preferencesBody).toEqual(preferences);
  });

  it('uploads avatar bytes with the selected image content type', async () => {
    let contentType = '';
    let byteLength = 0;
    mockServer.use(
      http.put('/api/account/avatar', async ({ request }) => {
        contentType = request.headers.get('content-type') ?? '';
        byteLength = (await request.arrayBuffer()).byteLength;
        return HttpResponse.json({
          avatarUrl: 'data:image/png;base64,iVBORw0KGgo=',
          email: 'hamed@nexora.dev',
          name: 'Hamed',
          phone: '+989121234567',
        });
      })
    );

    await settingsApi.updateAvatar(
      new File([new Uint8Array([137, 80, 78, 71])], 'avatar.png', { type: 'image/png' })
    );

    expect(contentType).toContain('image/png');
    expect(byteLength).toBe(4);
  });

  it('rejects malformed preferences before they reach application state', async () => {
    mockServer.use(
      http.get('/api/account/preferences', () =>
        HttpResponse.json({
          colorMode: 'neon',
          language: 'fa',
          priceAlerts: true,
          tradingNotifications: true,
        })
      )
    );

    await expect(settingsApi.getPreferences()).rejects.toThrow('Invalid account preferences response');
  });

  it('accepts a valid security overview', async () => {
    mockServer.use(http.get('/api/account/security', () => HttpResponse.json(securityResponse)));

    await expect(settingsApi.getSecurity()).resolves.toEqual(securityResponse);
  });

  it('rejects malformed session data before it reaches the cache', async () => {
    mockServer.use(
      http.get('/api/account/security', () =>
        HttpResponse.json({
          ...securityResponse,
          sessions: [{ ...securityResponse.sessions[0], current: 'yes' }],
        })
      )
    );

    await expect(settingsApi.getSecurity()).rejects.toThrow('Invalid account session response');
  });

  it('encodes session identifiers and sends only password fields', async () => {
    let passwordBody: unknown;
    mockServer.use(
      http.put('/api/account/password', async ({ request }) => {
        passwordBody = await request.json();
        return new HttpResponse(null, { status: 204 });
      }),
      http.delete('/api/account/sessions/session%2Fmobile', () => new HttpResponse(null, { status: 204 }))
    );

    await settingsApi.changePassword({ currentPassword: 'old-password', newPassword: 'new-password' });
    await settingsApi.revokeSession('session/mobile');

    expect(passwordBody).toEqual({ currentPassword: 'old-password', newPassword: 'new-password' });
  });

  it('validates MFA setup and recovery-code responses', async () => {
    mockServer.use(
      http.post('/api/account/mfa/setup', () =>
        HttpResponse.json({
          expiresAt: '2026-10-30T10:10:00.000Z',
          otpauthUri: 'otpauth://totp/Nexora:user?secret=ABC&issuer=Nexora',
          secret: 'ABC',
          setupToken: 'setup-1',
        })
      ),
      http.post('/api/account/mfa/confirm', () =>
        HttpResponse.json({ recoveryCodes: ['ABCDE-12345', 'FFFFF-00000'] })
      )
    );

    await expect(settingsApi.beginMfaSetup('current-password')).resolves.toMatchObject({ secret: 'ABC' });
    await expect(settingsApi.confirmMfaSetup({ code: '123456', setupToken: 'setup-1' })).resolves.toEqual({
      recoveryCodes: ['ABCDE-12345', 'FFFFF-00000'],
    });
  });
});
