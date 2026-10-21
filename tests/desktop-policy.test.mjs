import test from 'node:test';
import assert from 'node:assert/strict';
import policy from '../desktop/policy.cjs';
test('desktop protocol only serves bundled UI files',()=>{
 assert.equal(policy.assetName('axtify://app/'),'index.html');
 assert.equal(policy.assetName('axtify://app/app.js'),'app.js');
 for(const url of ['file:///etc/passwd','axtify://elsewhere/app.js','axtify://app/%2e%2e%2fpackage.json','axtify://app/desktop/main.cjs','axtify://app/%ZZ','axtify://user:pass@app/app.js'])assert.equal(policy.assetName(url),null);
});
test('desktop external links are restricted to supported HTTPS destinations',()=>{
 assert.equal(policy.allowedExternal('https://open.spotify.com/track/1234567890123456789012'),true);
 assert.equal(policy.allowedExternal('https://www.spotify.com/account/privacy/'),true);
 assert.equal(policy.allowedExternal('https://github.com/reddeadplsss/axtify'),true);
 for(const url of ['file:///etc/passwd','javascript:alert(1)','https://open.spotify.com.evil.test/track/1234567890123456789012','https://user:pass@github.com/reddeadplsss/axtify','https://github.com/other/repo','https://www.spotify.com:1234/account/privacy/'])assert.equal(policy.allowedExternal(url),false);
});
