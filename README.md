# Boondock-Web

CODING STANDARDS:

1: Error Early
2: Be Explicit
3: Comments are not to be used instead code should be self documenting
3-a: To achieve this self documentation make use of fully sized names that describe the functionality well
3-b: Comments are to be used for code than cannot be self documenting. (wierd browser behaviour ect)
3-c: There is an exception to this rule for IDE compatable comments comments that tell the IDE what a function does are acceptable only for larger groups of functions. (Not for a one off function but potentially for a variety of similar functions)
3: No Recursion
4: Do not await within a loop
5: Make use of Vues component based architecture (Small components like description boxes and repeatable behavious should be made into components and composables respectively)
6: All modals should make use of a focus lock (Use Vues tool for this)

JS Specific Standards:
1: Always prefer function syntax over const funcName() => {} syntax
2: Try to avoid try catches were possible and in general indenting blocks of code remember error early and often
