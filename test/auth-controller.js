const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth Controller - Login", () => {
  before(function (done) {
    mongoose
      .connect(
        "mongodb+srv://Ryu:OHY2n7uzgjTkhqR2@shop.7gk0cbz.mongodb.net/test-message?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true }
      )
      .then((result) => {
        // app.listen(8080);
        const user = new User({
          email: "test@test.com",
          name: "Ryu",
          password: "12345",
          posts: [],
          _id: "5c0f66b979af55031b34728a",
        });

        return user.save();
      })
      .then(() => {
        done();
      });
  });

  it("should throw an error with code 500 if accessing the database fails", (done) => {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "test123",
      },
    };

    AuthController.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });

    User.findOne.restore();
  });

  it("should send a response with a valid user status for an axisting user", (done) => {
    const req = { userId: "5c0f66b979af55031b34728a" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    AuthController.getUserStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("I am new!");

      done();
    });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
