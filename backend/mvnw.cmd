@REM ----------------------------------------------------------------------------
@REM Maven Wrapper for Windows (no pre-installed Maven required)
@REM ----------------------------------------------------------------------------
@echo off
@setlocal

set ERROR_CODE=0

@REM Resolve the location of this script
set MAVEN_PROJECTBASEDIR=%~dp0
if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%

set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

if not exist %WRAPPER_JAR% (
    echo Maven Wrapper JAR missing at %WRAPPER_JAR%.
    exit /b 1
)

@REM Prefer %JAVA_HOME%\bin\java.exe if JAVA_HOME is set and the binary exists;
@REM otherwise fall back to whatever 'java' resolves to on PATH.
if not "%JAVA_HOME%"=="" (
    if exist "%JAVA_HOME%\bin\java.exe" (
        set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
        goto :run
    )
)
for /F "usebackq delims=" %%J in (`where java`) do (
    set "JAVA_EXE=%%J"
    goto :run
)
echo ERROR: no java.exe found. Install a JDK or set JAVA_HOME.
exit /b 1

:run
set "MAVEN_PROJECTBASEDIR_DQUOTED=\"%MAVEN_PROJECTBASEDIR%\""
"%JAVA_EXE%" %MAVEN_OPTS% -classpath %WRAPPER_JAR% "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %WRAPPER_LAUNCHER% %*
if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%

exit /B %ERROR_CODE%
