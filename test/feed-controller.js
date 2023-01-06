const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const FeedController = require("../controllers/feed");

describe("Feed Controller", () => {
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

  it("should add a created post to the posts of the creator", (done) => {
    const req = {
      body: {
        title: "Test Post",
        content: "testtttt",
      },
      file: {
        path: "abc",
      },
      userId: "5c0f66b979af55031b34728a",
    };
    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    FeedController.createPost(req, res, () => {}).then((saveUser) => {
      expect(saveUser).to.have.property("posts");
      expect(saveUser.posts).to.have.length(1);
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
