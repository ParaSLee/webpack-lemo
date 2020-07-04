const friendlySyntaxErrorLabel = 'Syntax error:';

function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}

module.exports =  function formatWebpackMessages(json) {
    const formattedErrors = json.errors.map(function (message) {
        return formatMessage(message, true);
    });
    const formattedWarnings = json.warnings.map(function (message) {
        return formatMessage(message, false);
    });
    const result = { errors: formattedErrors, warnings: formattedWarnings };
    if (result.errors.some(isLikelyASyntaxError)) {
        // If there are any syntax errors, show just them.
        result.errors = result.errors.filter(isLikelyASyntaxError);
    }
    return result;
}