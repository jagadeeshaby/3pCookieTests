
// https://docs.cotter.app/sdk-reference/api-for-other-mobile-apps/api-for-mobile-apps#step-1-create-a-code-verifier

function dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2)
  }
  
  function generateRandomString() {
    var array = new Uint32Array(56/2);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec2hex).join('');
  }
  

  function sha256(plain) { // returns promise ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
  }
  
  function base64urlencode(a) {
        var str = "";
        var bytes = new Uint8Array(a);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
          str += String.fromCharCode(bytes[i]);
        }
        return btoa(str);
      }
  
  async function challenge_from_verifier(v) {
    hashed = await sha256(v);
    base64encoded = base64urlencode(hashed);
    return base64encoded;
  }
  


var pkce = {
    generateVerifier: generateRandomString,
    generateChallenge: challenge_from_verifier
}


