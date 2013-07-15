#!/usr/bin/env perl
#
# -----------------------------------------------------------------------------
# This file is part of rgx.
#
# rgx is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# rgx is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with rgx. If not, see <http://www.gnu.org/licenses/>.
# -----------------------------------------------------------------------------

use HTTP::Daemon;
use HTTP::Status;
use JSON;

my $d = HTTP::Daemon->new(
  LocalAddr => '127.0.0.1',
  LocalPort => 9402,
  ReuseAddr => 1
) || die;

my $json = JSON::XS->new;

use constant DEBUG => 0;
use constant RC_MATCH       => 'RC_MATCH';
use constant RC_NOMATCH     => 'RC_NOMATCH';
use constant RC_BADPATTERN  => 'RC_BADPATTERN';

print "Please contact me at: <URL:", $d->url, ">\n";

while (my $c = $d->accept) {
  ACCEPT_REQUEST: {

  while (my $r = $c->get_request) {
    if ($r->method ne 'POST') {
      $c->send_error(RC_NOT_IMPLEMENTED);
      last ACCEPT_REQUEST;
    }

    my $rc = '';

    eval {
      my $construct  = decode_json $r->content;

      if (!defined($construct->{'pattern'}) || !defined($construct->{'subject'})) {
        die 'internal';
      }

      ($ptrn, $subj, $flags) = (
        $construct->{'pattern'},
        $construct->{'subject'},
        $construct->{'flags'}
      );

      print "\tPattern: ", $construct->{'pattern'}, "\n" if DEBUG;
      print "\tSubject: ", $construct->{'subject'}, "\n" if DEBUG;
      print "\tFlags: ", $construct->{'flags'}, "\n" if DEBUG;

      my @captures  = ();
      my @offset    = ();

      my $test = $flags =~ s/g// ?
      sub {
        $_[0] =~ /(?$flags:$ptrn)/g;
        @offset = ($-[0],$+[0]);

        foreach $cap (1..$#-) {
          # must store it in a reference so we can encode it to JSON properly
          my @cap_offset = ($-[$cap],$+[$cap]);

          push(@captures, {
            match   => ${$cap},
            offset  => \@cap_offset
          });
        }

        return $#-;
      } :
      sub {
        $_[0] =~ /(?$flags:$ptrn)/;
        @offset = ($-[0],$+[0]);

        foreach $cap (1..$#-) {
          my @cap_offset = ($-[$cap],$+[$cap]);

          push(@captures, {
            match   => ${$cap},
            offset  => \@cap_offset
          });
        }

        return $#-;
      };

      my $matched = $test->($subj) ne -1;

      if ($matched) {
        $rc = {
          status    => RC_MATCH,
          offset    => \@offset,
          captures  => \@captures
        };
      } else {
        $rc = { status => RC_NOMATCH };
      }
    } or do {
      my $e = $@;
      print $e, "\n" if DEBUG;

      if ($e =~ /internal/) {
        $c->send_error(RC_BAD_REQUEST);
        last ACCEPT_REQUEST;
      } else {
        $e =~ s/at .*\.pm.*$//;
        $rc = {
          status  => RC_BADPATTERN,
          error   => $e
        };

      }
    };

    $rc = $json->encode($rc), "\n";
    $c->send_response('Content-Type: application/json');
    print $c $rc;

  }
  } # ACCEPT_REQUEST

  $c->close;
  undef($c);
}
