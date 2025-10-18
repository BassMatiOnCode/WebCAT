@ECHO OFF
SETLOCAL
SET args=%*
IF NOT DEFINED args GOTO :usage 
SET filename=%~1
CALL SET flags=%%args:*%1=%%
SET src=\github\bassmationcode\inc\docs\webcat
SET dst=\github\bassmationcode\webcat\code
XCOPY /d /s /b%flags% "%src%\%1" "%dst%\%1"
EXIT /b

:usage
ECHO Usage: download filename flags
ECHO   XCopies files or folders with symlinks preserved.
ECHO   src base: %src%
ECHO   dst base: %dst%
ECHO   Filenames are relative to src and dst base folders. 
ECHO   Examples:
ECHO   download pathbar\
ECHO   download pathbar\*.*
ECHO   download pathbar\pathbar-1.css
EXIT /b