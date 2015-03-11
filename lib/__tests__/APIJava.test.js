var Subject = require("../API");

describe("Server::API::Java", function() {
  this.timeout(100);

  afterEach(function(done) {
    if (Subject.isRunning()) {
      Subject.stop(done);
    }
    else {
      done();
    }
  });

  describe('@match', function() {
    describe('Java', function() {
      beforeEach(function(done) {
        Subject.start([ 'Java' ], done);
      });

      it('should work with multiple subjects', function(done) {
        Subject.match('Java', 'foo(.*)', [ 'foobar', 'fooZOO', 'xyz' ], [], function(result) {
          expect(result.length).to.equal(3);
          expect(result[0].status).to.equal('RC_MATCH');
          expect(result[1].status).to.equal('RC_MATCH');
          expect(result[2].status).to.equal('RC_NOMATCH');
          done();
        });
      });

      it('should report a match', function(done) {
        Subject.match('Java', 'foo', [ 'foobar' ], [], function(result) {
          expect(result[0]).to.deep.equal({
            "status": "RC_MATCH",
            "captures": [],
            "offset": [0,2]
          });

          done();
        });
      });
    });
  });
});