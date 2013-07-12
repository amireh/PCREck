<?php

require_once __DIR__.'/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

// Show all errors
error_reporting(E_ALL);

$app = new Silex\Application();

$flags = [
  "i" =>  "Caseless: letters in the pattern match both upper and lower case letters",
  "m" =>  "Multiline",
  "s" =>  "Dot-all: a dot metacharacter in the pattern matches all characters, including newlines.",
  "x" =>  "Extended: if this modifier is set, whitespace data characters in the " .
          "pattern are totally ignored except when escaped or inside a character " .
          "class, and characters between an unescaped # outside a character class " .
          "and the next newline character, inclusive, are also ignored.",
  "U" =>  "Ungreedy: This modifier inverts the \"greediness\" of the quantifiers " .
          "so that they are not greedy by default, but become greedy if followed by ?",
  "X" =>  "Extra: Any backslash in a pattern that is followed by a letter that " .
          "has no special meaning causes an error, thus reserving these " .
          "combinations for future expansion.",
  "u" => "UTF-8: pattern strings are treated as UTF-8.",
  "J" => "DUPNAMES: Allow duplicate names for subpatterns"
];

$app->get('/flags', function() use ($app, $flags) {
  return $app->json($flags);
});

$app->post('/', function(Request $request) use ($app) {
  $rc     = null;
  $err    = null;

  $data   = json_decode($request->getContent());
  $ptrn   = $data->pattern;
  $subj   = $data->subject;
  $flags  = $data->flags;

  if (!$ptrn || !$subj) {
    return new Response('Missing pattern or subject.', 400);
  }

  if ($flags) {
    $ptrn = '(?' . $flags . ':' . $ptrn . ')';
  }

  $ptrn = '/' . $ptrn . '/';

  function handleError($errno, $errstr, $errfile, $errline, array $errcontext)
  {
    // error was suppressed with the @-operator
    if (0 === error_reporting()) {
      return false;
    }

    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
  }
  set_error_handler('handleError');

  try {
    $rc = preg_match($ptrn, $subj, $matches, PREG_OFFSET_CAPTURE);
  } catch (ErrorException $e) {
    $err  = $e->getMessage();
    $rc   = FALSE;
  }
  $out = array();

  if ($rc === 1) {
    $out = [
      "status" => "RC_MATCH",
      "offset" => array($matches[0][1], $matches[0][1] + strlen($matches[0][0])),
      "captures" => array()
    ];

    for ($i = 1; $i < sizeof($matches); ++$i) {
      array_push($out["captures"], [
        "position" => $matches[$i][1],
        "string"   => $matches[$i][0]
      ]);
    }
  }
  else if ($rc === 0) {
    $out = [
      "status" => "RC_NOMATCH"
    ];
  }
  else if ($rc === FALSE) {
    $out = [
      "status" => "RC_BADPATTERN",
      "error"  => str_replace('preg_match(): Compilation failed: ', '', $err)
    ];
  }

  return $app->json($out, 200);
});

$app->run();
