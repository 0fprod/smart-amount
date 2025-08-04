module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Syntax of rules: [level, condition, value]
    // level: 0=ignore, 1=warning, 2=error
    // condition: 'always'=always apply, 'never'=never allow
    // value: specific value for the rule (optional)

    'type-enum': [
      2, // Error if not meet
      'always', // Always must meet
      [
        'feat', // New features
        'fix', // Bug fixes
        'docs', // Documentation changes
        'style', // Code style changes (formatting, etc.)
        'refactor', // Code refactoring
        'perf', // Performance improvements
        'test', // Adding or updating tests
        'ci', // CI/CD changes
        'chore', // Maintenance tasks
        'revert', // Revert previous commits
        'build', // Build system changes
        'deps', // Dependency updates
      ],
    ],
    'type-empty': [2, 'never'], // Error if the type is empty
    'subject-empty': [2, 'never'], // Error if the subject is empty
    'subject-full-stop': [2, 'never', '.'], // Error if it ends with a dot
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']], // Error if it uses these cases
    'header-max-length': [2, 'always', 72], // Error if it exceeds 72 characters
  },
};
