const { expect } = require("chai");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

const authMiddleware = require("../middleware/is-auth");

describe("Auth Middleware", () => {
  it("should throw an error if no authorization header is present", () => {
    const req = {
      get: function () {
        return null;
      },
    };

    const expectAction = authMiddleware.bind(this, req, {}, () => {});
    expect(expectAction).to.throw("Not authenticated.");
  });

  it("should yield a userId after decoding the token", () => {
    const req = {
      get: function () {
        return "Bearer adadadsad";
      },
    };

    // 使用 sinon 讓我們可以竄改第三方套件
    // 並且使用 restore 讓其不影響全局變數

    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });

    authMiddleware(req, {}, () => {});

    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");

    jwt.verify.restore();
  });

  it("should throw an error if the authorization header is only one string", () => {
    const req = {
      get: function () {
        return "xyz";
      },
    };

    const expectAction = authMiddleware.bind(this, req, {}, () => {});
    expect(expectAction).to.throw();
  });
});
