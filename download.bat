@echo off

rem  --------------------------------------------------------------------------
rem  Downloads content from {url} to {outfile}:
rem
rem    download {url} {outfile}
rem
rem  NOTE: it is better to set an abs path to {outfile}.
rem
rem  NOTE: requires MS JScript or PowerShell.
rem  --------------------------------------------------------------------------

setlocal DisableDelayedExpansion

set url=%~1
set outfile=%~2

if "%outfile%" == "" (
  echo [ERR][%~n0] Outfile is not set!
  exit /b 2
)

if exist "%outfile%" (
  echo [ERR][%~n0] Already exists: "%outfile%".
  exit /b 3
)

rem  Prefer MS JScript, because it's more native than PowerShell.
cscript >NUL && (
  cscript /nologo "%~dp0download.js" "%url%" "%outfile%" ^
    >NUL && exit /b 0 || exit /b 1
)

rem  Deprecated! Downloading with PowerShell.
powershell -? >NUL && (

  rem  Make intermediate dirs.
  for %%i in ("%outfile%") do if not exist "%%~pi" md "%%~pi"

  powershell -command ^
    "Invoke-WebRequest -UseBasicParsing -Uri '%url%' -OutFile '%outfile%'" ^
      >NUL && exit /b 0 || exit /b 1
)

echo [ERR][%~n0] cscript and powershell are not available!
exit /b 4

endlocal
