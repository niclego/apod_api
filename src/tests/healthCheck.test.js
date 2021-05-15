const healthCheck = require('../handlers/healthCheck');

test('healthCheck call is calling back', async () => {
    await healthCheck.handler({}, {}, (err, data) => {
        expect(data["body"]).toBe(JSON.stringify({message: "success"}));
    });
});