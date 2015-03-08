/**
 * Create a MatchConstruct usable by a dialect engine.
 *
 * @param  {String} pattern
 * @param  {String} subject
 * @param  {String} [flags=""]
 *
 * @return {String}
 *         The JSON construct.
 */
module.exports = function(pattern, subject, flags) {
  return JSON.stringify({
    pattern: pattern,
    subject: subject,
    flags: Array.isArray(flags) ? flags.join('') : flags
  });
};