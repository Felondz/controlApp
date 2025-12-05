import { describe, it, expect } from 'vitest';
import { getOwnerColor, getOwnerName, getOwnerInitials, isMyAccount, groupAccountsByOwner, calculateOwnerContributions } from '@/Utils/ownerHelpers';

describe('ownerHelpers', () => {
    describe('getOwnerColor', () => {
        it('returns default color for null ownerId', () => {
            const color = getOwnerColor(null);
            expect(color.chartColor).toBe('#3b82f6'); // Blue
        });

        it('returns consistent colors for same ownerId', () => {
            const color1 = getOwnerColor(1);
            const color2 = getOwnerColor(1);
            expect(color1).toEqual(color2);
        });

        it('cycles through available colors', () => {
            const color1 = getOwnerColor(0);
            const color9 = getOwnerColor(8); // 8 % 8 = 0
            expect(color1).toEqual(color9);
        });
    });

    describe('getOwnerName', () => {
        it('returns "Proyecto" if no owner', () => {
            expect(getOwnerName({})).toBe('Proyecto');
        });

        it('returns owner name from relationship', () => {
            const account = { propietario: { name: 'Juan Perez' } };
            expect(getOwnerName(account)).toBe('Juan Perez');
        });

        it('returns "Desconocido" if owner exists but has no name', () => {
            const account = { propietario: {} };
            expect(getOwnerName(account)).toBe('Desconocido');
        });
    });

    describe('getOwnerInitials', () => {
        it('returns folder icon for "Proyecto"', () => {
            expect(getOwnerInitials('Proyecto')).toBe('📁');
        });

        it('returns first 2 chars for single name', () => {
            expect(getOwnerInitials('Juan')).toBe('JU');
        });

        it('returns first and last initials for full name', () => {
            expect(getOwnerInitials('Juan Perez')).toBe('JP');
        });

        it('returns ? for empty name', () => {
            expect(getOwnerInitials('')).toBe('📁');
        });
    });

    describe('isMyAccount', () => {
        it('returns true if owner matches current user', () => {
            const account = { propietario_id: 1, propietario_type: 'App\\Models\\User' };
            expect(isMyAccount(account, 1)).toBe(true);
        });

        it('returns false if owner does not match', () => {
            const account = { propietario_id: 2, propietario_type: 'App\\Models\\User' };
            expect(isMyAccount(account, 1)).toBe(false);
        });

        it('returns false if account has no owner', () => {
            expect(isMyAccount({}, 1)).toBe(false);
        });
    });

    describe('groupAccountsByOwner', () => {
        it('groups accounts correctly', () => {
            const accounts = [
                { id: 1, propietario_id: 1, saldo_actual: 100, propietario: { name: 'Juan' } },
                { id: 2, propietario_id: 1, saldo_actual: 200, propietario: { name: 'Juan' } },
                { id: 3, propietario_id: 2, saldo_actual: 300, propietario: { name: 'Ana' } }
            ];

            const grouped = groupAccountsByOwner(accounts);
            expect(Object.keys(grouped)).toHaveLength(2);
            expect(grouped[1].totalBalance).toBe(300);
            expect(grouped[2].totalBalance).toBe(300);
        });
    });

    describe('calculateOwnerContributions', () => {
        it('calculates income and expense per owner', () => {
            const accounts = [
                { id: 1, propietario_id: 1, propietario: { name: 'Juan' } }
            ];
            const transactions = [
                { cuenta_id: 1, monto: 1000 },
                { cuenta_id: 1, monto: -500 }
            ];

            const contributions = calculateOwnerContributions(transactions, accounts);
            expect(contributions[1].income).toBe(1000);
            expect(contributions[1].expense).toBe(500);
            expect(contributions[1].net).toBe(500);
        });
    });
});
