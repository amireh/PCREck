module.exports = function(text, limit) {
  if (text.length > limit) {
    return text.substr(0, limit-3) + '...';
  }
  else {
    return text;
  }
};