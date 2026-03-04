@ECHO OFF
SETLOCAL
SET args=%*
IF NOT DEFINED args echo no args provided&GOTO :EOF 
SET filename=%1
CALL SET flags=%%args:*%1=%%
ECHO args     %args%
ECHO filename %filename%
ECHO flags    %flags%