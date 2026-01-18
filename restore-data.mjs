import { database, ref, set } from './firebase.js';

// Your backup data  
const backupData = {
    "members": [
        { "color": "#010D22", "id": "M4jlNBktNvd7oVlXUCRA", "joinedAt": new Date(1767814631 * 1000 + 68000000 / 1000000), "name": "Dom" },
        { "color": "#250B83", "id": "fqfZoNWYRrytpfNjmcDm", "joinedAt": new Date(1767814631 * 1000 + 68000000 / 1000000), "name": "Nick" },
        { "color": "#99675A", "id": "rmTmcbtFDonNFYYrMoK5", "joinedAt": new Date(1767814631 * 1000 + 68000000 / 1000000), "name": "Adrianna" }
    ],
    "chores": [
        { "createdAt": new Date(1767814631 * 1000 + 68000000 / 1000000), "id": "5fdpwSG0q8gucT25wGTQ", "name": "Dog poop", "order": 0 },
        { "createdAt": new Date(1767814718 * 1000 + 688000000 / 1000000), "id": "HYso3r7fOwcTHWKZsXrg", "name": "Wash bedding", "order": 1 },
        { "createdAt": new Date(1767814820 * 1000 + 858000000 / 1000000), "id": "QRD2H3CI8vT5BzwiQObk", "name": "Clean bathroom sink /counter", "order": 2 },
        { "createdAt": new Date(1767814757 * 1000 + 979000000 / 1000000), "id": "RpGSjeWU5X6SWifyU87j", "name": "Fold laundry", "order": 3 },
        { "createdAt": new Date(1767814789 * 1000 + 926000000 / 1000000), "id": "SqBQOfYWk6qtLuzM62wg", "name": "Clean toilet", "order": 4 },
        { "createdAt": new Date(1767814631 * 1000 + 68000000 / 1000000), "id": "VTdWUQH5J8VND8VH24dE", "name": "Empty dishwasher", "order": 5 },
        { "createdAt": new Date(1767814732 * 1000 + 473000000 / 1000000), "id": "XDUqMG5TsjDMr03q6Hpq", "name": "Mixed laundry load", "order": 6 },
        { "createdAt": new Date(1767814631 * 1000 + 68000000 / 1000000), "id": "XH8e11kycvYc68nY0tIe", "name": "Take out garbage", "order": 7 },
        { "createdAt": new Date(1767814631 * 1000 + 68000000 / 1000000), "id": "aXRWlLj6fhR5xUxxCZuP", "name": "Mop", "order": 8 },
        { "createdAt": new Date(1767814694 * 1000 + 500000000 / 1000000), "id": "fL0SuijXS9MmXInAyW9a", "name": "Make Brunch for 2+", "order": 9 },
        { "createdAt": new Date(1767814631 * 1000 + 68000000 / 1000000), "id": "g49u8tXGGXkOuZschR4L", "name": "Cat box", "order": 10 },
        { "createdAt": new Date(1767814631 * 1000 + 68000000 / 1000000), "id": "qi25rgn52iEouEOrL3sf", "name": "Vacuum", "order": 11 },
        { "createdAt": new Date(1767814798 * 1000 + 590000000 / 1000000), "id": "uKSZX4xgOO91zIXzUKjd", "name": "Clean shower/tub", "order": 12 },
        { "createdAt": new Date(1767814631 * 1000 + 68000000 / 1000000), "id": "ufdsyAozw237Fxtg3VjY", "name": "Load dishwasher", "order": 13 },
        { "createdAt": new Date(1767814631 * 1000 + 68000000 / 1000000), "id": "wQ14T5rqpmx1GsXaWgBs", "name": "Take out recycling", "order": 14 },
        { "createdAt": new Date("2026-01-09T03:13:03.124Z"), "id": "bxcbrsrrd", "name": "Dump run", "order": 15 }
    ],
    "logs": [
        { "choreId": "RpGSjeWU5X6SWifyU87j", "id": "x7l81kb83", "isManual": false, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2026-01-15T06:03:33.908Z") },
        { "choreId": "RpGSjeWU5X6SWifyU87j", "id": "1fwg14vxh", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2026-01-14T00:58:00.000Z") },
        { "choreId": "XDUqMG5TsjDMr03q6Hpq", "id": "bwxl44kn3", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2026-01-14T03:57:00.000Z") },
        { "choreId": "XDUqMG5TsjDMr03q6Hpq", "id": "jhae1z7jx", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2026-01-14T01:57:00.000Z") },
        { "choreId": "HYso3r7fOwcTHWKZsXrg", "id": "h4x2c82lo", "isManual": false, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2026-01-14T21:56:46.375Z") },
        { "choreId": "ufdsyAozw237Fxtg3VjY", "id": "8plpc9gjg", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2026-01-14T03:56:00.000Z") },
        { "choreId": "ufdsyAozw237Fxtg3VjY", "id": "lgp6s6s7a", "isManual": true, "memberId": "rmTmcbtFDonNFYYrMoK5", "timestamp": new Date("2026-01-12T03:56:00.000Z") },
        { "choreId": "VTdWUQH5J8VND8VH24dE", "id": "2vh3va3ar", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2026-01-14T00:55:00.000Z") },
        { "choreId": "ufdsyAozw237Fxtg3VjY", "id": "1l99yfuug", "isManual": true, "memberId": "rmTmcbtFDonNFYYrMoK5", "timestamp": new Date("2026-01-12T02:54:00.000Z") },
        { "choreId": "bxcbrsrrd", "id": "9aeyxnfam", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-03T21:16:00.000Z") },
        { "choreId": "bxcbrsrrd", "id": "o60tbnsyl", "isManual": true, "memberId": "rmTmcbtFDonNFYYrMoK5", "timestamp": new Date("2025-12-12T23:16:00.000Z") },
        { "choreId": "uKSZX4xgOO91zIXzUKjd", "id": "eag0rdgwu", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-05T01:15:00.000Z") },
        { "choreId": "qi25rgn52iEouEOrL3sf", "id": "l9aarlxg5", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-20T22:14:00.000Z") },
        { "choreId": "aXRWlLj6fhR5xUxxCZuP", "id": "ixm1sun5n", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-21T00:13:00.000Z") },
        { "choreId": "SqBQOfYWk6qtLuzM62wg", "id": "ffr0779jj", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-22T03:13:00.000Z") },
        { "choreId": "g49u8tXGGXkOuZschR4L", "id": "885suq12u", "isManual": false, "memberId": "M4jlNBktNvd7oVlXUCRA", "timestamp": new Date("2026-01-12T18:50:49.684Z") },
        { "choreId": "fL0SuijXS9MmXInAyW9a", "id": "h928lg3ad", "isManual": false, "memberId": "rmTmcbtFDonNFYYrMoK5", "timestamp": new Date("2026-01-12T18:50:35.529Z") },
        { "choreId": "fL0SuijXS9MmXInAyW9a", "id": "zbaatje82", "isManual": true, "memberId": "rmTmcbtFDonNFYYrMoK5", "timestamp": new Date("2026-01-11T18:50:00.000Z") },
        { "choreId": "VTdWUQH5J8VND8VH24dE", "id": "cos281ek5", "isManual": true, "memberId": "rmTmcbtFDonNFYYrMoK5", "timestamp": new Date("2026-01-10T18:49:00.000Z") },
        { "choreId": "XH8e11kycvYc68nY0tIe", "id": "v9dvihbrg", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-16T23:23:00.000Z") },
        { "choreId": "XH8e11kycvYc68nY0tIe", "id": "499ytu60x", "isManual": true, "memberId": "rmTmcbtFDonNFYYrMoK5", "timestamp": new Date("2025-12-15T17:23:00.000Z") },
        { "choreId": "RpGSjeWU5X6SWifyU87j", "id": "a025lcbik", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-19T19:22:00.000Z") },
        { "choreId": "RpGSjeWU5X6SWifyU87j", "id": "qiyrsr5cg", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-06T20:21:00.000Z") },
        { "choreId": "RpGSjeWU5X6SWifyU87j", "id": "kijzhtt0d", "isManual": true, "memberId": "rmTmcbtFDonNFYYrMoK5", "timestamp": new Date("2025-12-02T02:21:00.000Z") },
        { "choreId": "XDUqMG5TsjDMr03q6Hpq", "id": "b9qyw1o8j", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-13T00:20:00.000Z") },
        { "choreId": "XDUqMG5TsjDMr03q6Hpq", "id": "ebbitkk4h", "isManual": true, "memberId": "rmTmcbtFDonNFYYrMoK5", "timestamp": new Date("2025-12-01T19:20:00.000Z") },
        { "choreId": "HYso3r7fOwcTHWKZsXrg", "id": "spljxwb6q", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-07T01:19:00.000Z") },
        { "choreId": "XH8e11kycvYc68nY0tIe", "id": "pmt3rtde6", "isManual": true, "memberId": "rmTmcbtFDonNFYYrMoK5", "timestamp": new Date("2026-01-04T02:18:00.000Z") },
        { "choreId": "5fdpwSG0q8gucT25wGTQ", "id": "3ddmnlv2v", "isManual": true, "memberId": "rmTmcbtFDonNFYYrMoK5", "timestamp": new Date("2026-01-04T21:16:00.000Z") },
        { "choreId": "bxcbrsrrd", "id": "8lhexcegd", "isManual": true, "memberId": "rmTmcbtFDonNFYYrMoK5", "timestamp": new Date("2025-12-12T23:15:00.000Z") },
        { "choreId": "5fdpwSG0q8gucT25wGTQ", "id": "gjcs9oauk", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-15T23:11:00.000Z") },
        { "choreId": "ufdsyAozw237Fxtg3VjY", "id": "ktx2utmh0", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-22T19:11:00.000Z") },
        { "choreId": "VTdWUQH5J8VND8VH24dE", "id": "q4vgerupc", "isManual": true, "memberId": "M4jlNBktNvd7oVlXUCRA", "timestamp": new Date("2025-12-12T00:08:00.000Z") },
        { "choreId": "VTdWUQH5J8VND8VH24dE", "id": "acdmotuey", "isManual": true, "memberId": "rmTmcbtFDonNFYYrMoK5", "timestamp": new Date("2025-12-28T03:07:00.000Z") },
        { "choreId": "VTdWUQH5J8VND8VH24dE", "id": "h87wnb840", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-03T23:07:00.000Z") },
        { "choreId": "ufdsyAozw237Fxtg3VjY", "id": "xl89kzhth", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2026-01-05T02:06:00.000Z") },
        { "choreId": "fL0SuijXS9MmXInAyW9a", "id": "Z7nqwURK7iiX7tCzDwKZ", "isManual": false, "memberId": "rmTmcbtFDonNFYYrMoK5", "timestamp": new Date("2026-01-07T19:42:57.500Z") },
        { "choreId": "VTdWUQH5J8VND8VH24dE", "id": "8sSgFrDcRfbKuxDdxai1", "isManual": false, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2026-01-07T12:15:22.623Z") },
        { "choreId": "ufdsyAozw237Fxtg3VjY", "id": "uU70LtsNz6zhMoXJbJcs", "isManual": false, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2026-01-07T12:15:14.484Z") },
        { "choreId": "XDUqMG5TsjDMr03q6Hpq", "id": "i8RxdK5yGJZahtbfpZY4", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2026-01-05T22:44:00.000Z") },
        { "choreId": "g49u8tXGGXkOuZschR4L", "id": "fQ4KvxAc8JQF0kPk8YGE", "isManual": true, "memberId": "M4jlNBktNvd7oVlXUCRA", "timestamp": new Date("2026-01-04T19:43:00.000Z") },
        { "choreId": "XH8e11kycvYc68nY0tIe", "id": "K1sD5Jho3eSNix5cv0nN", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2026-01-03T22:43:00.000Z") },
        { "choreId": "HYso3r7fOwcTHWKZsXrg", "id": "RkLFMr54XPRE2D3mCfEb", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2026-01-03T19:41:00.000Z") },
        { "choreId": "XDUqMG5TsjDMr03q6Hpq", "id": "sVkFVc4Py7uqWtyNkdDT", "isManual": true, "memberId": "rmTmcbtFDonNFYYrMoK5", "timestamp": new Date("2026-01-02T19:41:00.000Z") },
        { "choreId": "5fdpwSG0q8gucT25wGTQ", "id": "aZx69TjOoAHTww0hwDc6", "isManual": true, "memberId": "rmTmcbtFDonNFYYrMoK5", "timestamp": new Date("2025-12-22T19:41:00.000Z") },
        { "choreId": "SqBQOfYWk6qtLuzM62wg", "id": "EfHFSG9yC5UEYjCeXS6Z", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-07T04:42:00.000Z") },
        { "choreId": "QRD2H3CI8vT5BzwiQObk", "id": "yA7bWkJES13ibfiJ8mZ1", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-07T01:42:00.000Z") },
        { "choreId": "wQ14T5rqpmx1GsXaWgBs", "id": "y02rcKb4aAl7JdmCEtmy", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-07T00:43:00.000Z") },
        { "choreId": "aXRWlLj6fhR5xUxxCZuP", "id": "bHfCtCUDjGgBNZ7r6YGl", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-06T12:15:00.000Z") },
        { "choreId": "qi25rgn52iEouEOrL3sf", "id": "hpGZyFdpgkmdEFQIJAq8", "isManual": true, "memberId": "fqfZoNWYRrytpfNjmcDm", "timestamp": new Date("2025-12-06T12:15:00.000Z") }
    ]
};

// Write to Firebase
const dataRef = ref(database, 'chore_data/default-family-id');
set(dataRef, backupData)
    .then(() => {
        console.log('✅ Data successfully restored to Firebase!');
        console.log('Restored:');
        console.log(`- ${backupData.members.length} members`);
        console.log(`- ${backupData.chores.length} chores`);
        console.log(`- ${backupData.logs.length} activity logs`);
    })
    .catch((error) => {
        console.error('❌ Error restoring data:', error);
    });
