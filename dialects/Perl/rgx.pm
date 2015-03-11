#!/usr/bin/env perl

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

use JSON;

my $json = JSON::XS->new;

use constant RC_MATCH       => 'RC_MATCH';
use constant RC_NOMATCH     => 'RC_NOMATCH';
use constant RC_BADPATTERN  => 'RC_BADPATTERN';

print "ready\n";
STDOUT->flush();

while (my $c = <>) {
  my $rc = '';

  eval {
    my $construct  = decode_json $c;
    my ($ptrn, $subj, $flags) = (
      $construct->{'pattern'},
      $construct->{'subject'},
      $construct->{'flags'}
    );

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

          push(@captures, \@cap_offset);
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

    if ($e =~ /internal/) {
      $rc = { status => RC_BAD_REQUEST, error => $e };
    } else {
      $e =~ s/at .*\.pm.*$//;
      $rc = {
        status  => RC_BADPATTERN,
        error   => $e
      };
    }
  };

  print $json->encode($rc), "\n";
  STDOUT->flush();
}
