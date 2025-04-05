// Helper functions to base64url encode/decode ArrayBuffers
const bufferEncode = (buffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const bufferDecode = (base64urlString) => {
  // Pad base64 string to a multiple of 4
  const padding = '='.repeat((4 - (base64urlString.length % 4)) % 4);
  const base64 = (base64urlString + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const str = atob(base64);
  const buffer = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    buffer[i] = str.charCodeAt(i);
  }
  return buffer;
};

// Pre-format registration options before calling navigator.credentials.create
const preformatMakeCredReq = (makeCredRequest) => {
  makeCredRequest.challenge = bufferDecode(makeCredRequest.challenge);
  makeCredRequest.user.id = bufferDecode(makeCredRequest.user.id);
  if (makeCredRequest.excludeCredentials) {
    makeCredRequest.excludeCredentials = makeCredRequest.excludeCredentials.map(
      (exCred) => {
        exCred.id = bufferDecode(exCred.id);
        return exCred;
      }
    );
  }
  return makeCredRequest;
};

// Transform the credential response into JSON-friendly format
const transformMakeCredRes = (makeCredRes) => {
  return {
    id: makeCredRes.id,
    rawId: bufferEncode(makeCredRes.rawId),
    response: {
      attestationObject: bufferEncode(makeCredRes.response.attestationObject),
      clientDataJSON: bufferEncode(makeCredRes.response.clientDataJSON),
    },
    type: makeCredRes.type,
    clientExtensionResults: makeCredRes.getClientExtensionResults(),
  };
};

// Pre-format authentication options before calling navigator.credentials.get
const preformatGetAssertReq = (getAssert) => {
  getAssert.challenge = bufferDecode(getAssert.challenge);
  if (getAssert.allowCredentials) {
    getAssert.allowCredentials = getAssert.allowCredentials.map((cred) => {
      cred.id = bufferDecode(cred.id);
      return cred;
    });
  }
  return getAssert;
};

const transformGetAssertRes = (assertRes) => {
  return {
    id: assertRes.id,
    rawId: bufferEncode(assertRes.rawId),
    response: {
      authenticatorData: bufferEncode(assertRes.response.authenticatorData),
      clientDataJSON: bufferEncode(assertRes.response.clientDataJSON),
      signature: bufferEncode(assertRes.response.signature),
      userHandle: assertRes.response.userHandle
        ? bufferEncode(assertRes.response.userHandle)
        : null,
    },
    type: assertRes.type,
    clientExtensionResults: assertRes.getClientExtensionResults(),
  };
};

export {
  bufferEncode,
  bufferDecode,
  preformatMakeCredReq,
  transformMakeCredRes,
  preformatGetAssertReq,
  transformGetAssertRes,
};
