import * as apis from './api';

describe('API INSTANCES', () => {
  it('should have exported api, google and ibge', async () => {
    expect(apis).toHaveProperty('api');
    expect(apis).toHaveProperty('google');
    expect(apis).toHaveProperty('ibge');
  });

  it('should export apis.api as a function', async () => {
    expect(typeof apis.api === 'function').toBeTruthy();
  });

  it('should export apis.google as a function', async () => {
    expect(typeof apis.google === 'function').toBeTruthy();
  });

  it('should export apis.ibge as a function', async () => {
    expect(typeof apis.ibge === 'function').toBeTruthy();
  });
});
