// biome-ignore lint/nursery/noCommonJs: need to use common js here
module.exports = {
  /*
  
     * Resolve and load @commitlint/config-conventional from node_modules.
  
     * Referenced packages must be installed
  
     * 
  
     * Explain what each rule is for
  
     * https://commitlint.js.org/#/reference-rules
  
     * 
  
     */

  extends: ["@commitlint/config-conventional"],

  /*
  
     * Any rules defined here will override rules from @commitlint/config-conventional
  
     */

  rules: {
    "type-enum": [
      2,

      "always",

      [
        "build",

        "chore",

        "ci",

        "docs",

        "improvement",

        "feat",

        "fix",

        "perf",

        "refactor",

        "revert",

        "style",

        "test",
      ],
    ],
  },
};
