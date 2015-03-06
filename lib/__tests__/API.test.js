var Subject = require("../API");

describe("Server::API", function() {
  this.timeout(100);

  afterEach(function(done) {
    if (Subject.isRunning()) {
      Subject.stop(done);
    }
    else {
      done();
    }
  });

  describe('@start', function() {
    it('should create delegates and connect', function(done) {
      expect(function() {
        Subject.start([ 'PCRE' ], done);
      }).not.to.throw();
    });
  });

  describe('@match', function() {
    describe('PCRE', function() {
      beforeEach(function(done) {
        Subject.start([ 'PCRE' ], done);
      });

      it('should work with multiple subjects', function(done) {
        Subject.match('PCRE', 'foo(.*)', [ 'foobar', 'fooZOO', 'xyz' ], [], function(result) {
          expect(result.length).to.equal(3);
          expect(result[0].status).to.equal('RC_MATCH');
          expect(result[1].status).to.equal('RC_MATCH');
          expect(result[2].status).to.equal('RC_NOMATCH');
          done();
        });
      });

      it('should report a match', function(done) {
        Subject.match('PCRE', 'foo', [ 'foobar' ], [], function(result) {
          expect(result[0]).to.deep.equal({
            "status": "RC_MATCH",
            "captures": [],
            "offset": [0,2]
          });

          done();
        });
      });

      it('should report a capture', function(done) {
        Subject.match('PCRE', 'foo(.*)', [ 'foobar' ], [], function(result) {
          expect(result[0]).to.deep.equal({
            "status": "RC_MATCH",
            "captures": [[3,5]],
            "offset": [0,5]
          });

          done();
        });
      });

      it('should work with non-capturing groups (?:)', function(done) {
        Subject.match('PCRE', "(?:t|foo(bar))", ["foobarzoo","t"], [], function(result) {
          expect(result[0].status).to.equal('RC_MATCH');
          expect(result[0].captures).to.deep.equal([[3,5]]);
          expect(result[1].status).to.equal('RC_MATCH');
          expect(result[1].captures).to.deep.equal([[]]);
          done();
        });
      });

      describe('spec: error handling', function() {
        it('should report a bad pattern with RC_BADPATTERN', function(done) {
          Subject.match('PCRE', 'asdf(', [ 'asdf' ], [], function(result) {
            expect(result[0].status).to.equal('RC_BADPATTERN');
            done();
          });
        });
      });

      describe('edge-cases', function() {
        it('should work with a pattern (or subject) that contains \\n', function(done) {
          Subject.match('PCRE', 'foo\\nbar', [ 'foo\nbar', 'foo\\nbar' ], [], function(result) {
            expect(result[0].status).to.equal('RC_MATCH');
            expect(result[0].offset).to.deep.equal([0,6]);

            expect(result[1].status).to.equal('RC_NOMATCH');
            done();
          });
        });
      });
    });
  })
});