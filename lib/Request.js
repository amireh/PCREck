module.exports = function(pattern, subject, flags) {
  return JSON.stringify({
    pattern: pattern,
    subject: subject,
    flags: (flags || []).join('')
  });
};